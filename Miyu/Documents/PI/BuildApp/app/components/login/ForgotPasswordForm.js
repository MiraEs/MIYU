'use strict';

import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	Alert,
	View,
} from 'react-native';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
	resetPassword,
	update,
} from '../../actions/UserActions';

import Form from '../../components/Form';
import FormInput from '../../components/FormInput';
import ErrorText from '../../components/ErrorText';
import { isValidEmail } from '../../lib/Validations';
import TrackingActions from '../../lib/analytics/TrackingActions';
import { Button } from 'BuildLibrary';

export class ForgotPasswordForm extends Component {

	constructor(props) {
		super(props);
		this.state = {
			isLoading: false,
			resetPasswordForm: {
				emailAddress: props.user.email || '',
			},
		};
	}

	handleChange = (formFields, valid) => {
		const resetPasswordForm = Object.keys(formFields).reduce((prev, key) => {
			prev[key] = formFields[key].value;
			return prev;
		}, {
			...this.state.resetPasswordForm,
		});

		this.setState({
			resetPasswordForm,
			valid,
		});
	};


	triggerValidation = () => {
		return this._resetPasswordForm.triggerValidation();
	};

	resetPassword = () => {
		const isValid = this.triggerValidation();
		const { resetPasswordForm: { emailAddress: email } } = this.state;
		if (isValid) {
			this.setState({ isLoading: true });
			this.props.actions.update({ email });

			this.props.actions.resetPassword(
				email
			).then(this.resetPasswordSuccess).catch(this.resetPasswordError).done();
		}
	};

	resetPasswordSuccess = () => {
		this.setState({ isLoading: false });
		Alert.alert(
			'Email Sent',
			'Check your inbox. Password reset instructions are on the way.',
			[{
				text: 'OK',
				onPress: this.props.navLogin,
			}]
		);
	};

	resetPasswordError = () => {
		this.setState({ isLoading: false });
		Alert.alert(
			'An error occurred',
			'Make sure the email address entered is correct and your phone has an active connection.',
			[{
				text: 'OK',
			}]
		);
	};

	validateEmail = (email) => {
		return isValidEmail(email) || 'Please enter a valid email address.';
	};

	render() {
		const { resetPasswordForm: { emailAddress }, error } = this.state;

		return (
			<View>
				<ErrorText text={error}/>
				<Form
					ref={(c) => this._resetPasswordForm = c}
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
						returnKeyType="send"
						blurOnSubmit={false}
						onSubmitEditing={this.resetPassword}
						scrollToOnFocus={false}
						accessibilityLabel="Email"
					/>
					<Button
						key="submitButton"
						isLoading={this.state.isLoading}
						loadingText="Reseting Password..."
						color="primary"
						onPress={this.resetPassword}
						text="Reset Password"
						trackAction={TrackingActions.LOGIN_MODAL_RESET_PASSWORD}
						accessibilityLabel="Reset Password Button"
					/>
				</Form>
			</View>
		);
	}
}

ForgotPasswordForm.propTypes = {
	actions: PropTypes.object,
	error: PropTypes.string,
	navLogin: PropTypes.func.isRequired,
	user: PropTypes.object,
};

const mapStateToProps = (state) => {
	return {
		error: state.userReducer.errors.login,
		user: state.userReducer.user,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			resetPassword,
			update,
		}, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPasswordForm);
