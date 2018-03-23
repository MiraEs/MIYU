import client from './httpClient';
import helpers from '../lib/helpers';
import { SITE_ID } from '../constants/constants';


const PayPalService = {
	startExpressCheckout(options = {}) {
		const url = `/v1/paypal/startExpressCheckout?sessionCartId=${options.sessionCartId}&siteId=${SITE_ID}&domain=${options.domain}`;

		return client.get(url)
			.then((results) => {
				helpers.serviceErrorCheck(results);
				return results;
			})
			.catch((error) => { throw error; });
	},

	processExpressCheckout(options = {}) {
		const url = `/v1/paypal/processExpressCheckout?paypalToken=${options.token}&payerId=${options.payerId}`;

		return client.get(url)
			.then((results) => {
				helpers.serviceErrorCheck(results);
				results.transactionDate = new Date();
				return results;
			})
			.catch((error) => { throw error; });
	},
};

export default PayPalService;
