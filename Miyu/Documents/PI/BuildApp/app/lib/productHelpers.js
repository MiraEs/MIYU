'use strict';

import helpers from './helpers';
import store from '../store/configStore';
import {
	CHECK_BOX_OPTION,
	I_DONT_NEED_THIS,
	NO_THANK_YOU,
} from '../constants/productDetailConstants';
import productConfigurationHelpers from './ProductConfigurationHelpers';

const productHelpers = {

	getStockText(selectedFinish, leadTimeInformation, addLeadTime) {
		let stockText = `${helpers.toBigNumber(selectedFinish.stockCount)} In Stock`;

		if (leadTimeInformation && leadTimeInformation.isOutOfStock) {
			if (leadTimeInformation.isMadeToOrder) {
				stockText = 'Made To Order';
			} else if (leadTimeInformation.isPreOrder) {
				stockText = 'Pre-Order';
			} else {
				stockText = 'Special Order';
			}
		}

		if (addLeadTime && leadTimeInformation) {
			stockText = `${stockText} - ${leadTimeInformation.text}`;
		}

		return stockText;
	},

	getLeadTimeText(leadTimeInfo) {
		if (leadTimeInfo) {
			return leadTimeInfo.text;
		}
	},

	hasFinishWithUniqueId(composite, uniqueId) {
		let hasFinish = false;
		if (composite && Array.isArray(composite.finishes)) {
			composite.finishes.forEach((finish) => {
				if (finish && finish.uniqueId === uniqueId) {
					hasFinish = true;
				}
			});
		}
		return hasFinish;
	},

	isGeProduct(product = {}) {
		if (product.manufacturer) {
			return product.manufacturer.toLowerCase() === 'ge';
		}
		return false;
	},

	isOptionalPricedOption(pricedOption) {
		const { value } = pricedOption;
		if (typeof value !== 'string') {
			return false;
		}
		return (value.toUpperCase() === NO_THANK_YOU || value.toUpperCase() === I_DONT_NEED_THIS);
	},

	isOptionalPricedOptionGroup(pricedOptionGroup) {
		return pricedOptionGroup.pricedOptions.filter((pricedOption) => {
			if (
				productHelpers.isOptionalPricedOption(pricedOption) ||
				(
					typeof pricedOption.inputType === 'string' &&
					pricedOption.inputType.toUpperCase() === CHECK_BOX_OPTION
				)
			) {
				return true;
			}
			return false;
		}).length > 0;
	},

	cartHasGeProducts(cart) {
		if (cart.sessionCartItems) {
			return !!cart.sessionCartItems.find((cartItem) => {
				if (cartItem.product) {
					return productHelpers.isGeProduct(cartItem.product);
				}
			});
		}
		return false;
	},

	getConfiguredPrice(productConfigurationId) {
		const productConfiguration = productConfigurationHelpers.getProductConfiguration(productConfigurationId);
		const productComposite = productConfigurationHelpers.getProductComposite(productConfigurationId);
		if (!productConfiguration || !productComposite) {
			return 0;
		}
		let price = 0;
		if (productConfiguration.selectedFinish && productConfiguration.selectedFinish.cost) {
			price += productConfiguration.selectedFinish.pricebookCostView.cost;
		}
		if (Array.isArray(productConfiguration.selectedPricedOptions)) {
			productConfiguration.selectedPricedOptions.forEach(({ optionName, pricedOptions }) => {
				const matchingOptionGroup = productComposite.pricedOptionGroups.find((group) => optionName === group.optionName);
				if (matchingOptionGroup) {
					pricedOptions.forEach(({ name }) => {
						const matchingOption = matchingOptionGroup.pricedOptions.find(({ value }) => value === name);
						if (matchingOption) {
							price += matchingOption.calculatedPrice;
						}
					});
				}
			});
		}
		return price;
	},

	parseGeError(error, zipCode) {
		const product = error.item ? error.item.product : {};
		const productName = product.displayName || 'This product';
		switch (error.error) {
			case 'ZIP_CODE_NOT_SERVICEABLE':
				if (zipCode === null) {
					return 'Please select a shipping location.';
				} else {
					return `${productName} cannot be delivered to ZIP code ${zipCode}. Please call for assistance with this order.`;
				}
			case 'PRODUCT_NOT_AVAILABLE':
				return `${productName} is not available.`;
			case 'PRODUCT_QUANTITY_NOT_AVAILABLE':
				return `${productName} is not available in the quantity you requested.`;
			case 'GE_DOWN':
				return `We were unable to access availability information about ${productName}. Please call us for assistance.`;
			case 'IN_TRANSIT':
				break;
			default:
				return 'An unknown error has occurred.';
		}
	},

	getGeErrorMessage(errors, zipCode) {
		if (!Array.isArray(errors)) {
			return;
		}
		for (const index in errors) {
			if (errors.hasOwnProperty(index)) {
				const error = errors[index];
				const errorMessage = productHelpers.parseGeError(error, zipCode);
				if (errorMessage) {
					return errorMessage;
				}
			}
		}
	},

	cartRequiresDeliveryDate(cart, errors) {
		let geItemCount = 0;
		cart.sessionCartItems.forEach((cartItem) => {
			if (productHelpers.isGeProduct(cartItem.product)) {
				geItemCount++;
			}
		});
		return !cart.requestedDeliveryDate && (!Array.isArray(errors) || errors.length < geItemCount);
	},

	hasPricedOptions(productComposite) {
		return productComposite && productComposite.pricedOptionGroups && productComposite.pricedOptionGroups.length > 0;
	},

	getNextProductCustomization({ currentOptionName, productConfigurationId }) {
		const state = store.getState();
		const productConfiguration = state.productConfigurationsReducer[productConfigurationId];
		const {
			pricedOptionGroups,
		} = state.productsReducer[productConfiguration.compositeId];
		const {
			selectedPricedOptions,
			selectedFinish,
		} = productConfiguration;
		if (!selectedFinish || !selectedFinish.finish) {
			return 'Finish';
		}
		const selectedOptionNames = selectedPricedOptions.map((option) => option.optionName);
		if (!selectedOptionNames.includes(currentOptionName)) {
			selectedOptionNames.push(currentOptionName);
		}
		return pricedOptionGroups.find(({ optionName }) => {
			return !selectedOptionNames.includes(optionName);
		});
	},

};

export default productHelpers;
