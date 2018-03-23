'use strict';
import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	View,
	StyleSheet,
} from 'react-native';
import helpers from '../../lib/helpers';
import { Text } from 'BuildLibrary';
import pluralize from 'pluralize';
import styles from '../../lib/styles';
import ShippingPrice from '../ShippingPrice';

const componentStyles = StyleSheet.create({
	totalsRow: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
	},
	labels: {
		alignItems: 'flex-end',
	},
	totals: {
		alignItems: 'flex-end',
		marginHorizontal: styles.measurements.gridSpace2,
	},
});

class CartSubTotal extends Component {

	getTotalQuantity() {
		let total = 0;

		this.props.cart.sessionCartItems.forEach((cartItem) => {
			total += cartItem.quantity;

			if (cartItem.hasSubItems) {
				cartItem.subItems.forEach((subItem) => {
					total += subItem.quantity;
				});
			}
		});

		return total;
	}

	getTaxAmount() {
		const { taxAmount } = this.props.cart;

		if (!taxAmount) {
			return '--';
		}

		return helpers.toUSD(taxAmount);
	}

	getProSavings() {
		const { cart: { sessionCartItems } } = this.props;
		let totalSavings = 0;

		sessionCartItems.forEach((item) => {
			const itemSavings = item.pricebookMap[1] ? (item.pricebookMap[1] - item.unitPrice) * item.quantity : 0;

			if (itemSavings > 0) {
				totalSavings += itemSavings;
			}
		});

		return totalSavings;
	}

	renderCouponLabel() {
		const { cart: { couponTotal, couponCode } } = this.props;

		if (couponTotal || couponCode) {
			return <Text>Discount:</Text>;
		}
	}

	renderCouponTotal() {
		const { cart: { couponTotal, couponCode } } = this.props;

		if (couponTotal || couponCode) {
			return (
				<Text color="accent">
					-{helpers.toUSD(couponTotal)}
				</Text>
			);
		}
	}

	renderStoreCreditLabel() {
		const { useStoreCredit } = this.props;

		if (useStoreCredit) {
			return (
				<Text>
					Store Credit:
				</Text>
			);
		}
	}

	renderStoreCreditTotal() {
		const { storeCredit, useStoreCredit } = this.props;

		if (useStoreCredit) {
			return (
				<Text color="accent">
					-{helpers.toUSD(storeCredit)}
				</Text>
			);
		}
	}

	renderProSavingsLabel(savings) {
		if (savings > 0) {
			return (
				<Text>
					Pro Savings:
				</Text>
			);
		}
	}

	renderProSavingsTotal(savings) {
		if (savings > 0) {
			return (
				<Text color="accent">
					{helpers.toUSD(savings)}
				</Text>
			);
		}
	}

	render() {
		const {
			cart: { shippingOptions, subTotal },
			selectedShippingIndex,
			user,
			actualTaxes,
		} = this.props;
		const totalQuantity = this.getTotalQuantity();
		const subTotalLabel = `(${pluralize('Item', totalQuantity, true)}):`;
		const filtered = (shippingOptions) ? shippingOptions.filter((option) => option.customerAvailable) : [];
		const shippingCost = shippingOptions && shippingOptions[selectedShippingIndex] && shippingOptions[selectedShippingIndex].shippingCost;
		const proSavings = this.getProSavings();

		return (
			<View style={componentStyles.totalsRow}>
				<View style={componentStyles.labels}>
					<Text>
						<Text>Subtotal</Text> {subTotalLabel}
					</Text>
					<Text>Shipping Estimate:</Text>
					<Text>{`${!actualTaxes ? 'Estimated ': ''}Tax:`}</Text>
					{this.renderStoreCreditLabel()}
					{this.renderCouponLabel()}
					{this.renderProSavingsLabel(proSavings)}
				</View>
				<View style={componentStyles.totals}>
					<Text>{helpers.toUSD(subTotal)}</Text>
					<ShippingPrice
						shippingCost={shippingCost}
						callUs={shippingOptions && (shippingOptions.length > 0 !== filtered.length > 0)}
						user={user}
					/>
					<Text>{this.getTaxAmount()}</Text>
					{this.renderStoreCreditTotal()}
					{this.renderCouponTotal()}
					{this.renderProSavingsTotal(proSavings)}
				</View>
			</View>
		);
	}
}

CartSubTotal.propTypes = {
	cart: PropTypes.shape({
		couponTotal: PropTypes.number,
		couponCode: PropTypes.object,
		sessionCartItems: PropTypes.array,
		shippingCost: PropTypes.number,
		shippingOptions: PropTypes.array,
		subTotal: PropTypes.number,
		taxAmount: PropTypes.number,
	}).isRequired,
	selectedShippingIndex: PropTypes.number,
	useStoreCredit: PropTypes.bool,
	storeCredit: PropTypes.number,
	user: PropTypes.object.isRequired,
	actualTaxes: PropTypes.bool,
};

CartSubTotal.defaultProps = {
	useStoreCredit: false,
	storeCredit: null,
};

export default CartSubTotal;
