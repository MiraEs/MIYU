import client from './httpClient';
import { serviceErrorCheck } from '../lib/helpers';

const CheckoutService = {
	checkout(request) {
		const url = '/v1/checkout/';

		return client.post(url, request).then((result) => {
			serviceErrorCheck(result);
			return result;
		})
		.catch((error) => {
			throw error;
		});
	},
};

export default CheckoutService;
