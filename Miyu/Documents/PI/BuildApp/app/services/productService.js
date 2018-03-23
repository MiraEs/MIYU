'use strict';

import client from './httpClient';
import {
	STORE_ID,
} from '../constants/constants';
import { bazaarVoice } from '../lib/environment';

const productService = {

	getProductCompositeDescription(options) {
		const url = `/v1/products/composite/${options.compositeId}/descriptions`;
		return client.get(url).then((data) => {
			if (data && data.code) {
				throw new Error(data.code);
			}
			return data;
		});
	},

	getProductCompositeByUniqueId(options) {
		const url = `/v1/products/composite?uniqueId=${options.uniqueId}`;
		return client.get(url)
			.then((data) => {
				if (data && data.code) {
					throw new Error(data.code);
				}
				return data;
			})
			.catch((error) => { throw error; });
	},

	getProductCompositeById(options) {
		const url = `/v1/products/composite/${options.compositeId}?storeId=${STORE_ID}`;

		return client.get(url)
			.then((data) => {
				if (data && data.code) {
					throw new Error(data.code);
				}
				return data;
			})
			.catch((error) => { throw error; });
	},

	getReviews(options) {
		const compositeId = options.compositeId,
			limit = options.limit || 5,
			offset = options.page || 0,
			sort = options.type || 'SubmissionTime:desc',
			url = `http://${bazaarVoice.url}&passkey=${bazaarVoice.apiKey}&Limit=${limit}&Offset=${offset*limit}&Sort=${sort}&Filter=ProductId:cp-${compositeId}`;

		return client.get(url)
			.then((data) => {
				if (data && data.Errors.length > 0) {
					throw new Error(data.Errors);
				}
				return data;
			})
			.catch((error) => { throw error; });
	},

	getProductAttachments({ compositeId }) {
		const url = `/v1/products/composite/${compositeId}/attachments`;

		return client.get(url)
			.then((data) => {
				if (data && data.code) {
					throw new Error(data.code);
				}
				return data;
			})
			.catch((error) => { throw error; });
	},

	getProductSpecs(compositeId) {
		const url = `/v1/products/specs/${compositeId}/`;
		return client.get(url);
	},

	getAvailability(uniqueId, zipCode, quantity) {
		const url = `/v1/ge/availability?uniqueId=${uniqueId}&zipCode=${zipCode}&quantity=${quantity}`;
		return client.get(url);
	},

	getProductRootCategory(compositeId) {
		const url = `/v1/products/composite/${compositeId}/rootCategory`;
		return client.get(url);
	},

	getArProducts() {
		const url = 'https://s1.img-b.com/mediabase/native/arkit/ar-products.json';
		return fetch(url).then((response) => {
			return response.text().then((text) => {
				return JSON.parse(text);
			});
		});
	},

};

module.exports = productService;
