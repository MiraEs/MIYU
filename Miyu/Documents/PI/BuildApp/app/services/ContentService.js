import client from './httpClient';
import {
	ROUTE,
	SHARED,
} from '../constants/ContentConstants';
import { STORE_ID as storeId } from '../constants/constants';

const url = '/v1/contents/items/scheduled/active/match/composites';

const ContentService = {

	getContent(id, type) {
		const body = {
			group: {
				id,
				type,
			},
		};
		return client.post(url, body);
	},

	getSharedPromos(categoryId) {
		const body = {
			group: {
				type: SHARED,
			},
			categories: [{
				categoryId,
				storeId,
			}],
		};
		return client.post(url, body);
	},

	getNamedSharedItem(name) {
		const body = {
			group: {
				identities: [{
					type: 'STORE_NAME',
					name,
					storeId,
				}],
				type: SHARED,
			},
		};
		return client.post(url, body);
	},

	getRoutePage(route) {
		const body = {
			group: {
				type: ROUTE,
				routes: [{
					routeReference: {
						route,
						storeId,
					},
				}],
			},
		};
		return client.post(url, body);
	},

	getContentGroup(type, liteResults = true) {
		return client.post(url, {
			group: {
				type,
				storeId,
			},
			liteResults,
		});
	},

};

export default ContentService;
