import { SMARTY_STREETS_ERROR, SMARTY_STREETS_URL } from '../constants/ExternalApis';
import {
	isValidUSZipcode,
	isValidCanadianZipcode,
} from '../lib/Validations';
import {
	US,
	CANADA,
} from '../constants/Addresses';

class SmartyStreets {
	get(zip) {
		return new Promise((resolve) => {
			const address = {
				zip: {
					value: zip,
					valid: false,
				},
			};

			if (isValidUSZipcode(zip)) {
				fetch(`${SMARTY_STREETS_URL}&zipcode=${zip}`)
					.then((data) => {
						if (!data.ok) {
							throw new Error(SMARTY_STREETS_ERROR);
						}

						return data.json();
					})
					.then((resJson) => resJson[0])
					.then((response) => {
						if (response.hasOwnProperty('status')) {
							// this happens when Smarty Streets can't find the zip
							throw new Error(response.reason);
						}

						return { zipInfo: response.city_states[0], city_states: response.city_states };
					})
					.then(({ city_states, zipInfo }) => {
						address.city = {
							value: zipInfo.city,
							valid: true,
						};
						address.state = {
							value: zipInfo.state_abbreviation,
							valid: true,
						};
						address.country = {
							value: US,
							valid: true,
						};
						address.zip.valid = true;

						resolve({address, city_states, valid: true, error: ''});
					})
					.catch((err) => {
						resolve({address, city_states: [], valid: false, error: err.message});
					})
					.done();
			} else if (isValidCanadianZipcode(zip)) {
				// no Smarty Streets for Canada
				address.country = {
					value: CANADA,
					valid: true,
				};
				address.zip.valid = true;

				resolve({address, city_states: [], valid: true, error: ''});
			} else {
				resolve({address, city_states: [], valid: false, error: 'Invalid ZIP Code.'});
			}
		});
	}
}

const smartyStreets = new SmartyStreets();

module.exports = smartyStreets;
