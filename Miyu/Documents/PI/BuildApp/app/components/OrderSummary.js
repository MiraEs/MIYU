import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	StyleSheet,
	View,
} from 'react-native';
import styles from '../lib/styles';
import { Text } from 'BuildLibrary';
import helpers from '../lib/helpers';
import constants from '../constants/constants';

const componentStyles = StyleSheet.create({
	container: {
		padding: styles.measurements.gridSpace1,
	},
	borderBottom: {
		paddingBottom: styles.measurements.gridSpace2,
		borderBottomWidth: styles.dimensions.borderWidth,
		borderBottomColor: styles.colors.greyLight,
	},
	grandTotal: {
		paddingTop: styles.measurements.gridSpace1,
	},
	row: {
		flexDirection: 'row',
	},
	spacedRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
});

export default class OrderSummary extends Component {

	constructor(props) {
		super(props);
		this.renderShipping = this.renderShipping.bind(this);
	}

	renderShipping(shipping) {
		if (shipping === 0) {
			return (
				<View style={componentStyles.row}>
					<Text decoration="line-through">{constants.FREE_SHIPPING}</Text>
					<Text
						weight="bold"
						color="accent"
					>
						 FREE
					</Text>
				</View>
			);
		}
		return <Text>{helpers.toUSD(shipping)}</Text>;
	}

	renderRewardTierName() {
		if (this.props.rewardTierName) {
			return (
				<Text>Discount ({this.props.rewardTierName} Savings):</Text>
			);
		}
		return (
			<Text>Discount:</Text>
		);
	}

	renderDiscounts() {
		const { order } = this.props;
		const { discountTotal } = order;

		if (discountTotal > 0) {
			return (
				<View style={componentStyles.spacedRow}>
					{this.renderRewardTierName()}
					<Text color="accent">{helpers.toUSD(discountTotal)}</Text>
				</View>
			);
		}
	}

	renderCredits() {
		const { order } = this.props;
		const { creditTotal } = order;

		if (creditTotal < 0) {
			return (
					<View style={componentStyles.spacedRow}>
						<Text>Returns:</Text>
						<Text color="accent">{helpers.toUSD(creditTotal)}</Text>
					</View>
			);
		}
	}
	render() {
		const { order } = this.props;
		const { subTotal, shippingTotal, taxTotal, total } = order;
		return (
			<View style={componentStyles.container}>
				<View style={componentStyles.borderBottom}>
					<View style={componentStyles.spacedRow}>
						<Text>Subtotal:</Text>
						<Text>{helpers.toUSD(subTotal)}</Text>
					</View>
					{this.renderDiscounts()}
					<View style={componentStyles.spacedRow}>
						<Text>Shipping:</Text>
						{this.renderShipping(shippingTotal)}
					</View>
					<View style={componentStyles.spacedRow}>
						<Text>Tax:</Text>
						<Text>{helpers.toUSD(taxTotal)}</Text>
					</View>
					{this.renderCredits()}
				</View>
				<View style={[componentStyles.spacedRow, componentStyles.grandTotal]}>
					<Text weight="bold">Grand Total:</Text>
					<Text
						weight="bold"
						color="primary"
					>
						{helpers.toUSD(total)}
					</Text>
				</View>
			</View>
		);
	}

}

OrderSummary.propTypes = {
	order: PropTypes.object.isRequired,
	rewardTierName: PropTypes.string,
};
