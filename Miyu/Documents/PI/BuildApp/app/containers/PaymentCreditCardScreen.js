import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	View,
	StyleSheet,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styles from '../lib/styles';
import {
	getCreditCards,
	getDefaultCard,
	useCreditCard,
} from '../actions/CheckoutActions';
import {
	ScrollView,
	Text,
	ImageButton,
	Button,
	withScreen,
} from 'BuildLibrary';
import RadioOption from '../components/RadioOption';
import CreditCardInfo from '../components/CreditCardInfo';
import PayPalInfo from '../components/PayPalInfo';
import TrackingActions from '../lib/analytics/TrackingActions';
import { CREDIT_CARD, PAYPAL } from '../constants/CheckoutConstants';
import helpers from '../lib/helpers';

const componentStyles = StyleSheet.create({
	screen: {
		flex: 1,
		backgroundColor: styles.colors.greyLight,
	},
	creditCardContainer: {
		marginHorizontal: styles.measurements.gridSpace1,
		marginTop: styles.measurements.gridSpace1,
	},
	headerText: {
		marginHorizontal: styles.measurements.gridSpace1,
		marginTop: styles.measurements.gridSpace1,
		marginBottom: styles.measurements.gridSpace2,
	},
	paymentsContainer: {
		backgroundColor: styles.colors.greyLight,
	},
	optionsContainer: {
		marginHorizontal: styles.measurements.gridSpace1,
	},
	newButton: {
		marginTop: styles.measurements.gridSpace1,
		width: styles.dimensions.width / 2,
		flex: 0,
	},
	paypalButton: {
		marginTop: styles.measurements.gridSpace1,
		width: (styles.dimensions.width / 3) * 2,
		flex: 0,
		alignSelf: 'center',
	},
	otherText: {
		marginTop: styles.measurements.gridSpace2,
	},
});

//This non default export is so we can use it for tests
export class PaymentCreditCardScreen extends Component {

	setScreenTrackingInformation() {
		return {
			name: 'build:app:paymentcreditcard',
		};
	}

	getScreenData = () => {
		this.props.actions.getCreditCards().catch(helpers.noop).done();
	};

	onNewCardPress = () => {
		const { onSaveSuccess, isGuestCheckout } = this.props;
		this.props.navigator.push('creditCardScreen', {
			isGuestCheckout,
			onSaveSuccess,
		});
	};

	renderPayPal = () => {
		const { paymentType, onSaveSuccess } = this.props;

		if (paymentType === PAYPAL) {
			return (
				<RadioOption
					onPress={() => onSaveSuccess()}
					children={<PayPalInfo />}
					isSelected={true}
				/>
			);
		}
	};

	renderCreditCards = () => {
		const { creditCards, creditCardId, onSaveSuccess, paymentType } = this.props;
		const { useCreditCard } = this.props.actions;

		return creditCards.map((card, index) => {
			const isSelected = (card.creditCardId === creditCardId || creditCards.length === 1) && paymentType === CREDIT_CARD;

			return (
				<RadioOption
					key={index}
					onPress={() => {
						useCreditCard(creditCards[index].creditCardId);
						onSaveSuccess();
					}}
					children={
						<CreditCardInfo {...card} />
					}
					isSelected={isSelected}
				/>
			);
		});
	};

	renderPayPalButton = () => {
		const { navigator } = this.props;

		return (
			<View>
				<Text
					textAlign="center"
					style={componentStyles.otherText}
				>
					Other Payment Methods
				</Text>
				<ImageButton
					accessibilityLabel="PayPal"
					style={componentStyles.paypalButton}
					onPress={() => {
						navigator.pop(1);
						navigator.replace('checkoutPayPal');
					}}
					source={require('../../images/PP_logo.png')}
					trackAction={TrackingActions.PAYMENT_PAYPAL}
				/>
			</View>
		);
	};

	renderPaymentOptions = () => {

		return (
			<View style={componentStyles.optionsContainer}>
				<Button
					accessibilityLabel="Add New Card Button"
					text="Add New Card"
					color="white"
					style={componentStyles.newButton}
					textColor="secondary"
					onPress={this.onNewCardPress}
					trackAction={TrackingActions.PAYMENT_ADD_NEW_CARD}
				/>
				{this.renderPayPalButton()}
			</View>
		);
	};

	render() {
		return (
			<View style={componentStyles.screen}>
				<Text
					weight="bold"
					size="large"
					style={componentStyles.headerText}
				>
					Select a payment method
				</Text>
				<ScrollView style={componentStyles.paymentsContainer}>
					<View style={componentStyles.creditCardContainer}>
						{this.renderPayPal()}
						{this.renderCreditCards()}
					</View>
					{this.renderPaymentOptions()}
				</ScrollView>
			</View>
		);
	}
}

PaymentCreditCardScreen.route = {
	navigationBar: {
		visible: true,
		title: 'Payment Method',
	},
};

PaymentCreditCardScreen.propTypes = {
	paymentType: PropTypes.string,
	creditCards: PropTypes.array,
	creditCardId: PropTypes.number,
	actions: PropTypes.object.isRequired,
	features: PropTypes.object,
	paypal: PropTypes.object,
	onSaveSuccess: PropTypes.func.isRequired,
	onCancel: PropTypes.func,
	onError: PropTypes.func,
	isGuestCheckout: PropTypes.bool,
	title: PropTypes.string,
	navigator: PropTypes.shape({
		push: PropTypes.func,
	}),
};

PaymentCreditCardScreen.defaultProps = {
	isGuestCheckout: false,
};

const mapStateToProps = (state) => {
	return {
		paymentType: state.checkoutReducer.paymentType,
		creditCards: state.checkoutReducer.creditCards,
		creditCardId: state.checkoutReducer.creditCardId,
		paypal: state.checkoutReducer.paypal,
		features: state.featuresReducer.features,

	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			getCreditCards,
			getDefaultCard,
			useCreditCard,
		}, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(withScreen(PaymentCreditCardScreen));
