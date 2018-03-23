import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	StyleSheet,
	WebView,
	View,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
	Button,
	Image,
	withScreen,
	Text,
} from 'BuildLibrary';
import {
	hideAccessories,
	showAccessories,
} from '../actions/KeyboardActions';
import {
	authorizePayPalPayment,
	createPayPalPayment,
	clearPayPal,
	checkout,
} from '../actions/CheckoutActions';
import {
	clearSessionCart,
	updateSessionCart,
} from '../actions/CartActions';
import {
	getStoreCredit,
	signUserOut,
} from '../actions/UserActions';
import styles from '../lib/styles';
import helpers from '../lib/helpers';
import TrackingActions from '../lib/analytics/TrackingActions';
import tracking from '../lib/analytics/tracking';
import LoadingView from '../components/LoadingView';
import Form from '../components/Form';
import OptionSelectButton from '../components/OptionSelectButton';
import Address from '../components/Address';
import Checkbox from '../components/Checkbox';
import GrandTotal from '../components/Checkout/GrandTotal';
import OrderInformation from '../components/Checkout/OrderInformation';
import ShippingMethodSelection from '../components/Checkout/ShippingMethodSelection';
import CouponButton from '../components/CouponButton';
import EventEmitter from '../lib/eventEmitter';
import NavigationBarIconTitle from '../components/navigationBar/NavigationBarIconTitle';
import RequestDeliveryDate from '../components/RequestDeliveryDate';
import NavigationBarIconButton from '../components/navigationBar/NavigationBarIconButton';
import CheckoutLoginModal from '../components/CheckoutLoginModal';
import cartService from '../services/CartService';
import productHelpers from '../lib/productHelpers';
import { showAlert } from '../actions/AlertActions';

const componentStyles = StyleSheet.create({
	indent: {
		marginHorizontal: styles.measurements.gridSpace1,
	},
	headerText: {
		marginTop: styles.measurements.gridSpace3,
	},
	spacer: {
		width: styles.measurements.gridSpace1,
	},
	shippingIconRow: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: styles.measurements.gridSpace1,
	},
	payPalImage: {
		height: 28,
		width: 98,
	},
	coupon: {
		marginHorizontal: styles.measurements.gridSpace1,
		marginTop: styles.measurements.gridSpace2,
	},
	scheduleDelivery: {
		padding: styles.measurements.gridSpace1,
	},
});

export class CheckoutPayPalScreen extends Component {

	constructor(props) {
		super(props);

		this.state = {
			isLoading: true,
			isAuthorized: false,
			isSubmitting: false,
			promptLogin: props.user.isGuest,
			redirectUrl: null,
			useStoreCredit: false,
		};
	}

	componentWillMount() {
		const {
			actions: { createPayPalPayment, getStoreCredit },
			user: { isGuest },
		} = this.props;

		createPayPalPayment().catch(helpers.noop).done();

		if (!isGuest) {
			getStoreCredit().catch(helpers.noop).done();
		}
	}

	componentDidMount() {
		const { cart } = this.props;
		const grandTotal = helpers.calcGrandTotal(cart, 0);

		tracking.trackCheckoutStarted(grandTotal, cart.cart);

		EventEmitter.addListener('exitCheckoutPayPalScreen', this.onExit);
	}

	componentWillReceiveProps(nextProps) {
		const { checkout: { isLoading }, paypal: { paymentReferenceId, redirectUrl } } = nextProps;

		this.setState({
			isAuthorized: paymentReferenceId && paymentReferenceId.length > 0,
			isLoading,
			redirectUrl,
		});
	}

	componentWillUnmount() {
		const { clearPayPal, showAccessories } = this.props.actions;

		clearPayPal();
		showAccessories();

		EventEmitter.removeListener('exitCheckoutPayPalScreen', this.onExit);
	}

	setScreenTrackingInformation() {
		return {
			name: 'build:app:checkoutpaypal',
		};
	}

	navigateBackToCheckout = () => {
		const { navigator } = this.props;

		navigator.pop();
	};

