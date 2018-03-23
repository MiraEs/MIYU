import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	Alert,
	Keyboard,
	StyleSheet,
	View,
	findNodeHandle,
	NativeModules,
	InteractionManager,
} from 'react-native';
import {
	CONSUMER_PRICEBOOK_ID,
} from '../constants/productDetailConstants';
const { UIManager } = NativeModules;
import {
	Button,
	KeyboardSpacer,
	Text,
	QuantitySelector,
} from 'BuildLibrary';
import Form from '../components/Form';
import uuid from 'uuid';
import ShopTheCollection from '../components/productDetail/ShopTheCollection';
import NavigationBarTitle from '../components/navigationBar/NavigationBarTitle';
import EventEmitter from '../lib/eventEmitter';
import styles from '../lib/styles';
import helpers from '../lib/helpers';
import TappableListItem from '../components/TappableListItem';
import ProductShortDescription from '../components/productDetail/ProductShortDescription';
import LoadingView from '../components/LoadingView';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ImageGallery from './ImageGallery';
import InlineAlert from '../components/InlineAlert';
import NavigationBarProductShareButton from '../components/navigationBar/NavigationBarProductShareButton';
import FavoriteButton from '../components/FavoriteButton';
import productsActions, { AVAILABILITY } from '../actions/ProductsActions';
import productConfigurationsActions from '../actions/ProductConfigurationsActions';
import {
	setAvailability,
	updateSquareFootage,
	getAvailability,
	saveLastViewedProductCompositeId,
} from '../actions/ProductDetailActions';
import {
	PRODUCT_SECTION,
	IMAGE_300,
} from '../constants/CloudinaryConstants';
import {
	SQUARE_FOOTAGE_BASED,
	HAS_OPTION_GROUPS,
	AVAILABLE_BY_LOCATION,
} from '../constants/CartConstants';
import OptionSelectButton from '../components/OptionSelectButton';
import ProductSquareFootQuantity from '../components/productDetail/ProductSquareFootQuantity';
import ProductRestrictions from '../components/productDetail/ProductRestrictions';
import TrackingActions from '../lib/analytics/TrackingActions';
import {
	trackAction,
	trackState,
} from '../actions/AnalyticsActions';
import { View as AnimatableView } from 'react-native-animatable';
import AddToCartSelector from '../components/AddToCartSelector';
import ZipChecker from '../components/productDetail/ZipChecker';
import SalesBox from '../components/productDetail/SalesBox';
import ManufacturerCallToAction from '../components/productDetail/ManufacturerCallToAction';
import RebateBox from '../components/productDetail/RebateBox';
import CollapsibleContainer from '../components/CollapsibleContainer';
import scrollableHelpers from '../lib/ScrollableHelpers';
import { historyUpsert } from '../actions/HistoryActions';
import productHelpers from '../lib/productHelpers';
import ProductPrice from '../components/productDetail/ProductPrice';
import { inputFocused } from '../lib/InputAnimations';
import {
	HOME,
	MAIN,
	LISTS,
} from '../constants/constants';
import VariationButton from '../components/productDetail/VariationButton';
import RatingsButton from '../components/productDetail/RatingsButton';
import StockCount from '../components/productDetail/StockCount';
import ProductQAndAButton from '../components/productDetail/ProductQAndAButton';
import ManufacturerResourcesButton from '../components/productDetail/ManufacturerResourcesButton';
import AddToProjectButton from '../components/AddToProjectButton';
import { showAlert } from '../actions/AlertActions';
import { itemAddedToProject } from '../actions/ProjectActions';
import ProductPricedOptionButtons from '../components/productDetail/ProductPricedOptionButtons';
import PhoneHelper from '../lib/PhoneHelper';
import ArIcon from '../components/ArIcon';
import router from '../router';


