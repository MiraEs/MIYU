import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	StyleSheet,
	View,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { NavigationStyles } from '@expo/ex-navigation';
import { withScreen } from 'BuildLibrary';
import ApplePay from '../lib/ApplePay';
import {
	authorizeApplePay,
	checkout,
	updateBillingAddress,
	updateShippingAddress,
} from '../actions/CheckoutActions';
import {
	clearSessionCart,
	getSessionCart,
	setSelectedShippingIndex,
	updateSessionCart,
} from '../actions/CartActions';
import {
	createGuest,
	guestLogin,
	saveCustomerAddress,
} from '../actions/UserActions';
import helpers, {calcGrandTotal} from '../lib/helpers';
import { navigatorPop } from '../actions/NavigatorActions';
import NavigationBarIconButton from '../components/navigationBar/NavigationBarIconButton';
import trackingActions from '../lib/analytics/TrackingActions';
import { AUTH_STATUS_ANONYMOUS } from '../constants/Auth';
import tracking from '../lib/analytics/tracking';
import {
	BILLING_ADDRESS,
	SHIPPING_ADDRESS,
} from '../constants/Addresses';
import { APPLE_PAY } from '../constants/CheckoutConstants';
import bugsnag from '../lib/bugsnag';
import environment from '../lib/environment';

const componentStyles = StyleSheet.create({
	withScreen: {
		backgroundColor: 'transparent',
	},
});

export class CheckoutApplePayScreen extends Component {

	constructor(props) {
		super(props);

		this.state = {
			payment: false,
			waitingForAuthorized: false,
		};

		ApplePay.paymentRequestDidFinish = this.paymentRequestDidFinish;
		ApplePay.didSelectShippingAddress = this.didSelectShippingAddress;
		ApplePay.didSelectShippingMethod = this.didSelectShippingMethod;
		ApplePay.didAuthorizePayment = this.didAuthorizePayment;
	}

	componentDidMount() {
		const { actions: { getSessionCart }, cart: { sessionCartId, zipCode } } = this.props;

		getSessionCart({
			sessionCartId,
			recalculatePrice: !!zipCode,
		}).done(() => this.paymentRequest());
	}

	componentWillReceiveProps(nextProps) {
		const { cart, cartReducer, selectedShippingIndex } = nextProps;

		if (cart.zipCode !== this.props.cart.zipCode) {
			ApplePay.updateShippingMethods(this.getPaymentDetails(cartReducer));
		}

		if (selectedShippingIndex !== this.props.selectedShippingIndex) {
			ApplePay.selectShippingMethod(this.getPaymentDetails(cartReducer));
		}
	}

	setScreenTrackingInformation() {
		return {
			name: 'build:app:checkoutapplepay',
		};
	}

	getPaymentDetails = (cartReducer) => {
		const { cart: { couponCode, couponTotal, shippingOptions, taxAmount }, selectedShippingIndex } = cartReducer;
		const items = [];
		const options = [];
		const grandTotal = calcGrandTotal(cartReducer);

		if (Array.isArray(shippingOptions) && shippingOptions.length > 0) {
			items.push({
				label: 'Shipping',
				amount: `${shippingOptions[selectedShippingIndex].shippingCost}`,
			});

			options.push({
				label: `${shippingOptions[selectedShippingIndex].shippingOption}`,
				detail: `${shippingOptions[selectedShippingIndex].shippingName}`,
				amount: `${shippingOptions[selectedShippingIndex].shippingCost}`,
			});

			shippingOptions.forEach((option, index) => {
				if (index !== selectedShippingIndex) {
					options.push({
						label: `${option.shippingOption}`,
						detail: `${option.shippingName}`,
						amount: `${option.shippingCost}`,
					});
				}
			});
		}

		if (taxAmount) {
			items.push({
				label: 'Tax',
				amount: `${taxAmount}`,
			});
		}

		if (couponCode && couponTotal > 0) {
			items.push({
				label: 'Coupon',
				amount: `${couponTotal * -1}`,
			});
		}

		items.push({
			label: 'Build.com',
			amount: `${grandTotal}`,
		});

		return { items, options };
	};

	paymentRequest = () => {
		const { cartReducer } = this.props;
		const { applePay: { merchantIdentifier }} = environment;
		ApplePay.paymentRequest(this.getPaymentDetails(cartReducer), merchantIdentifier);
	};

	paymentRequestDidFinish = () => {
		const { navigator } = this.props;
		const { waitingForAuthorized } = this.state;

		if (!waitingForAuthorized) {
			navigator.pop();
		}
	};

	didSelectShippingAddress = (zipCode) => {
		const { actions: { updateSessionCart }, cart, cartReducer } = this.props;

		if (zipCode !== cart.zipCode) {
			// if we're updating the cart, we'll need to send back the items to ApplePay from componentWillReceiveProps
			updateSessionCart({
				sessionCartId: cart.sessionCartId,
				cart: {
					zipCode,
				},
			})
				.catch(() => ApplePay.invalidShippingAddress())
				.done();
		} else {
			ApplePay.updateShippingMethods(this.getPaymentDetails(cartReducer));
		}
	};

	didSelectShippingMethod = (method) => {
		const { actions: { setSelectedShippingIndex }, cart: { shippingOptions } } = this.props;
		const index = shippingOptions.findIndex((option) => {
			return (option.shippingOption === method.label && option.shippingCost === method.amount);
		});

		setSelectedShippingIndex(index);
	};

