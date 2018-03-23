import {
	NativeModules,
	Platform,
} from 'react-native';
import TrackingActions from './TrackingActions';
import store from 'react-native-simple-store';
import {
	USER_LOGIN_STATUS,
	STORE_CUSTOMER_INFO,
} from '../../constants/constants';
import { HAS_LOGGED_IN_ON_DEVICE } from '../../constants/Auth';
import CustomDimensions from './CustomDimensions';
import Instabug from 'Instabug';
import helpers from '../helpers';
import adjustTokens from '../../constants/AdjustConstants';
import { Adjust, AdjustEvent } from 'react-native-adjust';
import { AppEventsLogger } from 'react-native-fbsdk';
import bugsnag from '../bugsnag';
import branch from 'react-native-branch';

const {
	MarketingCloud,
	LocalyticsManager,
	BuildFacebook,
} = NativeModules;

const paymentTypes = {
	CREDIT_CARD: 'CC',
	PAYPAL: 'PayPal',
	APPLE_PAY: 'Apple Pay',
};

class Tracking {

	constructor() {
		this.loginStatus = 'not logged in';
	}

	initLoginStatus() {
		store.get(USER_LOGIN_STATUS).then((loginStatus) => {
			if (!loginStatus) {
				this.setLoginStatus('not logged in');
			} else {
				this.loginStatus = loginStatus;
			}
		}).done();
	}

	setLoginStatus(loginStatus) {
		this.loginStatus = loginStatus;
		store.save(USER_LOGIN_STATUS, loginStatus).done();
	}

	trackAction(action, data = {}) {
		Instabug.log(`${action} - ${JSON.stringify(data)}`);
		bugsnag.leaveBreadcrumb(action, { ...data, type: 'user' });
		MarketingCloud.trackAction(action, data);
		LocalyticsManager.tagEvent(action, this.convertAttributesToStrings(data));
	}

	trackState(state, data = {}) {
		const newData = {
			...data,
			'user.LoginStatus': this.loginStatus,
		};
		Instabug.log(`${state} - ${JSON.stringify(newData)}`);
		MarketingCloud.trackState(state, newData);
		bugsnag.leaveBreadcrumb(state, { ...data, type: 'state' });
		LocalyticsManager.tagScreen(this.normalizeName(state));
	}

	trackInstallAndFirstLaunch() {
		Adjust.trackEvent(new AdjustEvent(adjustTokens.INSTALL));
		Adjust.trackEvent(new AdjustEvent(adjustTokens.FIRST_LAUNCH));
		AppEventsLogger.logEvent(TrackingActions.FB_FIRST_LAUNCH);
	}

	trackProjectCreated() {
		Adjust.trackEvent(new AdjustEvent(adjustTokens.CREATE_PROJECT));
	}

	trackAccountCreated() {
		Adjust.trackEvent(new AdjustEvent(adjustTokens.CREATE_ACCOUNT));
	}

	trackFavoriteItem() {
		Adjust.trackEvent(new AdjustEvent(adjustTokens.FAVORITE_ITEM));
		AppEventsLogger.logEvent(TrackingActions.FB_FAVORITE_ITEM);
	}

	async trackFirstLogin() {
		const hasLoggedInOnDevice = await store.get(HAS_LOGGED_IN_ON_DEVICE);
		if (!hasLoggedInOnDevice) {
			Adjust.trackEvent(new AdjustEvent(adjustTokens.FIRST_TIME_LOGIN));
		}
		store.save(HAS_LOGGED_IN_ON_DEVICE, true);
	}

	trackCheckoutStarted(grandTotal, cart) {
		Adjust.trackEvent(new AdjustEvent(adjustTokens.CHECKOUT_START));
		LocalyticsManager.tagStartedCheckout({
			totalPrice: this.dollarToPennies(grandTotal),
			itemCount: cart.quantity,
		});
		const params = {
			[BuildFacebook.EventParamNumItems]: cart.quantity,
			[BuildFacebook.EventParamCurrency]: 'USD',
		};
		AppEventsLogger.logEvent(BuildFacebook.AppEventNameInitiatedCheckout, parseFloat(grandTotal), params);
	}