const componentStyles = StyleSheet.create({
	whiteBackground: {
		backgroundColor: styles.colors.white,
	},
	pad: {
		padding: styles.measurements.gridSpace2,
	},
	padBottom: {
		paddingBottom: styles.measurements.gridSpace2,
		marginBottom: styles.measurements.gridSpace2,
	},
	row: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	shippingMessage: {
		marginVertical: styles.measurements.gridSpace3,
		marginHorizontal: styles.measurements.gridSpace1,
	},
	center: {
		alignItems: 'center',
	},
	screen: {
		backgroundColor: styles.colors.greyLight,
	},
	favoriteButton: {
		position: 'absolute',
		top: styles.measurements.gridSpace1,
		right: styles.measurements.gridSpace1,
	},
	addToCartQuantityWrap: {
		width: 140,
	},
	addedCartItemMessage: {
		width: 40,
		textAlign: 'center',
		fontFamily: styles.fonts.mainBold,
		fontWeight: 'bold',
		fontSize: 14,
	},
	reviewText: {
		fontFamily: styles.fonts.mainRegular,
		fontSize: styles.fontSize.regular,
		color: styles.colors.secondary,
	},
	spaceBetween: {
		justifyContent: 'space-between',
	},
	scrollWrap: {
		flex: 1,
		flexDirection: 'column',
		alignItems: 'stretch',
	},
	shopTheCollection: {
		marginTop: styles.measurements.gridSpace1,
	},
	footer: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		backgroundColor: styles.colors.lightGray,
	},
	addToCartButton: {
		flex: 1,
		marginHorizontal: styles.measurements.gridSpace1,
		marginTop: styles.measurements.gridSpace1,
	},
	largeQuantitySelector: {
		marginVertical: styles.measurements.gridSpace1,
	},
	stock: {
		marginHorizontal: styles.measurements.gridSpace1,
		marginTop: styles.measurements.gridSpace2,
	},
	productPriceContainer: {
		flexDirection: 'row',
	},
	quantityWrapSelectorsShown: {
		width: 132,
	},
	quantityWrapSelectorsHidden: {
		width: 44,
		marginRight: 1,
	},
	shareButton: {
		marginBottom: styles.measurements.gridSpace1,
	},
	finishText: {
		marginHorizontal: styles.measurements.gridSpace1,
		marginVertical: styles.measurements.gridSpace2,
	},
	inlineAlert: {
		margin: styles.measurements.gridSpace1,
	},
	horizontalMargin: {
		marginHorizontal: styles.measurements.gridSpace1,
	},
	zipCodeChecker: {
		paddingTop: styles.measurements.gridSpace3,
	},
	arIcon: {
		position: 'absolute',
		left: styles.measurements.gridSpace1,
		top: styles.measurements.gridSpace1,
	},
});

export class ProductDetailScreen extends Component {

	constructor(props) {
		super(props);
		let quantity = 1;
		const { option } = props;
		if (option) {
			if (option.requirement === HAS_OPTION_GROUPS) {
				quantity = option.quantity;
				this.onLayout = () => this.arePricedOptionsValid(option.requiredSelectedOptions);
			} else if (option.requirement === SQUARE_FOOTAGE_BASED) {
				quantity = 0;
				this.onLayout = () => this.squareFootQuantity.focusInput();
			} else if (option.requirement === AVAILABLE_BY_LOCATION) {
				InteractionManager.runAfterInteractions(() => {
					if (this.zipChecker) {
						this.zipChecker.getWrappedInstance().focus();
					}
				});
			}
		}
		this.state = {
			showQuantitySelectorView: true,
			isAddToCartEnabled: true,
			invalidOptionNames: [],
			zipCode: '',
			quantity,
		};
		this.isRefresh = false;
		this.isLoadingData = false;
		this.productConfigurationId = props.productConfigurationId || uuid.v4();
		if (helpers.isAndroid()) {
			UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
		}
		this.getProductCompositeData = this.getProductCompositeData.bind(this);
	}

	componentDidMount() {
		const {
			actions,
			compositeId,
			finish,
			hasProduct,
			manufacturer,
			sku,
			uniqueId,
		} = this.props;
		this.updateCurrentRouteParamsWithNextProps({
			productConfigurationId: this.productConfigurationId,
		});
		// if a user is revisiting the same product page they already did we will
		// already have the product
		if (hasProduct) {
			//  initialize the product configuration
			actions.createProductConfiguration({
				compositeId,
				uniqueId,
				productConfigurationId: this.productConfigurationId,
			});
		}
		if (compositeId) {
			actions.saveLastViewedProductCompositeId(compositeId);
		}
		actions.trackState(`build:app:product:${manufacturer}:${sku}:${finish}:${uniqueId}`, {
			'&&events': 'prodView',
			'&&products': `;${uniqueId}`,
			'purchase.currencycode': 'USD',
		});

		this.isLoadingData = true;
		InteractionManager.runAfterInteractions(() => this.getProductCompositeData());
		if (compositeId) {
			this.updateCurrentRouteParamsWithNextProps(this.props);
		}
		const FOUR_HOURS = 1000 * 60 * 60 * 4;
		this.getProductCompositeDataInterval = setInterval(() => {
			this.isLoadingData = true;
			this.getProductCompositeData(false);
		}, FOUR_HOURS);
	}