	didAuthorizePayment = (authorization) => {
		const {
			actions: { createGuest },
			user: { status },
		} = this.props;
		const { billingAddress, emailAddress } = authorization;

		if (status === AUTH_STATUS_ANONYMOUS) {
			createGuest({
				isGuest: true,
				firstName: billingAddress.firstName,
				lastName: billingAddress.lastName,
				email: emailAddress,
			})
			.then((user) => {
				tracking.trackCustomerLoggedIn(user, 'Guest');
				this.completeAuthorizePayment(authorization);
			})
			.catch((error) => {
				bugsnag.notify(error);
				ApplePay.invalidPayment();
			})
			.done();
		} else {
			this.completeAuthorizePayment(authorization);
		}
	};

	completeAuthorizePayment = ({billingAddress, emailAddress, paymentData, phoneNumber, shippingAddress}) => {
		const {
			actions: {
				authorizeApplePay,
				saveCustomerAddress,
				updateBillingAddress,
				updateShippingAddress,
			},
			cartReducer,
		} = this.props;
		const grandTotalAmount = calcGrandTotal(cartReducer);
		const authorizationRequest = {
			currency: 'USD',
			encryptedPaymentData: paymentData,
			billingAddress: {
				firstName: billingAddress.firstName,
				lastName: billingAddress.lastName,
				address: billingAddress.street,
				city: billingAddress.city,
				state: billingAddress.state,
				zip: billingAddress.postalCode,
				countryId: '1',
			},
			billingEmail: emailAddress,
			grandTotalAmount,
		};

		Promise.all([
			authorizeApplePay(authorizationRequest),
			saveCustomerAddress({
				firstName: billingAddress.firstName,
				lastName: billingAddress.lastName,
				address: billingAddress.street,
				city: billingAddress.city,
				state: billingAddress.state,
				zip: billingAddress.postalCode,
				country: billingAddress.countryCode.toUpperCase(),
				phone: phoneNumber,
			}, BILLING_ADDRESS),
			saveCustomerAddress({
				firstName: shippingAddress.firstName,
				lastName: shippingAddress.lastName,
				address: shippingAddress.street,
				city: shippingAddress.city,
				state: shippingAddress.state,
				zip: shippingAddress.postalCode,
				country: shippingAddress.countryCode.toUpperCase(),
				phone: phoneNumber,
			}, SHIPPING_ADDRESS),
		])
			.then((results) => {
				if (results.length !== 3 || !results[1].addressId || !results[2].addressId) {
					throw new Error('missing addresses');
				}

				updateBillingAddress(results[1].addressId);
				updateShippingAddress(results[2].addressId);
			})
			.then(() => this.checkout())
			.catch((error) => {
				bugsnag.notify(error);
				ApplePay.invalidPayment();
			});
	};

	checkout = () => {
		const {
			actions: { checkout, clearSessionCart },
			cartReducer,
			navigator,
		} = this.props;
		const grandTotal = calcGrandTotal(cartReducer);

		this.setState({ waitingForAuthorized: true }, () => {
			checkout(0)
				.then((orderNumber) => {
					clearSessionCart().done();
					tracking.trackCheckoutComplete(orderNumber, grandTotal, cartReducer.cart, APPLE_PAY);
					ApplePay.authorizedPayment();
					navigator.push('checkoutConfirmation', { orderNumber });
				})
				.catch((error) => {
					bugsnag.notify(error);
					ApplePay.invalidPayment();
					navigator.pop();
				})
				.done();
		});
	};

	render() {
		return <View />;
	}
}

export const route = {
	navigationBar: {
		navigatorPop,
		visible: true,
		title: 'Shopping Cart',
		renderLeft() {
			return (
				<NavigationBarIconButton
					onPress={() => this.navigatorPop('root')}
					iconName={helpers.getIcon('close')}
					trackAction={trackingActions.CART_NAV_TAP_CLOSE}
				/>
			);
		},
		renderRight() {
			return (
				<NavigationBarIconButton
					onPress={helpers.noop}
					iconName={helpers.getIcon('more')}
					trackAction={trackingActions.CART_NAV_TAP_MORE}
				/>
			);
		},
	},
	styles: {
		sceneAnimations: (props) => {
			const animation = NavigationStyles.SlideVertical.sceneAnimations(props);

			return {
				...animation,
				backgroundColor: 'transparent',
			};
		},
	},
	sceneStyle: {
		backgroundColor: 'transparent',
	},
};
CheckoutApplePayScreen.route = route;

CheckoutApplePayScreen.propTypes = {
	actions: PropTypes.object,
	cart: PropTypes.object,
	cartReducer: PropTypes.object,
	checkout: PropTypes.object,
	navigator: PropTypes.object,
	selectedShippingIndex: PropTypes.number,
	user: PropTypes.object,
};

export const mapStateToProps = (state) => {
	return {
		checkout: state.checkoutReducer,
		cart: state.cartReducer.cart,
		cartReducer: state.cartReducer,
		selectedShippingIndex: state.cartReducer.selectedShippingIndex,
		user: state.userReducer.user,
	};
};

export const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			authorizeApplePay,
			checkout,
			clearSessionCart,
			createGuest,
			getSessionCart,
			guestLogin,
			saveCustomerAddress,
			setSelectedShippingIndex,
			updateSessionCart,
			updateBillingAddress,
			updateShippingAddress,
		}, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(withScreen(CheckoutApplePayScreen, componentStyles.withScreen));
