import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	View,
	StyleSheet,
	findNodeHandle,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import helpers, { setStatusBarHidden } from '../lib/helpers';
import productHelpers from '../lib/productHelpers';
import styles from '../lib/styles';
import {
	getCustomerAddresses,
	getDefaultShippingAddress,
	getStoreCredit,
	signUserOut,
} from '../actions/UserActions';
import {
	clearSessionCart,
	updateSessionCart,
} from '../actions/CartActions';
import {
	showAccessories,
} from '../actions/KeyboardActions';
import {
	getCreditCards,
	getDefaultCard,
	updateShippingAddress,
	updateBillingAddress,
	checkout,
} from '../actions/CheckoutActions';
import {
	SHIPPING_ADDRESS,
} from '../constants/Addresses';
import OptionSelectButton from '../components/OptionSelectButton';
import Checkbox from '../components/Checkbox';
import cartService from '../services/CartService';
import Address from '../components/Address';
import CreditCardInfo from '../components/CreditCardInfo';
import PayPalInfo from '../components/PayPalInfo';
import {
	Text,
	Button,
	withScreen,
} from 'BuildLibrary';
import TrackingActions from '../lib/analytics/TrackingActions';
import tracking from '../lib/analytics/tracking';
import Form from '../components/Form';
import GrandTotal from '../components/Checkout/GrandTotal';
import OrderInformation from '../components/Checkout/OrderInformation';
import ShippingMethodSelection from '../components/Checkout/ShippingMethodSelection';
import CheckoutLoginModal from '../components/CheckoutLoginModal';
import CouponButton from '../components/CouponButton';
import { ANIMATION_TIMEOUT_200 } from '../constants/AnimationConstants';
import {
	CREDIT_CARD,
	PAYPAL,
} from '../constants/CheckoutConstants';
import NavigationBarIconTitle from '../components/navigationBar/NavigationBarIconTitle';
import RequestDeliveryDate from '../components/RequestDeliveryDate';
import NavigationBarIconButton from '../components/navigationBar/NavigationBarIconButton';
import EventEmitter from '../lib/eventEmitter';
import { showAlert } from '../actions/AlertActions';
import PhoneHelper from '../lib/PhoneHelper';

const componentStyles = StyleSheet.create({
	indent: {
		marginHorizontal: styles.measurements.gridSpace1,
	},
	headerText: {
		marginTop: styles.measurements.gridSpace3,
	},
	headerTextBottom: {
		marginBottom: styles.measurements.gridSpace1,
	},
	cartItemContainer: {
		backgroundColor: styles.colors.white,
		paddingHorizontal: styles.measurements.gridSpace2,
		paddingTop: styles.measurements.gridSpace2,
	},
	cartItem: {
		flexDirection: 'row',
		borderColor: styles.colors.greyLight,
		borderBottomWidth: styles.dimensions.borderWidthLarge,
		paddingBottom: styles.measurements.gridSpace2,
	},
	cartItemText: {
		flex: 1,
		marginLeft: styles.measurements.gridSpace2,
	},
	cartSubItemContainer: {
		backgroundColor: styles.colors.lightGray,
		paddingBottom: styles.measurements.gridSpace2,
	},
	subItem: {
		flexDirection: 'row',
		backgroundColor: styles.colors.lightGray,
		borderColor: styles.colors.secondary,
		borderLeftWidth: styles.dimensions.borderWidthLarge,
		marginTop: styles.measurements.gridSpace1,
		marginLeft: styles.measurements.gridSpace3,
		marginRight: styles.measurements.gridSpace1,
	},
	grandTotalAmount: {
		color: styles.colors.primary,
	},
	summaryContainer: {
		marginBottom: styles.measurements.gridSpace3,
		backgroundColor: styles.colors.white,
		padding: styles.measurements.gridSpace2,
		flexDirection: 'row',
		flex: 1,
		justifyContent: 'flex-end',
	},
	coupon: {
		marginHorizontal: styles.measurements.gridSpace1,
		marginTop: styles.measurements.gridSpace2,
	},
	scheduleDelivery: {
		padding: styles.measurements.gridSpace1,
	},
});

