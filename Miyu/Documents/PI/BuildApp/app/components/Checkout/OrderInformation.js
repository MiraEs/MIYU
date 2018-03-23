'use strict';
import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	StyleSheet,
	View,
} from 'react-native';
import styles from '../../lib/styles';
import helpers from '../../lib/helpers';
import productHelpers from '../../lib/productHelpers';
import {
	Text,
	Image,
} from 'BuildLibrary';
import { IMAGE_95 } from '../../constants/CloudinaryConstants';
import CartSubTotal from '../Cart/CartSubTotal';


const componentStyles = StyleSheet.create({
	subItem: {
		flexDirection: 'row',
		backgroundColor: styles.colors.lightGray,
		borderColor: styles.colors.secondary,
		borderLeftWidth: styles.dimensions.borderWidthLarge,
		marginTop: styles.measurements.gridSpace1,
		marginLeft: styles.measurements.gridSpace3,
		marginRight: styles.measurements.gridSpace1,
	},
	cartItemContainer: {
		backgroundColor: styles.colors.white,
		paddingHorizontal: styles.measurements.gridSpace2,
		paddingTop: styles.measurements.gridSpace2,
	},
	cartItem: {
		flexDirection: 'row',
		borderColor: styles.colors.greyLight,
		borderBottomWidth: styles.dimensions.borderWidthLarge,
		paddingBottom: styles.measurements.gridSpace2,
	},
	cartItemText: {
		flex: 1,
		marginLeft: styles.measurements.gridSpace2,
	},
	cartSubItemContainer: {
		backgroundColor: styles.colors.lightGray,
		paddingBottom: styles.measurements.gridSpace2,
	},
	indent: {
		marginHorizontal: styles.measurements.gridSpace1,
	},
	headerText: {
		marginTop: styles.measurements.gridSpace3,
		marginBottom: styles.measurements.gridSpace1,
	},
	summaryContainer: {
		marginBottom: styles.measurements.gridSpace3,
		backgroundColor: styles.colors.white,
		padding: styles.measurements.gridSpace2,
		flexDirection: 'row',
		flex: 1,
		justifyContent: 'flex-end',
	},
});

class OrderInformation extends Component {

	renderCartItemTotal(cartItem) {
		const total = helpers.toFloat(cartItem.unitPrice) * cartItem.quantity;
		const couponAmount = cartItem.couponAmount || 0;
		const quantity = `(Qty ${cartItem.quantity}) `;

		if (couponAmount > 0) {
			return (
				<Text size="small">
					{quantity}
					<Text
						size="small"
						decoration="line-through"
						lineHeight={false}
					>
						{helpers.toUSD(total)}
					</Text>
					<Text
						size="small"
						color="accent"
						lineHeight={false}
					>
						{helpers.toUSD(total - couponAmount)}
					</Text>
				</Text>
			);
		}

		return <Text size="small">(Qty {cartItem.quantity}) {helpers.toUSD(total)}</Text>;
	}

	renderSubItem(subItem) {
		const cartItem = subItem;
		const source = helpers.getImageUrl(cartItem.product.manufacturer, cartItem.product.image);

		return (
			<View
				key={cartItem.product.uniqueId}
				style={componentStyles.subItem}
			>
				<Image
					source={source}
					onPress={helpers.noop}
					{...IMAGE_95}
				/>
				<View style={componentStyles.cartItemText}>
					<Text weight="bold">{cartItem.product.displayName}</Text>
					<Text
						size="small"
						lineHeight={false}
					>
						Color/Finish: {cartItem.product.finish}
					</Text>
					<Text
						size="small"
						lineHeight={false}
					>
						{cartItem.leadTimeInformation.text}
					</Text>
					{this.renderCartItemTotal(cartItem)}
				</View>
			</View>
		);
	}

	renderSubItems(cartItem) {
		if (!cartItem.hasSubItems) {
			return null;
		}

		return (
			<View
				style={componentStyles.cartSubItemContainer}
			>
				{cartItem.subItems.map((subItem) => this.renderSubItem(subItem))}
			</View>
		);
	}

	renderLeadTimeInformation(cartItem) {
		let text = cartItem.leadTimeInformation.text;
		if (productHelpers.isGeProduct(cartItem.product)) {
			if (this.props.cart.requestedDeliveryDate) {
				text = `Requested delivery: ${helpers.getDateStrictFormat(this.props.cart.requestedDeliveryDate)}`;
			} else {
				text = 'Please select a delivery date for this item.';
			}
		}
		return (
			<Text size="small">
				{text}
			</Text>
		);
	}

	renderCartItem(item) {
		const cartItem = item;
		const source = helpers.getImageUrl(cartItem.product.manufacturer, cartItem.product.image);

		return (
			<View
				style={componentStyles.cartItemContainer}
				key={item.itemKey}
			>
				<View style={componentStyles.cartItem}>
					<Image
						source={source}
						onPress={() => helpers.noop}
						{...IMAGE_95}
					/>
					<View style={componentStyles.cartItemText}>
						<Text weight="bold">{cartItem.product.displayName}</Text>
						<Text
							size="small"
							lineHeight={false}
						>
							Color/Finish: {cartItem.product.finish}
						</Text>
						{this.renderLeadTimeInformation(cartItem)}
						{this.renderCartItemTotal(cartItem)}
					</View>
				</View>
				{this.renderSubItems(cartItem)}
			</View>
		);
	}

	renderCartItems(cartItems) {
		if (!cartItems) {
			return null;
		}

		return cartItems.map((item) => this.renderCartItem(item));
	}

	render() {
		const { cart, selectedShippingIndex, storeCredit, useStoreCredit, user, actualTaxes } = this.props;
		const { sessionCartItems } = cart;
		const couponCode = helpers.getCouponCodeFromCart(cart);

		return (
			<View>
				<Text
					size="large"
					weight="bold"
					style={[componentStyles.indent, componentStyles.headerText]}
				>
					Order Information
				</Text>
				{this.renderCartItems(sessionCartItems)}
				<View style={componentStyles.summaryContainer}>
					<CartSubTotal
						cart={cart}
						user={user}
						couponCode={couponCode}
						selectedShippingIndex={selectedShippingIndex}
						storeCredit={storeCredit}
						useCouponCode={!!couponCode}
					    useStoreCredit={useStoreCredit}
						actualTaxes={actualTaxes}
					/>
				</View>
			</View>
		);
	}
}

OrderInformation.propTypes = {
	cart: PropTypes.object.isRequired,
	user: PropTypes.object.isRequired,
	selectedShippingIndex: PropTypes.number.isRequired,
	useStoreCredit: PropTypes.bool,
	storeCredit: PropTypes.number,
	actualTaxes: PropTypes.bool,
};

export default OrderInformation;
