jest.mock('../httpClient', () => ({
	delete: jest.fn(() => ({
		then: jest.fn(() => ({
			catch: jest.fn(),
		})),
	})),
	get: jest.fn(() => ({
		then: jest.fn(() => ({
			catch: jest.fn(),
		})),
	})),
	post: jest.fn(() => ({
		then: jest.fn(() => ({
			catch: jest.fn(),
		})),
	})),
	put: jest.fn(() => ({
		then: jest.fn(() => ({
			catch: jest.fn(),
		})),
	})),
}));

import productService from '../productService';
import client from '../httpClient';
import { bazaarVoice } from '../../lib/environment';

describe('productServiceproductService tests', () => {
	describe('getProductCompositeDescription', () => {
		it('should use the right url', () => {
			const options = {
				compositeId: 1,
			};
			productService.getProductCompositeDescription(options);
			expect(client.get).toBeCalledWith(
				`/v1/products/composite/${options.compositeId}/descriptions`
			);
		});
	});

	describe('getProductCompositeByUniqueId', () => {
		it('should use the right url', () => {
			const options = {
				uniqueId: 1,
			};
			productService.getProductCompositeByUniqueId(options);
			expect(client.get).toBeCalledWith(
				`/v1/products/composite?uniqueId=${options.uniqueId}`
			);
		});
	});

	describe('getReviews', () => {
		it('should use the right url', () => {
			const options = {
				compositeId: 1,
			};
			productService.getReviews(options);
			expect(client.get).toBeCalledWith(
				`http://${bazaarVoice.url}&passkey=${bazaarVoice.apiKey}&Limit=5&Offset=0&Sort=SubmissionTime:desc&Filter=ProductId:cp-${options.compositeId}`
			);
		});

		it('should use the right url #2', () => {
			const options = {
				compositeId: 1,
				limit: 2,
				page: 3,
				type: 'Name:asc',
			};
			productService.getReviews(options);
			expect(client.get).toBeCalledWith(
				`http://${bazaarVoice.url}&passkey=${bazaarVoice.apiKey}&Limit=${options.limit}&Offset=${options.page*options.limit}&Sort=${options.type}&Filter=ProductId:cp-${options.compositeId}`
			);
		});

	});

	describe('getProductAttachments', () => {
		it('should use the right url', () => {
			const options = {
				compositeId: 1,
			};
			productService.getProductAttachments(options);
			expect(client.get).toBeCalledWith(`/v1/products/composite/${options.compositeId}/attachments`);
		});
	});

	describe('getProductSpecs', () => {
		it('should use the right url', () => {
			const compositeId = 1;
			productService.getProductSpecs(compositeId);
			expect(client.get).toBeCalledWith(`/v1/products/specs/${compositeId}/`);
		});
	});

	describe('getAvailability', () => {
		it('should use the right url', () => {
			const uniqueId = 1, zipCode = '11111', quantity = 2;
			productService.getAvailability(uniqueId, zipCode, quantity);
			expect(client.get).toBeCalledWith(`/v1/ge/availability?uniqueId=${uniqueId}&zipCode=${zipCode}&quantity=${quantity}`);
		});
	});

	describe('getProductRootCategory', () => {
		it('should use the right url', () => {
			const compositeId = 1;
			productService.getProductRootCategory(compositeId);
			expect(client.get).toBeCalledWith(`/v1/products/composite/${compositeId}/rootCategory`);
		});
	});

});
