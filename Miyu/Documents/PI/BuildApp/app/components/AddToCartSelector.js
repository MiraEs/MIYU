import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	LayoutAnimation,
	StyleSheet,
	View,
} from 'react-native';
import {
	NO_THANK_YOU,
	I_DONT_NEED_THIS,
	CHECK_BOX_OPTION,
} from '../constants/productDetailConstants';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withNavigation } from '@expo/ex-navigation';
import {
	addSessionCartItems,
	updateCartItemBounce,
} from '../actions/CartActions';
import { getProductComposite } from '../actions/ProductDetailActions';
import productConfigurationsActions from '../actions/ProductConfigurationsActions';
import styles from '../lib/styles';
import AddToCartButton from '../components/AddToCartButton';
import tracking from '../lib/analytics/tracking';
import helpers from '../lib/helpers';
import { trackAction } from '../actions/AnalyticsActions';
import { QuantitySelector } from 'BuildLibrary';

const componentStyles = StyleSheet.create({
	quantitySelectorShown: {
		width: 132,
	},
	quantitySelectorHidden: {
		width: 44,
		marginRight: 1,
	},
});

@withNavigation
export class AddToCartSelector extends Component {

	constructor(props) {
		super(props);
		this.state = {
			addToCartEnabled: true,
			loading: false,
			quantitySelectorMode: false,
			quantitySelectorVisible: true,
		};

		this.addToCartButton = {
			reset: helpers.noop,
			queueChange: helpers.noop,
		};
	}

	onAddToCartPress = () => {
		this.addToCartButton.queueChange({ text: 'Adding...' });
		const { productConfigurationId, actions, productComposite, compositeId, uniqueId } = this.props;
		if (!this.props.hideQuantitySelector) {
			LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
		}
		this.setState({
			addToCartEnabled: false,
			quantitySelectorVisible: false,
		}, () => {
			if (!productComposite) {
				actions.createProductConfiguration({ compositeId, uniqueId, productConfigurationId })
					.then(this.validate)
					.catch(helpers.noop)
					.done();
			} else {
				this.validate();
			}
		});
	};

	isOptional = (pricedOption) => {
		return (pricedOption.value.toUpperCase() === NO_THANK_YOU || pricedOption.value.toUpperCase() === I_DONT_NEED_THIS);
	};

	isOptionalPricedOptionGroup = (pricedOptionGroup) => {
		return pricedOptionGroup.pricedOptions.filter((pricedOption) =>
			this.isOptional(pricedOption) || pricedOption.inputType.toUpperCase() === CHECK_BOX_OPTION).length > 0;
	};

	validate = () => {
		const {
			productComposite,
			onAvailableByLocation,
			onSquareFootageBased,
			onHasOptionGroups,
			validateAvailability,
			selectedPricedOptions,
		} = this.props;

		if (productComposite.availableByLocation && onAvailableByLocation) {
			onAvailableByLocation();
			return this.resetAddToCartButton();
		}

		if (validateAvailability && !validateAvailability()) {
			return this.resetAddToCartButton();
		}

		if (productComposite.squareFootageBased && this.props.quantity === 0) {
			onSquareFootageBased();
			return this.resetAddToCartButton();
		}
		if (productComposite.pricedOptionGroups.length) {
			const { pricedOptionGroups } = productComposite;
			const requiredPricedOptionGroups = pricedOptionGroups
			.filter((optionGroup) => !this.isOptionalPricedOptionGroup(optionGroup));
			const optionalPricedOptionGroupNames = pricedOptionGroups
			.filter((optionGroup) => this.isOptionalPricedOptionGroup(optionGroup))
			.map((optionGroup) => optionGroup.optionName);
			const requiredSelectedOptions = selectedPricedOptions.filter((option) => option.pricedOptions.length)
			.map((option) => option.optionName)
			.filter((optionName) => !optionalPricedOptionGroupNames.includes(optionName));
			if (requiredSelectedOptions.length === requiredPricedOptionGroups.length) {
				return this.addItemsToCart();
			}
			onHasOptionGroups(requiredSelectedOptions);
			return this.resetAddToCartButton();
		}
		return this.addItemsToCart();
	};

	getSelectorStyle = () => {
		if (this.state.quantitySelectorMode) {
			return componentStyles.quantitySelectorShown;
		}
		return componentStyles.quantitySelectorHidden;
	};

	addItemsToCart = () => {
		const { actions, cart, productComposite, uniqueId, selectedPricedOptions } = this.props,
			{ sessionCartId } = cart,
			{ availability } = productComposite,
			sessionCartItems = [],
			pricedOptions = [];
		selectedPricedOptions.map((optionGroup) => {
			if (optionGroup) {
				optionGroup.pricedOptions.map((option) => {
					pricedOptions.push({
						keyCode: option.keyCode,
						pricedOptionId: option.pricedOptionId,
					});
				});
			}
		});
		tracking.trackNewCartCreated(cart, () => {
			actions.updateCartItemBounce(true);
		});
		this.trackAddToCart();

		sessionCartItems.push({
			productUniqueId: uniqueId,
			quantity: this.props.quantity,
			pricedOptions,
		});
		actions.addSessionCartItems({
			postalCode: availability.zipCode,
			postalCodeSource: availability.isAvailableInZip ? 'confirmed' : null,
			sessionCartItems,
			sessionCartId,
		}).then((results) => {
			const parentKey = results.cartItems[0].itemKey;
			this.addToCartButton.queueChange({
				text: 'Added To Cart',
				itemAdded: true,
			}, () => {
				this.handleUpsell(parentKey);
				this.resetAddToCartButton();
			});
		}).catch(() => {
			this.addToCartButton.queueChange({ text: 'Unable To Add' }, this.resetAddToCartButton);
		}).done();
	};

