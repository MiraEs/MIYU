'use strict';

import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	View,
	StyleSheet,
	Alert,
} from 'react-native';
import { connect } from 'react-redux';
import {
	setStatusBarStyle,
	setStatusBarHidden,
} from '../lib/helpers';
import styles from '../lib/styles';
import EventEmitter from '../lib/eventEmitter';
import { navigatorPop } from '../actions/NavigatorActions';
import FixedBottomButton from '../components/FixedBottomButton';
import Form from '../components/Form';
import FormInput from '../components/FormInput';
import FormDropDown from '../components/FormDropDown';
import ErrorText from '../components/ErrorText';
import {
	isInteger,
	isValidEmail,
} from '../lib/Validations';
import {
	KeyboardSpacer,
	withScreen,
} from 'BuildLibrary';
import TrackingActions from '../lib/analytics/TrackingActions';
import { NavigationStyles } from '@expo/ex-navigation';
import NavigationBarTextButton from '../components/navigationBar/NavigationBarTextButton';
import { bindActionCreators } from 'redux';
import {
	createCustomerServiceRequest,
	update,
} from '../actions/UserActions';
import { trackState } from '../actions/AnalyticsActions';

const componentStyles = StyleSheet.create({
	contactForm: {
		paddingHorizontal: styles.measurements.gridSpace1,
		flex: 1,
	},
	inputStyle: {
		height: 100,
	},
	inputMargin: {
		marginRight: styles.measurements.gridSpace1,
	},
});

const EMAIL_SCREEN_SEND_BUTTON_PRESS = 'EMAIL_SCREEN_SEND_BUTTON_PRESS';

export class EmailScreen extends Component {

	constructor(props) {
		super(props);
		const { email = '', firstName = '', lastName = '' } = props.user;
		this.state = {
			customerServiceRequest: {
				email,
				firstName,
				lastName,
				name: `${firstName} ${lastName}`,
			},
			isLoading: false,
			error: props.error,
		};
	}

	componentWillMount() {
		setStatusBarStyle('default', false);
		setStatusBarHidden(false, 'fade');
	}

	componentDidMount() {
		EventEmitter.addListener(EMAIL_SCREEN_SEND_BUTTON_PRESS, this.submitCustomerServiceRequest);
	}

	componentWillUnmount() {
		EventEmitter.removeListener(EMAIL_SCREEN_SEND_BUTTON_PRESS, this.submitCustomerServiceRequest);
	}

	setScreenTrackingInformation() {
		return {
			name: 'build:app:email',
		};
	}

	onCancelPress = () => {
		this.props.navigator.pop();
	};

	getEmailSubjects = () => {
		const emailSubjects = [{
			text: 'New Order',
			value: 'New Order',
		}, {
			text: 'Build App Issue',
			value: 'Build App Issue',
		}, {
			text: 'Problem with my Order / Product',
			value: 'Problem with my Order / Product',
		}, {
			text: 'Feedback & Suggestions',
			value: 'Feedback & Suggestions',
		}, {
			text: 'Other',
			value: 'Other',
		}];

		return emailSubjects;
	};

	handleChange = (formFields, valid) => {
		const initialValue = {
			...this.state.customerServiceRequest,
		};
		const customerServiceRequest = Object.keys(formFields).reduce((prev, key) => {
			prev[key] = formFields[key].value;
			return prev;
		}, initialValue);

		const { firstName = '', lastName = '' } = customerServiceRequest;
		customerServiceRequest.name = `${firstName} ${lastName}`;

		this.setState({
			customerServiceRequest,
			valid,
		});
	};

	validateEmail = (email) => {
		return isValidEmail(email) || 'Please enter a valid email address.';
	};

	validateOrderNumber = (orderNumber = '') => {
		const value = orderNumber.toString().trim();
		const MAX_VALUE = Math.pow(2, 31) - 1; // this is the max value allowed by the db

		if (!value) {
			return true;
		}
		if (!isInteger(value)) {
			return 'The order number will contain numbers only.';
		}
		if (Number.parseInt(value) > MAX_VALUE) {
			return 'Invalid order number.';
		}
		return true;
	};

	triggerValidation = () => {
		return this._customerServiceRequest.triggerValidation();
	};