export class CheckoutCreditCardScreen extends Component {

	constructor(props) {
		super(props);

		this.state = {
			isLoading: false,
			loadingData: true,
			useStoreCredit: false,
			promptLogin: props.user.isGuest,
			optionButtonErrors: {},
			validated: false,
		};
	}

	componentWillMount() {
		const { isGuest } = this.props.user;

		setStatusBarHidden(false, 'fade');

		if (isGuest) {
			this.setState({ loadingData: false });
		} else {
			this.initCustomerData(this.props);
		}
	}

	componentDidMount() {
		const { cart } = this.props;
		const grandTotal = helpers.calcGrandTotal(cart, 0);
		tracking.trackCheckoutStarted(grandTotal, cart.cart);

		EventEmitter.addListener('exitCheckoutCreditCardScreen', this.onExit);
	}

	componentWillReceiveProps(nextProps) {
		const validationErrors = nextProps.validationErrors || {};
		const hadErrors = Object.keys(this.state.optionButtonErrors).length > 0;

		if (hadErrors && this.state.optionButtonErrors !== validationErrors) {
			this.setState({
				optionButtonErrors: {
					contactInfo: !!validationErrors.customerId,
					shippingAddress: !!validationErrors.shippingAddressId,
					shippingMethod: !!validationErrors.shippingOptions,
					paymentMethod: !!validationErrors.paymentType,
				},
			});
		}
	}

	componentWillUnmount() {
		const { showAccessories } = this.props.actions;

		showAccessories();

		EventEmitter.removeListener('exitCheckoutCreditCardScreen', this.onExit);
	}

	setScreenTrackingInformation() {
		return {
			name: 'build:app:checkoutcreditcard',
		};
	}

	getAddress = (addresses, id) => {
		if (addresses) {
			return addresses.find((address) => address.addressId === id);
		}
	};

	getCreditCards = () => {
		return this.props.actions.getCreditCards().catch(helpers.noop).done();
	};

	getCustomerAddresses = () => {
		return this.props.actions.getCustomerAddresses();
	};

	getDefaultCard = () => {
		return this.props.actions.getDefaultCard();
	};

	getDefaultShippingAddress = () => {
		const {
			actions: {
				getDefaultShippingAddress,
				updateSessionCart,
				updateShippingAddress,
			},
			cart: {
				cart,
			},
			shippingAddressId,
		} = this.props;

		return getDefaultShippingAddress()
			.then(({ address: { addressId, zip } }) => {
				if (!shippingAddressId) {
					updateShippingAddress(addressId);
				}

				return zip;
			})
			.then((zipCode) => {
				updateSessionCart({
					sessionCartId: cart.sessionCartId,
					cart: {
						zipCode,
					},
					actualTaxes: true,
				}).catch(helpers.noop).done();
			});
	};

	getStoreCredit = () => {
		const { getStoreCredit } = this.props.actions;

		return getStoreCredit();
	};

	handleShippingAddressChange = (addressId) => {
		this.props.actions.updateShippingAddress(addressId);
	};

	hasAddress = (addresses, id) => {
		return !!this.getAddress(addresses, id);
	};

	hasContactInfo = ({ email, firstName, lastName, customerId }) => {
		return !!email && !!firstName && !!lastName && !!customerId;
	};

	initCustomerData = () => {
		Promise.all([
			this.getDefaultShippingAddress(),
			this.getCustomerAddresses(),
			this.getDefaultCard(),
			this.getStoreCredit(),
		])
			.catch(helpers.noop)
			.done(() => this.setState({ loadingData: false }));
	};

	navigateBackToCheckout = () => {
		const { navigator } = this.props;

		navigator.pop();
	};

