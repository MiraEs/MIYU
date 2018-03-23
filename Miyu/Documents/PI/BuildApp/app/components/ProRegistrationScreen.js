import React, {
	Component,
} from 'react';
import {
	StyleSheet,
	View,
} from 'react-native';
import {
	Text,
	KeyboardSpacer,
	withScreen,
} from 'BuildLibrary';
import PropTypes from 'prop-types';
import {
	create,
	saveProfessionalData,
	saveUserAnswers,
	saveCustomerAddress,
} from '../actions/UserActions';
import {
	COUNTRIES,
	SHIPPING_ADDRESS,
	STATES,
} from '../constants/Addresses';
import { showAlert } from '../actions/AlertActions';
import styles from '../lib/styles';
import FormInput from './FormInput';
import Form from './Form';
import DropDown from './DropDown';
import EventEmitter from '../lib/eventEmitter';
import FixedBottomButton from './FixedBottomButton';
import TrackingActions from '../lib/analytics/TrackingActions';
import FormErrorMessage from './FormErrorMessage';
import {
	isValidUSZipcode,
	isValidPhoneNumber,
	isValidCanadianZipcode,
} from '../lib/Validations';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import proQuestionnaireConstants from '../constants/proQuestionnaireConstants';
import NavigationBarIconButton from './navigationBar/NavigationBarIconButton';
import helpers from '../lib/helpers';
import { navigatorPopToTop } from '../actions/NavigatorActions';
import UtilityActions from '../actions/UtilityActions';
import bugsnag from '../lib/bugsnag';
import professions from '../constants/Professions';

const componentStyles = StyleSheet.create({
	screen: {
		backgroundColor: styles.colors.white,
		flex: 1,
		paddingHorizontal: styles.measurements.gridSpace1,
		paddingBottom: styles.dimensions.tapSizeMedium + styles.measurements.gridSpace1,
	},
	scrollView: {
		paddingTop: styles.measurements.gridSpace1,
	},
	dropDown: {
		marginHorizontal: 0,
	},
	dropDownError: {
		borderColor: styles.colors.error,
	},
});

export class ProRegistrationScreen extends Component {

	constructor(props) {
		super(props);

		this.state = {
			companyCountry: COUNTRIES[0].value,
			profession: '',
			professionErrorMessage: '',
			isLoading: false,
		};
	}

	setScreenTrackingInformation() {
		return {
			name: 'build:app:proregistration',
		};
	}

	onSelectProfession = (profession) => {
		this.setState({
			profession,
			professionErrorMessage: '',
		});
	};

	onPressSubmit = async () => {
		const isValid = this.validate();
		if (isValid) {
			this.setState({ isLoading: true });

			try {
				const {
					actions,
					navigator,
					firstName,
					lastName,
				} = this.props;

				const {
					companyAddress,
					companyName,
					companyPhoneNumber,
					companyZipCode,
					companyCity,
					companyStateAbbr,
					companyCountry,
				} = this.state;
				await actions.saveCustomerAddress({
					address: companyAddress,
					address2: '',
					city: companyCity,
					state: companyStateAbbr,
					country: companyCountry,
					company: companyName,
					phone: companyPhoneNumber,
					type: SHIPPING_ADDRESS,
					zip: this.getFormattedZipCode(companyZipCode),
					firstName,
					lastName,
				}, SHIPPING_ADDRESS);
				await actions.saveProfessionalData();
				await actions.saveUserAnswers({
					body: [{
						answerId: proQuestionnaireConstants.PROFESSION_ANSWER,
						questionId: proQuestionnaireConstants.CONSUMER_OR_PROFESSIONAL_QUESTION,
						questionnaireId: proQuestionnaireConstants.QUESTIONNAIRE,
						questionnaireSectionId: proQuestionnaireConstants.SECTION,
						textAnswer: '',
						multipleChoiceAnswerId: proQuestionnaireConstants.PROFESSION_ANSWER,
					}, {
						answerId: this.state.profession,
						questionnaireId: proQuestionnaireConstants.QUESTIONNAIRE,
						questionnaireSectionId: proQuestionnaireConstants.SECTION,
						questionId: proQuestionnaireConstants.PROFESSIONAL_QUESTION,
						textAnswer: '',
						multipleChoiceAnswerId: this.state.profession,
					}],
				});
				navigator.push('proRegistrationSuccess');
			} catch (error) {
				this.notifyUserErrors('There was an error saving your pro information.');
				this.setState({ isLoading: false });
			}
		}
	};

	onPressProfessionDropDown = () => {
		EventEmitter.emit('showActionSheet', {
			title: 'Choose Profession',
			options: Object.keys(professions).map((key) => {
				return {
					text: professions[key],
					onPress: () => this.onSelectProfession(key),
				};
			}),
		});
	};

