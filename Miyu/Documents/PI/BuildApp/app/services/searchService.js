import client from './httpClient';

const searchService = {
	searchByKeyword(request) {
		const url = '/v1/products/keywordSearch/';

		return client.post(url, request);
	},
	searchByCategory(request) {
		const url = '/v1/products/categorySearch/';

		return client.post(url, request);
	},
	typeAhead(body) {
		const url = '/v1/solr/suggest';

		return client.post(url, body);
	},
};

module.exports = searchService;