	componentWillReceiveProps(nextProps) {
		const {
			actions,
			compositeId,
			manufacturer,
			hasProduct,
			productId,
			title,
			uniqueId,
			itemAddedToProject,
		} = nextProps;
		const {
			selectedFinish,
			selectedPricedOptions,
		} = this.getProductConfiguration(nextProps);

		this.handleMaybeChangedTitle(nextProps);
		this.handleMaybeChangeSubTitle(nextProps);

		if (this.props.itemAddedToProject && !this.props.itemAddedToProject.added && itemAddedToProject && itemAddedToProject.added) {
			const { projectId } = itemAddedToProject;
			const button = {
				text: projectId ? 'Go to Project' : 'Go to Projects',
				onPress: () => {
					if (projectId) {
						this.props.navigation.getNavigatorByUID(MAIN).jumpToTab(LISTS);
						requestAnimationFrame(() => this.props.navigation.performAction(({ stacks }) => {
							stacks(LISTS).push(router.getRoute('projectDetails', { projectId }));
						}));
					} else {
						this.props.navigation.performAction(({ tabs }) => tabs(MAIN).jumpToTab(LISTS));
					}
					this.props.navigation.getNavigator('root').popToTop();
				},
			};
			const msg = projectId ? 'Item Added To Project!' : 'Item Added To Projects!';
			this.props.actions.showAlert(msg, 'success', button, () => {
				this.props.actions.itemAddedToProject({
					added: false,
					projectId: null,
				});
			});
		}

		// if we just got the compositeId
		if (!this.props.compositeId && compositeId) {
			actions.saveLastViewedProductCompositeId(compositeId);
		}
		if (!hasProduct && !this.isLoadingData) {
			this.isLoadingData = true;
			this.getProductCompositeData(false);
		}
		// when we get the product
		if (!this.props.hasProduct && hasProduct) {
			//  initialize the product configuration
			actions.createProductConfiguration({
				compositeId,
				uniqueId,
				productConfigurationId: this.productConfigurationId,
			});
		}
		// if we just got the selected finish
		if (hasProduct && !this.getProductConfiguration().selectedFinish && selectedFinish) {
			// add the product to the user's history
			actions.historyUpsert({
				compositeId,
				data: {
					manufacturer,
					productId,
					title,
					selectedFinish,
					selectedPricedOptions,
				},
			});
			if (!selectedFinish.isLowLeadCompliant) {
				setTimeout(this.showLowLeadMessage, 500);
			}
			// We update route params here so that the share button in the header
			// has access to all the needed information about the product
			this.updateCurrentRouteParamsWithNextProps({
				uniqueId: selectedFinish.uniqueId,
			});
		}
		// if there was previously a compositeId and it has changed
		// this happens when users hit Continue on the variations screen
		if (this.props.compositeId && this.props.compositeId !== compositeId) {
			actions.historyUpsert({
				compositeId,
				data: {
					manufacturer,
					productId,
					title,
					selectedFinish,
					selectedPricedOptions,
				},
			});
		}
		// If we route from a product page URL that only has a uniqueId we need to
		// update the current route params so that we can set the share button to
		// not loading
		if (!this.props.compositeId && compositeId) {
			this.updateCurrentRouteParamsWithNextProps(nextProps);
		}
	}

	componentWillUnmount() {
		if (this.getProductCompositeDataInterval) {
			clearInterval(this.getProductCompositeDataInterval);
		}
	}

	handleMaybeChangedTitle = (nextProps) => {
		if (!this.props.navBarTitle && nextProps.navBarTitle) {
			this.updateCurrentRouteParamsWithNextProps({
				navBarTitle: nextProps.navBarTitle,
			});
		}
	};

	handleMaybeChangeSubTitle = (nextProps) => {
		const { selectedFinish: previousSelectedFinish } = this.getProductConfiguration(this.props);
		const { selectedFinish: nextSelectedFinish } = this.getProductConfiguration(nextProps);
		if (!previousSelectedFinish && nextSelectedFinish && nextSelectedFinish.uniqueId) {
			this.updateCurrentRouteParamsWithNextProps({
				navBarSubTitle: `Item # bci${nextSelectedFinish.uniqueId}`,
			});
		}
	};

	onQuantityInputFocus = () => {
		if (this.addToCartSelector && this.form) {
			const scrollResponder = this.form.getScrollView().getScrollResponder();
			scrollableHelpers.scrollRefToKeyboard(scrollResponder, this.addToCartSelector, {
				offset: 280,
			});
		}
	};

	getProductConfiguration = (props = this.props) => {
		return props.productConfigurations[this.productConfigurationId] || {};
	};

	updateCurrentRouteParamsWithNextProps = (nextProps) => {
		InteractionManager.runAfterInteractions(() => {
			this.props.navigator.updateCurrentRouteParams(nextProps);
		});
	};

	async getProductCompositeData(shouldTrack = true) {
		const { actions, compositeId, uniqueId } = this.props;
		try {
			await actions.getProductComposite({
				isRefresh: this.isRefresh,
				compositeId,
				uniqueId,
			});
			this.isRefresh = true;
			if (shouldTrack) {
				this.trackProductViewed();
			}
			this.isLoadingData = false;
		} catch (error) {
			this.isLoadingData = false;
		}
	}

	trackProductViewed = () => {
		const {
			compositeId,
			manufacturer,
			productId,
			rootCategory: { categoryName, categoryId },
			uniqueId,
			isArProduct,
		} = this.props;
		const { selectedFinish: { finish, sku } } = this.getProductConfiguration();
		this.props.actions.trackAction(TrackingActions.PRODUCT_VIEWED, {
			compositeId,
			categoryName,
			categoryId,
			finish,
			manufacturer,
			productId,
			sku,
			uniqueId,
			isArProduct,
		});
	};

	onChangeProductConfigurationId = (productConfigurationId) => {
		if (productConfigurationId && productConfigurationId !== this.productConfigurationId) {
			this.productConfigurationId = productConfigurationId;
			this.props.navigator.updateCurrentRouteParams({
				productConfigurationId,
			});
		}
	};

	onSquareFootageChange = (squareFootage) => {
		const {
			compositeId,
			actions,
		} = this.props;
		actions.updateSquareFootage({
			compositeId,
			squareFootage: helpers.toFloat(squareFootage),
			productConfigurationId: this.productConfigurationId,
		});
	};

