import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	View,
	StyleSheet,
} from 'react-native';
import {
	Button,
	withScreen,
} from 'BuildLibrary';
import FormInput from '../components/FormInput';
import Form from '../components/Form';
import styles from '../lib/styles';
import helpers from '../lib/helpers';
import { isValidEmail } from '../lib/Validations';
import { updateCustomer } from '../actions/UserActions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import trackingActions from '../lib/analytics/TrackingActions';
import { trackState } from '../actions/AnalyticsActions';
import {showAlert } from '../actions/AlertActions';

const componentStyles = StyleSheet.create({
	container: {
		flex: 1,
		padding: styles.measurements.gridSpace1,
	},
	buttonWrapper: {
		flexDirection: 'row',
	},
	lastName: {
		flex: 1,
		paddingLeft: styles.measurements.gridSpace1,
	},
});

export class EditAccountDetailsScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			firstName: props.firstName,
			lastName: props.lastName,
			email: props.email,
			isLoading: false,
			error: '',
		};
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.error !== this.props.error) {
			this.setState({ error: nextProps.error });
		}
	}

	setScreenTrackingInformation() {
		return {
			name: 'build:app:editaccountdetails',
		};
	}

	handleSubmit = () => {
		if (this.firstName.triggerValidation() && this.lastName.triggerValidation() && this.email.triggerValidation()) {
			this.setState({ isLoading: true });
			this.props.actions.updateCustomer(this.state)
				.then(() => {
					this.props.actions.showAlert('Your account was successfully updated.');
					this.props.navigator.pop();
				})
				.catch(helpers.noop)
				.done(() => this.setState({ isLoading: false }));
		}
	};

	handleChange = ({ firstName, lastName, email }) => {
		const state = {};
		if (firstName) {
			state.firstName = firstName.value;
		}
		if (lastName) {
			state.lastName = lastName.value;
		}
		if (email) {
			state.email = email.value;
		}
		this.setState(state);
	};

	validateEmail = (email) => {
		return isValidEmail(email) || 'Invalid email.';
	};

	render() {
		const {
			firstName,
			lastName,
			email,
			isLoading,
		} = this.state;
		return (
			<View>
				<Form onChange={this.handleChange}>
					<View style={componentStyles.container}>
						<View style={styles.elements.centeredFlexRow}>
							<FormInput
								autoCapitalize="none"
								autoCorrect={false}
								name="firstName"
								isRequired={true}
								isRequiredError="First name is required."
								maxLength={50}
								label="First Name"
								value={firstName}
								ref={(ref) => this.firstName = ref}
								componentStyle={styles.elements.flex1}
								accessibilityLabel="First Name"
							/>
							<FormInput
								autoCapitalize="none"
								autoCorrect={false}
								name="lastName"
								isRequired={true}
								isRequiredError="Last name is required."
								maxLength={50}
								label="Last Name"
								value={lastName}
								ref={(ref) => this.lastName = ref}
								componentStyle={componentStyles.lastName}
								accessibilityLabel="Last Name"
							/>
						</View>
						<FormInput
							autoCapitalize="none"
							autoCorrect={false}
							name="email"
							isRequired={true}
							isRequiredError="Email is required."
							returnKeyType="done"
							maxLength={50}
							label="Email"
							value={email}
							validationFunction={this.validateEmail}
							onSubmitEditing={this.handleSubmit}
							ref={(ref) => this.email = ref}
							accessibilityLabel="Email"
							error={this.state.error}
							valid={!this.state.error}
						/>
					</View>
				</Form>
				<View style={componentStyles.buttonWrapper}>
					<Button
						text="Update Account Details"
						accessibilityLabel="Update Account Details Button"
						isLoading={isLoading}
						onPress={this.handleSubmit}
						borders={false}
						style={styles.elements.flex1}
						trackAction={trackingActions.UPDATE_ACCOUNT_DETAILS}
					/>
				</View>
			</View>
		);
	}
}

EditAccountDetailsScreen.route = {
	navigationBar: {
		title: 'Edit Account Details',
	},
};

EditAccountDetailsScreen.propTypes = {
	actions: PropTypes.object.isRequired,
	error: PropTypes.string,
	firstName: PropTypes.string.isRequired,
	lastName: PropTypes.string.isRequired,
	email: PropTypes.string.isRequired,
	navigator: PropTypes.shape({
		pop: PropTypes.func,
	}),
};

const mapStateToProps = (state) => {
	const user = state.userReducer.user;
	return {
		firstName: user.firstName,
		lastName: user.lastName,
		email: user.email,
		error: state.userReducer.errors.update,
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			updateCustomer,
			showAlert,
			trackState,
		}, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(withScreen(EditAccountDetailsScreen));
