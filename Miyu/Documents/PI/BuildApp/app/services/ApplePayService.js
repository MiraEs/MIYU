import client from './httpClient';
import helpers from '../lib/helpers';

const ApplePayService = {
	authorizations(request = {}) {
		const url = '/v1/applepay/authorizations';

		return client.post(url, request)
			.then((results) => {
				helpers.serviceErrorCheck(results);

				if (results && results.statusCode !== 200) {
					throw new Error(results.providerMessage || 'Declined');
				}

				return results;
			})
			.catch((error) => { throw error; });
	},
};

export default ApplePayService;
