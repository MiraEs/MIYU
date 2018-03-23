import client from './httpClient';
import tracking from '../lib/analytics/tracking';
import { SITE_ID } from '../constants/constants';
import helpers from '../lib/helpers';

const projectService = {

	get(options) {
		let filters = '';
		const queries = [];
		if (options.archived) {
			queries.push('archived=true');
		}
		if (options.includeInvited) {
			queries.push('includeInvited=true');
		}
		if (queries.length) {
			filters = `?${queries.join('&')}`;
		}

		const url = `/v1/customers/${options.customerId}/projects/listView${filters}`;

		return client.get(url)
			.then((data) => {
				if (data && data.code) {
					throw new Error(data.code);
				}
				return data;
			})
			.catch((error) => { throw error; });
	},

	save(request) {
		const body = {
			name: request.name || 'Untitled Project',
			description: request.description || '',
			archived: request.archived || false,
			id: request.id,
		};

		let query = '';

		if (request.engageExpert) {
			query = '?engageExpert=true';
		}

		const url = `/v1/customers/${request.customerId}/projects${query}`;

		return client.post(url, body)
			.then((response) => {
				if (response && response.code) {
					throw new Error(response.message);
				}
				if (!body.id) {
					tracking.trackAction('Project_creation', {
						project_id: response.id,
						project_title: response.name.length > 0,
						project_description: response.description.length > 0,
						'@expert': request.engageExpert,
						project_status: response.archived ? 'archived' : 'active',
					});
				}
				return response;
			})
			.catch((error) => { throw error; });
	},

	sendProjectInvites(request) {
		const url = `/v1/customers/${request.customerId}/projects/${request.projectId}/invites`;
		return client.post(url, request.emailAddresses);
	},

	deleteProjectTeamMember(request) {
		const url = `/v1/customers/${request.customerId}/projects/${request.projectId}/team/${request.teamMemberId}`;
		return client.delete(url);
	},

	getShoppingLists(options) {
		const url = `/v1/customers/${options.customerId}/shoppingLists?siteId=${SITE_ID}`;
		return client.get(url)
			.then((data) => {
				helpers.serviceErrorCheck(data);
				return data;
			});
	},

	getShoppingListsForProject(options) {
		const url = `/v1/projects/shoppingListAggregate/${options.projectId}?siteId=${SITE_ID}`;
		return client.get(url);
	},

	saveShoppingList(request) {
		const url = '/v1/projects/shoppingList';
		const body = {
			...request,
			siteId: SITE_ID,
		};
		return client.post(url, body);
	},

	attachCartItemToProject(projectId, projectItemId, itemId) {
		const query = `projectId=${projectId}&projectItemId=${projectItemId}&itemId=${itemId}&siteId=${SITE_ID}`;
		const url = `/v1/projects/shoppingListCartItem/?${query}`;
		return client.post(url);
	},

	deleteGroup(projectShoppingListGroupId) {
		const url = `/v1/projects/shoppingLists/${projectShoppingListGroupId}`;
		return client.delete(url);
	},
};


module.exports = projectService;
