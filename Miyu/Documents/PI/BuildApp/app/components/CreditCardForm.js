'use strict';

import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	Keyboard,
	StyleSheet,
	View,
	ViewPropTypes,
} from 'react-native';
import { Text } from 'BuildLibrary';
import Form from '../components/Form';
import FormInput from '../components/FormInput';
import styles from '../lib/styles';
import {
	getCardType,
	getCardImage,
} from '../lib/CreditCard';
import {
	AMERICAN_EXPRESS,
} from '../constants/CheckoutConstants';
import {
	formatCreditCardExp,
	formatCreditCardNumber,
	isInteger,
	isValidCardExpiration,
	isValidCardNumber,
	isValidCardCvv,
} from '../lib/Validations';
import EventEmitter from '../lib/eventEmitter';
import SimpleModal from './SimpleModal';

const componentStyles = StyleSheet.create({
	row: {
		flexDirection: 'row',
	},
	inlineInput: {
		flex: 1,
	},
	inlineInputRightMargin: {
		flex: 1,
		marginRight: styles.measurements.gridSpace1,
	},
});

export default class CreditCardForm extends Component {

	constructor() {
		super();

		this.state = {
			creditCard: {
				cardNumber: '',
				expDate: '',
				cvv: '',
			},
		};
	}

	handleChange = (formFields) => {
		const { onChange } = this.props;
		let valid = true;

		const creditCard = Object.keys(formFields).reduce((prev, key) => {
			prev[key] = formFields[key].value;
			valid = valid && formFields[key].valid;
			return prev;
		}, {
			...this.state.creditCard,
		});

		creditCard.cardNumber = formatCreditCardNumber(creditCard.cardNumber);
		creditCard.expDate = formatCreditCardExp(creditCard.expDate);

		this.setState({ creditCard, valid });

		onChange(creditCard);
	};

	validateCardNumber = (value) => {
		return isValidCardNumber(value) || 'Please enter a valid card number.';
	};

	validateCardExp = (value) => {
		return isValidCardExpiration(value) || 'Please enter a valid date. MM/YY';
	};

	validateCvv = (value) => {
		const { cardNumber } = this.state.creditCard,
			cardType = getCardType(cardNumber);
		return (isValidCardCvv(value, cardType) && isInteger(value)) || 'Please enter a valid CVV.';
	};

	triggerValidation = () => {
		return this.form.triggerValidation();
	};

	render() {
		const { style } = this.props;
		const {
			cardNumber,
			expDate,
			cvv,
		} = this.state.creditCard;
		const cardType = getCardType(cardNumber);
		return (
			<Form
				ref={(ref) => this.form = ref}
				onChange={this.handleChange}
				style={style}
				scrollsToTop={true}
			>
				{this.props.renderHeader()}
				<FormInput
					name="cardNumber"
					maxLength={19}
					label="Card Number"
					value={cardNumber}
					keyboardType="numeric"
					image={getCardImage(cardType)}
					validationFunction={this.validateCardNumber}
					validateOnBlur={false}
					isRequired={true}
					isRequiredError="Card number is required."
					accessibilityLabel="Card Number Input"
				/>
				<View style={componentStyles.row}>
					<FormInput
						name="expDate"
						maxLength={5}
						label="Expiration"
						placeholder="mm/yy"
						value={expDate}
						componentStyle={componentStyles.inlineInputRightMargin}
						keyboardType="numeric"
						validationFunction={this.validateCardExp}
						validateOnBlur={false}
						isRequired={true}
						isRequiredError="Exp date is required."
						accessibilityLabel="Expiration Field"
					/>
					<View style={componentStyles.inlineInput}>
						<FormInput
							name="cvv"
							maxLength={(!cardType || cardType === AMERICAN_EXPRESS) ? 4 : 3}
							label="CVV code"
							value={cvv}
							keyboardType="numeric"
							validationFunction={this.validateCvv}
							validateOnBlur={false}
							isRequired={true}
							isRequiredError="CVV is required."
							icon="information-circle"
							returnKeyType="done"
							accessibilityLabel="Cvv"
							onIconPress={() => {
								Keyboard.dismiss();
								EventEmitter.emit('showScreenOverlay', (
									<SimpleModal title="CVV Code">
										<Text weight="bold">Visa, Mastercard, & Discover</Text>
										<Text>Last 3 digits on the back of the card next to your signature.</Text>
										<Text weight="bold">American Express</Text>
										<Text>Last 4 digits on the front right of your card above the credit card number.</Text>
									</SimpleModal>
								));
							}}
						/>
					</View>
				</View>
				{this.props.renderFooter()}
			</Form>
		);
	}
}

CreditCardForm.propTypes = {
	renderHeader: PropTypes.func,
	renderFooter: PropTypes.func,
	style: PropTypes.oneOfType([
		PropTypes.object,
		ViewPropTypes.style,
	]),
	onChange: PropTypes.func.isRequired,
	scrollView: PropTypes.object,
};