	handleUpsell = (parentKey) => {
		const { compositeId, selectedFinish, productComposite, productConfigurationId } = this.props;
		const { recommendedOptions, accessories } = productComposite;
		if (recommendedOptions && recommendedOptions.length || accessories && accessories.length) {
			this.props.navigation.getNavigator('root').push('productUpsell', {
				addedProductQuantity: this.props.quantity,
				finish: selectedFinish,
				recommendedOptions,
				compositeId,
				parentKey,
				accessories,
				productConfigurationId,
			});
		}
	};

	resetAddToCartButton = () => {
		this.setState({ quantity: 1 });
		this.addToCartButton.reset(() => {
			if (!this.props.hideQuantitySelector) {
				LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
			}
			this.setState({
				quantitySelectorMode: false,
				quantitySelectorVisible: true,
				addToCartEnabled: true,
			});
		});
	};

	onToggleSelectors = (quantitySelectorMode) => {
		LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
		this.setState({ quantitySelectorMode });
	};

	getQuantitySelector = () => {
		if (this.state.quantitySelectorVisible && !this.props.hideQuantitySelector) {
			return (
				<QuantitySelector
					style={this.getSelectorStyle()}
					quantity={this.props.quantity}
					onUpdateQuantity={this.props.onUpdateQuantity}
					disableDelete={true}
					allowZero={false}
					onToggleSelectors={this.onToggleSelectors}
					theme="primary"
					onInputFocus={this.props.onInputFocus}
				/>
			);
		}
	};

	updateQuantity = (quantity) => {
		this.setState({ quantity });
	};

	trackAddToCart = () => {
		const { selectedFinish, productComposite: { manufacturer, productId, rootCategory }, quantity } = this.props;
		const { finish, sku, uniqueId, pricebookCostView: { cost } } = selectedFinish;
		const contextData = {
			manufacturer,
			productId,
			finish,
			sku,
			uniqueId,
			cost,
			quantity,
			categoryId: rootCategory.categoryId,
			categoryName: rootCategory.categoryName,
		};
		this.props.actions.trackAction(this.props.trackAction, contextData);
	};

	render() {
		return (
			<View style={[styles.elements.centeredFlexRow, styles.elements.flex]}>
				{this.getQuantitySelector()}
				<AddToCartButton
					ref={(ref) => {
						if (ref) {
							this.addToCartButton = ref;
						}
					}}
					style={styles.elements.flex}
					text="Add To Cart"
					disabled={!this.state.addToCartEnabled}
					onPress={this.onAddToCartPress}
				/>
			</View>
		);
	}

}

AddToCartSelector.propTypes = {
	actions: PropTypes.object,
	cart: PropTypes.object,
	compositeId: PropTypes.number,
	hideQuantitySelector: PropTypes.bool,
	onAvailableByLocation: PropTypes.func,
	onHasOptionGroups: PropTypes.func.isRequired,
	onSquareFootageBased: PropTypes.func.isRequired,
	onUpdateQuantity: PropTypes.func,
	productConfigurationId: PropTypes.string.isRequired,
	productComposite: PropTypes.object,
	quantity: PropTypes.number.isRequired,
	uniqueId: PropTypes.number,
	selectedFinish: PropTypes.object,
	trackAction: PropTypes.string,
	validateAvailability: PropTypes.func,
	onInputFocus: PropTypes.func,
	selectedPricedOptions: PropTypes.array,
	navigation: PropTypes.shape({
		getNavigator: PropTypes.func,
	}),
};

const mapStateToProps = function (state, ownProps) {
	const configuration = state.productConfigurationsReducer[ownProps.productConfigurationId];
	if (!configuration) {
		return {
			cart: state.cartReducer.cart,
			uniqueId: ownProps.selectedFinish && ownProps.selectedFinish.uniqueId,
		};
	}
	const {
		compositeId,
		uniqueId,
		selectedFinish,
		selectedPricedOptions,
	} = configuration;
	return {
		cart: state.cartReducer.cart,
		compositeId,
		productComposite: state.productsReducer[compositeId],
		selectedFinish,
		selectedPricedOptions,
		uniqueId,
	};
};

const mapDispatchToProps = function (dispatch) {
	return {
		actions: bindActionCreators({
			addSessionCartItems,
			createProductConfiguration: productConfigurationsActions.createProductConfiguration,
			getProductComposite,
			trackAction,
			updateCartItemBounce,
		}, dispatch),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(AddToCartSelector);
