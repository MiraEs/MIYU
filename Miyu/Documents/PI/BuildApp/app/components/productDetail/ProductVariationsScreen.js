
import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	StyleSheet,
	View,
	TouchableOpacity,
	Image,
	InteractionManager,
} from 'react-native';
import { Text } from 'build-library';
import {
	ScrollView,
	withScreen,
} from 'BuildLibrary';
import { bindActionCreators } from 'redux';
import store from '../../store/configStore';
import uuid from 'uuid';
import ExNavigationBarBackButton from '../ExNavigationBarBackButton';
import { connect } from 'react-redux';
import productConfigurationsActions from '../../actions/ProductConfigurationsActions';
import styles from '../../lib/styles';
import helpers from '../../lib/helpers';
import { PRODUCT_SECTION, IMAGE_100 } from '../../constants/CloudinaryConstants';
import productsActions from '../../actions/ProductsActions';
import TrackingActions from '../../lib/analytics/TrackingActions';
import productHelpers from '../../lib/productHelpers';
import scrollableHelpers from '../../lib/ScrollableHelpers';
import FixedBottomButton from '../FixedBottomButton';
import ProductConfigurationOptionButton from './ProductConfigurationOptionButton';
import ProductConfigurationHeader from './ProductConfigurationHeader';

const componentStyles = StyleSheet.create({
	screen: {
		flex: 1,
	},
	content: {
		flexGrow: 1,
	},
	finishes: {
		marginTop: styles.measurements.gridSpace3,
	},
	finish: {
		flexDirection: 'row',
		backgroundColor: styles.colors.white,
		padding: styles.measurements.gridSpace1,
		paddingRight: styles.measurements.gridSpace2,
		marginRight: styles.measurements.gridSpace1,
		borderWidth: 1,
		borderColor: styles.colors.grey,
	},
	finishImage: {
		height: 60,
		width: 60,
		marginRight: styles.measurements.gridSpace1,
	},
	list: {
		paddingLeft: styles.measurements.gridSpace1,
	},
	selectedFinishName: {
		marginLeft: styles.measurements.gridSpace1,
		marginBottom: styles.measurements.gridSpace1,
	},
	variation: {
		padding: styles.measurements.gridSpace1,
		marginRight: styles.measurements.gridSpace1,
		width: 100,
		alignItems: 'center',
	},
	variationContainer: {
		marginTop: styles.measurements.gridSpace3,
	},
	variationTitle: {
		marginLeft: styles.measurements.gridSpace1,
	},
	variationImageView: {
		backgroundColor: styles.colors.white,
		padding: styles.measurements.gridSpace1,
		borderWidth: 1,
		borderColor: styles.colors.grey,
	},
	variationImage: {
		width: 80,
		height: 80,
	},
	selectedTile: {
		borderColor: styles.colors.accent,
		borderWidth: 3,
		// this is here so the product info doesn't jump around when selected.
		// it offsets the extra large border
		padding: styles.measurements.gridSpace1 - 2,
	},
});

export class ProductVariationsScreen extends Component {

	componentDidMount() {
		const {
			selectedUniqueId,
			actions,
			navigator,
			variations,
			products,
			productComposite,
		} = this.props;
		InteractionManager.runAfterInteractions(() => {
			// save initialUniqueId and productComposite to the route so if the user presses the back button
			// we can reset the selected finish for the initial product configuration ID.
			navigator.updateCurrentRouteParams({
				initialUniqueId: selectedUniqueId,
				productComposite,
			});
		});
		if (Array.isArray(variations)) {
			variations.forEach((variation) => {
				if (Array.isArray(variation.variationProducts)) {
					variation.variationProducts.forEach((variationProduct) => {
						// if we don't have the composite in memory go get it
						if (variationProduct.productDrop && !products[variationProduct.productDrop.productCompositeId]) {
							actions.getProductComposite({
								compositeId: variationProduct.productDrop.productCompositeId,
							});
						}
					});
				}
			});
		}
		this.scrollToSelectedFinish();
	}

	finishRefs = {};

	onPressFinish = (uniqueId) => {
		const {
			actions,
			productComposite,
			productConfigurationId,
			navigator,
		} = this.props;
		navigator.updateCurrentRouteParams({
			hasSelectedFinish: true,
		});
		actions.setProductConfigurationFinish({
			productComposite,
			productConfigurationId,
			uniqueId,
		});
	};

