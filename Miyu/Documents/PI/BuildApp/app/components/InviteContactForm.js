import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	StyleSheet,
	View,
} from 'react-native';
import styles from '../lib/styles';
import Form from '../components/Form';
import FormInput from '../components/FormInput';
import { isValidEmail } from '../lib/Validations';

const componentStyles = StyleSheet.create({
	container: {
		paddingHorizontal: styles.measurements.gridSpace2,
	},
});

export default class InviteContactForm extends Component {

	constructor(props) {
		super(props);
		this.state = {
			email: props.email,
		};
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.email !== this.props.email) {
			this.setState({ email: nextProps.email });
		}
	}

	validateEmail = (email) => {
		return isValidEmail(email) || 'Please enter a valid email address.';
	};

	handleChange = (formFields) => {
		const { email } = formFields;
		this.setState({ email: email.value });
		if (email.valid || !email.value) {
			this.props.onHandleChange(email.value);
		}
	};

	render() {
		return (
			<View style={componentStyles.container}>
				<Form
					onChange={this.handleChange}
					scrollsToTop={true}
				>
					<FormInput
						autoCapitalize="none"
						autoCorrect={false}
						name="email"
						isRequired={true}
						isRequiredError="Required"
						label="Email*"
						placeholder="Enter email address"
						componentStyle={[styles.elements.flex, componentStyles.inputMargin]}
						accessibilityLabel="Email"
						keyboardType="email-address"
						value={this.state.email}
						validateOnChange={true}
						validationFunction={this.validateEmail}
						returnKeyType="go"
					/>
				</Form>
			</View>
		);
	}
}

InviteContactForm.propTypes = {
	email: PropTypes.string.isRequired,
	onHandleChange: PropTypes.func.isRequired,
};
