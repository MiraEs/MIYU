import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	StyleSheet,
	View,
} from 'react-native';
import styles from '../lib/styles';
import helpers from '../lib/helpers';
import {
	Image,
	Text,
} from 'BuildLibrary';
import { IMAGE_75 } from '../constants/CloudinaryConstants';

const componentStyles = StyleSheet.create({
	cartItem: {
		flexDirection: 'row',
		paddingBottom: styles.measurements.gridSpace2,
	},
	cartItemContainer: {
		backgroundColor: styles.colors.white,
		paddingHorizontal: styles.measurements.gridSpace2,
		paddingTop: styles.measurements.gridSpace2,
		borderBottomWidth: styles.dimensions.borderWidth,
		borderColor: styles.colors.grey,
	},
	cartItemText: {
		flex: 1,
		marginLeft: styles.measurements.gridSpace2,
	},
	cartSubItemContainer: {
		backgroundColor: styles.colors.lightGray,
		paddingBottom: styles.measurements.gridSpace2,
	},
	subItem: {
		flexDirection: 'row',
		backgroundColor: styles.colors.lightGray,
		borderColor: styles.colors.secondary,
		borderLeftWidth: styles.dimensions.borderWidthLarge,
		marginTop: styles.measurements.gridSpace1,
		marginLeft: styles.measurements.gridSpace3,
		marginRight: styles.measurements.gridSpace1,
	},

});

export default class CartItemInfo extends Component {

	renderCartItemTotal = (cartItem) => {
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
	};

	renderSubItem = (subItem) => {
		const cartItem = subItem;
		const source = helpers.getImageUrl(cartItem.product.manufacturer, cartItem.product.image);

		return (
			<View
				key={cartItem.product.uniqueId}
				style={componentStyles.subItem}
			>
				<Image
					source={source}
					{...IMAGE_75}
				/>
				<View style={componentStyles.cartItemText}>
					<Text weight="bold">{cartItem.product.displayName}</Text>
					<Text
						size="small"
						lineHeight={false}
					>
						Color/Finish: {cartItem.product.finish}
					</Text>
					{this.renderCartItemTotal(cartItem)}
				</View>
			</View>
		);
	};

	renderSubItems = (cartItem) => {
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
	};

	renderError = () => {
		if (this.props.cartItem.error) {
			return (
				<Text
					color="error"
					lineHeight={false}
					size="small"
				>
					{this.props.cartItem.error}
				</Text>
			);
		}
	};

	render() {
		const { cartItem } = this.props;
		const source = helpers.getImageUrl(cartItem.product.manufacturer, cartItem.product.image);

		return (
			<View
				style={componentStyles.cartItemContainer}
				key={cartItem.itemKey}
			>
				<View style={componentStyles.cartItem}>
					<Image
						source={source}
						{...IMAGE_75}
					/>
					<View style={componentStyles.cartItemText}>
						<Text weight="bold">{cartItem.product.displayName}</Text>
						<Text
							size="small"
							lineHeight={false}
						>
							Color/Finish: {cartItem.product.finish}
						</Text>
						{this.renderCartItemTotal(cartItem)}
						{this.renderError()}
					</View>
				</View>
				{this.renderSubItems(cartItem)}
			</View>
		);
	}

}

CartItemInfo.propTypes = {
	cartItem: PropTypes.object.isRequired,
};