	trackCheckoutComplete(orderNumber, grandTotal, cart, paymentType) {
		const products = this.normalizeCartItems(cart.sessionCartItems);
		orderNumber = `${orderNumber}`;
		MarketingCloud.trackAction(TrackingActions.CHECKOUT_PURCHASE, {
			orderNumber,
			transactionId: orderNumber,
			'&&products': products,
			'purchase.currencycode': 'USD',
			'purchase.order': 'order',
			'purchase.ordernumber': orderNumber,
			'purchase.paymentmethod': paymentTypes[paymentType],
		});

		this.trackAllPurchasedItems(cart.sessionCartItems);
		const attributes = this.convertAttributesToStrings({
			orderNumber,
			paymentType: paymentTypes[paymentType],
		});
		LocalyticsManager.tagCompletedCheckout({
			totalPrice: this.dollarToPennies(grandTotal),
			itemCount: cart.quantity,
			attributes,
		});
		const adjustEvent = new AdjustEvent(adjustTokens.CHECKOUT_COMPLETE);
		// the revenue number here is required to be a "float"
		adjustEvent.setRevenue(helpers.toFloat(grandTotal), 'USD');
		// the order number here is required to be a string
		adjustEvent.setTransactionId(orderNumber.toString());
		Adjust.trackEvent(adjustEvent);
		branch.sendCommerceEvent(grandTotal);
		AppEventsLogger.logEvent(TrackingActions.FB_CHECKOUT_COMPLETE, parseFloat(grandTotal), {
			[BuildFacebook.EventParamNumItems]: cart.quantity,
			[BuildFacebook.EventParamCurrency]: 'USD',
			[BuildFacebook.EventParamPaymentInfoAvailable]: paymentTypes[paymentType],
			orderNumber,
		});
	}

	trackAllPurchasedItems(cartItems) {
		cartItems.forEach((cartItem) => this.trackItemPurchased(cartItem));
	}

	trackItemPurchased(cartItem) {
		const { product, quantity } = cartItem;
		const { displayName, productId, manufacturer, sku, uniqueId, finish, productCompositeId } = product;
		const attributes = this.convertAttributesToStrings({
			manufacturer,
			sku,
			finish,
			quantity,
			uniqueId,
			compositeId: productCompositeId,
		});
		LocalyticsManager.tagPurchased({
			itemName: displayName,
			itemId: productId,
			itemType: null,
			itemPrice: 0,
			attributes,
		});
		AppEventsLogger.logPurchase(0, 'USD', {
			itemCount: quantity,
			...attributes,
		});
		if (cartItem.hasSubItems) {
			this.trackAllPurchasedItems(cartItem.subItems);
		}
	}

	trackNewCartCreated(cart, cartItemBounceCallback) {
		if (cart && cart.sessionCartItems && cart.sessionCartItems.length === 0) {
			if (cartItemBounceCallback && typeof cartItemBounceCallback === 'function') {
				cartItemBounceCallback();
			}
			MarketingCloud.trackAction(TrackingActions.PDP_NEW_CART, {
				'cart.cartcreated': 'cartcreated',
				'purchase.currencycode': 'USD',
				'&&products': this.normalizeCartItems(cart.sessionCartItems, true),
			});
			LocalyticsManager.tagEvent(TrackingActions.PDP_NEW_CART, null);
		}
	}

	trackCartItemDelete(cartItem, swipeRemove = false) {
		const { quantity, product } = cartItem;
		MarketingCloud.trackAction(TrackingActions.CART_ITEM_REMOVE, {
			'&&products': `;${product.uniqueId}`,
			'purchase.currencycode': 'USD',
			'cart.itemremoved': 'itemremoved',
		});
		const attributes = this.convertAttributesToStrings({
			swipeRemove,
			quantity,
			uniqueId: product.uniqueId,
			unitPrice: this.dollarToPennies(cartItem.unitPrice),
			manufacturer: product.manufacturer,
			productId: product.productId,
		});
		LocalyticsManager.tagEvent(TrackingActions.CART_ITEM_REMOVE, attributes);
	}

	trackAddToCart(action, data) {
		Adjust.trackEvent(new AdjustEvent(adjustTokens.ADD_TO_CART));
		MarketingCloud.trackAction(action, {
			'&&products': data ? `;${data.uniqueId}` : '',
			'purchase.currencycode': 'USD',
			'cart.itemadded': 'itemadded',
		});

		const attributes = this.convertAttributesToStrings({
			action,
			finish: data.finish,
			sku: data.sku,
			manufacturer: data.manufacturer,
			uniqueId: data.uniqueId,
			quantity: data.quantity,
			categoryId: data.categoryId,
		});
		LocalyticsManager.tagAddedToCart({
			itemName: `${data.manufacturer} ${data.productId}`,
			itemId: data.productId,
			itemType: data.categoryName || null,
			itemPrice: this.dollarToPennies(data.cost || 0),
			attributes,
		});
		AppEventsLogger.logEvent(BuildFacebook.AppEventNameAddedToCart, data.cost, {
			[BuildFacebook.EventParamContentId]: data.productId,
			[BuildFacebook.EventParamContentType]: data.categoryName,
			[BuildFacebook.EventParamCurrency]: 'USD',
			...attributes,
		});
	}