	onFinishButtonPress = () => {
		const { compositeId } = this.props;
		Keyboard.dismiss();
		this.props.navigation.getNavigator('root').push('productCustomizationScreen', {
			optionName: 'Finish',
			helpText: 'A Finish is the color/style of a product',
			title: 'Select a Finish',
			productConfigurationId: this.productConfigurationId,
			compositeId,
		});
	};

	onShortDescriptionPress = () => {
		const {
			navigation,
			compositeId,
		} = this.props;
		navigation.getNavigator('root').push('productDescription', {
			compositeId,
		});
	};

	onVideosPress = () => {
		Keyboard.dismiss();
		this.props.navigation.getNavigator('root').push('productVideos', {
			videos: this.props.productVideos,
		});
	};

	onReviewPress = () => {
		const { compositeId } = this.props;
		Keyboard.dismiss();
		this.props.navigation.getNavigator('root').push('productReviews', {
			compositeId,
		});
	};

	onProductSpecificationsPress = () => {
		const { compositeId } = this.props;
		Keyboard.dismiss();
		this.props.navigation.getNavigator('root').push('productSpecifications', {
			compositeId,
		});
	};

	onCollectionPress = () => {
		const { series, manufacturer } = this.props;
		const keyword = `${manufacturer} ${series}`;
		Keyboard.dismiss();
		const routeProps = {
			searchCriteria: {
				keyword,
				page: 1,
				pageSize: 50,
			},
			tracking: {
				name: 'build:app:pdp:collection',
				data: {
					keyword,
				},
			},
		};
		if (this.props.navigator.navigatorId !== HOME) {
			const homeNav = this.props.navigation.getNavigator(HOME);
			homeNav.popToTop();
			homeNav.push('productDrops', routeProps);
			this.props.navigation.performAction(({ tabs }) => tabs(MAIN).jumpToTab(HOME));
		} else {
			this.props.navigator.push('productDrops', routeProps);
		}
	};

	onUpdateQuantity = (quantity) => {
		if (this.zipChecker) {
			this.zipChecker.getWrappedInstance().clearAvailability();
		}
		this.setState({
			quantity,
		});
	};

	getAddToCartTrackData = () => {
		const { squareFootage, squareFootageBased, squareFootagePerCarton } = this.props;
		const { selectedFinish } = this.getProductConfiguration();
		let finalQuantity = this.state.quantity;
		if (squareFootageBased) {
			finalQuantity = helpers.toInteger(squareFootage / squareFootagePerCarton) + 1;
		}
		return {
			uniqueId: selectedFinish.uniqueId,
			quantity: finalQuantity,
			totalCost: finalQuantity * selectedFinish.pricebookCostView.cost,
		};
	};

	showLowLeadMessage = () => {
		Alert.alert('Federal Law prohibits the sale of this product.', 'All faucets sold within the United States must be low lead compliant. This product is not.');
	};

	scrollToComponent = (component, callback = helpers.noop) => {
		UIManager.measureLayoutRelativeToParent(
			component,
			helpers.noop,
			(x, y) => {
				this.form.getScrollView().scrollTo({ y: y / 2 + 44 });
				callback();
			},
		);
	};

	arePricedOptionsValid = (requiredSelectedOptions) => {
		const { pricedOptionGroups } = this.props;
		const invalidOptionNames = pricedOptionGroups.filter((option) => !requiredSelectedOptions.includes(option.optionName)).map((option) => option.optionName);
		if (!invalidOptionNames.length || !this.pricedOptionsButton) {
			// don't try to bounce the button if there are no invalid options
			// or if we don't have a reference to the button
			return;
		}
		Keyboard.dismiss();
		const optionComponent = findNodeHandle(this.pricedOptionsButton);
		this.scrollToComponent(optionComponent, () => {
			this.pricedOptionsButton.bounce();
		});
	};

	validateAvailability = () => {
		const { availability, geCheckout, availableByLocation } = this.props;
		if (geCheckout && availableByLocation) {
			if (availability.isAvailableInZip && availability.status === AVAILABILITY.IN_STOCK || availability.status === AVAILABILITY.BACKORDERED) {
				return true;
			}
			const component = findNodeHandle(this.zipChecker);
			this.scrollToComponent(component, this.zipChecker.getWrappedInstance().bounce);
			return false;
		}
		return true;
	};

	addOptionPrices = () => {
		const { pricedOptionGroups } = this.props;
		const { selectedPricedOptions } = this.getProductConfiguration();
		const prices = selectedPricedOptions.map((selectedPricedOptionGroup) => {
			const pricedOptionGroup = pricedOptionGroups.find((pricedOptionGroup) => pricedOptionGroup.optionName === selectedPricedOptionGroup.optionName),
				optionPrices = selectedPricedOptionGroup.pricedOptions.map((selectedPricedOption) => {
					const pricedOption = pricedOptionGroup.pricedOptions.find((pricedOption) => selectedPricedOption.pricedOptionId === pricedOption.pricedOptionId) || {};
					return pricedOption.cost && Number.isNaN(Number(pricedOption.cost)) ? 0 : Number(pricedOption.cost);
				});
			return optionPrices.reduce((previous, current) => Number(previous) + Number(current), 0);
		});
		return prices.reduce((previous, current) => Number(previous) + Number(current), 0);
	};

