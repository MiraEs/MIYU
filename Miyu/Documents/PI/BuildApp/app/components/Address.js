'use strict';
import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	View,
	ViewPropTypes,
} from 'react-native';
import PhoneHelper from '../lib/PhoneHelper';
import { Text } from 'BuildLibrary';

class Address extends Component {
	renderAddressLine(address) {
		if (address) {
			return <Text>{address}</Text>;
		}
	}

	render() {
		const { address, boldName } = this.props;
		const weight = boldName ? 'bold' : 'normal';

		if (!address) {
			return null;
		}

		return (
			<View
				key={address.addressId}
				style={this.props.style}
			>
				<Text
					capitalize="all"
					weight={weight}
				>
					{address.firstName} {address.lastName}
				</Text>
				{this.renderAddressLine(address.company)}
				{this.renderAddressLine(address.address)}
				{this.renderAddressLine(address.address2)}
				<Text>{address.city}, {address.state} {address.zip}</Text>
				{this.renderAddressLine(PhoneHelper.formatPhoneNumber({ phoneNumber: address.phone }))}
			</View>
		);
	}
}

Address.propTypes = {
	address: PropTypes.shape({
		firstName: PropTypes.string.isRequired,
		lastName: PropTypes.string.isRequired,
		company: PropTypes.string,
		address: PropTypes.string,
		address2: PropTypes.string,
		city: PropTypes.string.isRequired,
		state: PropTypes.string.isRequired,
		zip: PropTypes.string.isRequired,
		phone: PropTypes.string,
	}),
	boldName: PropTypes.bool,
	style: ViewPropTypes.style,
};

Address.defaultProps = {
	boldName: true,
};

export default Address;
