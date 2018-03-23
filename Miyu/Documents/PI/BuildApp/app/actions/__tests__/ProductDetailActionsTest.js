
const dispatch = jest.fn();

jest.unmock('../../../app/actions/ProductDetailActions');
import productDetailActions from '../ProductDetailActions';

jest.mock('../../../app/services/productService', () => ({
	getProductRootCategory: jest.fn(() => Promise.resolve({})),
	getProductCompositeByUniqueId: jest.fn(() => Promise.resolve({})),
	getProductCompositeById: jest.fn(() => Promise.resolve({})),
	getProductSpecs: jest.fn(() => Promise.resolve({})),
	getReviews: jest.fn(() => Promise.resolve({})),
	getAvailability: jest.fn(() => Promise.resolve({})),
	getProductCompositeDescription: jest.fn(() => Promise.resolve({})),
}));
import productService from '../../services/productService';

jest.mock('../../../app/services/FavoritesService', () => ({
	saveFavoriteProduct: jest.fn(() => Promise.resolve({})),
}));
import favoritesService from '../../services/FavoritesService';

describe('ProductDetailActions', () => {

	beforeEach(() => {
		productService.getProductRootCategory.mockClear();
		favoritesService.saveFavoriteProduct.mockClear();
		dispatch.mockClear();
	});

	describe('updateSquareFootage', () => {
		it('should return an object', () => {
			const result = productDetailActions.updateSquareFootage({});
			expect(result).toEqual({
				type: 'UPDATE_SQUARE_FOOTAGE',
				payload: {},
			});
		});
	});

	describe('saveLastViewedProductCompositeId', () => {
		it('should return an object', () => {
			const result = productDetailActions.saveLastViewedProductCompositeId(2);
			expect(result).toEqual({
				type: 'SAVE_LAST_VIEWED_PRODUCT_COMPOSITE_ID',
				payload: 2,
			});
		});
	});

	describe('receiveProductRootCategory', () => {
		it('should return an object', () => {
			const payload = {
				test: true,
			};
			const result = productDetailActions.receiveProductRootCategory(payload);
			expect(result).toEqual({
				type: 'RECEIVE_PRODUCT_ROOT_CATEGORY',
				payload,
			});
		});
	});

	describe('getProductRootCategory', () => {
		it('should return a function', () => {
			productDetailActions.getProductRootCategory(2)(dispatch);
			expect(productService.getProductRootCategory).toBeCalledWith(2);
		});
	});

	describe('setProductQAndAFilter', () => {
		it('should return an object', () => {
			const term = 'term';
			const result = productDetailActions.setProductQAndAFilter(term);
			expect(result).toEqual({
				type: 'SET_QUESTION_AND_ANSWER_FILTER',
				term,
			});
		});
	});

	describe('setProductSpecFilter', () => {
		it('should return an object', () => {
			const text = 'text';
			const result = productDetailActions.setProductSpecFilter(text);
			expect(result).toEqual({
				type: 'SET_PRODUCT_SPEC_FILTER',
				text,
			});
		});
	});

	describe('getProductReviews', () => {
		it('should return a function', () => {
			const options = {
				test: true,
			};
			productDetailActions.getProductReviews(options)(dispatch);
			expect(productService.getReviews).toBeCalledWith(options);
		});
	});

	describe('clearReviews', () => {
		it('should return a function', () => {
			productDetailActions.clearReviews()(dispatch);
			expect(dispatch).toBeCalledWith({
				type: 'CLEAR_REVIEWS',
			});
		});
	});

	describe('getProductSpecs', () => {
		it('should return a function', () => {
			productDetailActions.getProductSpecs(2)(dispatch);
			expect(productService.getProductSpecs).toBeCalledWith(2);
		});
	});

	describe('goToGalleryIndex', () => {
		it('should return a function', () => {
			const options = {
				index: 10,
				productConfigurationId: 'u-u-i-d',
			};
			const result = productDetailActions.goToGalleryIndex(options);
			expect(result).toEqual({
				type: 'GALLERY_GO_TO_INDEX',
				payload: options,
			});
		});
	});

});
