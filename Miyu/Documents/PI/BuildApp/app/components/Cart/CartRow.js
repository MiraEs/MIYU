'use strict';
import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	StyleSheet,
	View,
	TouchableWithoutFeedback,
	TouchableOpacity,
} from 'react-native';
import {
	Image,
	Text,
	QuantitySelector,
} from 'BuildLibrary';
import { withNavigation } from '@expo/ex-navigation';
import styles from '../../lib/styles';
import helpers from '../../lib/helpers';
import productHelpers from '../../lib/productHelpers';
import PricedOptions from './PricedOptions';
import Button from '../button';
import trackingActions from '../../lib/analytics/TrackingActions';
import {
	UNDO_STATUS,
	DELETE_STATUS,
} from '../../constants/CartConstants';
import { HOME } from '../../constants/constants';
import {
	IMAGE_75,
	IMAGE_95,
} from '../../constants/CloudinaryConstants';
import tracking from '../../lib/analytics/tracking';
import { trackAction } from '../../actions/AnalyticsActions';
import store from '../../store/configStore';

const componentStyles = StyleSheet.create({
	item: {
		backgroundColor: styles.colors.white,
		borderTopWidth: styles.dimensions.borderWidth,
		borderBottomWidth: styles.dimensions.borderWidth,
		borderColor: styles.colors.grey,
	},
	detailRow: {
		flex: 1,
		flexDirection: 'row',
		paddingHorizontal: styles.measurements.gridSpace2,
		paddingVertical: styles.measurements.gridSpace1,
	},
	detailColumn: {
		flex: 1,
		justifyContent: 'flex-start',
		paddingLeft: styles.measurements.gridSpace2,
	},
	quantitySelectorsShown: {
		marginBottom: styles.measurements.gridSpace1,
	},
	quantitySelectorsHidden: {
		marginRight: styles.measurements.gridSpace1,
		width: 44,
	},
	quantityWrapSelectorsShown: {
		flexDirection: 'column',
		alignItems: 'flex-end',
		marginTop: styles.measurements.gridSpace2,
		marginBottom: styles.measurements.gridSpace1,
	},
	quantityWrapSelectorsHidden: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: styles.measurements.gridSpace2,
		marginBottom: styles.measurements.gridSpace1,
	},
	totalRow: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		alignItems: 'center',
		marginHorizontal: styles.measurements.gridSpace1,
		paddingHorizontal: styles.measurements.gridSpace1,
		paddingVertical: styles.measurements.gridSpace1,
		borderTopWidth: styles.dimensions.borderWidth,
		borderTopColor: styles.colors.grey,
	},
	undoRow: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		backgroundColor: styles.colors.white,
		paddingHorizontal: styles.measurements.gridSpace2,
		paddingVertical: styles.measurements.gridSpace2,
		borderTopWidth: styles.dimensions.borderWidth,
		borderBottomWidth: styles.dimensions.borderWidth,
		borderColor: styles.colors.grey,
	},
	subItems: {
		paddingBottom: styles.measurements.gridSpace2,
	},
	subItem: {
		backgroundColor: styles.colors.lightGray,
		borderColor: styles.colors.secondary,
		borderLeftWidth: styles.dimensions.borderWidthLarge,
		marginTop: styles.measurements.gridSpace1,
		marginLeft: styles.measurements.gridSpace3,
		marginRight: styles.measurements.gridSpace1,
	},
	subItemDetailRow: {
		paddingHorizontal: styles.measurements.gridSpace1,
	},
	subItemTotalRow: {
		marginHorizontal: 0,
		paddingHorizontal: styles.measurements.gridSpace1,
	},
	subItemUndoRow: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		backgroundColor: styles.colors.lightGray,
		borderColor: styles.colors.secondary,
		borderLeftWidth: styles.dimensions.borderWidthLarge,
		paddingHorizontal: styles.measurements.gridSpace2,
		paddingVertical: styles.measurements.gridSpace2,
		marginTop: styles.measurements.gridSpace1,
		marginLeft: styles.measurements.gridSpace3,
		marginRight: styles.measurements.gridSpace1,
	},
	label: {
		marginRight: styles.measurements.gridSpace1,
	},
});