	onPressVariation = ({ productCompositeId }) => {
		const productConfigurationId = uuid.v4();
		const productComposite = this.props.products[productCompositeId];
		let matchingFinishIndex;
		productComposite.finishes.forEach((finish, index) => {
			if (finish.finish.toLowerCase() === this.props.selectedFinishName.toLowerCase()) {
				matchingFinishIndex = index;
			}
		});
		this.props.actions.createProductConfiguration({
			compositeId: productCompositeId,
			uniqueId: productComposite.finishes[matchingFinishIndex || 0].uniqueId,
			productConfigurationId,
		});
		this.props.navigator.updateCurrentRouteParams({
			productConfigurationId,
			hasSelectedFinish: matchingFinishIndex !== undefined && this.props.hasSelectedFinish,
		});
		this.scrollToSelectedFinish();
	};

	onPressContinue = () => {
		const {
			productConfigurationId,
			onPressContinue,
			productComposite,
			navigator,
			navigation,
		} = this.props;
		onPressContinue(productConfigurationId);
		const hasPricedOptions = productHelpers.hasPricedOptions(productComposite);
		const nextCustomization = productHelpers.getNextProductCustomization({
			productConfigurationId,
			currentOptionName: 'Finish',
		});
		if (hasPricedOptions && nextCustomization) {
			navigation.getNavigator('root').replace('productPricedOptions', {
				productConfigurationId,
			});
		} else {
			navigator.pop();
		}
	};

	setScreenTrackingInformation() {
		return {
			name: 'build:app:productvariation',
		};
	}

	scrollToSelectedFinish = () => {
		setTimeout(() => {
			const container = this.finishesScrollView;
			const child = this.finishRefs[this.props.selectedFinishName];
			scrollableHelpers.scrollChildToCenter(container, child);
		}, 200);
	};

	getVariationOpacity = (hasMatchingFinish) => {
		return {
			opacity: hasMatchingFinish ? 1 : 0.6,
		};
	};

	isSelected = (finishName) => {
		return finishName === this.props.selectedFinishName && this.props.hasSelectedFinish;
	};

	renderSelectedFinishName = () => {
		if (!this.props.hasSelectedFinish) {
			return (
				<Text
					weight="bold"
					color="error"
				>
					Please select an available finish
				</Text>
			);
		}
		return <Text weight="bold">{this.props.selectedFinishName}</Text>;
	};

	renderFinish = (finish, index) => {
		const uri = helpers.getCloudinaryImageUrl({
			...IMAGE_100,
			section: PRODUCT_SECTION,
			name: `${this.props.manufacturer}/${finish.image}`,
		});
		return (
			<View
				ref={(node) => {
					if (node) {
						this.finishRefs[finish.finish] = node;
					}
				}}
				key={index}
			>
				<ProductConfigurationOptionButton
					onPress={() => this.onPressFinish(finish.uniqueId)}
					imageURI={uri}
					text={finish.finish}
					price={finish.pricebookCostView.cost}
					isSelected={this.isSelected(finish.finish)}
				/>
			</View>
		);
	};

	renderFinishes = () => {
		return (
			<View style={componentStyles.finishes}>
				<Text style={componentStyles.selectedFinishName}>Finish: {this.renderSelectedFinishName()}</Text>
				<ScrollView
					horizontal={true}
					contentContainerStyle={componentStyles.list}
					showsHorizontalScrollIndicator={false}
					ref={(node) => {
						if (node) {
							this.finishesScrollView = node;
						}
					}}
				>
					{this.props.finishes.map(this.renderFinish)}
				</ScrollView>
			</View>
		);
	};

	renderVariation = (variation, index) => {
		let uri;
		let selectedStyle = {};
		let hasMatchingFinish = true;
		let productComposite;
		if (variation.productDrop) {
			const matchingFinishIndex = variation.productDrop.finishIndexMap[this.props.selectedFinishName];
			const matchingFinish = variation.productDrop.finishes[matchingFinishIndex];
			const image = matchingFinish && matchingFinish.image || variation.productDrop.finishes[0].image;
			if (!matchingFinish) {
				hasMatchingFinish = false;
			}
			uri = helpers.getCloudinaryImageUrl({
				...IMAGE_100,
				section: PRODUCT_SECTION,
				name: `${this.props.manufacturer}/${image}`,
			});
			productComposite = this.props.products[variation.productDrop.productCompositeId];
		} else {
			selectedStyle = componentStyles.selectedTile;

			uri = helpers.getCloudinaryImageUrl({
				...IMAGE_100,
				section: PRODUCT_SECTION,
				name: `${this.props.manufacturer}/${this.props.selectedImage}`,
			});
			productComposite = this.props.products[this.props.compositeId];
		}
		return (
			<TouchableOpacity
				disabled={!variation.productDrop || !productComposite}
				onPress={() => this.onPressVariation(variation.productDrop)}
				key={index}
				style={componentStyles.variation}
			>
				<View
					style={this.getVariationOpacity(hasMatchingFinish && productComposite)}
				>
					<View
						style={[componentStyles.variationImageView, selectedStyle]}
					>
						<Image
							source={{
								uri,
							}}
							style={componentStyles.variationImage}
						/>
					</View>
					<Text
						size="small"
						textAlign="center"
					>
						{variation.variationName}
					</Text>
				</View>
			</TouchableOpacity>
		);
	};

