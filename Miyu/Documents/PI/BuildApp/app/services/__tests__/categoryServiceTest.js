jest.mock('../httpClient', () => ({
	get: jest.fn(),
}));

import categoryService from '../categoryService';
import client from '../httpClient';

describe('categoryService tests', () => {
	describe('getCategories', () => {
		it('should use the right url', () => {
			categoryService.getCategories();
			expect(client.get).toBeCalledWith('/v1/categories/');
		});
	});

	describe('getCategory', () => {
		it('should use the right url', () => {
			const categoryId = 1;
			categoryService.getCategory(categoryId);
			expect(client.get).toBeCalledWith(
				`/v1/categories/${categoryId}`
			);
		});
	});

	describe('getSubCategories', () => {
		it('should use the right url', () => {
			const categoryId = 1;
			categoryService.getSubCategories(categoryId);
			expect(client.get).toBeCalledWith(
				`/v1/categories/${categoryId}/subs?separated=true`
			);
		});
	});
});
