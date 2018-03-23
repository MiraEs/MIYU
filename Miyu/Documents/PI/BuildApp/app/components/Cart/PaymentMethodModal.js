import React, {
	PureComponent,
} from 'react';
import PropTypes from 'prop-types';
import {
	StyleSheet,
	View,
} from 'react-native';
import {
	Button,
	Image,
	Text,
} from 'BuildLibrary';
import styles from '../../lib/styles';
import TrackingActions from '../../lib/analytics/TrackingActions';
import {
	CREDIT_CARD,
	PAYPAL,
} from '../../constants/CheckoutConstants';
import creditCardImage from '../../../images/creditCard.png';
import payPalImage from '../../../images/Paypal.png';

const componentStyles = StyleSheet.create({
	component: {
		backgroundColor: styles.colors.white,
	},
	button: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
	},
	method: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: styles.measurements.gridSpace2,
		paddingVertical: styles.measurements.gridSpace3,
	},
	textwrap: {
		paddingLeft: styles.measurements.gridSpace2,
	},
	separator: {
		borderTopWidth: styles.dimensions.borderWidth,
		borderColor: styles.colors.grey,
	},
});

class PaymentMethodModal extends PureComponent {
	static propTypes = {
		onCheckout: PropTypes.func.isRequired,
	};

	render() {
		const { onCheckout } = this.props;

		return (
			<View style={componentStyles.component}>
				<View style={componentStyles.separator}/>
				<Button
					accessibilityLabel="Credit Card Checkout Button"
					onPress={() => onCheckout(CREDIT_CARD)}
					color="white"
					borders={false}
					size="large"
					style={componentStyles.button}
					trackAction={TrackingActions.CART_CHECKOUT_CREDITCARD}
				>
					<View
						style={componentStyles.method}
					>
						<Image
							resizeMode="contain"
							source={creditCardImage}
						/>
						<View
							style={componentStyles.textwrap}
						>
							<Text
								weight="bold"
							>Credit Card
							</Text>
						</View>
					</View>
				</Button>
				<View style={componentStyles.separator}/>
				<Button
					accessibilityLabel="PayPal Checkout Button"
					onPress={() => onCheckout(PAYPAL)}
					color="white"
					borders={false}
					size="large"
					style={componentStyles.button}
					trackAction={TrackingActions.CART_CHECKOUT_PAYPAL}
				>
					<View
						style={componentStyles.method}
					>
						<Image
							resizeMode="contain"
							source={payPalImage}
						/>
						<View
							style={componentStyles.textwrap}
						>
							<Text
								weight="bold"
							>PayPal
							</Text>
						</View>
					</View>
				</Button>
			</View>
		);
	}
}

export default PaymentMethodModal;
