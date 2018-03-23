'use strict';

jest.unmock('../projectsService');
jest.mock('react-native');
jest.mock('../httpClient', () => {
	return {
		get: jest.fn(() => Promise.resolve()),
		post: jest.fn(() => Promise.resolve()),
		delete: jest.fn(),
	};
});
import client from '../httpClient';

import projectsService from '../projectsService';

const SITE_ID = '82';

describe('projectsService', () => {
	describe('get', () => {
		it('should have no query params', () => {
			const options = { customerId: 1 };
			projectsService.get(options);
			const url = `/v1/customers/${options.customerId}/projects/listView`;
			expect(client.get).toHaveBeenCalledWith(url);
		});

		it('should add archived=true query param', () => {
			const options = {
				customerId: 1,
				archived: true,
			};
			projectsService.get(options);
			const url = `/v1/customers/${options.customerId}/projects/listView?archived=true`;
			expect(client.get).toHaveBeenCalledWith(url);
		});
	});

	describe('save', () => {
		it('should call with default params', () => {
			const request = {
				name: 'test name',
				description: '',
				archived: false,
				id: 1,
			};
			projectsService.save(request);
			const query = '';
			const url = `/v1/customers/${request.customerId}/projects${query}`;
			expect(client.post).toHaveBeenCalledWith(url, request);
		});

		it('should call engageExpert=true', () => {
			const body = {
				name: 'test name',
				description: '',
				archived: false,
				id: 1,
			};
			const request = {
				...body,
				engageExpert: true,
			};
			projectsService.save(request);
			const query = '?engageExpert=true';
			const url = `/v1/customers/${request.customerId}/projects${query}`;
			expect(client.post).toHaveBeenCalledWith(url, body);
		});
	});

	describe('sendProjectInvites', () => {
		it('should call with the default params', () => {
			const request = {
				customerId: 1,
				projectId: 1,
				emailAddresses: [],
			};
			projectsService.sendProjectInvites(request);
			expect(client.post)
				.toBeCalledWith(
					`/v1/customers/${request.customerId}/projects/${request.projectId}/invites`,
					request.emailAddresses
				);
		});

	});

	describe('deleteProjectTeamMember', () => {
		it('should call with the default params', () => {
			const request = {
				customerId: 1,
				projectId: 1,
				teamMemberId: 1,
			};
			projectsService.deleteProjectTeamMember(request);
			expect(client.delete)
				.toBeCalledWith(
					`/v1/customers/${request.customerId}/projects/${request.projectId}/team/${request.teamMemberId}`
				);
		});

	});

	describe('getShoppingLists', () => {
		it('should call with the default params', () => {
			const options = {
				customerId: 1,
			};
			projectsService.getShoppingLists(options);
			expect(client.get)
				.toBeCalledWith(
					`/v1/customers/${options.customerId}/shoppingLists?siteId=${SITE_ID}`
				);
		});

	});

	describe('getShoppingListsForProject', () => {
		it('should call with the default params', () => {
			const options = {
				projectId: 1,
			};
			projectsService.getShoppingListsForProject(options);
			expect(client.get)
				.toBeCalledWith(
					`/v1/projects/shoppingListAggregate/${options.projectId}?siteId=${SITE_ID}`
				);
		});

	});

	describe('saveShoppingList', () => {
		it('should call with the default params', () => {
			projectsService.saveShoppingList({ shoppingList: {} });
			expect(client.post)
				.toBeCalledWith(
					'/v1/projects/shoppingList', {
						shoppingList: {},
						siteId: SITE_ID,
					}
				);
		});

	});

});