	handleStateDropDownPressed = () => {
		EventEmitter.emit('showActionSheet', {
			title: 'Select State',
			options: this.getStates().map(state => {
				return {
					text: state.text,
					onPress: () => this.handleStateSelected(state.value),
				};
			}),
		});
	};

	handleCountryDropDownPressed = () => {
		let selectedCountryIndex;
		COUNTRIES.forEach((country, index) => {
			if (country.value === this.state.companyCountry) {
				selectedCountryIndex = index;
			}
		});
		const options = {
			title: 'Select Country',
			selections: [selectedCountryIndex],
			options: COUNTRIES.map(country => {
				return {
					text: country.text,
					onPress: () => this.handleCountrySelected(country.value),
				};
			}),
		};
		EventEmitter.emit('showActionSheet', options);
	};

	/**
	 * Add the selected country to the local component state
	 * @param companyCountry {string}
	 */
	handleCountrySelected = companyCountry => {
		const stateChanges = {
			companyCountry,
		};
		if (companyCountry !== this.state.companyCountry) {
			stateChanges.companyCity = '';
			stateChanges.companyStateAbbr = '';
		}
		this.setState(stateChanges);
	};

	/**
	 * Adds the selected state to local component state
	 * @param {String} companyStateAbbr
	 */
	handleStateSelected = (companyStateAbbr) => {
		this.setState({
			stateErrorMessage: '',
			companyStateAbbr,
		});
	};

	handleZipCodeInputBlur = async () => {
		try {
			const { actions } = this.props;
			let { companyZipCode } = this.state;
			if (!isValidUSZipcode(companyZipCode) && !isValidCanadianZipcode(companyZipCode)) {
				return;
			}
			companyZipCode = this.getFormattedZipCode(companyZipCode);
			const addressInfo = await actions.getZipCodeInfo(companyZipCode);
			if (addressInfo && addressInfo.city && addressInfo.stateAbbr && addressInfo.country) {
				this.setState({
					stateErrorMessage: '',
					companyCity: addressInfo.city,
					companyStateAbbr: addressInfo.stateAbbr,
					companyCountry: COUNTRIES.find(country => country.value === addressInfo.country).value,
				});
			}
		} catch (error) {
			if (!__DEV__) {
				bugsnag.notify(error);
			}
			// fail silently as this is just a convenience for users
		}
	};

	onChangeFormValues = (values) => {
		const state = {};
		Object.keys(values).forEach((key) => {
			state[key] = values[key].value;
		});
		this.setState({ ...state });
	};

	/**
	 * Our web services don't handle Canadian zip codes without a space or with lowercase letters
	 * @param zipCode {string|number}
	 */
	getFormattedZipCode = zipCode => {
		if (isValidCanadianZipcode(zipCode)) {
			zipCode = zipCode.toUpperCase().replace(/\s/g, '');
			zipCode = `${zipCode.substring(0, 3)} ${zipCode.substring(3)}`;
			return zipCode;
		}
		return zipCode;
	};

	validate = () => {
		let isValid = true;
		if (this.form) {
			if (!this.state.profession) {
				this.setState({ professionErrorMessage: 'Profession is required.' });
				isValid = false;
			}
			if (!this.state.companyStateAbbr) {
				this.setState({ stateErrorMessage: 'Company state is required.' });
				isValid = false;
			}
			if (!this.form.triggerValidation()) {
				isValid = false;
			}
		}
		return isValid;
	};

	validateZipCode = (zipCode) => {
		return (isValidUSZipcode(zipCode) || isValidCanadianZipcode(zipCode)) || 'Enter a valid zip code.';
	};

	validatePhone = (phone) => {
		return isValidPhoneNumber(phone) || 'Enter a valid phone number.';
	};

	getStates = () => {
		const { companyCountry } = this.state;
		const statesForCurrentCountry = STATES.filter(state => state.country === companyCountry);
		return statesForCurrentCountry;
	};

	getStateNameForAbbreviation = abbreviation => {
		const states = this.getStates();
		const matchingState = states.find(state => state.value === abbreviation);
		if (matchingState && matchingState.text) {
			return matchingState.text;
		}
		return '';
	};

	notifyUserErrors = (message) => {
		this.props.actions.showAlert(message, 'error');
	};

	renderProfessionError = () => {
		if (this.state.professionErrorMessage) {
			return (
				<FormErrorMessage
					message={this.state.professionErrorMessage}
				/>
			);
		}
	};

	renderStateError = () => {
		if (this.state.stateErrorMessage) {
			return (
				<FormErrorMessage
					message={this.state.stateErrorMessage}
				/>
			);
		}
	};

