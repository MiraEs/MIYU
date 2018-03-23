jest.mock('../httpClient', () => ({
	post: jest.fn(),
}));

import ContentService from '../ContentService';
import client from '../httpClient';
const url = '/v1/contents/items/scheduled/active/match/composites';
import {
	ROUTE,
	SHARED,
} from '../../constants/ContentConstants';
import { STORE_ID as storeId } from '../../constants/constants';

describe('ContentService tests', () => {
	describe('getContent', () => {
		it('should use the right url', () => {
			const type = 'test';
			const id = 1;
			ContentService.getContent(id, type);
			expect(client.post).toBeCalledWith(url, {
				group: {
					id,
					type,
				},
			});
		});
	});

	describe('getSharedPromos', () => {
		it('should use the right url', () => {
			const categoryId = 1;
			ContentService.getSharedPromos(categoryId);
			expect(client.post).toBeCalledWith(url, {
				group: {
					type: SHARED,
				},
				categories: [{
					categoryId,
					storeId,
				}],
			});
		});
	});

	describe('getRoutePage', () => {
		it('should use the right url', () => {
			const route = 'test';
			ContentService.getRoutePage(route);
			expect(client.post).toBeCalledWith(url, {
				group: {
					type: ROUTE,
					routes: [{
						routeReference: {
							route,
							storeId,
						},
					}],
				},
			});
		});
	});

	describe('getContentGroup', () => {
		it('should use the right url', () => {
			const type = 'test';
			ContentService.getContentGroup(type);
			expect(client.post).toBeCalledWith(url, {
				group: {
					type,
					storeId,
				},
				liteResults: true,
			});
		});
	});
});