	onEdit = () => {
		const { createPayPalPayment } = this.props.actions;

		createPayPalPayment()
			.then(() => this.setState({ isAuthorized: false }))
			.then(() => this.navigateBackToCheckout())
			.catch(helpers.noop)
			.done();
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

	onSubmitOrder = () => {
		const {
			actions: {
				showAlert,
			},
			cart: {
				cart,
				cart: {
					shippingOptions,
				},
			},
		} = this.props;
		const filtered = this.getAvailableShippingOptions(shippingOptions);
		if (shippingOptions && (shippingOptions.length !== filtered.length)) {
			return EventEmitter.emit('onCallUs', true);
		}
		this.setState({ isSubmitting: true });

		if (productHelpers.cartHasGeProducts(cart)) {
			this.checkForSessionCartErrors().then((errorMessage) => {
				if (errorMessage) {
					this.setState({ isSubmitting: false });
					showAlert(errorMessage, 'error', null, null, 6000);
				} else {
					this.checkout();
				}
			});
		} else {
			this.checkout();
		}
	};

	checkout = () => {
		const {
			actions: { checkout, clearSessionCart },
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
				this.props.actions.showAlert(error.message || error, 'error');
			})
			.done(() => {
				showAccessories();
				this.setState({ isSubmitting: false });
			});
	};

	payPalCallback = (event) => {
		const { navigator } = this.props;
		const { url } = event;
		const payPalRegex = /www\.paypal\.com|www\.sandbox\.paypal\.com|about:blank/i;
		const callbackRegex = /build\.com\/api\/callback\/paypalClassic\/return\?/i;
		const tokenRegex = /token=([^&]*)/i;
		const payerIdRegex = /payerId=([^&]*)/i;
		let token = null;
		let payerId = null;

		// using the try/catch because we're expecting array elements that might not be there
		try {
			// check to see if we're still in paypal or not
			if (url.search(payPalRegex) < 0) {
				this.webView.stopLoading();

				// not in paypal, check to see if this is the callback
				if (url.search(callbackRegex) > -1) {
					token = url.match(tokenRegex)[1];
					payerId = url.match(payerIdRegex)[1];

					this.setState({ isLoading: true }, () => {
						this.authorizePayPalPayment({ token, payerId });
					});
				} else {
					// ok, we're trying to do something else - time to exit.
					this.setState({ isLoading: true }, () => {
						navigator.pop();
					});
				}
			}
		} catch (error) {
			navigator.pop();
		}
	};

	authorizePayPalPayment = (payload) => {
		const { actions: { authorizePayPalPayment }, navigator } = this.props;

		authorizePayPalPayment(payload)
			.then((zipCodeChanged) => {
				if (zipCodeChanged) {
					this.props.actions.showAlert('Your grand total has been updated to reflect the address selected in PayPal.', 'warning');
				}
			})
			.catch(() => {
				this.setState({
					isLoading: false,
					isAuthorized: false,
				}, () => {
					this.props.actions.showAlert('Error Authorizing PayPal Payment', 'error');
					navigator.pop();
				});
			})
			.done();
	};

	onCheckoutLogin = (isGuest) => {
		const { createPayPalPayment } = this.props.actions;

		this.setState({ promptLogin: false }, () => {
			if (!isGuest) {
				createPayPalPayment()
					.then(() => this.setState({ isAuthorized: false }))
					.catch(helpers.noop)
					.done();
			}
		});
	};

	renderShippingMethodSection = () => {
		const { cart, navigator, user } = this.props;

		return (
			<ShippingMethodSelection
				cart={cart}
				user={user}
				isDisabled={false}
				hasError={false}
				onPress={() => navigator.push('shippingMethod', { onSaveSuccess: this.navigateBackToCheckout })}
			/>
		);
	};

