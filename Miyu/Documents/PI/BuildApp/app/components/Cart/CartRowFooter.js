import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	StyleSheet,
	View,
} from 'react-native';
import styles from '../../lib/styles';
import helpers from '../../lib/helpers';
import {
	IconButton,
	LinkButton,
	Text,
} from 'BuildLibrary';
import trackingActions from '../../lib/analytics/TrackingActions';
import tracking from '../../lib/analytics/tracking';
import CartSubTotal from './CartSubTotal';
import CouponButton from '../CouponButton';
import { TERMS_OF_USE_URL } from '../../constants/constants';
import helpersWithLoadRequirements from '../../lib/helpersWithLoadRequirements';
import ApplePay from '../../lib/ApplePay';
import ApplePayButton from '../../lib/ApplePay/ApplePayButton';

const componentStyles = StyleSheet.create({
	component: {
		flexDirection: 'column',
	},
	buttonRow: {
		flex: 1,
		flexDirection: 'row',
		paddingTop: styles.measurements.gridSpace1,
		paddingHorizontal: styles.measurements.gridSpace1,
		paddingBottom: styles.measurements.gridSpace2,
		backgroundColor: styles.colors.greyLight,
	},
	buttonWrap: {
		flex: 1,
	},
	spacer: {
		width: styles.measurements.gridSpace1,
	},
	totalRow: {
		flex: 1,
		borderTopWidth: styles.dimensions.borderWidth,
		borderColor: styles.colors.grey,
		paddingVertical: styles.measurements.gridSpace1,
	},
	grandTotalRow: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		alignItems: 'center',
		paddingHorizontal: styles.measurements.gridSpace2,
		paddingBottom: styles.measurements.gridSpace2,
	},
	checkoutRow: {
		padding: styles.measurements.gridSpace1,
	},
	checkoutButton: {
		flex: 1,
	},
	applePayButton: {
		marginBottom: styles.measurements.gridSpace1,
	},
	termsRow: {
		justifyContent: 'center',
		flexWrap: 'wrap',
	},
});

class CartRowFooter extends Component {
	constructor(props) {
		super(props);

		this.state = {
			canMakePayments: false,
			canMakePaymentsUsingNetworks: false,
			showCouponEdit: false,
			showZipcodeEdit: false,
			zipcode: null,
		};
	}

	componentWillMount() {
		if (helpers.isIOS()) {
			ApplePay.canMakePayments()
				.then(({canMakePayments, canMakePaymentsUsingNetworks}) => {
					this.setState({isLoaded: true, canMakePayments, canMakePaymentsUsingNetworks });
				})
				.catch(helpers.noop);
		}
	}

	getGrandTotal = () => {
		const { selectedShippingIndex } = this.props;
		const { subTotal, couponTotal, shippingOptions, taxAmount } = this.props.cart;
		let grandTotal = couponTotal ? subTotal - couponTotal : subTotal;
		if (Array.isArray(shippingOptions) && shippingOptions[selectedShippingIndex] && shippingOptions[selectedShippingIndex].shippingCost) {
			grandTotal += shippingOptions[selectedShippingIndex].shippingCost;
		}
		if (taxAmount) {
			grandTotal += taxAmount;
		}
		return helpers.toUSD(grandTotal);
	};

	onApplePayCheckout = () => {
		const { navigator } = this.props;

		navigator.push('checkoutApplePay');
	};

	renderApplePayButton = () => {
		const {applePay} = this.props;
		const {canMakePayments, canMakePaymentsUsingNetworks} = this.state;

		if (!helpers.isIOS() || !applePay || !canMakePayments || !canMakePaymentsUsingNetworks) {
			return null;
		}

		return (
			<ApplePayButton
				onPress={this.onApplePayCheckout}
				style={componentStyles.applePayButton}
			/>
		);
	};

	render() {
		const {
			cart,
			checkForErrors,
			onShippingEstimateModal,
			selectedShippingIndex,
			user,
		} = this.props;
		const {
			sessionCartItems,
			zipCode,
		} = cart;
		const zipCodeText = ` ${zipCode}`;
		const terms = 'By purchasing, I agree to Build.com\'s ';
		let shippingButton = 'Shipping Estimate';

		if (zipCode) {
			shippingButton = (
				<Text
					color="grey"
					lineHeight={false}
					size="xsmall"
				>
					Ship to
					<Text
						color="accent"
						lineHeight={false}
					>
						{zipCodeText}
					</Text>
				</Text>
			);
		}

		return (
			<View style={componentStyles.component}>
				<View style={componentStyles.buttonRow}>
					<View style={componentStyles.buttonWrap}>
						<CouponButton
							size="small"
							addTrackAction={trackingActions.CART_ADD_COUPON_CODE}
							editTrackAction={trackingActions.CART_EDIT_COUPON_CODE}
							removeTrackAction={trackingActions.CART_REMOVE_COUPON_CODE}
						/>
					</View>
					<View style={componentStyles.spacer}/>
					<View style={componentStyles.buttonWrap}>
						<IconButton
							accessibilityLabel="Shipping Estimate"
							iconName={helpers.getIcon('bus')}
							size="small"
							color="white"
							text={shippingButton}
							onPress={onShippingEstimateModal}
							trackAction={trackingActions.CART_SHIPPING_ESTIMATE}
						/>
					</View>
				</View>
				<View style={componentStyles.totalRow}>
					<CartSubTotal
						cart={cart}
						selectedShippingIndex={selectedShippingIndex}
						user={user}
					/>
				</View>
				<View style={componentStyles.grandTotalRow}>
					<Text
						size="large"
						lineHeight={false}
						weight="bold"
					>
						Grand Total:
					</Text>
					<View style={componentStyles.spacer}/>
					<Text
						color="primary"
						lineHeight={false}
						size="large"
						weight="bold"
					>
						{this.getGrandTotal()}
					</Text>
				</View>
				<View style={componentStyles.termsRow}>
					<LinkButton
						size="xsmall"
						textAlign="center"
						onPress={() => helpersWithLoadRequirements.openURL(TERMS_OF_USE_URL)}
					>
						<Text
							size="xsmall"
							textAlign="center"
						>
							{terms}
						</Text>
						terms and conditions.
					</LinkButton>
				</View>
				<View style={componentStyles.checkoutRow}>
					{this.renderApplePayButton()}
					<IconButton
						accessibilityLabel="Cart Checkout"
						borders={false}
						iconName={helpers.getIcon('lock')}
						style={componentStyles.checkoutButton}
						text="Secure Checkout"
						textColor="white"
						onPress={checkForErrors}
						trackAction={trackingActions.CART_SELECT_CHECKOUT}
						trackContextData={{
							'&&products': tracking.normalizeCartItems(sessionCartItems, true),
							'purchase.currencycode': 'USD',
							'cart.checkoutstart': 'checkoutstart',
						}}
					/>
				</View>
			</View>
		);
	}
}

CartRowFooter.propTypes = {
	applePay: PropTypes.bool,
	cart: PropTypes.object.isRequired,
	checkForErrors: PropTypes.func.isRequired,
	navigator: PropTypes.object.isRequired,
	onShippingEstimateModal: PropTypes.func.isRequired,
	selectedShippingIndex: PropTypes.number.isRequired,
	user: PropTypes.object.isRequired,
};

export default CartRowFooter;
