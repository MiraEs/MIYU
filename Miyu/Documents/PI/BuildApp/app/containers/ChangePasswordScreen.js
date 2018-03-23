import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	Alert,
	StyleSheet,
	View,
} from 'react-native';
import FormInput from '../components/FormInput';
import Form from '../components/Form';
import styles from '../lib/styles';
import {
	isValidPassword,
	isValidPasswordConf,
} from '../lib/Validations';
import {
	receiveUpdateUserFail,
	updatePassword,
} from '../actions/UserActions';
import {
	Button,
	withScreen,
	Text,
} from 'BuildLibrary';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ACCOUNT_DETAILS_CHANGE_PASSWORD } from '../lib/analytics/TrackingActions';
import helpers from '../lib/helpers';
import { trackState } from '../actions/AnalyticsActions';

const componentStyles = StyleSheet.create({
	container: {
		flex: 1,
		padding: styles.measurements.gridSpace1,
	},
	buttonWrapper: {
		flexDirection: 'row',
	},
});

export class ChangePasswordScreen extends Component {
	constructor(props) {
		super(props);
		this.state={
			newPassword: '',
			password: '',
			passwordConfirm: '',
		};
	}

	componentDidMount() {
		// clear the error message
		this.props.actions.receiveUpdateUserFail({ message: '' });
	}

	setScreenTrackingInformation() {
		return {
			name: 'build:app:changepassword',
		};
	}

	handleSubmit = () => {
		if (this.pass.triggerValidation() && this.passConf.triggerValidation()) {
			this.props.actions.updatePassword(this.state)
				.then(() => {
					Alert.alert('Password Changed', 'Your password has been successfully changed.', [{
						text: 'OK',
						onPress: () => this.props.navigator.pop(),
					}]);
				})
				.catch(helpers.noop)
				.done();
		}
	};

	validateConfirm = (validation) => {
		return isValidPasswordConf(this.state.newPassword, validation) || 'Password must match.';
	};

	handleFormChange = ({ password = {}, newPassword = {}, passwordConfirm = {} }) => {
		this.setState({
			password: password.value || '',
			newPassword: newPassword.value || '',
			passwordConfirm: passwordConfirm.value || '',
		});
	};

	renderError = () => {
		const { error } = this.props;

		if (error) {
			return (
				<Text
					color="error"
					size="small"
				>
					{error}
				</Text>
			);
		}
	};

	render() {
		return (
			<View>
				<Form onChange={this.handleFormChange}>
					<View style={componentStyles.container}>
						{this.renderError()}
						<FormInput
							autoCapitalize="none"
							autoCorrect={false}
							name="password"
							isRequired={true}
							isRequiredError="Password is required."
							maxLength={50}
							label="Current Password"
							value={this.state.password}
							ref={(ref) => this.pass = ref}
							secureTextEntry={true}
							accessibilityLabel="Current Password Field"
						/>
						<FormInput
							autoCapitalize="none"
							autoCorrect={false}
							name="newPassword"
							isRequired={true}
							isRequiredError="Password is required."
							maxLength={50}
							validationFunction={(pass) => isValidPassword(pass) || 'Password must be at least 6 characters.'}
							label="New Password"
							value={this.state.newPassword}
							ref={(ref) => this.newPass = ref}
							secureTextEntry={true}
							accessibilityLabel="New Password Field"
						/>
						<FormInput
							autoCapitalize="none"
							autoCorrect={false}
							name="passwordConfirm"
							isRequired={true}
							isRequiredError="Password Confirmation is required."
							maxLength={50}
							label="Verify New Password"
							value={this.state.passwordConfirm}
							returnKeyType="done"
							validationFunction={this.validateConfirm}
							onSubmitEditing={this.handleSubmit}
							ref={(ref) => this.passConf = ref}
							secureTextEntry={true}
							accessibilityLabel="Verify New Password Field"
						/>
					</View>
				</Form>
				<View style={componentStyles.buttonWrapper}>
					<Button
						text="Change Password"
						accessibilityLabel="Change Password Button"
						onPress={this.handleSubmit}
						borders={false}
						style={styles.elements.flex1}
						trackAction={ACCOUNT_DETAILS_CHANGE_PASSWORD}
					/>
				</View>
			</View>
		);
	}
}

ChangePasswordScreen.route = {
	navigationBar: {
		title: 'Change Password',
	},
};
ChangePasswordScreen.propTypes = {
	actions: PropTypes.object.isRequired,
	error: PropTypes.string,
	navigator: PropTypes.shape({
		pop: PropTypes.func,
	}),
};

const mapStateToProps = (state) => {
	return {
		error: state.userReducer.errors.update,
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			receiveUpdateUserFail,
			updatePassword,
			trackState,
		}, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(withScreen(ChangePasswordScreen));
