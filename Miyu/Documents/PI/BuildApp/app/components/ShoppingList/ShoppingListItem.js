import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	StyleSheet,
	TouchableOpacity,
	View,
	ViewPropTypes,
} from 'react-native';
import {
	Image,
	Text,
} from 'BuildLibrary';
import { withNavigation } from '@expo/ex-navigation';
import styles from '../../lib/styles';
import Icon from 'react-native-vector-icons/Ionicons';
import helpers from '../../lib/helpers';
import {
	PRODUCT_SECTION,
	IMAGE_42,
} from '../../constants/CloudinaryConstants';
import {
	HOME,
	MAIN,
} from '../../constants/constants';
import {
	addItemsToCartFromProject,
	removeItemFromShoppingList,
} from '../../actions/ProjectActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Swipeable from 'react-native-swipeable';
import SwipeRowAction from '../SwipeRowAction';
import { showAlert } from '../../actions/AlertActions';
import PricedOptions from '../Cart/PricedOptions';
import router from '../../router';
import TrackingActions from '../../lib/analytics/TrackingActions';
import { trackAction } from '../../actions/AnalyticsActions';

const componentStyles = StyleSheet.create({
	purchased: {
		flexDirection: 'row',
		marginBottom: styles.measurements.gridSpace1,
		marginRight: styles.measurements.gridSpace2,
		alignItems: 'center',
	},
	itemWrapper: {
		marginTop: -1,
		borderColor: styles.colors.grey,
		borderWidth: styles.dimensions.borderWidth,
	},
	subItem: {
		marginLeft: styles.measurements.gridSpace2,
		borderLeftWidth: styles.dimensions.borderWidthLarge,
		borderLeftColor: styles.colors.greyDark,
	},
	imageWrapper: {
		flexDirection: 'row',
		margin: styles.measurements.gridSpace1,
		alignItems: 'center',
	},
	image: {
		marginLeft: styles.measurements.gridSpace1,
		marginRight: styles.measurements.gridSpace2,
	},
	secondRowWrapper: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	editButton: {
		paddingLeft: styles.measurements.gridSpace2,
	},
	purchaseIcon: {
		marginRight: styles.measurements.gridSpace1,
	},
	pricedOptions: {
		marginLeft: 70,
		marginBottom: 3,
	},
});

export class ShoppingListItem extends Component {

	constructor(props) {
		super(props);
		this.state = {
			addToCartEnabled: true,
		};
		this.swipeable = {
			recenter: helpers.noop,
		};
	}

	getBackgroundStyle = () => {
		const { item, isSubItem } = this.props;
		const backgroundColor = item.isPurchased || isSubItem ? styles.colors.greyLight : styles.colors.white;
		return {
			backgroundColor,
		};
	};

	getStyle = () => {
		return StyleSheet.flatten([
			componentStyles.itemWrapper,
			this.props.isSubItem ? componentStyles.subItem : {},
			this.getBackgroundStyle(),
			this.props.style,
		]);
	};

	onPressEdit = () => {
		const {
			item,
			navigation,
			onUpdateItem,
			projectId,
			sessionCartId,
		} = this.props;
		this.swipeable.recenter();
		navigation.getNavigator('root').push('productEdit', {
			item,
			onUpdateItem,
			projectId,
			sessionCartId,
		});
	};

	onPressAddToCart = () => {
		this.setState({ addToCartEnabled: false });
		const { item, actions, projectId } = this.props;
		actions.addItemsToCartFromProject(projectId, [item])
			.then(() => this.swipeable.recenter())
			.catch(() => this.props.actions.showAlert('Failed to add item to cart.', 'error'))
			.done();
	};

	onPressDeleteItem = () => {
		const { item: { itemKey, sessionCartId }, projectId } = this.props;
		this.props.actions.removeItemFromShoppingList(sessionCartId, itemKey, projectId)
			.catch(() => this.props.actions.showAlert('Failed to delete item.', 'error'))
			.done();
	};

	goToProduct = () => {
		const { item: { product }} = this.props;
		this.props.navigation.getNavigatorByUID(MAIN).jumpToTab(HOME);
		requestAnimationFrame(() => this.props.navigation.performAction(({ stacks }) => {
			stacks(HOME).push(router.getRoute('productDetail', {
				compositeId: product.productCompositeId,
				uniqueId: product.uniqueId,
				manufacturer: product.manufacturer,
				sku: product.sku,
				finish: product.finish,
			}));
		}));
	};

	getSwipeRowAction = (options) => {
		const { text, backgroundColor, iconName, analyticsData, onPress, rightSwipeItem = true } = options;
		return (
			<SwipeRowAction
				text={text}
				iconName={iconName}
				backgroundColor={backgroundColor}
				analyticsData={analyticsData}
				rightSwipeItem={rightSwipeItem}
				onPress={onPress}
			/>
		);
	};

