
const dispatch = jest.fn();
jest.mock('redux-actions');

jest.unmock('../../../app/actions/CategoryActions');
import categoryActions from '../CategoryActions';

jest.mock('../../../app/services/categoryService', () => ({
	getCategories: jest.fn(() => Promise.resolve({})),
	getSubCategories: jest.fn(() => Promise.resolve({})),
	getCategory: jest.fn(() => Promise.resolve({})),
}));
import categoryService from '../../services/categoryService';

describe('CategoryActions', () => {

	afterEach(() => {
		categoryService.getCategory.mockClear();
		categoryService.getSubCategories.mockClear();
		categoryService.getCategories.mockClear();
	});

	describe('getCategoriesSuccess', () => {
		it('should return an object with matching props', () => {
			const result = categoryActions.getCategoriesSuccess({});
			expect(result).toEqual({
				type: 'CATEGORIES_SUCCESS',
				payload: {},
			});
		});
	});

	describe('getCategorySuccess', () => {
		it('should return an object with matching props', () => {
			const result = categoryActions.getCategorySuccess({});
			expect(result).toEqual({
				type: 'CATEGORY_SUCCESS',
				payload: {},
			});
		});
	});

	describe('getCategoriesFail', () => {
		it('should return an object with matching props', () => {
			const error = new Error('test');
			const result = categoryActions.getCategoriesFail(error);
			expect(result).toEqual({
				type: 'CATEGORIES_FAIL',
				payload: error,
				error: true,
			});
		});
	});

	describe('getCategories', () => {
		it('should call categoryService.getCategories', () => {
			categoryActions.getCategories()(dispatch);
			expect(categoryService.getCategories).toBeCalled();
		});
	});

	describe('getCategory', () => {
		it('should call categoryService.getCategory and categoryService.getSubCategories with just category id', () => {
			const category = {
				id: 123,
			};
			categoryActions.getCategory(category)(dispatch).then();
			expect(categoryService.getCategory).toBeCalledWith(123);
			expect(categoryService.getSubCategories).toBeCalledWith(123);
		});

		it('should call only categoryService.getSubCategories with full category', () => {
			const category = {
				id: 123,
				name: 'test category',
			};
			categoryActions.getCategory(category)(dispatch);
			expect(categoryService.getCategory).not.toBeCalled();
			expect(categoryService.getSubCategories).toBeCalledWith(123);
		});
	});

});
