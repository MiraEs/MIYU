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
import { FREE_SHIPPING } from '../../constants/constants';


const componentStyles = StyleSheet.create({
	summary: {
		paddingHorizontal: styles.measurements.gridSpace2,
		alignItems: 'flex-end',
		borderBottomWidth: styles.dimensions.borderWidth,
		borderColor: styles.colors.lightGray,
	},
	padding: {
		paddingVertical: styles.measurements.gridSpace2,
	},
	text: {
		marginLeft: styles.measurements.gridSpace1,
		fontSize: styles.fontSize.small,
		color: styles.colors.mediumDarkGray,
	},
	shippingRow: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
	},
	shippingCostFree: {
		color: styles.colors.accent,
		paddingTop: 1,
	},
});

class CartSummary extends Component {
	constructor(props) {
		super(props);

		this.state = { selectedShippingIndex: props.selectedShippingIndex };
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.selectedShippingIndex !== nextProps.selectedShippingIndex) {
			this.setState({ selectedShippingIndex: nextProps.selectedShippingIndex });
		}
	}

	render() {
		const subTotal = this.props.cart.subTotal || 0,
			selectedShipping = this.props.cart.shippingOptions ? this.props.cart.shippingOptions[this.state.selectedShippingIndex] : null,
			shippingTotal = selectedShipping ? selectedShipping.shippingCost : 0;
		let shippingView = <Text style={componentStyles.text}>Shipping: {helpers.toUSD(shippingTotal)}</Text>,
			couponTotal = 0,
			couponView = <View/>;

		if (this.props.cart.couponTotal) {
			couponTotal = this.props.cart.couponTotal;
			couponView = <Text style={componentStyles.cartRowFooterText}>Coupon ({this.props.cart.couponNumber}): -{helpers.toUSD(couponTotal)}</Text>;
		}

		if (shippingTotal === 0) {
			shippingView = (
				<View style={componentStyles.shippingRow}>
					<Text style={componentStyles.text}>Shipping:</Text>
					<Text style={[componentStyles.text, styles.elements.strikeOutText]}>{helpers.toUSD(FREE_SHIPPING)} </Text>
					<Text style={[styles.text.bold, componentStyles.shippingCostFree]}>FREE</Text>
				</View>
			);
		}

		return (
			<View style={[componentStyles.summary, componentStyles.padding]}>
				<Text style={[componentStyles.padding, styles.elements.titleTextRegular]}>Estimated Cart Totals</Text>
				<Text style={componentStyles.text}>Subtotal of items: {helpers.toUSD(subTotal)}</Text>
				{shippingView}
				{couponView}
				<Text style={[componentStyles.padding, styles.elements.titleTextSmall]}>Estimated Grand Total: {helpers.toUSD(subTotal + shippingTotal + couponTotal)}</Text>
			</View>
		);
	}
}

CartSummary.propTypes = {
	cart: PropTypes.object.isRequired,
	selectedShippingIndex: PropTypes.number,
};

export default CartSummary;
