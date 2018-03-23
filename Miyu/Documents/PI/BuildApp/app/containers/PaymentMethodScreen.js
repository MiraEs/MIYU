import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	StyleSheet,
	TouchableOpacity,
	View,
} from 'react-native';
import { connect } from 'react-redux';
import { createAnimatableComponent } from 'react-native-animatable';
import {
	Image,
	Text,
	withScreen,
} from 'BuildLibrary';
import Icon from 'react-native-vector-icons/Ionicons';
import styles from '../lib/styles';
import helpers from '../lib/helpers';
import TrackingActions from '../lib/analytics/TrackingActions';
import { navigatorPop, navigatorPopToRoute } from '../actions/NavigatorActions';
import {
	APPLE_PAY,
	CREDIT_CARD,
	PAYPAL,
} from '../constants/CheckoutConstants';
import NavigationBarIconButton from '../components/navigationBar/NavigationBarIconButton';
import CheckoutLoginModal from '../components/CheckoutLoginModal';
import ApplePay from '../lib/ApplePay';

const AnimatedView = createAnimatableComponent(View);
const componentStyles = StyleSheet.create({
	component: {
		backgroundColor: styles.colors.white,
	},
	button: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		height: styles.buttons.large.height,
		borderBottomWidth: styles.dimensions.borderWidth,
		borderColor: styles.colors.grey,
	},
	method: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		paddingHorizontal: styles.measurements.gridSpace3,
		paddingVertical: styles.measurements.gridSpace3,
	},
	image: {
		width: 63,
		height: 42,
	},
	imageApplePay: {
		width: 63,
		height: 42,
		borderColor: styles.colors.black,
		borderWidth: 1,
		borderRadius: 5,
	},
	textwrap: {
		paddingLeft: styles.measurements.gridSpace2,
	},
	separator: {
		borderTopWidth: styles.dimensions.borderWidth,
		borderColor: styles.colors.grey,
	},
	icon: {
		paddingHorizontal: styles.measurements.gridSpace3,
	},
});

export class PaymentMethodScreen extends Component {

	constructor(props) {
		super(props);

		this.state = {
			isLoaded: !helpers.isIOS(),
			promptLogin: props.isGuest,
			slideOptions: false,
			canMakePayments: false,
			canMakePaymentsUsingNetworks: false,
		};
	}

	componentWillMount() {
		if (helpers.isIOS()) {
			ApplePay.canMakePayments()
				.then(({ canMakePayments, canMakePaymentsUsingNetworks }) => {
					this.setState({ isLoaded: true, canMakePayments, canMakePaymentsUsingNetworks });
				})
				.catch(helpers.noop);
		}
	}

	setScreenTrackingInformation() {
		return {
			name: 'build:app:paymentmethod',
		};
	}

	onCheckoutLogin = () => {
		this.setState({ promptLogin: false, slideOptions: true });
	};

	onCheckout = (paymentType) => {
		const { navigator } = this.props;

		if (paymentType === CREDIT_CARD) {
			navigator.push('checkoutCreditCard');
		}

		if (paymentType === PAYPAL) {
			navigator.push('checkoutPayPal');
		}

		if (paymentType === APPLE_PAY) {
			navigatorPopToRoute('cartScreen', 'root');
			navigator.push('checkoutApplePay');
		}
	};

	renderCreditCard = () => {
		const creditCardImage = require('../../images/creditCard.png');

		return (
			<TouchableOpacity
				id="buttoncreditcard"
				accessibilityLabel="Credit Card Checkout Button"
				onPress={() => this.onCheckout(CREDIT_CARD)}
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
						style={componentStyles.image}
					/>
					<View
						style={componentStyles.textwrap}
					>
						<Text
							size="large"
							weight="bold"
						>Credit Card
						</Text>
					</View>

				</View>
				<Icon
					name={helpers.getIcon('arrow-forward')}
					size={27}
					color={styles.colors.secondary}
					style={componentStyles.icon}
				/>
			</TouchableOpacity>
		);
	};

