'use strict';

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
	getCustomer,
	loginWithCreds,
} from '../../actions/UserActions';
import { linkExistingCustomer } from '../../actions/SocialLoginActions';
import Form from '../../components/Form';
import FormInput from '../../components/FormInput';
import { isValidEmail } from '../../lib/Validations';
import TrackingActions from '../../lib/analytics/TrackingActions';
import tracking from '../../lib/analytics/tracking';
import helpers from '../../lib/helpers';
import styles from '../../lib/styles';
import { DID_LOGIN_WITH_SOCIAL } from '../../constants/SocialConstants';
import store from 'react-native-simple-store';

import {
	Button,
	LinkButton,
	Text,
} from 'BuildLibrary';


const componentStyles = StyleSheet.create({
	forgotPassword: {
		marginVertical: styles.measurements.gridSpace2,
	},
});


export class LoginForm extends Component {

	constructor(props) {
		super(props);
		this.state = {
			loginForm: {
				emailAddress: props.user.email || '',
			},
		};
	}

	handleChange = (formFields, valid) => {
		const loginForm = Object.keys(formFields).reduce((prev, key) => {
			prev[key] = formFields[key].value;
			return prev;
		}, {
			...this.state.loginForm,
		});

		this.setState({
			loginForm,
			valid,
		});
	};

	login = () => {
		const isValid = this.triggerValidation();
		const { emailAddress, password } = this.state.loginForm;
		const {
			actions,
			linkAccounts,
			user: {
				socialUserAccessToken,
				socialUserId,
			},
		} = this.props;

		if (isValid) {
			if (linkAccounts) {
				const request = {
					username: emailAddress.trim(),
					socialLoginType: 'facebook',
					password,
					socialUserAccessToken,
					socialUserId,
				};

				actions.linkExistingCustomer(request)
					.then(this.loginSuccess)
					.catch(this.loginFail)
					.done();
			} else {
				this.setState({ error: '' });
				actions.loginWithCreds(emailAddress.trim(), password)
					.then(this.loginSuccess)
					.catch(this.loginFail)
					.done();
			}
		}
	};

	loginFail = (loginError) => {
		const error = (loginError && loginError.message) || 'Invalid Email Address or Password!';
		this.setState({ error }, this.props.loginFail);
	};

	loginSuccess = () => {
		const {
			actions,
			loginSuccess,
			user,
		} = this.props;
		store.get(DID_LOGIN_WITH_SOCIAL).then((isSocialLogin) => {
			tracking.trackCustomerLoggedIn(user, isSocialLogin ? 'Facebook' : 'Email');
		});
		actions.getCustomer().catch(helpers.noop).done();
		tracking.trackFirstLogin();
		loginSuccess();
	};

	triggerValidation = () => {
		return this._loginForm.triggerValidation();
	};

	validateEmail = (email) => {
		return isValidEmail(email) || 'Please enter a valid email address.';
	};

	renderError = () => {
		const { error } = this.state;

		if (!error) {
			return null;
		}

		return (
			<Text
				color="error"
				size="small"
			>
				{error}
			</Text>
		);
	};

	render() {
		const {
			loginForm: { emailAddress, password },
		} = this.state;
		const { isLoggingIn, isLoggingInSocial, linkAccounts } = this.props;
		const isLoading = linkAccounts ? isLoggingInSocial : isLoggingIn;

		return (
			<View>
				{this.renderError()}
				<Form
					ref={(c) => this._loginForm = c}
					onChange={this.handleChange}
				>
					<FormInput
						name="emailAddress"
						autoCapitalize="none"
						autoCorrect={false}
						isRequired={true}
						isRequiredError="Email Address is required."
						keyboardType="email-address"
						label="Email Address*"
						validationFunction={this.validateEmail}
						value={emailAddress}
						blurOnSubmit={false}
						scrollToOnFocus={false}
						accessibilityLabel="Email Address"
					/>
					<FormInput
						autoCapitalize="none"
						autoCorrect={false}
						name="password"
						isRequired={true}
						isRequiredError="Password is required."
						label="Password*"
						value={password}
						secureTextEntry={true}
						returnKeyType="go"
						onSubmitEditing={this.login}
						scrollToOnFocus={false}
						accessibilityLabel="Password"
					/>
					<Button
						key="loginModalLoginButton"
						isLoading={isLoading}
						color="primary"
						onPress={this.login}
						text="Login"
						trackAction={TrackingActions.LOGIN_MODAL_LOGIN}
						accessibilityLabel="Login Button"
					/>
					<LinkButton
						accessibilityLabel="Forgot Password Button"
						onPress={this.props.navForgotPassword}
						style={componentStyles.forgotPassword}
					>
						Forgot Password
					</LinkButton>
				</Form>
			</View>
		);
	}
}

LoginForm.propTypes = {
	linkAccounts: PropTypes.bool,
	loginFail: PropTypes.func,
	loginSuccess: PropTypes.func,
	navForgotPassword: PropTypes.func.isRequired,
	actions: PropTypes.object,
	isLoggingIn: PropTypes.bool,
	isLoggingInSocial: PropTypes.bool,
	error: PropTypes.string,
	user: PropTypes.object,
};

LoginForm.defaultProps = {
	linkAccounts: false,
	loginFail: helpers.noop,
	loginSuccess: helpers.noop,
};

export const mapStateToProps = (state) => {
	return {
		isLoggingIn: state.userReducer.isLoggingIn,
		isLoggingInSocial: state.userReducer.isLoggingInSocial,
		user: state.userReducer.user,
	};
};

export const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			getCustomer,
			linkExistingCustomer,
			loginWithCreds,
		}, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);
