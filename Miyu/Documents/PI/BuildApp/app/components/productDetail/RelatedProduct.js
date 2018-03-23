'use strict';

import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	StyleSheet,
	View,
	LayoutAnimation,
	TouchableWithoutFeedback,
} from 'react-native';
import {
	Image,
	LinkButton,
	QuantitySelector,
} from 'BuildLibrary';
import { Text } from 'build-library';
import animations from '../../lib/animations';
import { withNavigation } from '@expo/ex-navigation';
import { toUSD, getCloudinaryImageUrl, removeHTML } from '../../lib/helpers';
import styles from '../../lib/styles';
import OptionSelectButton from '../OptionSelectButton';
import { PRODUCT_SECTION, IMAGE_95 } from '../../constants/CloudinaryConstants';
import EventEmitter from '../../lib/eventEmitter';
import SimpleModal from '../SimpleModal';
import AddToCartButton from '../AddToCartButton';
import TrackingActions from '../../lib/analytics/TrackingActions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getProductRootCategory } from '../../actions/ProductDetailActions';
import { trackAction } from '../../actions/AnalyticsActions';

const componentStyles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'row',
	},
	leftColumn: {
		margin: styles.measurements.gridSpace1,
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	rightColumn: {
		flex: 1,
		paddingVertical: styles.measurements.gridSpace1,
		paddingRight: styles.measurements.gridSpace1,
	},
	quantityAndAddToCart: {
		flexDirection: 'row',
		padding: styles.measurements.gridSpace1,
	},
	addToCartButton: {
		flex: 1,
		borderLeftWidth: styles.dimensions.borderWidth,
		borderColor: styles.colors.white,
	},
	quantitySelectorsHidden: {
		width: 44,
	},
	quantitySelectorsShown: {
		width: 132,
	},
});

@withNavigation
export class RelatedProduct extends Component {

	constructor(props) {
		super(props);
		this.state = {
			quantity: this.props.neededQuantity,
			isQuantitySelectorsVisible: false,
			showQuantitySelectorView: true,
			isAddToCartEnabled: true,
		};
	}

	onWhyTextPress = (title, content) => {
		EventEmitter.emit('showScreenOverlay', (
			<SimpleModal title={title}>
				<View>
					<Text>{removeHTML(content)}</Text>
				</View>
			</SimpleModal>
		));
	};

	onFinishButtonPress = () => {
		const { id, selectedFinish } = this.props;
		this.props.navigator.push('upsellFinishSelection', {
			optionId: id,
			prevSelectedFinish: selectedFinish,
		});
	};

	onModelDetailPress = () => {
		this.props.navigator.push('modelDetailPickerScreen', {
			finish: this.props.selectedFinish.finish,
			optionId: this.props.id,
			optionProducts: this.getOptionProducts(),
			productFriendlyName: this.props.friendlyName,
		});
	};

	onProductTap = () => {
		this.setState({ isQuantitySelectorsVisible: false }, () => {
			// if we're adding to the cart, the quantitySelector isn't on the screen
			if (this.quantitySelector && typeof this.quantitySelector.onHideSelectors === 'function') {
				this.quantitySelector.onHideSelectors();
			}
		});
	};

	/**
	 * Swaps the selected product to top of the list
	 */
	getOptionProducts = () => {
		const { optionProducts, selectedDrop } = this.props;
		const selectedModelProductCompositeId = selectedDrop.productCompositeId;
		if (optionProducts.length > 1) {
			const index = optionProducts
				.findIndex(({productDrop}) => productDrop.productCompositeId === selectedModelProductCompositeId);
			const selectedProduct = optionProducts[index];
			optionProducts[index] = optionProducts[0];
			optionProducts[0] = selectedProduct;
		}
		return optionProducts;
	};