	getAllSwipeActions = () => {
		const swipeActions = [];
		const { isPurchased, product } = this.props.item;
		if (!isPurchased) {
			swipeActions.push(
				this.getSwipeRowAction({
					text: 'Add To Cart',
					backgroundColor: styles.colors.primary,
					iconName: 'cart',
					analyticsData: {
						trackName: TrackingActions.SHOPPING_LIST_ITEM_ADD_TO_CART_TAP,
						trackData: {
							screen: 'Shopping List Tab',
							productId: product.productId,
							manufacturer: product.manufacturer,
							uniqueId: product.uniqueId,
							compositeId: product.productCompositeId,
							finish: product.finish,
						},
					},
					onPress: this.onPressAddToCart,
				})
			);
		}
		swipeActions.push(
			this.getSwipeRowAction({
				text: 'Edit',
				backgroundColor: styles.colors.accent,
				iconName: 'create',
				analyticsData: { trackName: TrackingActions.SHOPPING_LIST_ITEM_EDIT_TAP },
				onPress: this.onPressEdit,
			})
		);
		if (!isPurchased) {
			swipeActions.push(
				this.getSwipeRowAction({
					text: 'Delete',
					backgroundColor: styles.colors.error,
					iconName: 'trash',
					analyticsData: { trackName: TrackingActions.SHOPPING_LIST_ITEM_DELETE_TAP },
					onPress: this.onPressDeleteItem,
				})
			);
		}
		return swipeActions;
	};

	renderPurchasedTag = () => {
		const { item } = this.props;
		if (item.isPurchased) {
			return (
				<View style={componentStyles.purchased}>
					<Icon
						name={helpers.getIcon('checkmark-circle')}
						size={18}
						color={styles.colors.primary}
						style={componentStyles.purchaseIcon}
					/>
					<Text lineHeight={false}>Purchased</Text>
				</View>
			);
		}
	};

	renderTotalPriceAndPurchase = () => {
		const { item: {
			isPurchased,
			quantityPurchased,
			quantityUnpurchased,
			unitPrice,
		}} = this.props;
		const quantity = isPurchased ? quantityPurchased : quantityUnpurchased;
		const itemSubTotal = unitPrice * quantity;
		return (
			<View style={componentStyles.secondRowWrapper}>
				<Text color="primary">
					{helpers.toUSD(itemSubTotal)}
				</Text>
				{this.renderPurchasedTag()}
			</View>
		);
	};

	renderProductDetails = () => {
		const { item } = this.props;
		const {
			estimatedArrival = 'Arriving Monday',
			isPurchased,
			orderNum = '123456',
			product = {},
			quantityPurchased,
			quantityUnpurchased,
			unitPrice,
		} = item;

		if (isPurchased) {
			return (
				<View style={styles.elements.flex1}>
					<Text weight="bold">
						{product.displayName}
					</Text>
					<Text
						color="primary"
						decoration="underline"
					>
						Order #{orderNum}
					</Text>
					<Text size="small">(Qty. {quantityPurchased}) {estimatedArrival}</Text>
					{this.renderTotalPriceAndPurchase()}
				</View>
			);
		}

		return (
			<View>
				<Text weight="bold">
					{product.displayName}
				</Text>
				<Text>Finish: {product.finish}</Text>
				<View style={styles.elements.flexRow}>
					<Text size="small">{helpers.toUSD(unitPrice)}{' '}</Text>
					<Text size="small">(Qty. {quantityUnpurchased}){' '}</Text>
					<Text
						size="small"
						color="greyDark"
					>
						{helpers.toBigNumber(product.stockCount)} In-stock
					</Text>
				</View>
				{this.renderTotalPriceAndPurchase()}
			</View>
		);
	};

	render() {
		const { item, bounceOnMount, actions } = this.props;
		const { product = {} } = item;
		const imageUri = helpers.getCloudinaryImageUrl({
			...IMAGE_42,
			section: PRODUCT_SECTION,
			manufacturer: product.manufacturer,
			name: product.image,
		});

		return (
			<Swipeable
				onRef={(ref) => (this.swipeable = ref ? ref : this.swipeable)}
				rightButtons={this.getAllSwipeActions()}
				bounceOnMount={bounceOnMount}
				onRightActionRelease={() => actions.trackAction(TrackingActions.SHOPPING_LIST_ITEM_SWIPE)}
			>
				<View style={this.getStyle()}>
					<View style={componentStyles.imageWrapper}>
						<TouchableOpacity onPress={this.goToProduct}>
							<Image
								source={{ uri: imageUri }}
								height={IMAGE_42.height}
								width={IMAGE_42.width}
								style={componentStyles.image}
							/>
						</TouchableOpacity>
						{this.renderProductDetails()}
					</View>
					<View style={componentStyles.pricedOptions}>
						<PricedOptions options={item.pricedOptions}/>
					</View>
				</View>
			</Swipeable>
		);
	}
}

ShoppingListItem.propTypes = {
	actions: PropTypes.object,
	bounceOnMount: PropTypes.bool,
	item: PropTypes.object,
	isSubItem: PropTypes.bool,
	navigation: PropTypes.shape({
		getNavigator: PropTypes.func,
		getNavigatorByUID: PropTypes.func,
		performAction: PropTypes.func,
	}),
	onUpdateItem: PropTypes.func,
	projectId: PropTypes.number.isRequired,
	sessionCartId: PropTypes.number.isRequired,
	style: ViewPropTypes.style,
};

ShoppingListItem.defaultProps = {
	bounceOnMount: false,
	item: {},
	isSubItem: false,
	onUpdateItem: helpers.noop,
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			addItemsToCartFromProject,
			removeItemFromShoppingList,
			showAlert,
			trackAction,
		}, dispatch),
	};
};

export default withNavigation(connect(null, mapDispatchToProps)(ShoppingListItem));
