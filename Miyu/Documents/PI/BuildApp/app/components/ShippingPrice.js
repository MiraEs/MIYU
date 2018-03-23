'use strict';
import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	View,
	StyleSheet,
} from 'react-native';
import helpers from '../lib/helpers';
import EventEmitter from '../lib/eventEmitter';
import { DISCOUNTED_SHIPPING_PRICE } from '../constants/CheckoutConstants';
import { Text } from 'BuildLibrary';
import PhoneHelper from '../lib/PhoneHelper';

const componentStyles = StyleSheet.create({
	strikePrice: {
		marginRight: 4,
	},
	priceBlock: {
		flexDirection: 'row',
	},
});

class ShippingPrice extends Component {

	render() {
		const {
			shippingCost,
			callUs,
			user,
		} = this.props;

		if (shippingCost === null) {
			return <Text>--</Text>;
		}


		if (shippingCost) {
			return <Text>{helpers.toUSD(shippingCost)}</Text>;
		}

		if (callUs) {
			const phone = PhoneHelper.getPhoneNumberByUserType(user);
			return (
				<Text
					color="primary"
					onPress={() => EventEmitter.emit('onCallUs', phone, true)}
				>
					Call
				</Text>
			);
		}
		return (
			<View style={componentStyles.priceBlock}>
				<Text
					decoration="line-through"
					style={componentStyles.strikePrice}
				>
					{helpers.toUSD(DISCOUNTED_SHIPPING_PRICE)}
				</Text>
				<Text
					weight="bold"
					color="accent"
				>
					FREE
				</Text>
			</View>
		);
	}
}

ShippingPrice.propTypes = {
	shippingCost: PropTypes.number,
	callUs: PropTypes.bool,
	user: PropTypes.object.isRequired,
};

ShippingPrice.defaultProps = {
	callUs: false,
	user: {},
};


export default ShippingPrice;
