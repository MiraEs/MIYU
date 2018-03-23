
import httpClient from '../services/httpClient';

function getZipCodeInfo(zipCode) {
	return async () => {
		const url = `/v1/utility/validation/zipcode/${zipCode}`;
		return await httpClient.get(url);
	};
}

export default {
	getZipCodeInfo,
};
