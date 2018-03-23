'use strict';

import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { Switch } from 'build-library';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { create } from '../../actions/UserActions';
import styles from '../../lib/styles';
import Form from '../../components/Form';
import FormInput from '../../components/FormInput';
import {
	isValidEmail,
	isValidPassword,
} from '../../lib/Validations';
import { noop } from '../../lib/helpers';
import { withNavigation } from '@expo/ex-navigation';
import TrackingActions from '../../lib/analytics/TrackingActions';
import { DID_LOGIN_WITH_SOCIAL } from '../../constants/SocialConstants';
import store from 'react-native-simple-store';
import { trackAction } from '../../actions/AnalyticsActions';
import tracking from '../../lib/analytics/tracking';

import {
	Button,
	Text,
} from 'BuildLibrary';

const componentStyles = {
	inputMargin: {
		marginRight: styles.measurements.gridSpace1,
	},
	isProContainer: {
		paddingTop: styles.measurements.gridSpace1,
		paddingBottom: styles.measurements.gridSpace2,
	},
};

export class SignUpForm extends Component {

	constructor(props) {
		super(props);

		const { email = '', firstName = '', lastName = '' } = props.user;
		this.state = {
			createAccountForm: {
				email,
				firstName,
				lastName,
			},
			isLoading: false,
		};
	}

	handleChange = (formFields, valid) => {
		const createAccountForm = Object.keys(formFields).reduce((prev, key) => {
			prev[key] = formFields[key].value;
			return prev;
		}, {
			...this.state.createAccountForm,
		});

		this.setState({
			createAccountForm,
			valid,
		});
	};

	onValueChangeIsPro = (isPro) => {
		if (typeof this.props.onChangeIsPro === 'function') {
			this.props.onChangeIsPro(isPro);
		}
	};

	nextFormField = (fieldName) => {
		this.signUpForm._form[fieldName].focus();
	};

	triggerValidation = () => {
		return this.signUpForm.triggerValidation();
	};

	validateEmail = (email) => {
		return isValidEmail(email) || 'Please enter a valid email address.';
	};

	validatePassword = (password) => {
		return isValidPassword(password) || 'Password must be at least 6 characters';
	};

	getUser = () => {
		const { createAccountForm } = this.state;
		return {
			...createAccountForm,
			passwordConfirm: createAccountForm.password,
			isGuest: false,
			isPro: this.props.isPro,
		};
	};

	createAccountSuccess = () => {
		const { actions: { trackAction }, isPro, cart } = this.props;

		tracking.trackAccountCreated();
		store.get(DID_LOGIN_WITH_SOCIAL).then((isSocialLogin) => {
			this.props.actions.trackAction(TrackingActions.CUSTOMER_SIGNUP_COMPLETE, {
				user: this.props.user,
				methodName: isSocialLogin ? 'Facebook' : 'Email',
				cart,
			});
		});

		if (isPro) {
			trackAction(TrackingActions.PRO_REGISTRATION_START);
			this.props.navigation.getNavigator('root').push('proRegistration', {
				...this.getUser(),
			});
		} else {
			if (!this.props.noNotificationPrompt) {
				this.props.navigator.pop();
			}
			this.props.loginSuccess();
		}
	};

	createAccountFail = (error) => {
		if (error && error.message) {
			error = error.message;
		}
		this.setState({ error }, this.props.loginFail);
	};


	signUp = () => {
		const isValid = this.triggerValidation();
		const {
			actions: {
				create,
			},
			isCheckout,
			noNotificationPrompt,
		} = this.props;

		if (isValid) {
			const user = this.getUser();

			this.setState({ isLoading: true });

			create(user, !isCheckout && !noNotificationPrompt)
			.then(this.createAccountSuccess)
			.catch(this.createAccountFail)
			.done(() => this.setState({ isLoading: false }));
		}
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
		const { createAccountForm } = this.state;
		const { email, firstName, lastName, password } = createAccountForm;

		return (
			<View>
				{this.renderError()}
				<Form
					ref={(ref) => {
						if (ref) {
							this.signUpForm = ref;
						}
					}}
					onChange={this.handleChange}
				>
					<View style={styles.elements.flexRow}>
						<FormInput
							name="firstName"
							autoCapitalize="words"
							autoCorrect={false}
							isRequired={true}
							isRequiredError="First Name is required."
							label="First Name*"
							value={firstName}
							blurOnSubmit={false}
							componentStyle={[styles.elements.flex1, componentStyles.inputMargin]}
							accessibilityLabel="First Name"
						/>
						<FormInput
							name="lastName"
							autoCapitalize="words"
							autoCorrect={false}
							isRequired={true}
							isRequiredError="Last Name is required."
							label="Last Name*"
							value={lastName}
							blurOnSubmit={false}
							componentStyle={styles.elements.flex1}
							accessibilityLabel="Last Name"
						/>
					</View>
					<FormInput
						name="email"
						autoCapitalize="none"
						autoCorrect={false}
						isRequired={true}
						isRequiredError="Email Address is required."
						keyboardType="email-address"
						label="Email Address*"
						value={email}
						blurOnSubmit={false}
						accessibilityLabel="Email"
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
						returnKeyType="done"
						onSubmitEditing={this.signUp}
						accessibilityLabel="Password"
					/>
					{
						this.props.showEnrollAsPro &&
						<View style={[styles.elements.flexRow, componentStyles.isProContainer]}>
							<View style={styles.elements.flex1}>
								<Text weight="bold">Enroll as a Trade Professional</Text>
								<Text size="small">Verified PROs receive exclusive benefits.</Text>
							</View>
							<Switch
								onValueChange={this.onValueChangeIsPro}
								value={this.props.isPro}
							/>
						</View>
					}
					<Button
						isLoading={this.state.isLoading}
						loadingText="Creating Account..."
						color="primary"
						onPress={this.signUp}
						text="Create Account"
						accessibilityLabel="Create Account Button"
						trackAction={TrackingActions.LOGIN_MODAL_CREATE_ACCOUNT}
					/>
				</Form>
			</View>
		);
	}
}

SignUpForm.propTypes = {
	showEnrollAsPro: PropTypes.bool,
	actions: PropTypes.object,
	error: PropTypes.string,
	user: PropTypes.object,
	linkAccounts: PropTypes.bool,
	loginSuccess: PropTypes.func,
	loginFail: PropTypes.func,
	isCheckout: PropTypes.bool.isRequired,
	noNotificationPrompt: PropTypes.bool,
	navigator: PropTypes.shape({
		pop: PropTypes.func,
	}),
	navigation: PropTypes.shape({
		getNavigator: PropTypes.func,
	}),
	onChangeIsPro: PropTypes.func,
	isPro: PropTypes.bool,
	cart: PropTypes.object,
};

SignUpForm.defaultProps = {
	linkAccounts: false,
	loginFail: noop,
	loginSuccess: noop,
};

const mapStateToProps = (state) => {
	return {
		error: state.userReducer.errors.login,
		user: state.userReducer.user,
		cart: state.cartReducer.cart,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			create,
			trackAction,
		}, dispatch),
	};
};

export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(SignUpForm));