	trackAddToCart = () => {
		const {
			selectedFinish: { cost, finish, sku, uniqueId },
			selectedDrop : { manufacturer, productId },
			relatedProductRootCategory,
			compositeId,
		} = this.props;
		const attributes = {
			compositeId,
			cost,
			sku,
			uniqueId,
			finish,
			manufacturer,
			productId,
			quantity: this.state.quantity,
		};

		if (relatedProductRootCategory) {
			this.props.actions.trackAction(this.getTrackAction(), {
				...attributes,
				...relatedProductRootCategory,
			});
		} else {
			this.props.actions.getProductRootCategory(compositeId)
				.then((rootCategory) => {
					this.props.actions.trackAction(this.getTrackAction(), {
						...attributes,
						...rootCategory,
					});
				})
				.catch(() => {
					this.props.actions.trackAction(this.getTrackAction(), attributes);
				}).done();
		}
	};

	onAddToCartPress = () => {
		if (this.state.isAddToCartEnabled) {
			this.trackAddToCart();
			LayoutAnimation.configureNext(animations.fadeIn);
			this.setState({
				showQuantitySelectorView: false,
				isAddToCartEnabled: false,
			});
			this.props.onAddToCartPress({
				productUniqueId: this.props.selectedFinish.uniqueId,
				quantity: this.state.quantity,
				pricedOptions: [],
				isSuggestedItem: this.props.isSuggestedItem,
			}, this.addButton, () => {
				LayoutAnimation.configureNext(animations.fadeIn);
				this.onUpdateQuantity(1);
				this.setState({
					showQuantitySelectorView: true,
					isAddToCartEnabled: true,
					isQuantitySelectorsVisible: false,
				});
			});
		}
	};

	onUpdateQuantity = (quantity) => {
		this.setState({
			quantity,
		});
	};

	getTrackAction = () => {
		const { optionType } = this.props;
		if (this.isMatchOptionType(optionType, 'Required')) {
			return TrackingActions.RELATED_PRODUCT_REQUIRED_ADD_TO_CART;
		} else if (this.isMatchOptionType(optionType, 'Recommended')) {
			return TrackingActions.RELATED_PRODUCT_RECOMMENDED_ADD_TO_CART;
		} else {
			return TrackingActions.RELATED_PRODUCT_MAY_WE_SUGGEST_ADD_TO_CART;
		}
	};

	isMatchOptionType = (left, right) => {
		return left.toLowerCase() === right.toLowerCase();
	};

	renderWhyLink = () => {
		const { optionType, titlePrimary, whyText } = this.props;
		let text;
		if (this.isMatchOptionType(optionType, 'Required')) {
			text = 'Why is this Required?';
		} else if (this.isMatchOptionType(optionType, 'Recommended')) {
			text = 'Why would I need this?';
		}
		if (text) {
			return (
				<LinkButton
					accessibilityLabel={`relatedProduct${titlePrimary.replace(/\s/g, '')}`}
					onPress={() => this.onWhyTextPress(text, whyText)}
				>
					{text}
				</LinkButton>
			);
		}
	};

	renderQuantitySelector = () => {
		const wrapStyle = this.state.isQuantitySelectorsVisible ? componentStyles.quantitySelectorsShown : componentStyles.quantitySelectorsHidden;

		if (this.state.showQuantitySelectorView) {
			return (
				<View style={wrapStyle}>
					<QuantitySelector
						theme="primary"
						ref={(ref) => this.quantitySelector = ref}
						allowZero={false}
						quantity={this.state.quantity}
						onUpdateQuantity={this.onUpdateQuantity}
						disableDelete={true}
						onToggleSelectors={(visible) => this.setState({isQuantitySelectorsVisible: visible})}
						onInputFocus={() => this.props.onQuantityInputFocus(this.quantitySelector)}
					/>
				</View>
			);
		}
	};

	renderOptionProducts = () => {
		const { selectedDrop, titleSecondary } = this.props;
		const boldText = `${selectedDrop.manufacturer} ${selectedDrop.productId}`;

		if (this.getOptionProducts() && this.getOptionProducts().length > 1) {
			return (
				<OptionSelectButton
					onPress={this.onModelDetailPress}
					text="Model: "
					boldText={boldText}
					isConfigured={true}
					style={componentStyles.horizontalMargin}
					accessibilityLabel={`Related${boldText}`}
				/>
			);
		}

		if (!titleSecondary) {
			return (
				<Text>Model: <Text weight="bold">{boldText}</Text></Text>
			);
		}
	};