	getAddToProjectTrackingContextData = () => {
		const { manufacturer, productId, rootCategory } = this.props;
		const { selectedFinish } = this.getProductConfiguration();
		const { finish, sku, uniqueId, pricebookCostView: { cost } } = selectedFinish;
		return {
			manufacturer,
			productId,
			finish,
			sku,
			uniqueId,
			cost,
			quantity: this.state.quantity,
			categoryId: rootCategory.categoryId,
			categoryName: rootCategory.categoryName,
		};
	};

	renderZipCodeChecker = () => {
		const {
			compositeId,
			geCheckout,
			availableByLocation,
		} = this.props;
		const { selectedFinish } = this.getProductConfiguration();
		if (geCheckout && availableByLocation) {
			const scrollView = this.form ? this.form.getScrollView() : null;
			return (
				<ZipChecker
					ref={(ref) => {
						if (ref) {
							this.zipChecker = ref;
						}
					}}
					onFocus={() => inputFocused(this.zipChecker, scrollView, 145)}
					compositeId={compositeId}
					selectedFinish={selectedFinish}
					quantity={this.state.quantity}
				/>
			);
		}
	};

	renderSquareFootQuantity = () => {
		const {
			squareFootage,
			squareFootageBased,
			squareFootagePerCarton,
		} = this.props;
		const { selectedFinish } = this.getProductConfiguration();
		if (squareFootageBased) {
			return (
				<ProductSquareFootQuantity
					onSquareFootageChange={this.onSquareFootageChange}
					onCartonCountChange={this.onUpdateQuantity}
					squareFootage={squareFootage}
					squareFootagePerCarton={squareFootagePerCarton}
					costPerSquareFoot={selectedFinish.pricebookCostView.cost}
					ref={(ref) => this.squareFootQuantity = ref}
					stockCount={selectedFinish.stockCount}
				/>
			);
		}
	};

	renderProductSpecs = () => {
		const { productSpecs } = this.props;
		if (productSpecs && productSpecs.length > 0) {
			return (
				<TappableListItem
					onPress={this.onProductSpecificationsPress}
					body="Product Specifications"
					accessibilityLabel="Product Specs Button"
				/>
			);
		}
	};

	renderFinishOption = () => {
		const { squareFootageBased,
			discontinued,
			finishes,
			variations,
		} = this.props;
		const { selectedFinish } = this.getProductConfiguration();
		const hasVariations = Array.isArray(variations) && variations.length > 0;
		if (discontinued || hasVariations) {
			return null;
		}
		if (squareFootageBased || (finishes && finishes.length < 2)) {
			return (
				<Text style={componentStyles.finishText}>Finish: <Text
					style={styles.text.bold}
				>
					{selectedFinish.finish}
				</Text></Text>
			);
		}
		return (
			<OptionSelectButton
				onPress={this.onFinishButtonPress}
				boldText={!!selectedFinish.finish ? selectedFinish.finish : 'Choose Finish'}
				text={!!selectedFinish.finish ? 'Finish: ' : ''}
				isConfigured={!!selectedFinish.finish}
				style={componentStyles.horizontalMargin}
				accessibilityLabel="Finish Select"
			/>
		);
	};

	renderCollapsibleSalesContainer = () => {
		const salesBox = this.renderSalesBox();
		const mCta = this.renderManufacturerCallToAction();
		const children = [];
		if (salesBox) {
			children.push(salesBox);
		}
		if (mCta) {
			children.push(mCta);
		}
		return children;
	};

	renderDiscontinuedAlert = () => {
		const { discontinued, manufacturer } = this.props;
		const { selectedFinish } = this.getProductConfiguration();
		if (discontinued) {
			return (
				<InlineAlert
					title="Product Discontinued"
					style={componentStyles.inlineAlert}
				>
					<Text
						color="error"
						textAlign="center"
					>
						The {manufacturer} {selectedFinish.sku} has been discontinued
					</Text>
					<Button
						onPress={this.onCollectionPress}
						style={componentStyles.shopTheCollection}
						text="Shop the Collection"
						accessibilityLabel="Shop Collection Button"
						trackAction={TrackingActions.PDP_SHOP_COLLECTION}
					/>
				</InlineAlert>
			);
		}
	};

	renderLargeQuantitySelector = () => {
		const {
			availableByLocation,
			type,
			geCheckout,
			squareFootageBased,
		} = this.props;

		const shouldShowQuantitySelector = geCheckout || !availableByLocation;
		const isPaintType = type && type.toLowerCase() === 'paint';

		if (!squareFootageBased && !isPaintType && shouldShowQuantitySelector) {
			return (
				<View>
					<View style={[componentStyles.addToCartButton, componentStyles.largeQuantitySelector]}>
						<QuantitySelector
							allowZero={false}
							onUpdateQuantity={this.onUpdateQuantity}
							disableDelete={true}
							quantity={this.state.quantity}
							onInputFocus={this.onQuantityInputFocus}
							theme="full"
						/>
					</View>
					<View style={styles.elements.inputGroupDivider} />
				</View>
			);
		}
	};

