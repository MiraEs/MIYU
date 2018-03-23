import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	Animated,
	InteractionManager,
	StyleSheet,
	View,
} from 'react-native';
import {
	Button,
	Image,
	QuantitySelector,
	ScrollView,
	Text,
	TouchableOpacity,
	withScreen,
} from 'BuildLibrary';
import { NavigationStyles } from '@expo/ex-navigation';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import helpers from '../../../lib/helpers';
import styles from '../../../lib/styles';
import KeyboardSpacer from '../../../components/Library/View/KeyboardSpacer';
import NavigationBarTextButton from '../../../components/navigationBar/NavigationBarTextButton';
import Icon from 'react-native-vector-icons/Ionicons';
import {
	PRODUCT_SECTION,
	IMAGE_75,
} from '../../../constants/CloudinaryConstants';
import StarRating from 'react-native-star-rating';
import ExpandCollapseContainer from '../../../components/ExpandCollapseContainer';
import AddToCartButton from '../../../components/AddToCartButton';
import {
	addItemsToCartFromProject,
	addItemToShoppingList,
	getProjects,
	getShoppingLists,
} from '../../../actions/ProjectActions';
import { showAlert } from '../../../actions/AlertActions';
import { HOME } from '../../../constants/constants';
import trackingActions from '../../../lib/analytics/TrackingActions';
import { trackAction } from '../../../actions/AnalyticsActions';

const componentStyles = StyleSheet.create({
	image: {
		marginRight: styles.measurements.gridSpace1,
	},
	bulletText: {
		marginLeft: styles.measurements.gridSpace1,
	},
	configWrapper: {
		marginBottom: styles.measurements.gridSpace1,
		marginLeft: styles.measurements.gridSpace2,
	},
	quantitySelector: {
		borderColor: styles.colors.white,
		borderRightWidth: styles.dimensions.borderWidth,
	},
	headerWrapper: {
		borderLeftWidth: 0,
		borderRightWidth: 0,
	},
	expandCollapse: {
		backgroundColor: styles.colors.white,
	},
	productDetails: {
		paddingHorizontal: styles.measurements.gridSpace1,
	},
	productDetailWrapper: {
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: styles.measurements.gridSpace1,
	},
	productNameRow: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	productNameIcon: {
		marginLeft: styles.measurements.gridSpace1,
	},
	productPrice: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginTop: styles.measurements.gridSpace1,
	},
	productDescription: {
		marginTop: styles.measurements.gridSpace2,
		marginBottom: styles.measurements.gridSpace1,
	},
	addToProject: {
		margin: styles.measurements.gridSpace1,
	},
});

export class ProductEditScreen extends Component {

	constructor(props) {
		super(props);
		this.state = {
			addToCartEnabled: true,
			quantity: props.item.quantityUnpurchased,
			quantitySelectorWidth: new Animated.Value(44),
		};

		this.addToCartButton = {
			reset: helpers.noop,
			queueChange: helpers.noop,
		};
		this.quantitySelector = {
			onHideSelectors: helpers.noop,
		};
	}

	componentDidMount() {
		InteractionManager.runAfterInteractions(() => {
			this.props.navigator.updateCurrentRouteParams({
				onCancel: this.onPressCancel,
				onSave: this.onPressSave,
			});
		});
	}

	setScreenTrackingInformation() {
		return {
			name: 'build:app:more:projects:productedit',
		};
	}

	animateQuantitySelector = (visible) => {
		Animated.timing(this.state.quantitySelectorWidth, {
			toValue: visible ? 132 : 44,
			duration: 200,
		}).start();
	};

	goToProduct = () => {
		const { item: { product }} = this.props;
		this.props.navigator.pop();
		this.props.navigation.getNavigator(HOME).push('productDetail', {
			compositeId: product.productCompositeId,
			uniqueId: product.uniqueId,
			manufacturer: product.manufacturer,
			sku: product.sku,
			finish: product.finish,
		});
		this.props.navigation.performAction(({ tabs }) => tabs('main').jumpToTab(HOME));
	};

	onPressCancel = () => {
		this.props.onUpdateItem();
		this.props.navigator.pop();
	};

	onPressCopyToProject = () => {
		const { quantity } = this.state;
		const {
			item: {
				pricedOptions: selectedPricedOptions,
				product: {
					uniqueId,
				} = {},
			} = {},
		} = this.props;
		this.props.navigator.push('addToProjectModal', {
			itemToAdd: {
				quantity,
			},
			itemToAddConfiguration: {
				uniqueId,
				selectedPricedOptions,
			},
			title: 'Copy To Project',
		});
	};