	navigateToPaymentScreen = () => {
		const { creditCards, isGuestCheckout } = this.props;

		const props = {
			onSaveSuccess: this.navigateBackToCheckout,
			onCancel: this.navigateBackToCheckout,
			isGuestCheckout,
		};

		if (creditCards && creditCards.length || !isGuestCheckout) {
			this.props.navigator.push('paymentCreditCard', props);
		} else {
			this.props.navigator.push('creditCardScreen', props);
		}
	};

	navigateToShippingMethods = () => {
		const { actions: { updateSessionCart }, cart: { cart }, shippingAddressId, shippingAddresses } = this.props;
		const shippingAddress = this.getAddress(shippingAddresses, shippingAddressId);

		if (shippingAddress && !cart.zipCode) {
			updateSessionCart({
				sessionCartId: cart.sessionCartId,
				cart: { zipCode: shippingAddress.zip },
			})
				.catch(helpers.noop)
				.done(() => {
					this.props.navigator.push('shippingMethod', { onSaveSuccess: this.navigateBackToCheckout });
				});
		} else {
			this.props.navigator.push('shippingMethod', { onSaveSuccess: this.navigateBackToCheckout });
		}
	};

	navigateToShippingAddress = () => {
		const { user, shippingAddressId, shippingAddresses, navigator } = this.props;

		if (!shippingAddresses.length) {
			return () => {
				navigator.push('newAddress', {
					title: 'Shipping Address',
					addressTypeId: SHIPPING_ADDRESS,
					onSaveSuccess: this.navigateBackToCheckout,
				});
			};
		} else {
			return () => {
				navigator.push('addressScreen', {
					title: 'Shipping Address',
					updateAddress: this.handleShippingAddressChange,
					addressTypeId: SHIPPING_ADDRESS,
					addressId: shippingAddressId,
					defaultAddressId: user.defaultShippingAddressId,
					onSaveSuccess: this.navigateBackToCheckout,
					actualTaxes: true,
				});
			};
		}
	};

	disableOptionButton = (requires) => {
		const { validationErrors } = this.props;

		return validationErrors && !!validationErrors[requires];
	};