	renderAddToButtons = () => {
		const {
			discontinued,
			availableByLocation,
			type,
			geCheckout,
		} = this.props;
		const { selectedFinish } = this.getProductConfiguration();

		const shouldShowAddToCart = geCheckout || !availableByLocation;
		const isLowLeadCompliant = selectedFinish && selectedFinish.isLowLeadCompliant;
		const isPaintType = type && type.toLowerCase() === 'paint';

		if (!shouldShowAddToCart || isPaintType) {
			return this.renderCallToOrder();
		}

		if (isLowLeadCompliant && !discontinued) {
			return (
				<View>
					{this.renderAddToCartSelector()}
					{this.renderAddToProjectButton()}
				</View>
			);
		}
	};

	renderCallToOrder = () => {
		const { user } = this.props;
		const phone = PhoneHelper.getPhoneNumberByUserType(user);
		return (
			<View style={componentStyles.addToCartButton}>
				<Button
					text="Call to Order"
					color="primary"
					onPress={() => EventEmitter.emit('onCallUs', phone)}
					accessibilityLabel="Call To Order Button"
					trackAction={TrackingActions.PDP_CALL_TO_ORDER_ITEM}
					trackContextData={this.getAddToCartTrackData()}
				/>
			</View>
		);
	};

	renderAddToCartSelector = () => {
		return (
			<View style={componentStyles.addToCartButton}>
				<AddToCartSelector
					productConfigurationId={this.productConfigurationId}
					hideQuantitySelector={true}
					onSquareFootageBased={() => this.squareFootQuantity.focusInput()}
					onHasOptionGroups={this.arePricedOptionsValid}
					quantity={this.state.quantity}
					onUpdateQuantity={this.onUpdateQuantity}
					trackAction={TrackingActions.PDP_ADDITEM}
					validateAvailability={this.validateAvailability}
					onInputFocus={this.onQuantityInputFocus}
					ref={(ref) => {
						if (ref) {
							this.addToCartSelector = ref;
						}
					}}
				/>
			</View>
		);
	};

	renderAddToProjectButton = () => {
		if (this.props.shoppingLists) {
			return (
				<View style={componentStyles.addToCartButton}>
					<AddToProjectButton
						productConfigurationId={this.productConfigurationId}
						quantity={this.state.quantity}
						onHasOptionGroups={this.arePricedOptionsValid}
						onSquareFootageBased={() => this.squareFootQuantity.focusInput()}
						validateAvailability={this.validateAvailability}
					/>
				</View>
			);
		}
	};

	renderManufacturerCallToAction = () => {
		const {
			manufacturerInfo: { manufacturerCallToAction },
		} = this.props;

		if (manufacturerCallToAction) {
			return (
				<ManufacturerCallToAction
					key="mCta"
					manufacturerCallToAction={manufacturerCallToAction}
				/>
			);
		}
	};

	renderRebateBox = () => {
		const { selectedFinish = {} } = this.getProductConfiguration();
		const { finishRebates = [] } = selectedFinish;
		const now = Date.now();
		const rebates = finishRebates.filter((rebate) => {
			return rebate.startDate < now && now < rebate.endDate;
		});

		if (selectedFinish && rebates.length) {
			return (
				<RebateBox
					key="rebateBox"
					rebates={rebates}
				/>
			);
		}
	};

	renderSalesBox = () => {
		const { selectedFinish } = this.getProductConfiguration();
		if (selectedFinish && selectedFinish.sale) {
			return (
				<SalesBox
					key="salesBox"
					sale={selectedFinish.sale}
				/>
			);
		}
	};

	renderVideos = () => {
		const { productVideos } = this.props;
		if (!productVideos.length) {
			return;
		}
		return (
			<TappableListItem
				onPress={this.onVideosPress}
				body="Videos"
				accessibilityLabel="Videos Button"
			/>
		);
	};

	renderProductPrice = () => {
		const {
			squareFootageBased,
			squareFootagePerCarton,
			compositeId,
			finishes,
			manufacturer,
			productId,
			rootCategory,
		} = this.props;
		const { selectedFinish } = this.getProductConfiguration();
		if (selectedFinish) {
			return (
				<View style={componentStyles.productPriceContainer}>
					<ProductPrice
						hasMAP={selectedFinish.mapBusterPricebookCostView !== null}
						consumerPrice={selectedFinish.pricebookCostViewsMap[1] && selectedFinish.pricebookCostViewsMap[1].cost}
						cost={squareFootageBased ? squareFootagePerCarton : selectedFinish.pricebookCostView.cost}
						isProPricing={selectedFinish.pricebookCostView.pricebookId !== CONSUMER_PRICEBOOK_ID}
						minPrice={selectedFinish.pricebookCostView.cost}
						msrp={selectedFinish.msrp}
						squareFootageBased={squareFootageBased}
						optionPriceTotal={this.addOptionPrices()}
					/>
					<FavoriteButton
						compositeId={compositeId}
						productUniqueId={selectedFinish.uniqueId}
						finishes={finishes}
						style={componentStyles.favoriteButton}
						product={{
							manufacturer,
							productId,
							rootCategory,
							selectedFinish,
						}}
					/>

				</View >
			);
		}
	};

