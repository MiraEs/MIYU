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
import {
	addCreditCard,
	useCreditCard,
	getCreditCards,
	updateBillingAddress,
	updateCreditCard,
	deleteCreditCard,
} from '../actions/CheckoutActions';
import {
	saveCustomerAddress,
	getCustomerBillingAddresses,
} from '../actions/UserActions';
import CreditCardForm from '../components/CreditCardForm';
import styles from '../lib/styles';
import {
	Text,
	withScreen,
	KeyboardAwareView,
} from 'BuildLibrary';
import OptionSelectButton from '../components/OptionSelectButton';
import Address from '../components/Address';
import {
	saveSession,
	getSession,
} from '../actions/SessionActions';
import { BILLING_ADDRESS, STATE_EDIT_ADDRESS } from '../constants/Addresses';
import TrackingActions from '../lib/analytics/TrackingActions';
import FixedBottomButton from '../components/FixedBottomButton';
import { trackState } from '../actions/AnalyticsActions';

const componentStyles = StyleSheet.create({
	paddingHorizontal: {
		paddingHorizontal: styles.measurements.gridSpace1,
	},
	headerText: {
		marginTop: styles.measurements.gridSpace1,
	},
	verticalSpacer: {
		height: styles.measurements.gridSpace1,
	},
});

//This non default export is so we can use it for tests
export class CreditCardScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			error: '',
			hasBillingAddresses: Array.isArray(props.billingAddresses) && props.billingAddresses.length > 0,
			hasAddressError: false,
			isLoading: false,
		};
	}

	componentWillReceiveProps(nextProps) {
		const hasBillingAddresses = Array.isArray(nextProps.billingAddresses) && nextProps.billingAddresses.length > 0;
		this.setState({ hasBillingAddresses });
	}

	setScreenTrackingInformation() {
		return {
			name: 'build:app:creditcard',
		};
	}

	getAddress = () => {
		const { billingAddressId, billingAddresses, shippingAddressId, shippingAddresses } = this.props;
		let address = billingAddresses.find((address) => address.addressId === billingAddressId) || billingAddresses[0];

		if (!address) {
			address = Object.assign({}, shippingAddresses.find((address) => address.addressId === shippingAddressId) || shippingAddresses[0]);
			delete address.addressId;
		}

		return address;
	};

	onChange = (creditCard) => {
		const { updateCreditCard } = this.props.actions;
		updateCreditCard(creditCard);
	};

	onPressEditAddress = (address) => {
		this.props.navigator.push('newAddress', {
			onSaveSuccess: () => this.props.navigator.pop(),
			title: '',
			addressScreenState: STATE_EDIT_ADDRESS,
			addressTypeId: BILLING_ADDRESS,
			address,
		});
	};

	onPressSelectAddress = (address) => {
		const { billingAddressId } = this.props;
		const { updateBillingAddress } = this.props.actions;

		this.props.navigator.push('addressScreen', {
			onSaveSuccess: () => this.props.navigator.pop(),
			title: 'Billing Address',
			updateAddress: updateBillingAddress,
			addressTypeId: BILLING_ADDRESS,
			addressId: address.addressId,
			defaultAddressId: billingAddressId,
		});
	};

	tokenizeAndAddCard = (address) => {
		const { creditCard, onSaveSuccess, creditCardId, isEdit } = this.props;
		const { addCreditCard, saveSession, deleteCreditCard } = this.props.actions;

		this.setState({ isLoading: true });

		saveSession()
			.then((session) => {
				return {
					billingAddressId: address.addressId,
					sessionId: session.cid,
					creditCardNumber: creditCard.cardNumber.replace(/[^\d.]/g, ''),
					cvv: creditCard.cvv,
					creditCardName: `${address.firstName} ${address.lastName}`,
					expirationMonth: creditCard.expDate.replace(/[^\d.]/g, '').substring(0, 2),
					expirationYear: `20${creditCard.expDate.replace(/[^\d.]/g, '').substring(2, 4)}`,
					creditCardId,
				};
			})
			.then((card) => addCreditCard(card))
			.then(() => {
				if (isEdit) {
					return deleteCreditCard(creditCardId);
				}
			})
			.then(onSaveSuccess)
			.catch(() => this.addCardError)
			.done();
	};

	addCardError = () => {
		this.setState({
			error: 'Sorry we could not add your card, please check the information and try again.',
			isLoading: false,
		});
		setTimeout(() => this.setState({ error: '' }), 3000);
	};

	onPressUseCardButton = () => {
		const { saveCustomerAddress } = this.props.actions;
		const billingAddress = this.getAddress();
		const isValid = this.cardForm.triggerValidation();

		if (!isValid) {
			this.setState({ error: 'Please fill out all the fields.' });
			setTimeout(() => {
				this.setState({ error: '' });
			}, 3000);
			return;
		}

		if (!billingAddress.addressId) {
			saveCustomerAddress(billingAddress, BILLING_ADDRESS).then((newAddress) => {
				this.tokenizeAndAddCard(newAddress);
			});
		} else {
			this.tokenizeAndAddCard(billingAddress);
		}
	};

	renderHeader = () => {
		const { error } = this.state;

		return (
			<View>
				<Text
					weight="bold"
					size="large"
					style={componentStyles.headerText}
					accessibilityLabel="Credit Card Header"
				>
					Enter your card information
				</Text>
				<Text color="error">{error}</Text>
			</View>
		);
	};

	renderAddresses = () => {
		const { isGuestCheckout } = this.props;
		const billingAddress = this.getAddress();

		return (
			<View>
				<Text weight="bold">Billing Address</Text>
				<OptionSelectButton
					onPress={() => {
						if (isGuestCheckout && !billingAddress.addressId) {
							this.onPressEditAddress(billingAddress);
						} else {
							this.onPressSelectAddress(billingAddress);
						}
					}}
					accessibilityLabel="Address Select"
				>
					{this.renderAddressText(billingAddress)}
				</OptionSelectButton>
			</View>
		);
	};

	renderAddressText = (billingAddress) => {
		if (Object.keys(billingAddress).length) {
			return <Address address={billingAddress} />;
		} else {
			return <Text>Enter a new Billing Address</Text>;
		}
	};

	render() {
		const { isLoading } = this.state;

		return (
			<View style={styles.elements.screenGreyLight}>
				<CreditCardForm
					ref={(ref) => this.cardForm = ref}
					onChange={this.onChange}
					renderHeader={this.renderHeader}
					renderFooter={this.renderAddresses}
					style={componentStyles.paddingHorizontal}
				/>
				<KeyboardAwareView>
					<FixedBottomButton
						onPress={this.onPressUseCardButton}
						trackAction={TrackingActions.CREDIT_CARD_USE_CARD}
						buttonText="Use This Card"
						isLoading={isLoading}
						pinToKeyboard={false}
						hideOnKeyboardShow={true}
						accessibilityLabel="Use This Card Button"
					/>
				</KeyboardAwareView>
			</View>
		);
	}
}

