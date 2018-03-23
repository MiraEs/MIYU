'use strict';
import {
	resetInternetCredentials,
	getInternetCredentials,
	setInternetCredentials,
} from 'react-native-keychain';
import { Platform } from 'react-native';
import store from 'react-native-simple-store';

function isIOS() {
	return Platform.OS === 'ios';
}

export default {

	resetCredentialsForDomain(domain) {
		if (isIOS()) {
			resetInternetCredentials(domain);
		} else {
			store.delete(`${domain}-creds`);
		}
	},

	getCredentialsForDomain(domain) {
		if (isIOS()) {
			return getInternetCredentials(domain).catch((error) => {
				if (error.message.indexOf('No keychain entry found for server') !== -1) {
					// if the error is just that there are no credentials just returned undefined
					return;
				}
				throw error;
			});
		} else {
			return new Promise((resolve, reject) => {
				store.get(`${domain}-creds`).then((credentials) => {
					if (credentials) {
						return resolve(JSON.parse(credentials));
					} else {
						return resolve(null);
					}
				}, (error) => reject(error));
			});
		}
	},

	setCredentialsForDomain(domain, username, password) {
		if (isIOS()) {
			setInternetCredentials(domain, username, password);
		} else {
			store.save(`${domain}-creds`, JSON.stringify({username, password}));
		}
	},

};