	setOptionButtonError = (validationErrors) => {
		const optionButtonErrors = {
			contactInfo: !!validationErrors.customerId,
			shippingAddress: !!validationErrors.shippingAddressId,
			shippingMethod: !!validationErrors.shippingOptions,
			paymentMethod: !!validationErrors.paymentType,
		};
		const firstError = Object.keys(optionButtonErrors).find((button) => !!optionButtonErrors[button]);

		if (!!firstError) {
			setTimeout(() => {
				if (this.form) {
					const scrollResponder = this.form.getScrollView().getScrollResponder();
					scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
						findNodeHandle(this[firstError]),
						200,
						true
					);
				}
			}, ANIMATION_TIMEOUT_200);

			this.setState({ optionButtonErrors }, () => this[firstError].bounce());
		}
	};

	getAvailableShippingOptions = (shippingOptions) => {
		return shippingOptions ? shippingOptions.filter((option) => option.customerAvailable) : [];
	};

	onExit = () => {
		const { actions, navigator, user } = this.props;

		if (user.isGuest && user.status === 'AUTH_STATUS_ANONYMOUS') {
			actions.signUserOut(null, user.isGuest);
		}
		navigator.pop();
	};

	checkForSessionCartErrors = () => {
		const {
			cart,
			cart: {
				sessionCartId,
				zipCode,
			},
		} = this.props.cart;
		return cartService.getSessionCartErrors(sessionCartId, zipCode).then((errors) => {
			if (productHelpers.cartRequiresDeliveryDate(cart, errors)) {
				return 'Please schedule a delivery date';
			}
			return productHelpers.getGeErrorMessage(errors, zipCode);
		});
	};

	checkout = () => {
		const {
			actions: { checkout, clearSessionCart, showAlert },
			checkout: { paymentType },
			cart,
			navigator,
			user,
		} = this.props;
		const storeCredit = this.state.useStoreCredit ? helpers.calcStoreCredit(cart, user.storeCredit) : 0;
		const grandTotal = helpers.calcGrandTotal(cart, storeCredit);

		checkout(storeCredit)
			.then((orderNumber) => {
				clearSessionCart().done();
				tracking.trackCheckoutComplete(orderNumber, grandTotal, cart.cart, paymentType);
				navigator.push('checkoutConfirmation', { orderNumber });
			})
			.catch((error) => {
				showAlert(error.message || error, 'error');
			})
			.done(() => {
				this.setState({ isLoading: false });
			});
	};

	onSubmitOrderPress = () => {
		const {
			cart : {
				cart,
				cart: {
					shippingOptions,
				},
			},
			validationErrors,
		} = this.props;
		const filtered = this.getAvailableShippingOptions(shippingOptions);

		if (shippingOptions && (shippingOptions.length !== filtered.length)) {
			const phone = PhoneHelper.getPhoneNumberByUserType(this.props.user);
			return EventEmitter.emit('onCallUs', phone, true);
		}
		if (!!validationErrors) {
			return this.setOptionButtonError(validationErrors);
		}
		if (validationErrors === null) {
			this.setState({ isLoading: true });
			if (productHelpers.cartHasGeProducts(cart)) {
				this.checkForSessionCartErrors().then((errorMessage) => {
					if (errorMessage) {
						this.setState({ isLoading: false });
						this.props.actions.showAlert(errorMessage, 'error', null, null, 6000);
					} else {
						this.checkout();
					}
				});
			} else {
				this.checkout();
			}
		}
	};

	getCheckoutButtonText = () => {
		const { shippingOptions } = this.props.cart.cart;
		const filtered = this.getAvailableShippingOptions(shippingOptions);
		const phone = PhoneHelper.getPhoneNumberByUserType(this.props.user);

		if (shippingOptions && (shippingOptions.length !== filtered.length)) {
			return `Call to Place Order - ${PhoneHelper.formatPhoneNumber(phone)}`;
		}

		return 'Submit Order';
	};

	onCheckoutLogin = (isGuest) => {
		this.setState({ promptLogin: false }, () => {
			if (!isGuest) {
				this.initCustomerData();
			}
		});
	};

	renderAddress = (address) => {
		if (address) {
			return <Address address={address} />;
		}
	};

	renderContactInfo = (user) => {
		if (this.hasContactInfo(user)) {
			return (
				<View>
					<Text>{user.firstName} {user.lastName}</Text>
					<Text>{user.email}</Text>
				</View>
			);
		}
	};

	renderPaymentMethod = () => {
		const { creditCard, paymentType } = this.props.checkout;

		if (paymentType === CREDIT_CARD) {
			return (
				<CreditCardInfo {...creditCard} />
			);
		}

		if (paymentType === PAYPAL) {
			return <PayPalInfo />;
		}
	};

	renderShippingMethodSection = () => {
		const { cart, user } = this.props;
		const { optionButtonErrors } = this.state;

		return (
			<ShippingMethodSelection
				ref={(ref) => this.shippingMethod = ref}
				cart={cart}
				user={user}
				isDisabled={this.disableOptionButton('shippingAddressId')}
				hasError={optionButtonErrors.shippingMethod}
				onPress={this.navigateToShippingMethods}
			/>
		);
	};

	renderStoreCredit = () => {
		const { cart, user } = this.props;
		const { useStoreCredit } = this.state;
		const storeCredit = helpers.toUSD(helpers.calcStoreCredit(cart, user.storeCredit));

		if (user.storeCredit && user.storeCredit > 0) {
			return (
				<Checkbox
					name="storeCredit"
					label={`Apply ${storeCredit} in store credit.`}
					value={useStoreCredit}
					onChange={() => this.setState({ useStoreCredit: !useStoreCredit })}
					style={componentStyles.indent}
				/>
			);
		}
	};

	renderScreenContent = () => {
		const { loadingData, optionButtonErrors, useStoreCredit } = this.state;
		const { creditCard } = this.props.checkout;
		const { cart, user, shippingAddressId, shippingAddresses, navigator } = this.props;
		const { selectedShippingIndex } = cart;
		const optionSelectError = 'Please finish filling in your information before submitting your order.';
		const shippingTitle = shippingAddresses.length > 0 ? 'Select a shipping address' : 'Add a shipping address';
		const paymentTitle = creditCard && creditCard.creditCardId ? 'Select a payment method' : 'Add a payment method';

		if (loadingData) {
			return null;
		}

		return (
			<Form
				ref={(ref) => {
					if (ref) {
						this.form = ref;
					}
				}}
				scrollsToTop={true}
			>
				<Text
					size="large"
					weight="bold"
					style={[componentStyles.indent, componentStyles.headerText]}
				>
					Contact Info
				</Text>
				<OptionSelectButton
					key="contactInfo"
					onPress={() => navigator.push('contactInfo', {
						onSaveSuccess: this.navigateBackToCheckout,
					})}
					text="Add your contact information"
					ref={(ref) => this.contactInfo = ref}
					style={componentStyles.indent}
					hasError={optionButtonErrors.contactInfo}
					errorMessage={optionSelectError}
					accessibilityLabel="Contact Info"
				>
					{this.renderContactInfo(user)}
				</OptionSelectButton>
				<Text
					size="large"
					weight="bold"
					style={[componentStyles.indent, componentStyles.headerText]}
				>
					Shipping Information
				</Text>
				<OptionSelectButton
					key="shippingAddress"
					onPress={this.navigateToShippingAddress()}
					text={shippingTitle}
					ref={(ref) => this.shippingAddress = ref}
					style={componentStyles.indent}
					isDisabled={this.disableOptionButton('customerId')}
					hasError={optionButtonErrors.shippingAddress}
					errorMessage={optionSelectError}
					accessibilityLabel="Shipping Address"
				>
					{this.renderAddress(this.getAddress(shippingAddresses, shippingAddressId))}
				</OptionSelectButton>
				{this.renderShippingMethodSection()}
				<RequestDeliveryDate
					cart={this.props.cart.cart}
					testID="RequestDeliveryDate"
					trackAction={TrackingActions.CC_CHECKOUT_REQUEST_DELIVERY_DATE}
					isDisabled={this.disableOptionButton('shippingAddressId')}
				/>
				<Text
					size="large"
					weight="bold"
					style={[componentStyles.indent, componentStyles.headerText]}
				>
					Payment Method
				</Text>
				<OptionSelectButton
					key="paymentMethod"
					onPress={() => this.navigateToPaymentScreen()}
					text={paymentTitle}
					ref={(ref) => this.paymentMethod = ref}
					style={componentStyles.indent}
					isDisabled={this.disableOptionButton('shippingAddressId')}
					hasError={optionButtonErrors.paymentMethod}
					errorMessage={optionSelectError}
					accessibilityLabel="Payment Method"
				>
					{this.renderPaymentMethod()}
				</OptionSelectButton>
				{this.renderStoreCredit()}
				<CouponButton
					style={componentStyles.coupon}
					addTrackAction={TrackingActions.CHECKOUT_ADD_COUPON_CODE}
					editTrackAction={TrackingActions.CHECKOUT_EDIT_COUPON_CODE}
					removeTrackAction={TrackingActions.CHECKOUT_REMOVE_COUPON_CODE}
				/>
				<OrderInformation
					cart={cart.cart}
					user={user}
					selectedShippingIndex={selectedShippingIndex}
					storeCredit={helpers.calcStoreCredit(cart, user.storeCredit)}
					useStoreCredit={useStoreCredit}
					actualTaxes={true}
				/>
			</Form>
		);
	};

	renderFooter = () => {
		const { isLoading, loadingData, useStoreCredit } = this.state;
		const { cart, user } = this.props;

		if (loadingData) {
			return null;
		}

		return (
			<View>
				<GrandTotal
					cart={cart}
					storeCredit={user.storeCredit}
					useStoreCredit={useStoreCredit}
				/>
				<Button
					isLoading={isLoading}
					onPress={this.onSubmitOrderPress}
					text={this.getCheckoutButtonText()}
					accessibilityLabel="Submit Credit Card Order"
					trackAction={TrackingActions.CHECKOUT_SUBMIT}
					style={styles.elements.noFlex}
				/>
			</View>
		);
	};

	render() {
		const { navigator } = this.props;
		const { promptLogin } = this.state;

		if (promptLogin) {
			return (
				<CheckoutLoginModal
					onCheckoutLogin={this.onCheckoutLogin}
					navigator={navigator}
					paymentType="CREDIT_CARD"
					title="Secure Checkout"
				/>
			);
		}

		return (
			<View
				style={styles.elements.screenGreyLight}
			>
				{this.renderScreenContent()}
				{this.renderFooter()}
			</View>
		);
	}
}