	render() {
		return (
			<View style={componentStyles.screen}>
				<Form
					ref={(ref) => {
						if (ref) {
							this.form = ref;
						}
					}}
					onChange={this.onChangeFormValues}
					style={componentStyles.scrollView}
				>
					<Text>Trade professionals qualify for PRO Pricing, a dedicated Account Manager, Trade Specific Promotions and more.</Text>
					<Text weight="bold">Profession*</Text>
					<DropDown
						accessibilityLabel="Profession Drop Down"
						text={professions[this.state.profession]}
						onPress={this.onPressProfessionDropDown}
						buttonStyle={[componentStyles.dropDown, this.state.professionErrorMessage ? componentStyles.dropDownError : {}]}
						isRequired={true}
						isRequiredError="Company name is required."
					/>
					{this.renderProfessionError()}
					<Text weight="bold">Company Name*</Text>
					<FormInput
						name="companyName"
						accessibilityLabel="Company Name Input"
						isRequired={true}
						isRequiredError="Company name is required."
						value={this.state.companyName}
					/>
					<Text weight="bold">Company Address*</Text>
					<FormInput
						name="companyAddress"
						accessibilityLabel="Company Address Input"
						isRequired={true}
						isRequiredError="Company address is required."
						value={this.state.companyAddress}
					/>
					<Text weight="bold">ZIP Code*</Text>
					<FormInput
						name="companyZipCode"
						keyboardType="numbers-and-punctuation"
						accessibilityLabel="Company Zip Code Input"
						isRequired={true}
						value={this.state.companyZipCode}
						onBlur={this.handleZipCodeInputBlur}
						isRequiredError="Company zip code is required."
						validationFunction={this.validateZipCode}
					/>
					<FormInput
						name="companyCity"
						label="Company City*"
						accessibilityLabel="Company City Input"
						isRequired={true}
						isRequiredError="Company city is required."
						value={this.state.companyCity}
					/>
					<Text weight="bold">Company State*</Text>
					<DropDown
						accessibilityLabel="Company State Drop Down"
						text={this.getStateNameForAbbreviation(this.state.companyStateAbbr)}
						onPress={this.handleStateDropDownPressed}
						buttonStyle={[componentStyles.dropDown, this.state.stateErrorMessage ? componentStyles.dropDownError : {}]}
						isRequired={true}
						isRequiredError="Company state is required."
					/>
					{this.renderStateError()}
					<Text weight="bold">Company Country*</Text>
					<DropDown
						accessibilityLabel="Company Country Drop Down"
						text={this.state.companyCountry}
						onPress={this.handleCountryDropDownPressed}
						buttonStyle={[componentStyles.dropDown, this.state.countryErrorMessage ? componentStyles.dropDownError : {}]}
						isRequired={true}
						isRequiredError="Company country is required."
					/>
					<Text weight="bold">Phone Number*</Text>
					<FormInput
						name="companyPhoneNumber"
						keyboardType="numeric"
						accessibilityLabel="Company Phone Number Input"
						isRequired={true}
						value={this.state.companyPhoneNumber}
						isRequiredError="Company phone number is required."
						validationFunction={this.validatePhone}
					/>
				</Form>
				<KeyboardSpacer />
				<FixedBottomButton
					buttonText="Submit"
					onPress={this.onPressSubmit}
					isLoading={this.state.isLoading}
					trackAction={TrackingActions.PRO_REGISTRATION_SUBMIT}
					accessibilityLabel="Submit Button"
				/>
			</View>
		);
	}

}

ProRegistrationScreen.route = {
	navigationBar: {
		title: 'PRO Registration',
		visible: true,
		renderLeft() {
			return (
				<NavigationBarIconButton
					iconName={helpers.getIcon('close')}
					onPress={() => navigatorPopToTop('root')}
					color={helpers.isIOS() ? styles.colors.greyDark : styles.colors.white}
					trackAction={TrackingActions.PRO_REGISTRATION_CLOSE}
				/>
			);
		},
	},
};

ProRegistrationScreen.propTypes = {
	customerId: PropTypes.number,
	firstName: PropTypes.string.isRequired,
	lastName: PropTypes.string.isRequired,
	actions: PropTypes.shape({
		create: PropTypes.func,
		showAlert: PropTypes.func,
		saveProfessionalData: PropTypes.func,
		saveUserAnswers: PropTypes.func,
		saveCustomerAddress: PropTypes.func,
	}),
	navigator: PropTypes.shape({
		push: PropTypes.func,
	}),
};

ProRegistrationScreen.defaultProps = {};

export const mapStateToProps = (state) => {
	return {
		customerId: state.userReducer.user.customerId,
	};
};

export const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			getZipCodeInfo: UtilityActions.getZipCodeInfo,
			create,
			saveProfessionalData,
			saveUserAnswers,
			saveCustomerAddress,
			showAlert,
		}, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(withScreen(ProRegistrationScreen));