	renderSelectedFinishes = () => {
		const { selectedFinish, selectedDrop } = this.props;
		const boldText = selectedFinish.finish ? selectedFinish.finish : 'Choose Finish';
		const text = selectedFinish.finish ? 'Finish: ' : '';

		if (selectedDrop.finishes && selectedDrop.finishes.length > 1) {
			return (
				<OptionSelectButton
					onPress={this.onFinishButtonPress}
					boldText={boldText}
					text={text}
					isConfigured={true}
					accessibilityLabel={`${boldText}Finish`}
				/>
			);
		}

		return (
			<Text>{text} <Text weight="bold">{boldText}</Text></Text>
		);
	};

	renderTitle = () => {
		const { titlePrimary, titleSecondary } = this.props;
		return <Text><Text weight="bold">{titlePrimary}</Text> {titleSecondary}</Text>;
	};

	render() {
		const { selectedFinish: { cost, image }, selectedDrop: { manufacturer } } = this.props;
		const imageSource = getCloudinaryImageUrl({
			name: image,
			...IMAGE_95,
			manufacturer,
			section: PRODUCT_SECTION,
		});
		return (
			<TouchableWithoutFeedback onPress={this.onProductTap}>
				<View>
					<View style={componentStyles.container}>
						<View style={componentStyles.leftColumn}>
							<Image
								source={imageSource}
								style={componentStyles.image}
								{...IMAGE_95}
							/>
							<View>
								<Text
									textAlign="center"
									size="small"
									color="greyDark"
								>
									{this.state.quantity} @ {toUSD(cost)}
								</Text>
								<Text
									color="primary"
									weight="bold"
									textAlign="center"
								>
									{toUSD(cost * this.state.quantity)}
								</Text>
							</View>
						</View>
						<View style={componentStyles.rightColumn}>
							{this.renderTitle()}
							{this.renderWhyLink()}
							{this.renderOptionProducts()}
							{this.renderSelectedFinishes()}
						</View>
					</View>
					<View style={componentStyles.quantityAndAddToCart}>
						{this.renderQuantitySelector()}
						<AddToCartButton
							ref={(node) => this.addButton = node}
							style={componentStyles.addToCartButton}
							text="Add To Cart"
							onPress={this.onAddToCartPress}
						/>
					</View>
				</View>
			</TouchableWithoutFeedback>
		);
	}
}

RelatedProduct.propTypes = {
	id: PropTypes.string,
	titlePrimary: PropTypes.string,
	titleSecondary: PropTypes.string,
	compositeId: PropTypes.number.isRequired,
	optionType: PropTypes.string,
	optionProducts: PropTypes.array,
	onAddToCartPress: PropTypes.func,
	onQuantityInputFocus: PropTypes.func,
	whyText: PropTypes.string,
	friendlyName: PropTypes.string,
	selectedFinish: PropTypes.object,
	selectedDrop: PropTypes.object,
	neededQuantity: PropTypes.number.isRequired,
	isSuggestedItem: PropTypes.bool,
	relatedProductRootCategory: PropTypes.object,
	actions: PropTypes.object,
	navigator: PropTypes.shape({
		push: PropTypes.func,
	}),
};

RelatedProduct.defaultProps = {
	optionProducts: [],
	selectedFinish: {},
	selectedDrop: {},
	friendlyName: '',
	parentProductQuantity: 1,
	titlePrimary: '',
	titleSecondary: '',
	relatedProductRootCategory: {},
};

const mapStateToProps = ({ productDetailReducer }, ownProps) => {
	return {
		relatedProductRootCategory: productDetailReducer.rootCategories[ownProps.compositeId],
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			getProductRootCategory,
			trackAction,
		}, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(RelatedProduct);
