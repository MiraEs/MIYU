'use strict';

import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import FormInput from '../components/FormInput';
import { isValidEmail } from '../lib/Validations';

export default class EmailAddressEdit extends Component {

	constructor(props) {
		super(props);

		this.state = {
			emailAddress: props.emailAddress || '',
		};
	}

	focus = () => {
		this._emailAddress.focus();
	};

	triggerValidation = () => {
		return this._emailAddress.triggerValidation();
	};

	validateEmail = (email) => {
		return isValidEmail(email) || 'Please enter a valid email address.';
	};

	render() {
		const { emailAddress, onSubmitEditing, returnKeyType, name } = this.props;

		return (
			<FormInput
				autoCapitalize="none"
				autoCorrect={false}
				onChange={this.handleChange}
				onSubmitEditing={onSubmitEditing}
				returnKeyType={returnKeyType}
				name={name}
				isRequired={true}
				isRequiredError="Email Address is required."
				keyboardType="email-address"
				label="Email Address*"
				ref={(ref) => this._emailAddress = ref}
				validationFunction={this.validateEmail}
				value={emailAddress}
				accessibilityLabel={this.props.accessibilityLabel}
			/>
		);
	}
}

EmailAddressEdit.propTypes = {
	emailAddress: PropTypes.string,
	onChange: PropTypes.func, // if this component is in a Form, onChange will come from the form.  Otherwise you need to pass it manually
	onSubmitEditing: PropTypes.func,
	returnKeyType: PropTypes.oneOf(['done', 'go', 'next', 'search', 'send']),
	name: PropTypes.string,
	accessibilityLabel: PropTypes.string.isRequired,
};

EmailAddressEdit.defaultProps = {
	name: 'emailAddress',
};
