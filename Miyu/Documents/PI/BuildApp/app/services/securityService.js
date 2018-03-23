'use strict';

import client from './httpClient';

const securityService = {

	getMyCustomerId() {
		const url = '/v1/security/myCustomerId';
		return client.get(url);
	},
};

module.exports = securityService;