	renderVariations = () => {
		const {
			variations,
		} = this.props;
		if (Array.isArray(variations) && variations.length > 0) {
			return variations.map((variation, index) => {
				const variationName = variation.variationProducts.find((product) => product.currentVariation).variationName;
				return (
					<View
						key={index}
						style={componentStyles.variationContainer}
					>
						<Text style={componentStyles.variationTitle}>{variation.name}: <Text weight="bold">{variationName}</Text></Text>
						<ScrollView
							horizontal={true}
							contentContainerStyle={componentStyles.list}
							showsHorizontalScrollIndicator={false}
						>
							{variation.variationProducts.map(this.renderVariation)}
						</ScrollView>
					</View>
				);
			});
		}
	};

	render() {
		return (
			<View style={componentStyles.screen}>
				<ProductConfigurationHeader
					hasSelectedFinish={this.props.hasSelectedFinish}
					productConfigurationId={this.props.productConfigurationId}
				/>
				<View style={componentStyles.content}>
					{this.renderFinishes()}
					{this.renderVariations()}
				</View>
				<FixedBottomButton
					buttonText="Continue"
					disabled={!this.props.hasSelectedFinish}
					onPress={this.onPressContinue}
					trackAction={TrackingActions.VARIATION_CONTINUE}
					accessibilityLabel="Continue Button"
				/>
			</View>
		);
	}

}

ProductVariationsScreen.propTypes = {
	actions: PropTypes.object,
	compositeId: PropTypes.number,
	cost: PropTypes.number,
	finishes: PropTypes.array,
	initialProductConfigurationId: PropTypes.string.isRequired,
	manufacturer: PropTypes.string,
	hasSelectedFinish: PropTypes.bool,
	navigation: PropTypes.shape({
		getNavigator: PropTypes.func,
	}),
	onPressContinue: PropTypes.func,
	productComposite: PropTypes.object,
	productConfigurationId: PropTypes.string.isRequired,
	products: PropTypes.object,
	selectedFinishName: PropTypes.string,
	selectedUniqueId: PropTypes.number,
	stockText: PropTypes.string,
	variations: PropTypes.array,
	selectedLeadTimeText: PropTypes.string,
	navigator: PropTypes.object,
	selectedSku: PropTypes.string,
	selectedImage: PropTypes.string,
};

ProductVariationsScreen.defaultProps = {
	hasSelectedFinish: true,
};

ProductVariationsScreen.route = {
	navigationBar: {
		title: 'Customize Product',
		visible: true,
		renderLeft(route) {
			return (
				<ExNavigationBarBackButton
					tintColor={styles.colors.white}
					onPress={() => {
						store.dispatch(productConfigurationsActions.setProductConfigurationFinish({
							uniqueId: route.params.initialUniqueId,
							productConfigurationId: route.params.initialProductConfigurationId,
							productComposite: route.params.productComposite,
						}));
					}}
				/>
			);
		},
	},
};

const mapStateToProps = (state, ownProps) => {
	let { productConfigurationId } = ownProps;
	if (!productConfigurationId) {
		productConfigurationId = ownProps.initialProductConfigurationId;
	}
	const {
		selectedFinish,
		compositeId,
		uniqueId,
	} = state.productConfigurationsReducer[productConfigurationId];
	const product = state.productsReducer[compositeId];
	return {
		finishes: product.finishes,
		manufacturer: product.manufacturer,
		selectedSku: selectedFinish.sku,
		stockText: productHelpers.getStockText(selectedFinish, selectedFinish.leadTimeInformation),
		cost: selectedFinish.pricebookCostView.cost,
		products: state.productsReducer,
		productComposite: product,
		selectedFinishName: selectedFinish.finish,
		selectedUniqueId: uniqueId,
		selectedImage: selectedFinish.image,
		selectedLeadTimeText: selectedFinish.leadTimeText,
		variations: product.variations,
		productConfigurationId,
		compositeId,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			setProductConfigurationFinish: productConfigurationsActions.setProductConfigurationFinish,
			createProductConfiguration: productConfigurationsActions.createProductConfiguration,
			getProductComposite: productsActions.getProductComposite,
		}, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(withScreen(ProductVariationsScreen));