	onPressSave = () => {
		const {
			actions,
			item: {
				pricedOptions,
				product: {
					uniqueId: productUniqueId,
				} = {},
				quantityUnpurchased,
			} = {},
			onUpdateItem,
			sessionCartId,
		} = this.props;
		const quantity = this.state.quantity - quantityUnpurchased;

		actions.addItemToShoppingList({
			sessionCartItems: [{
				pricedOptions,
				productUniqueId,
				quantity,
			}],
			sessionCartId,
		})
			.then(() => {
				return Promise.all([
					actions.getProjects(),
					actions.getShoppingLists(),
				]);
			})
			.then(() => {
				onUpdateItem();
				this.props.navigator.pop();
			})
			.catch(() => actions.showAlert('Unable to save changes. Try again.', 'error'))
			.done();
	};

	onPressAddToCart = () => {
		const {
			item,
			actions,
			projectId,
		} = this.props;
		this.addToCartButton.queueChange({ text: 'Adding...' });
		actions.trackAction(trackingActions.SHOPPING_LIST_ITEM_ADD_TO_CART_TAP, {
			screen: 'Shopping List Item Edit',
			productId: item.product.productId,
			manufacturer: item.product.manufacturer,
			uniqueId: item.product.uniqueId,
			compositeId: item.product.productCompositeId,
			finish: item.product.finish,
		});
		actions.addItemsToCartFromProject(projectId, [{
			...item,
			quantityUnpurchased: this.state.quantity,
		}])
			.then(() => {
				this.addToCartButton.queueChange({
					text: 'Added To Cart',
					itemAdded: true,
				}, () => {
					this.resetAddToCartButton();
				});
			})
			.catch(() => this.addToCartButton.queueChange({ text: 'Unable To Add' }, this.resetAddToCartButton))
			.done(() => {
				this.quantitySelector.onHideSelectors();
				this.animateQuantitySelector(false);
			});
	};

	onUpdateQuantity = (quantity) => {
		this.setState({ quantity });
	};

	resetAddToCartButton = () => {
		this.addToCartButton.reset(() => {
			this.setState({
				addToCartEnabled: true,
			});
		});
	};

	renderAddToCart = () => {
		const { item } = this.props;
		const {
			addToCartEnabled,
			quantity,
		} = this.state;

		return (
			<View style={styles.elements.flexRow}>
				<Animated.View
					style={{
						width: this.state.quantitySelectorWidth,
					}}
				>
					<QuantitySelector
						ref={(ref) => {
							if (ref) {
								this.quantitySelector = ref;
							}
						}}
						allowZero={false}
						disableDelete={true}
						maxQuantity={item.product.stockCount}
						onUpdateQuantity={this.onUpdateQuantity}
						onToggleSelectors={this.animateQuantitySelector}
						quantity={quantity}
						style={componentStyles.quantitySelector}
						theme="primary"
					/>
				</Animated.View>
				<AddToCartButton
					ref={(ref) => {
						if (ref) {
							this.addToCartButton = ref;
						}
					}}
					disabled={!addToCartEnabled}
					onPress={this.onPressAddToCart}
					style={styles.elements.flex1}
					text="Add To Cart"
				/>
			</View>
		);
	};

	renderConfiguration = () => {
		const {
			pricedOptions = [],
			product = {},
		} = this.props.item;
		const options = [
			`Color/Finish: ${product.finish}`,
			...pricedOptions.map(({ optionName = '', optionValue = ''}) => `${optionName}: ${optionValue}`),
		];
		return (
			<ExpandCollapseContainer
				header={(
					<Text
						size="large"
						weight="bold"
					>
						Configuration
					</Text>
				)}
				headerWrapperStyle={componentStyles.headerWrapper}
				isVisible={true}
				style={componentStyles.expandCollapse}
			>
				<View style={componentStyles.configWrapper}>
					{options.map((item, index) => {
						return (
							<View
								key={index}
								style={styles.elements.flexRow}
							>
								<Text>{String.fromCharCode('8226')}</Text><Text style={componentStyles.bulletText}>{item}</Text>
							</View>
						);
					})}
				</View>
			</ExpandCollapseContainer>
		);
	};

