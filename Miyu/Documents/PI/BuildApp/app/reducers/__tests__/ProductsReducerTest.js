jest.mock('../../actions/ProductsActions', () => ({
	getProductCompositeSuccess: 'GET_PRODUCT_COMPOSITE_SUCCESS',
	clearProductCache: 'CLEAR_PRODUCT_CACHE',
	AVAILABILITY: {
		UNKNOWN: 'UNKNOWN',
	},
}));
import productsActions from '../../actions/ProductsActions';

jest.mock('../../lib/helpers', () => ({
	removeHTML: jest.fn((text) => text),
	toFloat: jest.fn(),
}));

import productsReducer from '../ProductsReducer';

describe('ProductsReducer', () => {

	it('should have a default state', () => {
		const result = productsReducer();
		expect(result).toEqual({});
	});

	it('should handle GET_PRODUCT_COMPOSITE_SUCCESS with no finishes', () => {
		const result = productsReducer({}, {
			type: 'GET_PRODUCT_COMPOSITE_SUCCESS',
			payload: {
				finishes: [],
				productSpecs: [],
				description: '',
				productQuestions: [],
				productCompositeId: 1234,
			},
		});
		expect(result).toEqual({
			1234: {
				accessories: undefined,
				application: undefined,
				attachmentCount: undefined,
				availability: {
					status: 'UNKNOWN',
				},
				availableByLocation: undefined,
				compositeId: 1234,
				discontinued: undefined,
				finishes: [],
				imageGallery: undefined,
				manufacturer: undefined,
				manufacturerInfo: undefined,
				pricedOptionGroups: undefined,
				productId: undefined,
				productCompositeId: 1234,
				productSpecs: [],
				productVideos: undefined,
				recommendedOptions: undefined,
				reviewRating: undefined,
				rootCategory: undefined,
				series: undefined,
				squareFootageBased: undefined,
				squareFootagePerCarton: undefined,
				type: undefined,
				variations: undefined,
				title: undefined,
				topProductSpecs: [],
				description: '',
				productQuestions: [],
			},
		});
	});

	it('should handle GET_PRODUCT_COMPOSITE_SUCCESS', () => {
		const result = productsReducer({}, {
			type: 'GET_PRODUCT_COMPOSITE_SUCCESS',
			payload: {
				finishes: [{
					status: 'STOCK',
				}, {
					status: 'NON_STOCK',
				}],
				productCompositeId: 1234,
				productSpecs: [{
					attributeName: 'square foot per carton',
					productSpecValue: [{
						value: 22.33,
					}],
				}],
				description: '',
				productQuestions: [{
					question: 'question',
					body: 'body',
				}],
				squareFootageBased: true,
			},
		});
		expect(result).toEqual({
			1234: {
				accessories: undefined,
				application: undefined,
				attachmentCount: undefined,
				availability: {
					status: 'UNKNOWN',
				},
				availableByLocation: undefined,
				compositeId: 1234,
				discontinued: undefined,
				finishes: [{
					status: 'STOCK',
				}],
				imageGallery: undefined,
				manufacturer: undefined,
				manufacturerInfo: undefined,
				pricedOptionGroups: undefined,
				productId: undefined,
				productCompositeId: 1234,
				productSpecs: [{
					attributeName: 'square foot per carton',
					productSpecValue: [{
						value: 22.33,
					}],
				}],
				productVideos: undefined,
				recommendedOptions: undefined,
				reviewRating: undefined,
				rootCategory: undefined,
				series: undefined,
				type: undefined,
				variations: undefined,
				squareFootageBased: true,
				squareFootagePerCarton: undefined,
				title: undefined,
				topProductSpecs: [],
				description: '',
				productQuestions: [{
					body: 'body',
					question: 'question',
				}],
			},
		});
	});

	it('should handle clearProductCache', () => {
		const result = productsReducer({ test: true }, productsActions.clearProductCache);
		expect(result).toMatchSnapshot();
	});

});