CreditCardScreen.route = {
	navigationBar: {
		visible: true,
		title(props) {
			return props.title || 'Add a New Card';
		},
	},
};

CreditCardScreen.propTypes = {
	actions: PropTypes.object.isRequired,
	creditCard: PropTypes.object.isRequired,
	creditCardId: PropTypes.number,
	creditCards: PropTypes.array.isRequired,
	shippingAddressId: PropTypes.number,
	shippingAddresses: PropTypes.array.isRequired,
	billingAddressId: PropTypes.number,
	billingAddresses: PropTypes.array.isRequired,
	routeStack: PropTypes.array,
	onSaveSuccess: PropTypes.func.isRequired,
	isGuestCheckout: PropTypes.bool,
	isCheckout: PropTypes.bool,
	isEdit: PropTypes.bool,
	title: PropTypes.string,
	navigator: PropTypes.shape({
		push: PropTypes.func,
		pop: PropTypes.func,
	}),
};

CreditCardScreen.defaultProps = {
	isGuestCheckout: false,
	isCheckout: true,
	isEdit: false,
};

const mapStateToProps = (state, ownProps) => {
	return {
		creditCard: state.checkoutReducer.creditCard,
		creditCardId: ownProps.creditCardId || state.checkoutReducer.creditCardId,
		creditCards: state.checkoutReducer.creditCards,
		shippingAddressId: state.checkoutReducer.shippingAddressId,
		shippingAddresses: (state.userReducer.user && state.userReducer.user.shippingAddresses) || [],
		billingAddresses: (state.userReducer.user && state.userReducer.user.billingAddresses) || [],
		routeStack: state.checkoutReducer.routeStack,
		billingAddressId: state.checkoutReducer.billingAddressId,
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			addCreditCard,
			getCreditCards,
			saveCustomerAddress,
			saveSession,
			getSession,
			useCreditCard,
			updateBillingAddress,
			getCustomerBillingAddresses,
			updateCreditCard,
			deleteCreditCard,
			trackState,
		}, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(withScreen(CreditCardScreen));