	renderProductDetails = () => {
		const {
			item,
			item: {
				isPurchased,
				product = {},
				quantityPurchased,
				unitPrice,
			},
			reviewRating: {
				avgRating,
				numReviews,
			} = {},
		} = this.props;
		const quantity = isPurchased ? quantityPurchased : this.state.quantity;
		const imageUri = helpers.getCloudinaryImageUrl({
			...IMAGE_75,
			section: PRODUCT_SECTION,
			manufacturer: product.manufacturer,
			name: product.image,
		});

		return (
			<View style={componentStyles.productDetails}>
				<TouchableOpacity
					onPress={this.goToProduct}
					trackAction={trackingActions.EDIT_ITEM_NAV_TO_PRODUCT}
					trackContextData={item}
				>
					<View style={componentStyles.productDetailWrapper}>
						<Image
							source={{ uri: imageUri }}
							height={IMAGE_75.height}
							width={IMAGE_75.width}
							style={componentStyles.image}
						/>
						<View style={styles.elements.flex1}>
							<View style={componentStyles.productNameRow}>
								<Text
									color="primary"
									size="large"
									weight="bold"
								>
									{product.displayName}
								</Text>
								<Icon
									name="ios-arrow-forward"
									size={25}
									color={styles.colors.primary}
									style={componentStyles.productNameIcon}
								/>
							</View>
							<Text numberOfLines={3}>{product.productTitle}</Text>
						</View>
					</View>
				</TouchableOpacity>
				<View style={componentStyles.productPrice}>
					<Text
						color="primary"
						weight="bold"
					>
						{helpers.toUSD(quantity * unitPrice)}
					</Text>
					<Text color="greyDark">{helpers.toUSD(unitPrice)} ea.</Text>
					<View style={[styles.elements.flexRow, styles.elements.centerItem]}>
						<StarRating
							disabled={true}
							maxStars={5}
							emptyStar="ios-star-outline"
							fullStar="ios-star"
							halfStar="ios-star-half"
							iconSet="Ionicons"
							rating={avgRating}
							selectedStar={helpers.noop}
							starColor={styles.colors.accent}
							starSize={14}
						/>
					<Text size="small">
							({numReviews})
						</Text>
					</View>
				</View>
				<Text style={componentStyles.productDescription}>
					{item.leadTimeText}. {product.stockCount} In-Stock.{' '}
					{product.freeShipping === 'Y' ? 'Ships FREE!' : ''}
				</Text>
			</View>
		);
	};

	renderSecondaryActions = () => {
		const {
			item: {
				quantity,
				product: {
					cost,
					finish,
					sku,
					uniqueId,
					manufacturer,
					productId,
				},
			} = {},
		} = this.props;
		const contextData = {
			manufacturer,
			productId,
			finish,
			sku,
			uniqueId,
			cost,
			quantity,
		};

		return (
			<Button
				accessibilityLabel="Copy to Project"
				color="white"
				onPress={this.onPressCopyToProject}
				text="Copy to Project"
				textColor="secondary"
				trackAction={trackingActions.EDIT_ITEM_COPY_TO_PROJECT}
				trackContextData={contextData}
				style={componentStyles.addToProject}
			/>
		);
	};

	render() {
		return (
			<View style={styles.elements.screen}>
				<ScrollView
					keyboardShouldPersistTaps="always"
					style={{
					}}
				>
					{this.renderProductDetails()}
					{this.renderConfiguration()}
					{this.renderSecondaryActions()}
				</ScrollView>
				{this.renderAddToCart()}
				<KeyboardSpacer topSpacing={48}/>
			</View>
		);
	}

}

ProductEditScreen.route = {
	styles: {
		...NavigationStyles.SlideVertical,
		gestures: null,
	},
	navigationBar: {
		visible: true,
		title: 'Edit Item',
		renderLeft(route) {
			return (
				<NavigationBarTextButton onPress={route.params.onCancel}>
					Cancel
				</NavigationBarTextButton>
			);
		},
		renderRight(route) {
			return (
				<NavigationBarTextButton onPress={route.params.onSave}>
					Save
				</NavigationBarTextButton>
			);
		},
	},
};

ProductEditScreen.propTypes = {
	actions: PropTypes.object,
	item: PropTypes.object.isRequired,
	navigation: PropTypes.shape({
		getNavigator: PropTypes.func,
		performAction: PropTypes.func,
	}),
	navigator: PropTypes.shape({
		pop: PropTypes.func,
		push: PropTypes.func,
		updateCurrentRouteParams: PropTypes.func,
	}),
	onUpdateItem: PropTypes.func,
	projectId: PropTypes.number.isRequired,
	reviewRating: PropTypes.shape({
		avgRating: PropTypes.number,
		numReviews: PropTypes.number,
	}),
	sessionCartId: PropTypes.number.isRequired,
};

ProductEditScreen.defaultProps = {
	item: {},
	onUpdateItem: helpers.noop,
};

export const mapStateToProps = ({ projectsReducer = {} }, { item = {} }) => {
	const { aggregateData = {} } = projectsReducer;
	const { product = {} } = item;
	const productData = aggregateData[product.uniqueId] || {};
	const { reviewRating = {
		avgRating: 0,
		numReviews: 0,
	} } = productData;
	return {
		reviewRating,
	};
};

export const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			addItemsToCartFromProject,
			addItemToShoppingList,
			getProjects,
			getShoppingLists,
			showAlert,
			trackAction,
		}, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(withScreen(ProductEditScreen));
