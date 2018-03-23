'use strict';
import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	StyleSheet,
	View,
	Text,
} from 'react-native';
import styles from '../../lib/styles';
import helpers from '../../lib/helpers';


const componentStyles = StyleSheet.create({
	priceSummary: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	priceSummaryRight: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'flex-end',
	},
	price: {
		fontSize: styles.fontSize.small,
		marginLeft: styles.measurements.gridSpace1,
	},
	total: {
		textAlign: 'right',
		fontSize: styles.fontSize.regular,
	},
});

class CartRowPrice extends Component {

	getCartItemTotal(cartItem) {
		const total = helpers.toFloat(cartItem.unitPrice) * helpers.toFloat(cartItem.quantity);
		return helpers.toUSD(total);
	}

	render() {
		if (this.props.cartItem.showQuantitySelectors) {
			return (
				<View style={componentStyles.priceSummary}>
					<Text style={componentStyles.price}>@ ${this.props.cartItem.unitPrice}</Text>
				</View>
			);
		} else if (this.props.cartItem.quantity > 1) {
			return (
				<View style={componentStyles.priceSummary}>
					<Text style={componentStyles.price}>@ ${this.props.cartItem.unitPrice}</Text>
					<Text style={componentStyles.total}>{this.getCartItemTotal(this.props.cartItem)}</Text>
				</View>
			);
		}

		return (
			<View style={componentStyles.priceSummaryRight}>
				<Text style={componentStyles.total}>{this.getCartItemTotal(this.props.cartItem)}</Text>
			</View>
		);
	}
}

CartRowPrice.propTypes = {
	cartItem: PropTypes.object.isRequired,
};

export default CartRowPrice;