@withNavigation
class CartRow extends Component {

	constructor(props) {
		super(props);

		this.state = { isSelectorVisible: {} };
		this.state.isSelectorVisible[props.cartItem.itemKey] = false;

		this.quantitySelectors = {};
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.hideQuantitySelectors) {
			Object.keys(this.quantitySelectors).forEach((key) => {
				if (this.quantitySelectors[key]) {
					this.onToggleSelectors(false, key);
					this.quantitySelectors[key].onHideSelectors();
				}
			});
		}
	}

	getQuantitySelectorWrapStyle = (key) => {
		if (this.state.isSelectorVisible[key]) {
			return componentStyles.quantityWrapSelectorsShown;
		}

		return componentStyles.quantityWrapSelectorsHidden;
	};

	getQuantitySelectorStyle = (key) => {
		if (this.state.isSelectorVisible[key]) {
			return componentStyles.quantitySelectorsShown;
		}

		return componentStyles.quantitySelectorsHidden;
	};

	onRowSelect = () => {
		this.props.onHideQuantitySelectors();
	};

	goToProduct = (item) => {
		if (this.props.cameFromProductWithCompositeId && item.productCompositeId === this.props.cameFromProductWithCompositeId) {
			this.props.navigator.pop();
		} else {
			this.props.navigator.pop();
			this.props.navigation.getNavigator(HOME).push('productDetail', {
				compositeId: item.productCompositeId,
				uniqueId: item.uniqueId,
				manufacturer: item.manufacturer,
				sku: item.sku,
				finish: item.finish,
			});
			this.props.navigation.performAction(({ tabs }) => tabs('main').jumpToTab(HOME));
		}
	};

	onToggleSelectors = (state, key) => {
		const { isSelectorVisible } = this.state;

		isSelectorVisible[key] = state;
		this.setState({ isSelectorVisible });
	};

	onUpdateQuantity = (cartItem, category, newQuantity, key) => {
		this.props.onUpdateQuantity(newQuantity, key)
		.then(() => {
			// track if quantity is reduced
			if (newQuantity < cartItem.quantity) {
				tracking.trackCartItemDelete({
					...cartItem,
					quantity: (cartItem.quantity - newQuantity),
				});
			} else {
				store.dispatch(trackAction(trackingActions.CART_ITEM_ADD, {
					...category,
					quantity: newQuantity,
					cost: cartItem.unitPrice,
					finish: cartItem.product.finish,
					manufacturer: cartItem.product.manufacturer,
					productId: cartItem.product.productId,
					sku: cartItem.product.sku,
					compositeId: cartItem.product.productCompositeId,
					uniqueId: cartItem.product.uniqueId,
				}));
			}
		})
		.catch(() => this.onResetQuantity(cartItem));
	};

	onResetQuantity = (cartItem) => {
		const { itemKey, quantity } = cartItem;
		const quantitySelector = this.quantitySelectors[itemKey];

		if (quantitySelector) {
			quantitySelector.setState({ quantity });
		}
	};

	onUndoDeleteCartItem = (cartItem) => {
		const { itemKey } = cartItem;

		this.onToggleSelectors(false, itemKey);
		this.props.onUndoDeleteCartItem(cartItem);
	};

	renderCartItemTotal = (cartItem) => {
		const total = helpers.toFloat(cartItem.unitPrice) * cartItem.quantity;
		const couponAmount = cartItem.couponAmount || 0;
		const couponTotal = ` ${helpers.toUSD(total - couponAmount)}`;

		if (couponAmount > 0) {
			return (
				<Text lineHeight={false}>
					<Text
						decoration="line-through"
						lineHeight={false}
					>
						{helpers.toUSD(total)}
					</Text>
					<Text
						weight="bold"
						color="primary"
						lineHeight={false}
					>
						{couponTotal}
					</Text>
				</Text>
			);
		}

		return (
			<Text
				weight="bold"
				color="primary"
				lineHeight={false}
			>
				{helpers.toUSD(total)}
			</Text>
		);
	};

	renderStockText = (cartItem) => {
		if (cartItem && !productHelpers.isGeProduct(cartItem.product) && cartItem.leadTimeInformation) {
			const stockText = productHelpers.getStockText(cartItem.product, cartItem.leadTimeInformation, !cartItem.leadTimeInformation.isOutOfStock);
			const stockTextColor = cartItem.leadTimeInformation.isOutOfStock ? 'accent' : 'secondary';
			return (
				<Text
					size="small"
					color={stockTextColor}
				>
					{stockText}
				</Text>
			);
		}
	};

	renderSubItems = () => {
		const { cartItem } = this.props;

		if (!cartItem.hasSubItems) {
			return null;
		}

		return (
			<View style={componentStyles.subItems}>
				{cartItem.subItems.map((subItem) => {
					const source = helpers.getImageUrl(subItem.product.manufacturer, subItem.product.image);
					if (subItem.deleteStatus === DELETE_STATUS) {
						return null;
					}

					if (subItem.deleteStatus === UNDO_STATUS) {
						return (
							<View
								key={subItem.itemKey}
								style={componentStyles.subItemUndoRow}
							>
								<View>
									<Text
										weight="bold"
										color="error"
									>
										{subItem.product.displayName}
									</Text>
									<Text color="error">removed from the cart</Text>
								</View>
								<View>
									<Button
										accessibilityLabel="Undo Delete Sub Item Button"
										color="white"
										text="Undo"
										onPress={() => this.onUndoDeleteCartItem(subItem)}
										trackAction={trackingActions.CART_ROW_UNDO}
									/>
								</View>
							</View>
						);
					}

					return (
						<View
							key={subItem.itemKey}
							style={componentStyles.subItem}
						>
							<View
								style={[componentStyles.detailRow, componentStyles.subItemDetailRow]}
							>
								<Image
									source={source}
									onPress={() => this.goToProduct(subItem.product)}
									{...IMAGE_75}
								/>
								<View style={componentStyles.detailColumn}>
									<TouchableOpacity onPress={() => this.goToProduct(subItem.product)}>
										<Text weight="bold">{subItem.product.displayName}</Text>
									</TouchableOpacity>
									<View>
										<Text>Color/Finish: {subItem.product.finish}</Text>
									</View>
									{this.renderStockText(subItem)}
									<View style={this.getQuantitySelectorWrapStyle(subItem.itemKey)}>
										<QuantitySelector
											ref={(ref) => this.quantitySelectors[subItem.itemKey] = ref}
											style={this.getQuantitySelectorStyle(subItem.itemKey)}
											id={subItem.itemKey}
											quantity={subItem.quantity}
											onUpdateQuantity={(quantity, key) => this.onUpdateQuantity(subItem, cartItem.rootCategory, quantity, key)}
											onInputFocus={() => this.props.onQuantityInputFocus(this.quantitySelectors[subItem.itemKey])}
											onToggleSelectors={(visible) => this.onToggleSelectors(visible, subItem.itemKey)}
										/>
										<Text
											weight="bold"
											lineHeight={false}
										>
											@ {helpers.toUSD(subItem.unitPrice)}
										</Text>
									</View>
								</View>
							</View>
							<View style={[componentStyles.totalRow, componentStyles.subItemTotalRow]}>
								<Text
									style={componentStyles.label}
									size="small"
									weight="bold"
									lineHeight={false}
								>
									Item Total
								</Text>
								{this.renderCartItemTotal(subItem)}
							</View>
						</View>
					);
				})}
			</View>
		);
	};

	renderRow = () => {
		const cartItem = this.props.cartItem;
		const source = helpers.getImageUrl(cartItem.product.manufacturer, cartItem.product.image);
		const squareFeet = cartItem.sqftPerCarton ?
			<Text size="small">Square Feet: {cartItem.sqftPerCarton}</Text> : null;

		if (cartItem.deleteStatus === DELETE_STATUS) {
			return null;
		}

		if (cartItem.deleteStatus === UNDO_STATUS) {
			return (
				<View style={componentStyles.undoRow}>
					<View>
						<Text
							weight="bold"
							color="error"
						>
							{cartItem.product.displayName}
						</Text>
						<Text color="error">removed from the cart</Text>
					</View>
					<View>
						<Button
							accessibilityLabel="Undo Delete Button"
							color="white"
							text="Undo"
							textColor="accent"
							onPress={() => this.onUndoDeleteCartItem(cartItem)}
							trackAction={trackingActions.CART_ROW_UNDO}
						/>
					</View>
				</View>
			);
		}

		return (
			<View
				ref={(ref) => this.cartItemRow = ref}
				key={cartItem.itemKey}
				style={componentStyles.item}
			>
				<TouchableWithoutFeedback onPress={this.onRowSelect}>
					<View>
						<View
							style={componentStyles.detailRow}
						>
							<Image
								source={source}
								onPress={() => this.goToProduct(cartItem.product)}
								{...IMAGE_95}
							/>
							<View style={componentStyles.detailColumn}>
								<TouchableOpacity onPress={() => this.goToProduct(cartItem.product)}>
									<Text weight="bold">{cartItem.product.displayName}</Text>
									<View>
										<Text>Color/Finish: {cartItem.product.finish}</Text>
									</View>
									{this.renderStockText(cartItem)}
									{squareFeet}
								</TouchableOpacity>
								<PricedOptions options={cartItem.pricedOptions} />
								<View style={this.getQuantitySelectorWrapStyle(cartItem.itemKey)}>
									<QuantitySelector
										ref={(ref) => this.quantitySelectors[cartItem.itemKey] = ref}
										style={this.getQuantitySelectorStyle(cartItem.itemKey)}
										id={cartItem.itemKey}
										quantity={cartItem.quantity}
										onUpdateQuantity={(quantity, key) => this.onUpdateQuantity(cartItem, cartItem.rootCategory, quantity, key)}
										onInputFocus={() => this.props.onQuantityInputFocus(this.quantitySelectors[cartItem.itemKey])}
										onToggleSelectors={(visible) => this.onToggleSelectors(visible, cartItem.itemKey)}
									/>
									<Text
										weight="bold"
										lineHeight={false}
									>
										@ {helpers.toUSD(cartItem.unitPrice)}
									</Text>
								</View>
							</View>
						</View>
						<View style={componentStyles.totalRow}>
							<Text
								style={componentStyles.label}
								size="small"
								weight="bold"
								lineHeight={false}
							>
								Item Total
							</Text>
							{this.renderCartItemTotal(cartItem)}
						</View>
						{this.renderSubItems()}
					</View>
				</TouchableWithoutFeedback>
			</View>
		);
	};

	render() {
		return this.renderRow();
	}
}

CartRow.propTypes = {
	rowId: PropTypes.string.isRequired,
	cartItem: PropTypes.object.isRequired,
	onUpdateQuantity: PropTypes.func.isRequired,
	onUndoDeleteCartItem: PropTypes.func.isRequired,
	onHideQuantitySelectors: PropTypes.func,
	onQuantityInputFocus: PropTypes.func,
	onProductPress: PropTypes.func,
	cameFromProductWithCompositeId: PropTypes.number,
	navigator: PropTypes.shape({
		push: PropTypes.func,
		pop: PropTypes.func,
	}),
	navigation: PropTypes.shape({
		getNavigator: PropTypes.func,
		performAction: PropTypes.func,
	}),
};

CartRow.defaultProps = {
	onHideQuantitySelectors: helpers.noop,
	onQuantityInputFocus: helpers.noop,
	onProductPress: helpers.noop,
};

export default CartRow;