	trackCustomerRegistered(user, cart, methodName = 'Email') {
		this.setLoginStatus('logged in');
		const customerId = this.numberToString(user.customerId);
		let sessionCartId;
		if (cart && cart.sessionCartId) {
			sessionCartId = this.numberToString(cart.sessionCartId);
		}
		const customer = {
			customerId,
			firstName: user.firstName,
			lastName: user.lastName,
			fullName: `${user.firstName} ${user.lastName}`,
			emailAddress: user.email,
		};

		Instabug.setUserEmail(customer.emailAddress);
		Instabug.setUserName(customer.customerId);
		Instabug.setUserData(`${customer.customerId}-${customer.emailAddress}`);

		MarketingCloud.trackAction(TrackingActions.CUSTOMER_SIGNUP_COMPLETE, { ...customer, methodName });

		this.setCustomerValues(user);
		LocalyticsManager.tagCustomerRegistered({
			customer,
			methodName,
			attributes: {
				customerId,
				sessionCartId,
				email: user.email,
			},
		});
		AppEventsLogger.logEvent(BuildFacebook.AppEventNameCompletedRegistration, {
			[BuildFacebook.EventParamRegistrationMethod]: methodName,
			...customer,
		});
	}

	trackCustomerLoggedIn(user, methodName = 'Email') {
		this.setLoginStatus('logged in');
		const customerId = this.numberToString(user.customerId);
		const customer = {
			customerId,
			firstName: user.firstName,
			lastName: user.lastName,
			fullName: `${user.firstName} ${user.lastName}`,
			emailAddress: user.email,
		};
		Instabug.setUserEmail(customer.emailAddress);
		Instabug.setUserName(customer.customerId);
		Instabug.setUserData(`${customer.customerId}-${customer.emailAddress}`);
		MarketingCloud.trackAction(TrackingActions.CUSTOMER_SIGNIN_COMPLETE, { ...customer, methodName });
		LocalyticsManager.tagCustomerLoggedIn({
			customer,
			methodName,
			attributes: {
				customerId,
				email: user.email,
			},
		});
		this.setCustomerValues(user);
	}

	trackCustomerLoggedOut(isGuest = false) {
		this.setLoginStatus('logged out');
		const data = { isGuestLogout: isGuest ? 'Yes' : 'No' };
		MarketingCloud.trackAction(TrackingActions.CUSTOMER_SIGNOUT_COMPLETE, data);
		LocalyticsManager.tagCustomerLoggedOut(data);
		store.get(STORE_CUSTOMER_INFO).then((user) => {
			this.setCustomerValues(user, false);
		}).catch(helpers.noop).done();
	}

	/**
	 * Only tracking for Localytics. For Omniture look at HeaderSearch#handleSubmit()
	 */
	trackHeaderSearch(searchCriteria, totalResults, resultCount) {
		const attributes = this.convertAttributesToStrings({
			totalResults,
			page: searchCriteria.page,
			pageSize: searchCriteria.pageSize,
		});
		LocalyticsManager.tagSearched({
			attributes,
			resultCount,
			queryText: searchCriteria.keyword,
			contentType: null,
		});
	}

	trackProductShared(shareResult, data) {
		const { manufacturer, productId, type, compositeId, selectedFinish } = data;

		// There is no way to find out which app was selected to share on Android, platform limitation :(
		const methodName = shareResult && shareResult.app ? shareResult.app : 'Android';

		const attributes = this.convertAttributesToStrings({
			manufacturer,
			compositeId,
			finish: selectedFinish.finish,
			sku: selectedFinish.sku,
			uniqueId: selectedFinish.uniqueId,
			cost: this.dollarToPennies(selectedFinish.pricebookCostView.cost),
		});

		MarketingCloud.trackAction(TrackingActions.PRODUCT_SHARED_COMPLETE, {
			methodName,
			productId,
			type,
			compositeId,
			manufacturer,
			...attributes,
		});
		LocalyticsManager.tagShared({
			methodName,
			attributes,
			contentName: `${manufacturer} ${productId}`,
			contentId: productId,
			contentType: type,
		});
	}

	trackPhoneDial(phoneNumber, isPro) {
		const attributes = {
			phoneNumber,
			'Customer Type': isPro ? 'Pro' : 'Non-Pro',
		};
		this.trackAction(TrackingActions.PHONE_DIAL, attributes);
		Adjust.trackEvent(new AdjustEvent(adjustTokens.CALL_EXPERT));
		AppEventsLogger.logEvent(TrackingActions.FB_CALL_EXPERT, attributes);
	}

	/**
	 * Sets Profile attribute. By default it sets at Organization level
	 * @param profileAttribute - Name of the profile attribute
	 * @param attributeValue - Value for profileAttribute to set
	 * @param isOrganization - boolean to set scope of the profile attribute. If true, then it will be set to Organization,
	 * 							else it will be set to Application level.
	 */
	setProfileAttribute(profileAttribute, attributeValue, isOrganization = true) {
		LocalyticsManager.setProfileAttribute({ profileAttribute, attributeValue, isOrganization });
	}