	render() {
		const {
			hasProduct,
			finishes,
			imageGallery,
			manufacturer,
			series,
			title,
			topProductSpecs,
			compositeId,
			productId,
			discontinued,
			squareFootageBased,
			availableByLocation,
		} = this.props;
		const { selectedFinish } = this.getProductConfiguration();
		let images = [];
		const finishImages = finishes ? finishes.map((finish) => {
			return {
				uri: helpers.getCloudinaryImageUrl({
					...IMAGE_300,
					section: PRODUCT_SECTION,
					name: finish.image,
					manufacturer,
				}),
			};
		}) : [];

		if (imageGallery.length) {
			images = imageGallery.map((image) => {
				return {
					uri: helpers.getCloudinaryImageUrl({
						...IMAGE_300,
						section: PRODUCT_SECTION,
						manufacturer: image.manufacturer,
						name: image.imageName,
					}),
				};
			});
		}
		images = finishImages.concat(images);
		if (hasProduct === false || (hasProduct === true && selectedFinish === undefined)) {
			return <LoadingView />;
		}

		return (
			<View
				style={componentStyles.scrollWrap}
				onLayout={() => {
					if (this.onLayout) {
						this.onLayout();
						this.onLayout = null;
					}
				}}
			>
				<Form
					style={[styles.elements.screenWithHeader, componentStyles.screen]}
					ref={(form) => {
						if (!this.form) {
							this.form = form;
						}
					}}
					scrollsToTop={true}
				>
					<View style={[componentStyles.center, componentStyles.whiteBackground, componentStyles.padBottom]}>
						<ImageGallery
							images={images}
							title={`${manufacturer} ${productId}`}
							productConfigurationId={this.productConfigurationId}
							compositeId={compositeId}
						/>
						<ArIcon
							style={componentStyles.arIcon}
							compositeId={compositeId}
						/>
					</View>
					<ProductRestrictions productConfigurationId={this.productConfigurationId} />
					{this.renderDiscontinuedAlert()}
					{this.renderProductPrice()}
					<VariationButton
						productConfigurationId={this.productConfigurationId}
						onChangeProductConfigurationId={this.onChangeProductConfigurationId}
					/>
					{this.renderFinishOption()}
					<AnimatableView
						ref={(ref) => {
							if (ref) {
								this.pricedOptionsButton = ref;
							}
						}}
					>
						<ProductPricedOptionButtons productConfigurationId={this.productConfigurationId} />
					</AnimatableView>
					{this.renderZipCodeChecker()}
					{this.renderLargeQuantitySelector()}
					{this.renderSquareFootQuantity()}
					{this.renderAddToButtons()}
					<View style={componentStyles.stock}>
						<StockCount
							selectedFinish={selectedFinish}
							discontinued={discontinued}
							squareFootageBased={squareFootageBased}
							availableByLocation={availableByLocation}
						/>
					</View>
					<View style={[componentStyles.shippingMessage]}>
						<Text style={styles.text.default}>
							<Text style={styles.text.bold}>{selectedFinish.shippingMessage} </Text>
							{selectedFinish.leadTimeInformation ? selectedFinish.leadTimeInformation.text : null}
						</Text>
					</View>
					<CollapsibleContainer>
						{this.renderCollapsibleSalesContainer()}
					</CollapsibleContainer>
					{this.renderRebateBox()}
					<ProductShortDescription
						onPressReadMore={this.onShortDescriptionPress}
						onCollectionPress={this.onCollectionPress}
						series={series}
						specifications={topProductSpecs}
						title={title}
						style={componentStyles.whiteBackground}
					/>
					{this.renderProductSpecs()}
					<RatingsButton
						productConfigurationId={this.productConfigurationId}
						onPress={this.onReviewPress}
					/>
					<ProductQAndAButton productConfigurationId={this.productConfigurationId} />
					{this.renderVideos()}
					<ManufacturerResourcesButton productConfigurationId={this.productConfigurationId} />
					<ShopTheCollection
						productConfigurationId={this.productConfigurationId}
						onViewAllPress={this.onCollectionPress}
					/>
					<KeyboardSpacer />
				</Form>
			</View>
		);
	}
}

ProductDetailScreen.route = {
	navigationBar: {
		// eslint-disable-next-line react/prop-types
		renderTitle: ({ params }) => {
			return (
				<NavigationBarTitle
					title={params.navBarTitle}
					subTitle={params.navBarSubTitle}
				/>
			);
		},
		renderRight(route) {
			return (
				<NavigationBarProductShareButton
					compositeId={route.params.compositeId}
					uniqueId={route.params.uniqueId}
				/>
			);
		},
	},
};

