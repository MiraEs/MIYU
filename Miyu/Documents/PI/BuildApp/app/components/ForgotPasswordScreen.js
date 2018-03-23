'use strict';

import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	View,
	Text,
	TextInput,
	Alert,
	StyleSheet,
	Dimensions,
} from 'react-native';
import { withScreen } from 'BuildLibrary';
import Button from './button';
import customerService from '../services/customerService';
import NavigationBar from './NavigationBar';
import {
	setStatusBarStyle,
} from '../lib/helpers';
import styles from '../lib/styles';
const { width } = Dimensions.get('window');
import TrackingActions from '../lib/analytics/TrackingActions';


const componentStyles = StyleSheet.create({
	paswordScreen: {
		flex: 1,
		alignItems: 'center',
		backgroundColor: '#e1e1e1',
	},
	passwordContent: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	primaryButton: {
		height: 40,
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: styles.measurements.gridSpace1,
		width: width - 40,
	},
	heading: {
		textAlign: 'center',
		color: styles.colors.secondary,
		fontSize: styles.colors.regular,
		marginBottom: styles.measurements.gridSpace2,
		width: width - 40,
		fontFamily: styles.fonts.mainRegular,
	},
	container: {
		flex: 1,
	},
});

class ForgotPasswordScreen extends Component {

	constructor(props) {
		super(props);
		this.state = {
			email: '',
			isLoading: false,
		};

		this.emailUpdated = this.emailUpdated.bind(this);
		this.closeModal = this.closeModal.bind(this);
		this.resetPassword = this.resetPassword.bind(this);

	}

	setScreenTrackingInformation() {
		return {
			name: 'build:app:forgotpassword',
		};
	}

	emailUpdated(email) {
		this.setState({
			email,
		});
	}

	closeModal() {
		const { navigator, shouldResetStatusBar } = this.props;
		if (shouldResetStatusBar) {
			setStatusBarStyle('default', true);
		}
		navigator.pop();
	}

	resetPassword() {
		this.setState({
			isLoading: true,
		});
		// we access the customer service directly here since sending an email
		// to reset the users password isn't really needed/useful in the user store
		customerService.resetPassword(this.state.email).then((response) => {
			if (response === true) {
				Alert.alert('Email Sent', 'An email with instructions to reset your password has been sent.', [{
					text: 'OK',
					onPress: this.closeModal,
				}]);
			} else {
				Alert.alert('An error occurred', 'Make sure the email address entered is correct and your phone has an active connection.', [{
					text: 'OK',
				}]);
			}
			this.setState({
				isLoading: false,
			});
		});
	}

	render() {
		return (
			<View style={componentStyles.container}>
				<NavigationBar
					leftNavButton={{
						text: 'Close',
						onPress: this.closeModal,
					}}
					title={{
						text: 'Forgot Password',
					}}
				/>
				<View style={componentStyles.paswordScreen}>
					<View style={componentStyles.passwordContent}>
						<Text style={componentStyles.heading}>Enter your email address and we will send you an email with a link to reset your password.</Text>
						<TextInput
							autoCapitalize="none"
							autoCorrect={false}
							keyboardType="email-address"
							onChangeText={this.emailUpdated}
							placeholder="Email Address"
							placeholderTextColor={styles.colors.grey}
							style={[styles.elements.formInput, {
								width: width - 40,
							}]}
							underlineColorAndroid="transparent"
						/>
						<Button
							isLoading={this.state.isLoading}
							onPress={this.resetPassword}
							style={componentStyles.primaryButton}
							text="Reset Password"
							trackAction={TrackingActions.RESET_PASSWORD}
							accessibilityLabel="Reset Password Button"
						/>
					</View>
				</View>
			</View>
		);
	}

}

ForgotPasswordScreen.defaultProps = {
	shouldResetStatusBar: true,
};

ForgotPasswordScreen.propTypes = {
	navigator: PropTypes.object.isRequired,
	shouldResetStatusBar: PropTypes.bool.isRequired,
};

module.exports = (withScreen(ForgotPasswordScreen));