	setPushNotificationsEnabled(enabled) {
		this.setProfileAttribute('Push Enabled', enabled ? 'Yes' : 'No');
		if (Platform.OS === 'Android') {
			LocalyticsManager.setNotificationsDisabled(!enabled);
		}
	}

	/**
	 * Set Custom Dimension using CustomDimensions.js
	 * @param dimension One of the int values from CustomDimension.js. This must be declared in Localytics Dashboard as well.
	 * @param value This must be a string
	 */
	setCustomDimension(dimension, value) {
		const params = {
			'customDimension': dimension,
			'customDimensionValue': value && typeof value !== 'string' ? value.toString() : value,
		};
		LocalyticsManager.setCustomDimension(params);
	}

	setCustomerValues(user, isLoggedIn = true) {
		user = user || { isGuest: !isLoggedIn, isPro: false, email: null, customerId: null };

		this.saveCustomerInfoToStore(user);

		this.setIsGuestValues(user.isGuest);
		this.setIsProValues(user.isPro);
		this.setIsLoggedInValues(isLoggedIn);

		this.setCustomDimension(CustomDimensions.CUSTOMER_EMAIL, user.email);
		this.setCustomDimension(CustomDimensions.CUSTOMER_ID, this.numberToString(user.customerId));
	}

	setIsProValues(isPro) {
		const value = isPro ? 'Yes' : 'No';
		this.setCustomDimension(CustomDimensions.IS_PRO, value);
		this.setProfileAttribute('isPro', value);
	}

	setIsGuestValues(isGuest) {
		const value = isGuest ? 'Yes' : 'No';
		this.setCustomDimension(CustomDimensions.IS_GUEST, value);
		this.setProfileAttribute('isGuest', value);
	}

	setIsLoggedInValues(isLoggedIn) {
		const value = isLoggedIn ? 'Yes' : 'No';
		this.setCustomDimension(CustomDimensions.IS_LOGGED_IN, value);
		this.setProfileAttribute('isLoggedIn', value);
	}

	setIs3dEnabledValues(is3dEnabled) {
		const value = is3dEnabled ? 'Yes' : 'No';
		this.setCustomDimension(CustomDimensions.IS_3D_ENABLED, value);
		this.setProfileAttribute('is3dEnabled', value);
	}


	setIsAREnabledValues(isAREnabled) {
		const value = isAREnabled ? 'Yes' : 'No';
		this.setCustomDimension(CustomDimensions.IS_AR_ENABLED, value);
		this.setProfileAttribute('isAREnabled', value);
	}

	saveCustomerInfoToStore(user) {
		store.save(STORE_CUSTOMER_INFO, {
			customerId: user.customerId,
			email: user.email,
			isPro: user.isPro,
			isGuest: user.isGuest,
		}).catch(helpers.noop).done();
	}

	/**
	 * This method takes cart items and generates &&products string for Omniture tracking.
	 * @param cartItems
	 * @param normalizeUniqueId if set to true, then only uniqueIds are added to &&products
	 */
	normalizeCartItems(cartItems, normalizeUniqueId = false) {
		let products = '';
		if (cartItems) {
			cartItems.forEach((cartItem) => {
				products = `${products}${this.normalizeCartItem(cartItem, normalizeUniqueId)}`;
			});
		}
		return products;
	}

	normalizeCartItem(cartItem, normalizeUniqueId = false) {
		let normalized = '';
		if (cartItem) {
			if (normalizeUniqueId) {
				normalized = `;${cartItem.product.uniqueId};;,`;
			} else {
				const quantity = cartItem.quantity;
				const totalCost = quantity * cartItem.unitPrice;
				normalized = `;${cartItem.product.uniqueId};${quantity};${totalCost},`;
			}

			// subitems
			if (cartItem.subItems && cartItem.subItems.length > 0) {
				normalized = `${normalized}${this.normalizeCartItems(cartItem.subItems, normalizeUniqueId)}`;
			}
		}
		return normalized;
	}

	normalizeName(name) {
		return name.substring('build:app:'.length);
	}

	/**
	 * Localytics track price in pennies.
	 * @param dollar
	 * @returns {number} dollar amount in pennies
	 */
	dollarToPennies(dollar) {
		return Math.round(dollar * 100);
	}

	numberToString(value) {
		if (value && typeof value === 'number') {
			return value.toString();
		}
		return value;
	}

	convertAttributesToStrings(attributes) {
		const obj = {};
		Object.keys(attributes).forEach((key) => {
			const val = attributes[key];
			if (val && typeof val !== 'string') {
				obj[key] = val.toString();
			} else if (val) {
				obj[key] = val;
			}
		});
		return obj;
	}
}

module.exports = new Tracking();