CheckoutCreditCardScreen.route = {
	navigationBar: {
		visible: true,
		renderTitle() {
			return (
				<NavigationBarIconTitle color={helpers.isIOS() ? 'secondary' : 'greyLight'}>
					Secure Checkout
				</NavigationBarIconTitle>
			);
		},
		renderLeft() {
			return (
				<NavigationBarIconButton
					iconName={helpers.getIcon('arrow-back')}
					iconSize={33}
					onPress={() => EventEmitter.emit('exitCheckoutCreditCardScreen')}
					trackAction={TrackingActions.CHECKOUT_NAV_TAP_CLOSE}
				/>
			);
		},
	},
};

CheckoutCreditCardScreen.propTypes = {
	user: PropTypes.object,
	actions: PropTypes.object,
	cart: PropTypes.object,
	checkout: PropTypes.object,
	creditCards: PropTypes.array,
	creditCardId: PropTypes.number,
	isGuestCheckout: PropTypes.bool,
	shippingAddressId: PropTypes.number,
	billingAddressId: PropTypes.number,
	shippingAddresses: PropTypes.array,
	billingAddresses: PropTypes.array,
	routeStack: PropTypes.array,
	lastViewedProduct: PropTypes.object,
	navigator: PropTypes.shape({
		push: PropTypes.func,
		pop: PropTypes.func,
	}),
	validationErrors: PropTypes.object,
};

CheckoutCreditCardScreen.defaultProps = {
	isGuestCheckout: false,
	validationErrors: null,
};

const mapStateToProps = (state) => {
	return {
		user: state.userReducer.user,
		checkout: state.checkoutReducer,
		cart: state.cartReducer,
		creditCards: state.checkoutReducer.creditCards,
		creditCardId: state.checkoutReducer.creditCardId,
		shippingAddressId: state.checkoutReducer.shippingAddressId,
		billingAddressId: state.checkoutReducer.billingAddressId,
		shippingAddresses: (state.userReducer.user && state.userReducer.user.shippingAddresses) || [],
		billingAddresses: (state.userReducer.user && state.userReducer.user.billingAddresses) || [],
		routeStack: state.checkoutReducer.routeStack,
		validationErrors: state.validator.checkoutCreditCard,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			checkout,
			clearSessionCart,
			getCustomerAddresses,
			getCreditCards,
			getDefaultCard,
			getDefaultShippingAddress,
			getStoreCredit,
			signUserOut,
			updateBillingAddress,
			updateSessionCart,
			updateShippingAddress,
			showAccessories,
			showAlert,
		}, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(withScreen(CheckoutCreditCardScreen));
