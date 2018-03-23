'use strict';

import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	View,
	ViewPropTypes,
} from 'react-native';
import Form from '../components/Form';
import FormInput from '../components/FormInput';
import FormDropDown from '../components/FormDropDown';
import {
	COUNTRIES,
	STATES,
} from '../constants/Addresses';
import SmartyStreets from '../services/SmartyStreets';
import styles from '../lib/styles';
import {
	Text,
	KeyboardSpacer,
} from 'BuildLibrary';
import {
	formatPhoneNumber,
	isValidPhoneNumber,
	isValidAddress,
} from '../lib/Validations';

const componentStyles = {
	footerText: {
		paddingBottom: styles.measurements.gridSpace1,
	},
	inputMargin: {
		marginRight: styles.measurements.gridSpace1,
	},
};

export default class AddressEdit extends Component {

	constructor(props) {
		super(props);

		this.countries = COUNTRIES;
		this.statesProvinces = STATES;

		this.state = {
			address: props.address || { country: 1 },
			city_states: [], // array of city/states associated with the provided ZIP
			zipError: '',
			zipValid: null,
		};
	}

	componentWillMount() {
		const { city, state, zip } = this.state.address;
		if (zip) {
			SmartyStreets.get(zip)
				.then(({address, zipError, zipValid, city_states}) => {
					if (city) {
						delete address.city;
					}
					if (state) {
						delete address.state;
					}
					this.setState({zipError, zipValid, city_states});
					this.handleChange(address);
				});
		}
	}

	getStateDropdownTemplate = (item, style, props) => {
		return (
				<Text
					style={style}
					{...props}
				>
					{item.name}
				</Text>);
	};

	getStates = () => {
		const { country } = this.state.address;
		let states = STATES;

		if (country) {
			states = states.filter((state) => state.country === country);
		}

		states = states.map((state) => {
			return {
				name: state.text,
				text: state.value,
				value: state.value,
				country: state.country,
			};
		});

		return states;
	};

	handleChange = (formFields, valid) => {
		const { onChange } = this.props;

		const address = Object.keys(formFields).reduce((prev, key) => {
			prev[key] = formFields[key].value;
			return prev;
		}, {
			...this.state.address,
		});

		if (address.phone && address.phone.length > 8) {
			address.phone = formatPhoneNumber(address.phone);
		}

		this.setState({
			address,
			valid,
		});

		if (onChange) {
			onChange(address, valid);
		}
	};

	handleNewZip = (input) => {
		const { onBlur } = this.props;
		const zip = input._lastNativeText && input._lastNativeText.trim();

		if (zip) {
			SmartyStreets.get(zip)
				.then(({address, error, valid, city_states}) => {
					this.setState({zipError: error, zipValid: valid, city_states});
					this.handleChange(address);
				});
		}

		if (typeof onBlur === 'function') {
			onBlur(input);
		}
	};

	validateAddress = (address) => {
		if (this.props.poHelpText) {
			return isValidAddress(address) || 'Sorry, we cannot ship to P.O. Boxes.';
		}

		return true;
	};

	validateCityStateZip = (input) => {
		let { address: { city = '', state }} = this.state;
		city = city.trim();

		// there's a delay on changing the state of the state
		// so we get it from the arguments
		if (typeof input === 'string') {
			state = input;
		}

		const { city_states } = this.state;
		const { formWarning } = this.props;

		if (city && state && city_states.length) {
			const validatedCityState = city_states.find((cityState) => {
				return cityState.state_abbreviation === state &&
					cityState.city === city;
			});

			if (!validatedCityState && typeof formWarning === 'function') {
				formWarning('Please review your ZIP Code, City and State. It appears that at least one of them may be incorrect.');
			}
		}
	};

	validatePhoneNumber = (value) => {
		return value && isValidPhoneNumber(value) ? true : 'Please enter a valid phone number.';
	};


	triggerValidation = () => {
		return this._address.triggerValidation();
	};