ProductDetailScreen.propTypes = {
	actions: PropTypes.object.isRequired,
	availability: PropTypes.object,
	compositeId: PropTypes.number,
	discontinued: PropTypes.bool.isRequired,
	fetchingAvailability: PropTypes.bool,
	finishes: PropTypes.array,
	geCheckout: PropTypes.bool,
	hasProduct: PropTypes.bool,
	imageGallery: PropTypes.array,
	itemAddedToProject: PropTypes.shape({
		added: PropTypes.bool,
		projectId: PropTypes.number,
	}),
	manufacturer: PropTypes.string.isRequired,
	manufacturerInfo: PropTypes.object,
	navBarTitle: PropTypes.string,
	navigator: PropTypes.object.isRequired,
	option: PropTypes.object,
	pricedOptionGroups: PropTypes.array.isRequired,
	productConfigurationId: PropTypes.string,
	productConfigurations: PropTypes.object,
	productId: PropTypes.string.isRequired,
	productSpecs: PropTypes.array.isRequired,
	productVideos: PropTypes.array,
	recommendedOptions: PropTypes.array,
	rootCategory: PropTypes.object,
	selectedFinish: PropTypes.object,
	series: PropTypes.string,
	shoppingLists: PropTypes.bool,
	squareFootage: PropTypes.number,
	squareFootageBased: PropTypes.bool,
	squareFootagePerCarton: PropTypes.number,
	availableByLocation: PropTypes.bool.isRequired,
	title: PropTypes.string.isRequired,
	topProductSpecs: PropTypes.array.isRequired,
	type: PropTypes.string.isRequired,
	uniqueId: PropTypes.number,
	sku: PropTypes.string,
	finish: PropTypes.string,
	navigation: PropTypes.shape({
		getNavigator: PropTypes.func,
		getNavigatorByUID: PropTypes.func,
		performAction: PropTypes.func,
	}),
	user: PropTypes.object,
	variations: PropTypes.array,
	isArProduct: PropTypes.bool,
};

export default connect((state, ownProps) => {
	let product;
	let squareFootage = 0;
	const productConfigurations = state.productConfigurationsReducer;
	const { productConfigurationId } = ownProps;
	const screenView = state.productDetailReducer.screenViews[productConfigurationId];
	let compositeId;
	if (productConfigurationId && productConfigurations[productConfigurationId] && productConfigurations[productConfigurationId].compositeId) {
		compositeId = productConfigurations[productConfigurationId].compositeId;
	} else {
		compositeId = ownProps.compositeId;
	}
	if (compositeId) {
		product = state.productsReducer[compositeId];
	} else {
		Object.keys(state.productsReducer).forEach((currentCompositeId) => {
			const composite = state.productsReducer[currentCompositeId];
			if (productHelpers.hasFinishWithUniqueId(composite, ownProps.uniqueId)) {
				product = composite;
				compositeId = composite.compositeId;
			}
		});
	}
	if (!product) {
		return {
			discontinued: false,
			finishes: [],
			hasProduct: false,
			imageGallery: [],
			manufacturer: '',
			manufacturerInfo: {},
			pricedOptionGroups: [],
			productId: '',
			productSpecs: [],
			productVideos: [],
			recommendedOptions: [],
			rootCategory: {},
			series: '',
			squareFootageBased: false,
			squareFootagePerCarton: 0,
			availableByLocation: false,
			title: '',
			topProductSpecs: [],
			type: '',
			productConfigurations,
			squareFootage,
		};
	}
	if (screenView && screenView.squareFootage) {
		squareFootage = screenView.squareFootage;
	}
	const { geCheckout, shoppingLists } = state.featuresReducer.features;
	const { user } = state.userReducer;
	const {
		availability,
		discontinued,
		fetchingAvailability,
		finishes,
		imageGallery,
		manufacturer,
		manufacturerInfo,
		pricedOptionGroups,
		productId,
		productSpecs,
		productVideos,
		recommendedOptions,
		rootCategory,
		series,
		squareFootageBased,
		squareFootagePerCarton,
		availableByLocation,
		title,
		topProductSpecs,
		type,
		variations,
	} = product;
	return {
		hasProduct: true,
		itemAddedToProject: state.projectsReducer.itemAddedToProject,
		navBarTitle: `${manufacturer} ${productId}`,
		isArProduct: state.productDetailReducer.arProducts.includes(ownProps.compositeId),
		availability,
		compositeId,
		discontinued,
		fetchingAvailability,
		finishes,
		geCheckout,
		imageGallery,
		manufacturer,
		manufacturerInfo,
		pricedOptionGroups,
		productConfigurations,
		productId,
		productSpecs,
		productVideos,
		recommendedOptions,
		rootCategory,
		series,
		shoppingLists,
		squareFootage,
		squareFootageBased,
		squareFootagePerCarton,
		availableByLocation,
		title,
		topProductSpecs,
		type,
		user,
		variations,
	};
}, (dispatch) => {
	return {
		actions: bindActionCreators({
			createProductConfiguration: productConfigurationsActions.createProductConfiguration,
			getProductComposite: productsActions.getProductComposite,
			setAvailability,
			getAvailability,
			updateSquareFootage,
			historyUpsert,
			trackAction,
			saveLastViewedProductCompositeId,
			trackState,
			showAlert,
			itemAddedToProject,
		}, dispatch),
	};
})(ProductDetailScreen);
