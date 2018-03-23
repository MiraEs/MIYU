'use strict';

import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	View,
	StyleSheet,
} from 'react-native';
import {
	Text,
	KeyboardSpacer,
	withScreen,
	KeyboardAwareView,
} from 'BuildLibrary';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setStatusBarHidden } from '../lib/helpers';
import styles from '../lib/styles';
import Form from '../components/Form';
import FormInput from '../components/FormInput';
import EmailAddressEdit from '../components/EmailAddressEdit';
import TrackingActions from '../lib/analytics/TrackingActions';
import FixedBottomButton from '../components/FixedBottomButton';
import {
	update,
	updateCustomer,
	createGuest,
} from '../actions/UserActions';
import { AUTH_STATUS_ANONYMOUS } from '../constants/Auth';
import tracking from '../lib/analytics/tracking';

import { showAlert } from '../actions/AlertActions';


const componentStyles = StyleSheet.create({
	formContent: {
		flex: 1,
		margin: styles.measurements.gridSpace1,
	},
	message: {
		marginTop: styles.measurements.gridSpace1,
		marginBottom: styles.measurements.gridSpace3,
	},
	inputMargin: {
		marginRight: styles.measurements.gridSpace1,
	},
});

export class ContactInfoScreen extends Component {

	constructor(props) {
		super(props);
		const { email, firstName, lastName } = props.user;
		this.state = {
			email,
			firstName,
			lastName,
			isLoading: false,
			error: props.error,
		};
	}

	componentWillMount() {
		setStatusBarHidden(false, 'fade');
	}


	setScreenTrackingInformation() {
		return {
			name: 'build:app:contactinfo',
		};
	}

	handleInfoChange = ({ email = this.state.email, firstName = this.state.firstName, lastName = this.state.lastName }) => {
		if (typeof email === 'object') {
			email = email.value;
		}
		if (typeof firstName === 'object') {
			firstName = firstName.value;
		}
		if (typeof lastName === 'object') {
			lastName = lastName.value;
		}

		this.setState({
			email,
			firstName,
			lastName,
		});
	};

	submitContactInfo = () => {
		const validForm = this.infoForm.triggerValidation();

		this.setState({ isLoading: true });

		if (validForm) {
			const { email, firstName, lastName } = this.state;
			const {
				user,
				actions,
				onSaveSuccess,
			} = this.props;

			if (user.status === AUTH_STATUS_ANONYMOUS) {
				actions.createGuest({
					isGuest: true,
					email,
					firstName,
					lastName,
				})
				.then((user) => {
					tracking.trackCustomerLoggedIn(user, 'Guest');
					onSaveSuccess();
				})
				.catch(() => {
					this.props.actions.showAlert('There was an error saving your contact information', 'error');
				})
				.done(() => this.setState({ isLoading: false }));
			} else {
				actions.updateCustomer({
					email,
					firstName,
					lastName,
				})
				.then(onSaveSuccess)
				.catch(() => {
					this.props.actions.showAlert('Failed to update contact information', 'error');
				})
				.done(() => this.setState({ isLoading: false }));
			}
		} else {
			this.setState({ isLoading: false });
		}
	};

	render() {
		const { email, error, firstName, isLoading, lastName } = this.state;

		return (
			<View
				style={styles.elements.screen}
			>
				<Form
					ref={(c) => this.infoForm = c}
					onChange={this.handleInfoChange}
					scrollsToTop={true}
				>
					<View
						style={componentStyles.formContent}
						key="formContent"
					>
						<Text
							color="greyDark"
							size="small"
							style={componentStyles.message}
						>
							We need this information so we can contact you with any order updates.
						</Text>
						<Text
							color="error"
							size="small"
						>
							{error}
						</Text>
						<View
							style={styles.elements.flexRow}
							key="nameRow"
						>
							<FormInput
								autoCapitalize="words"
								autoCorrect={false}
								name="firstName"
								isRequired={true}
								isRequiredError="Required."
								label="First Name*"
								value={firstName}
								componentStyle={[styles.elements.flex, componentStyles.inputMargin]}
								returnKeyType="next"
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
								returnKeyType="next"
								accessibilityLabel="Last Name"
							/>
						</View>
						<EmailAddressEdit
							name="email"
							emailAddress={email}
							onSubmitEditing={this.submitContactInfo}
							returnKeyType="done"
							accessibilityLabel="Email"
						/>
						<KeyboardSpacer />
					</View>
				</Form>
				<KeyboardAwareView>
					<FixedBottomButton
						buttonText="Use This Contact Information"
						isLoading={isLoading}
						onPress={this.submitContactInfo}
						trackAction={TrackingActions.CONTACT_INFO_SUBMIT}
						hideOnKeyboardShow={true}
						accessibilityLabel="Use This Info Button"
					/>
				</KeyboardAwareView>
			</View>
		);
	}

}

ContactInfoScreen.route = {
	navigationBar: {
		visible: true,
		title: 'Contact Information',
	},
};

ContactInfoScreen.propTypes = {
	user: PropTypes.object,
	error: PropTypes.string,
	actions: PropTypes.object,
	onSaveSuccess: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
	return {
		error: state.userReducer.errors.checkout,
		user: state.userReducer.user,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			update,
			updateCustomer,
			createGuest,
			showAlert,
		}, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(withScreen(ContactInfoScreen));