	render() {
		const {
			firstName,
			lastName,
			company,
			address,
			address2,
			city,
			state,
			zip,
			country,
			phone,
		} = this.state.address;
		const {
			zipError,
			zipValid,
		} = this.state;
		const {
			poHelpText,
			style,
			inputFocusOffset,
			topSpacing,
		} = this.props;

		// this offsets the scroll on the phone input enough so that
		// we can see the warning text and any error message
		let phoneOffset = 30;
		if (this._address && !this._address._form.phone.isValid()) {
			phoneOffset += 27;
		}

		return (
			<Form
				ref={(c) => this._address = c}
				onChange={this.handleChange}
				inputFocusOffset={inputFocusOffset}
				style={style}
				scrollsToTop={true}
			>
				{this.props.children}
				<View style={styles.elements.flexRow}>
					<FormInput
						autoCapitalize="words"
						autoCorrect={false}
						name="firstName"
						isRequired={true}
						isRequiredError="Required."
						label="First Name*"
						value={firstName}
						componentStyle={[styles.elements.flex, componentStyles.inputMargin]}
						accessibilityLabel="First Name"
					/>
					<FormInput
						autoCapitalize="words"
						autoCorrect={false}
						name="lastName"
						isRequired={true}
						isRequiredError="Required."
						label="Last Name*"
						value={lastName}
						componentStyle={styles.elements.flex}
						accessibilityLabel="Last Name"
					/>
				</View>
				<FormInput
					autoCapitalize="words"
					name="company"
					maxLength={75}
					label="Company Name"
					value={company}
					accessibilityLabel="Company"
				/>
				<FormInput
					name="address"
					isRequired={true}
					isRequiredError="Address is required."
					maxLength={100}
					label="Address*"
					value={address}
					help={poHelpText ? 'We cannot ship to a P.O. Box' : null}
					validationFunction={this.validateAddress}
					accessibilityLabel="Street Address"
				/>
				<FormInput
					name="address2"
					maxLength={100}
					label="Suite/Apt"
					value={address2}
					accessibilityLabel="Street Address 2"
				/>
				<FormInput
					keyboardType="numbers-and-punctuation"
					name="zip"
					isRequired={true}
					autoCorrect={false}
					isRequiredError="ZIP is required."
					maxLength={10}
					label="ZIP Code*"
					error={zipError}
					valid={zipValid}
					value={zip}
					onBlur={this.handleNewZip}
					accessibilityLabel="Zip Code"
				/>
				<FormInput
					autoCapitalize="words"
					name="city"
					isRequired={true}
					isRequiredError="City is required."
					maxLength={50}
					label="City*"
					value={city}
					accessibilityLabel="City"
					onBlur={this.validateCityStateZip}
				/>
				<FormDropDown
					name="state"
					isRequired={true}
					isRequiredError="Required."
					modalDescription="Select State/Province"
					options={this.getStates()}
					label="State*"
					dependentOnKey="country"
					dropDownCustomTemplate={this.getStateDropdownTemplate}
					value={state}
					accessibilityLabel="State"
					onChange={this.validateCityStateZip}
				/>
				<FormDropDown
					name="country"
					isRequired={true}
					isRequiredError="Country is required."
					modalDescription="Select Country"
					options={COUNTRIES}
					label="Country*"
					value={country}
					accessibilityLabel="Country"
				/>
				<FormInput
					keyboardType="numeric"
					name="phone"
					validationFunction={this.validatePhoneNumber}
					isRequired={true}
					isRequiredError="Phone Number is required."
					label="Phone Number*"
					returnKeyType="go"
					value={phone}
					focusOffset={phoneOffset}
					accessibilityLabel="Phone Number"
				/>
				<Text
					style={componentStyles.footerText}
					size="small"
					color="greyDark"
				>
					We will only use your phone number to contact you in regards to
					issues with your order or shipment delivery purposes.
				</Text>
				<KeyboardSpacer topSpacing={topSpacing} />
			</Form>

		);
	}
}

AddressEdit.propTypes = {
	children: PropTypes.any,
	style: PropTypes.oneOfType([
		PropTypes.object,
		ViewPropTypes.style,
	]),
	address: PropTypes.object,
	poHelpText: PropTypes.bool,
	onChange: PropTypes.func.isRequired,
	onFocus: PropTypes.func,
	onBlur: PropTypes.func,
	scrollView: PropTypes.object,
	inputFocusOffset: PropTypes.number,
	topSpacing: PropTypes.number,
	formWarning: PropTypes.func,
};

AddressEdit.defaultProps = {
	poHelpText: false,
	topSpacing: 0,
};
