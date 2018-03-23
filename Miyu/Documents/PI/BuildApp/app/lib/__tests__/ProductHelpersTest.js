
jest.mock('../../../app/lib/helpers', () => ({
	toBigNumber: jest.fn((number) => number),
}));
jest.mock('../../store/configStore', () => ({
	getState: jest.fn(() => ({
		productConfigurationsReducer: {
			'u-u-i-d-1': {
				selectedPricedOptions: [],
				selectedFinish: {},
				compositeId: 1,
			},
			'u-u-i-d-2': {
				selectedPricedOptions: [{
					optionName: 'option name one',
				}, {
					optionName: 'option name two',
				}],
				selectedFinish: {
					finish: 'finish name',
				},
				compositeId: 2,
			},
		},
		productsReducer: {
			1: {
				pricedOptionGroups: [],
			},
			2: {
				pricedOptionGroups: [{
					optionName: 'option name one',
				}, {
					optionName: 'option name two',
				}, {
					optionName: 'option name three',
				}],
			},
		},
	})),
}));

import productHelpers from '../productHelpers';

describe('productHelpers', () => {

	const uniqueId = 123;
	const product = {
		stockCount: 4,
		manufacturer: 'GE',
		finishes: [{
			uniqueId,
		}],
	};

	describe('getStockText', () => {
		it('should handle in stock', () => {
			const result = productHelpers.getStockText(product);
			expect(result).toEqual('4 In Stock');
		});
		it('should handle out of stock', () => {
			const result = productHelpers.getStockText(product, {
				isOutOfStock: true,
				isMadeToOrder: true,
			});
			expect(result).toEqual('Made To Order');
		});
		it('should handle pre order', () => {
			const result = productHelpers.getStockText(product, {
				isOutOfStock: true,
				isPreOrder: true,
			});
			expect(result).toEqual('Pre-Order');
		});
		it('should handle generic out of stock', () => {
			const result = productHelpers.getStockText(product, {
				isOutOfStock: true,
			});
			expect(result).toEqual('Special Order');
		});
		it('should handle add lead time', () => {
			const result = productHelpers.getStockText(product, {
				isOutOfStock: true,
				text: 'lead time text',
			}, true);
			expect(result).toEqual('Special Order - lead time text');
		});
	});

	describe('getLeadTimeText', () => {
		it('should return lead time text', () => {
			const result = productHelpers.getLeadTimeText({ text: 'testing' });
			expect(result).toEqual('testing');
		});
	});

	describe('hasFinishWithUniqueId', () => {
		it('should return true for matching finish', () => {
			const result = productHelpers.hasFinishWithUniqueId(product, uniqueId);
			expect(result).toEqual(true);
		});
		it('should return false for no matching finish', () => {
			const product = {
				finishes: [{
					uniqueId: 654,
				}],
			};
			const result = productHelpers.hasFinishWithUniqueId(product, uniqueId);
			expect(result).toEqual(false);
		});
	});

	describe('isGeProduct', () => {
		it('should return true for GE products', () => {
			const result = productHelpers.isGeProduct(product);
			expect(result).toEqual(true);
		});
		it('should return false for non GE products', () => {
			const product = {
				manufacturer: 'Non-GE',
			};
			const result = productHelpers.isGeProduct(product);
			expect(result).toEqual(false);
		});
		it('should return false for product without manufacturer prop', () => {
			const result = productHelpers.isGeProduct({});
			expect(result).toEqual(false);
		});
	});

	describe('cartHasGeProducts', () => {
		it('should return true for a cart with GE products', () => {
			const cart = {
				sessionCartItems: [{
					product,
				}],
			};
			const result = productHelpers.cartHasGeProducts(cart);
			expect(result).toEqual(true);
		});
		it('should return false for a cart without GE products', () => {
			const cart = {
				sessionCartItems: [{
					product: {
						manufacturer: 'Non-GE',
					},
				}],
			};
			const result = productHelpers.cartHasGeProducts(cart);
			expect(result).toEqual(false);
		});
		it('should return false for an empty cart object', () => {
			const result = productHelpers.cartHasGeProducts({});
			expect(result).toEqual(false);
		});
	});

	describe('parseGeError', () => {
		const displayName = 'This faucet';
		const errorWithItem = {
			item: {
				product: {
					displayName,
				},
			},
		};
		const zipCode = 77777;

		it('should handle ZIP_CODE_NOT_SERVICEABLE with a zip code', () => {
			const error = {
				...errorWithItem,
				error: 'ZIP_CODE_NOT_SERVICEABLE',
			};
			const result = productHelpers.parseGeError(error, zipCode);
			expect(result).toEqual(`${displayName} cannot be delivered to ZIP code ${zipCode}. Please call for assistance with this order.`);
		});
		it('should handle ZIP_CODE_NOT_SERVICEABLE with a null zip code', () => {
			const error = {
				...errorWithItem,
				error: 'ZIP_CODE_NOT_SERVICEABLE',
			};
			const result = productHelpers.parseGeError(error, null);
			expect(result).toEqual('Please select a shipping location.');
		});
		it('should handle PRODUCT_NOT_AVAILABLE', () => {
			const error = {
				error: 'PRODUCT_NOT_AVAILABLE',
			};
			const result = productHelpers.parseGeError(error);
			expect(result).toEqual('This product is not available.');
		});
		it('should handle PRODUCT_QUANTITY_NOT_AVAILABLE', () => {
			const error = {
				error: 'PRODUCT_QUANTITY_NOT_AVAILABLE',
			};
			const result = productHelpers.parseGeError(error);
			expect(result).toEqual('This product is not available in the quantity you requested.');
		});
		it('should handle GE_DOWN', () => {
			const error = {
				error: 'GE_DOWN',
			};
			const result = productHelpers.parseGeError(error);
			expect(result).toEqual('We were unable to access availability information about This product. Please call us for assistance.');
		});
		it('should handle IN_TRANSIT', () => {
			const error = {
				error: 'IN_TRANSIT',
			};
			const result = productHelpers.parseGeError(error);
			expect(result).toEqual();
		});
		it('should handle an unknown error type', () => {
			const error = {
				error: 'MEH',
			};
			const result = productHelpers.parseGeError(error);
			expect(result).toEqual('An unknown error has occurred.');
		});
	});

	describe('getGeErrorMessage', () => {
		it('should return undefined when not passed an array', () => {
			const result = productHelpers.getGeErrorMessage();
			expect(result).toEqual();
		});
		it('should return a GE error', () => {
			const zipCode = 77777;
			const errors = [{
				error: 'MEH',
			}];
			const result = productHelpers.getGeErrorMessage(errors, zipCode);
			expect(result).toEqual('An unknown error has occurred.');
		});
	});

	describe('cartRequiresDeliveryDate', () => {
		it('should return true for carts needing delivery dates', () => {
			const cart = {
				sessionCartItems: [{
					product: {
						manufacturer: 'GE',
					},
				}],
			};
			const result = productHelpers.cartRequiresDeliveryDate(cart);
			expect(result).toEqual(true);
		});
		it('should return false when it already has a requested delivery date', () => {
			const cart = {
				sessionCartItems: [],
			};
			const result = productHelpers.cartRequiresDeliveryDate(cart, []);
			expect(result).toEqual(false);
		});
	});

	describe('hasPricedOptions', () => {
		it('should return true when array has one or more priced option', () => {
			const productComposite = {
				pricedOptionGroups: [{}],
			};
			const result = productHelpers.hasPricedOptions(productComposite);
			expect(result).toEqual(true);
		});
		it('should return false when priced option groups are empty', () => {
			const productComposite = {
				pricedOptionGroups: [],
			};
			const result = productHelpers.hasPricedOptions(productComposite);
			expect(result).toEqual(false);
		});
	});

	describe('getNextProductCustomization', () => {

		it('should return Finish for no selected finish', () => {
			const productConfigurationId = 'u-u-i-d-1';
			const result = productHelpers.getNextProductCustomization({ productConfigurationId });
			expect(result).toEqual('Finish');
		});
		it('should return the next finish for products with selected finish', () => {
			const productConfigurationId = 'u-u-i-d-2';
			const result = productHelpers.getNextProductCustomization({
				productConfigurationId,
				currentOptionName: 'option name one',
			});
			expect(result).toEqual({
				optionName: 'option name three',
			});
		});
	});

});