	renderShippingInfo = () => {
		const {
			paypal: { shippingAddressId },
			user: { shippingAddresses = [] },
		} = this.props;
		const shippingAddress = (shippingAddresses || []).find((address) => address.addressId === shippingAddressId);
		const payPalImage = require('../../images/PP_logo.png');

		return (
			<View>
				<View
					style={componentStyles.shippingIconRow}
				>
					<Text
						weight="bold"
					>
						Paying with
					</Text>
					<View
						style={componentStyles.spacer}
					/>
					<Image
						resizeMode="contain"
						source={payPalImage}
						style={componentStyles.payPalImage}
					/>
				</View>
				<Text
					weight="bold"
				>
					Shipping to:
				</Text>
				<Address
					address={shippingAddress}
					boldName={false}
				/>
			</View>
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

	renderReview = () => {
		const {
			cart,
			navigator,
			user,
		} = this.props;
		const { storeCredit } = user;
		const { useStoreCredit } = this.state;

		return (
			<Form
				ref={(ref) => this.form = ref}
				scrollsToTop={true}
			>
				<Text
					size="large"
					weight="bold"
					style={[componentStyles.indent, componentStyles.headerText]}
				>
					Shipping & Payment
				</Text>
				<OptionSelectButton
					key="shippingInfo"
					onPress={() => navigator.push('paymentPayPal', { onEdit: this.onEdit })}
					text="Add your contact information"
					ref={(ref) => this.shippingInfo = ref}
					style={componentStyles.indent}
					accessibilityLabel="Shipping Info"
				>
					{this.renderShippingInfo()}
				</OptionSelectButton>
				{this.renderShippingMethodSection()}
				<RequestDeliveryDate
					cart={cart.cart}
					testID="RequestDeliveryDate"
					trackAction={TrackingActions.PP_CHECKOUT_REQUEST_DELIVERY_DATE}
				/>
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
					selectedShippingIndex={cart.selectedShippingIndex}
					storeCredit={helpers.calcStoreCredit(cart, storeCredit)}
					useStoreCredit={useStoreCredit}
					actualTaxes={true}
				/>
			</Form>
		);
	};

	renderScreenContent = () => {
		const { navigator } = this.props;
		const { isAuthorized, isLoading, promptLogin, redirectUrl } = this.state;

		if (promptLogin) {
			return (
				<CheckoutLoginModal
					onCheckoutLogin={this.onCheckoutLogin}
					navigator={navigator}
					paymentType="PAYPAL"
					title="PayPal Checkout"
				/>
			);
		}

		if (isLoading) {
			return <LoadingView />;
		}

		if (isAuthorized) {
			return this.renderReview();
		}

		return (
			<WebView
				ref={(ref) => this.webView = ref}
				source={{ uri: redirectUrl }}
				startInLoadingState={true}
				onNavigationStateChange={this.payPalCallback}
			/>
		);
	};

	renderFooter = () => {
		const { cart, user: { storeCredit } } = this.props;
		const { isAuthorized, isLoading, isSubmitting, useStoreCredit } = this.state;

		if (!isAuthorized || isLoading) {
			return null;
		}

		return (
			<View>
				<GrandTotal
					cart={cart}
					storeCredit={storeCredit}
					useStoreCredit={useStoreCredit}
				/>
				<Button
					onPress={this.onSubmitOrder}
					isLoading={isSubmitting}
					text="Submit Order"
					accessibilityLabel="Submit PayPal Order"
					style={styles.elements.noFlex}
					trackAction={TrackingActions.CHECKOUT_SUBMIT}
				/>
			</View>
		);
	};

	render() {

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

CheckoutPayPalScreen.route = {
	navigationBar: {
		visible: true,
		renderTitle() {
			return (
				<NavigationBarIconTitle color={helpers.isIOS() ? 'secondary' : 'greyLight'}>
					PayPal Checkout
				</NavigationBarIconTitle>
			);
		},
		renderLeft() {
			return (
				<NavigationBarIconButton
					iconName={helpers.getIcon('arrow-back')}
					iconSize={33}
					onPress={() => EventEmitter.emit('exitCheckoutPayPalScreen')}
					trackAction={TrackingActions.CHECKOUT_NAV_TAP_CLOSE}
				/>
			);
		},
	},
};

CheckoutPayPalScreen.propTypes = {
	actions: PropTypes.object,
	cart: PropTypes.object,
	checkout: PropTypes.object,
	navigator: PropTypes.shape({
		push: PropTypes.func,
		pop: PropTypes.func,
	}),
	onSave: PropTypes.func,
	onCancel: PropTypes.func,
	onError: PropTypes.func,
	paypal: PropTypes.object,
	title: PropTypes.string,
	user: PropTypes.object,
};

const mapStateToProps = (state) => {
	return {
		checkout: state.checkoutReducer,
		cart: state.cartReducer,
		paypal: state.checkoutReducer.paypal || {},
		user: state.userReducer.user,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			hideAccessories,
			showAccessories,
			authorizePayPalPayment,
			createPayPalPayment,
			clearPayPal,
			getStoreCredit,
			clearSessionCart,
			checkout,
			showAlert,
			signUserOut,
			updateSessionCart,
		}, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(withScreen(CheckoutPayPalScreen));
