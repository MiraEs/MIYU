'use strict';
import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	StyleSheet,
	View,
} from 'react-native';
import {
	KeyboardSpacer,
	Text,
} from 'BuildLibrary';
import FixedBottomButton from '../FixedBottomButton';
import trackingActions from '../../lib/analytics/TrackingActions';
import styles from '../../lib/styles';
import Form from '../Form';
import FormInput from '../FormInput';
import { isValidEmail } from '../../lib/Validations';


const componentStyles = StyleSheet.create({
	content: {
		flex: 1,
		justifyContent: 'space-between',
		backgroundColor: styles.colors.white,
		paddingHorizontal: styles.measurements.gridSpace1,
		paddingVertical: styles.measurements.gridSpace2,
	},
	spacer: {
		height: styles.measurements.gridSpace1,
	},
});

class EmailCartModal extends Component {

	constructor(props) {
		super(props);
		this.state = {
			fromName: props.name,
			fromEmail: props.email,
			emails: null,
			subject: null,
			message: '',
			valid: false,
		};
	}

	onEmail = () => {
		const { emails, fromName, fromEmail, subject, message } = this.state;
		if (this.emailForm.triggerValidation()) {
			this.props.onEmail({
				emails: emails.split(' '),
				fromName,
				fromEmail,
				subject,
				message,
			});
		}
	};

	onChange = (emailForm) => {
		const formState = {};

		for (const key in emailForm) {
			formState[key] = emailForm[key].value;
		}

		this.setState(formState);
	};

	validateEmail = (email) => {
		return isValidEmail(email) || 'Please enter a valid email address.';
	};

	onValidateEmails = (value) => {
		const emails = value ? value.split(' ') : [];

		if (emails.length < 1) {
			return false;
		}

		return emails.map((email) => isValidEmail(email.trim())).indexOf(false) < 0;
	};

	render() {

		return (
			<View style={componentStyles.content}>
				<Form
					ref={(ref) => this.emailForm = ref}
					onChange={this.onChange}
				>
					<FormInput
						name="fromName"
						autoCorrect={false}
						isRequired={true}
						isRequiredError="Your Name is required."
						label="Your Name*"
						value={this.state.fromName}
						accessibilityLabel="Your Name"
					/>
					<FormInput
						name="fromEmail"
						autoCorrect={false}
						autoCapitalize="none"
						isRequired={true}
						isRequiredError="Your Email Address is required."
						keyboardType="email-address"
						validationFunction={this.validateEmail}
						label="Your Email*"
						value={this.state.fromEmail}
						scrollToOnFocus={false}
						accessibilityLabel="Your Email"
					/>
					<FormInput
						name="emails"
						autoCorrect={false}
						autoCapitalize="none"
						isRequired={true}
						isRequiredError="Who are you emailing the cart to?"
						label="Email to Addresses*"
						help="Separate emails with spaces"
						keyboardType="email-address"
						validationFunction={this.onValidateEmails}
						value={this.state.emails}
						accessibilityLabel="Email Addresses"
					/>
					<FormInput
						name="subject"
						isRequired={true}
						isRequiredError="Email Subject is required."
						label="Email Subject*"
						value={this.state.subject}
						accessibilityLabel="Email Subject"
					/>
					<FormInput
						name="message"
						clearButtonMode="always"
						label="Message"
						lines={2}
						multiline={true}
						onChangeText={(message) => this.setState({ message })}
						onSubmitEditing={this.onSave}
						onEndEditing={this.onSave}
						value={this.state.message}
						accessibilityLabel="Message"
					/>
					<View style={componentStyles.spacer}/>
					<Text size="small">*=Required</Text>
				</Form>
				<KeyboardSpacer/>
				<FixedBottomButton
					buttonText="Send Email"
					onPress={this.onEmail}
					accessibilityLabel="Email Cart Button"
					trackAction={trackingActions.EMAIL_CART}
				/>
			</View>
		);
	}
}

EmailCartModal.propTypes = {
	onEmail: PropTypes.func.isRequired,
	email: PropTypes.string,
	name: PropTypes.string,
};

export default EmailCartModal;
