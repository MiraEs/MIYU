import client from './httpClient';

const categoryService = {
	getCategories() {
		const url = '/v1/categories/';
		return client.get(url);
	},

	getCategory(categoryId) {
		const url = `/v1/categories/${categoryId}`;
		return client.get(url);
	},

	getSubCategories(categoryId) {
		const url = `/v1/categories/${categoryId}/subs?separated=true`;
		return client.get(url);
	},
};


module.exports = categoryService;