	renderPayPal = () => {
		const payPalImage = require('../../images/Paypal.png');

		return (
			<TouchableOpacity
				id="buttonpaypal"
				accessibilityLabel="PayPal Checkout Button"
				onPress={() => this.onCheckout(PAYPAL)}
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
						style={componentStyles.image}
					/>
					<View
						style={componentStyles.textwrap}
					>
						<Text
							size="large"
							weight="bold"
						>PayPal
						</Text>
					</View>
				</View>
				<Icon
					name={helpers.getIcon('arrow-forward')}
					size={27}
					color={styles.colors.secondary}
					style={componentStyles.icon}
				/>
			</TouchableOpacity>
		);
	};

	renderApplePay = () => {
		const { applePay } = this.props;
		const { canMakePayments, canMakePaymentsUsingNetworks } = this.state;
		const applePayImage = require('../../images/ApplePay2.png');

		if (!helpers.isIOS() || !applePay || !canMakePayments || !canMakePaymentsUsingNetworks) {
			return null;
		}

		return (
			<TouchableOpacity
				id="buttonapplepay"
				accessibilityLabel="ApplePay Checkout Button"
				onPress={() => this.onCheckout(APPLE_PAY)}
				color="white"
				borders={false}
				size="large"
				style={componentStyles.button}
				trackAction={TrackingActions.CART_CHECKOUT_APPLEPAY}
			>
				<View
					style={componentStyles.method}
				>
					<Image
						resizeMode="contain"
						source={applePayImage}
						style={componentStyles.imageApplePay}
					/>
					<View
						style={componentStyles.textwrap}
					>
						<Text
							size="large"
							weight="bold"
						>ApplePay
						</Text>
					</View>
				</View>
				<Icon
					name={helpers.getIcon('arrow-forward')}
					size={27}
					color={styles.colors.secondary}
					style={componentStyles.icon}
				/>
			</TouchableOpacity>
		);
	};

	renderTitle() {
		return (
			<View
				style={[componentStyles.button, componentStyles.icon]}
			>
				<Text
					size="large"
					weight="bold"
				>How do you want to pay?
				</Text>
			</View>
		);
	}

	render() {
		const { navigator } = this.props;
		const { isLoaded, promptLogin, slideOptions } = this.state;

		if (!isLoaded) {
			return <View />;
		}

		if (promptLogin) {
			return (
				<CheckoutLoginModal
					onCheckoutLogin={this.onCheckoutLogin}
					navigator={navigator}
					paymentType={CREDIT_CARD}
					title="PayPal Checkout"
				/>
			);
		}

		if (slideOptions) {
			return (
				<AnimatedView
					animation="slideInRight"
					duration={300}
					ref={(ref) => this.messageView = ref}
					style={componentStyles.component}
				>
					{this.renderTitle()}
					{this.renderCreditCard()}
					{this.renderPayPal()}
					{this.renderApplePay()}
				</AnimatedView>
			);
		}

		return (
			<View style={componentStyles.component}>
				{this.renderTitle()}
				{this.renderCreditCard()}
				{this.renderPayPal()}
				{this.renderApplePay()}
			</View>
		);
	}
}

export const route = {
	navigationBar: {
		navigatorPop,
		visisble: true,
		title: 'Payment Methods',
		renderLeft() {
			return (
				<NavigationBarIconButton
					iconName={helpers.getIcon('arrow-back')}
					iconSize={33}
					onPress={() => this.navigatorPop('root')}
					trackAction={TrackingActions.CHECKOUT_NAV_TAP_CLOSE}
				/>
			);
		},
	},
};
PaymentMethodScreen.route = route;

PaymentMethodScreen.propTypes = {
	applePay: PropTypes.bool,
	isGuest: PropTypes.bool,
	navigator: PropTypes.object,
};

export const mapStateToProps = (state) => {
	return {
		isGuest: state.userReducer.user.isGuest,
		applePay: state.featuresReducer.features.applePay,
	};
};

export default connect(mapStateToProps)(withScreen(PaymentMethodScreen));