	submitCustomerServiceRequest = () => {
		const isValid = this.triggerValidation();
		if (isValid) {
			const {
				actions: {
					createCustomerServiceRequest,
					update,
				},
				isLoggedIn,
				user,
			} = this.props;
			const { customerServiceRequest } = this.state;
			const { email, firstName, lastName } = customerServiceRequest;

			if (user && user.rep && user.rep.repUserID) {
				customerServiceRequest.userId = user.rep.repUserID;
			}
			this.setState({ isLoading: true });
			createCustomerServiceRequest(customerServiceRequest)
				.then(() => {
					Alert.alert('Email Sent', 'You\'ll be hearing from us soon.', [{
						text: 'OK',
						onPress: this.onCancelPress,
					}]);
				})
				.done(() => this.setState({ isLoading: false }));

			if (!isLoggedIn) {
				update({
					email,
					firstName,
					lastName,
				});
			}
		}
	};

	render() {
		const { isLoading, customerServiceRequest, error } = this.state;
		const { subject, comments, email, firstName, lastName, orderNumber } = customerServiceRequest;

		return (
			<View style={styles.elements.screen}>
				<View style={componentStyles.contactForm}>
					<ErrorText text={error} />
					<Form
						ref={(c) => this._customerServiceRequest = c}
						onChange={this.handleChange}
						scrollsToTop={true}
					>
						<FormDropDown
							name="subject"
							isRequired={true}
							isRequiredError="Email Subject is required."
							label="Email Subject*"
							value={subject}
							modalDescription="Select Email Subject"
							options={this.getEmailSubjects()}
							accessibilityLabel="Email Subject"
						/>
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
							autoCapitalize="none"
							autoCorrect={false}
							name="email"
							isRequired={true}
							isRequiredError="Email Address is required."
							keyboardType="email-address"
							label="Your Email Address*"
							validationFunction={this.validateEmail}
							value={email}
							accessibilityLabel="Sender Email"
						/>
						<FormInput
							autoCorrect={false}
							name="orderNumber"
							isRequired={false}
							keyboardType="numeric"
							label="Order Number"
							value={orderNumber}
							accessibilityLabel="Order Number"
							validationFunction={this.validateOrderNumber}
							validateOnChange={true}
						/>
						<FormInput
							autoCapitalize="none"
							autoCorrect={false}
							name="comments"
							isRequired={true}
							multiline={true}
							isRequiredError="Message is required."
							inputStyle={componentStyles.inputStyle}
							label="Message*"
							value={comments}
							accessibilityLabel="Message"
						/>
					</Form>
				</View>
				<FixedBottomButton
					buttonText="Send Email"
					isLoading={isLoading}
					onPress={this.submitCustomerServiceRequest}
					trackAction={TrackingActions.EMAIL_US_SUBMIT}
					pinToKeyboard={false}
					accessibilityLabel="Send Email"
					hideOnKeyboardShow={true}
				/>
				<KeyboardSpacer />
			</View>
		);
	}

}

EmailScreen.route = {
	styles: {
		...NavigationStyles.SlideVertical,
		gestures: null,
	},
	navigationBar: {
		visible: true,
		title: 'Email Us',
		renderLeft() {
			return <NavigationBarTextButton onPress={() => navigatorPop('root')}>Cancel</NavigationBarTextButton>;
		},
		renderRight() {
			return <NavigationBarTextButton onPress={() => EventEmitter.emit(EMAIL_SCREEN_SEND_BUTTON_PRESS)}>Send</NavigationBarTextButton>;
		},
	},
};

EmailScreen.propTypes = {
	customerServiceRequest: PropTypes.object,
	valid: PropTypes.bool,
	error: PropTypes.string,
	actions: PropTypes.object,
	user: PropTypes.object,
	isLoggedIn: PropTypes.bool,
	navigator: PropTypes.shape({
		pop: PropTypes.func,
	}),
};

EmailScreen.defaultProps = {
	user: {},
	isLoggedIn: false,
	valid: false,
};

const mapStateToProps = (state) => {
	return {
		user: state.userReducer.user,
		isLoggedIn: state.userReducer.isLoggedIn,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			createCustomerServiceRequest,
			update,
			trackState,
		}, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(withScreen(EmailScreen));
