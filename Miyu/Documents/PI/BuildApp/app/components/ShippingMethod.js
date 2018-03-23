'use strict';
import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { Text } from 'BuildLibrary';
import ShippingPrice from './ShippingPrice';

class ShippingMethod extends Component {

	render() {
		const { shippingMethod } = this.props;
		const shippingNameArr = shippingMethod.shippingName.split('(');
		const shippingNameShort = shippingNameArr[shippingNameArr.length - 1].trim().slice(0, -1);

		return (
			<View key={shippingMethod.shippingOptionId}>
				<Text weight="bold">{shippingMethod.shippingOption}</Text>
				<Text>{shippingNameShort}</Text>
				<ShippingPrice shippingCost={shippingMethod.shippingCost}/>
			</View>
		);
	}
}

ShippingMethod.propTypes = {
	shippingMethod: PropTypes.shape({
		shippingOptionId: PropTypes.number,
		shippingOption: PropTypes.string,
		shippingName: PropTypes.string,
		shippingCost: PropTypes.number,
	}).isRequired,
};

export default ShippingMethod;
