'use strict';

import {
	AccessToken,
	GraphRequest,
	GraphRequestManager,
	LoginManager,
} from 'react-native-fbsdk';

const facebookService = {

	getToken() {
		return new Promise((resolve, reject) => {
			return AccessToken.getCurrentAccessToken()
				.then((token) => {
					if (token && token.accessToken) {
						// we already have an accessToken, let's see if it's good
						const now = new Date();
						if (now.getTime() > token.expirationTime) {
							// expired token
							return AccessToken.refreshCurrentAccessTokenAsync()
								.then(AccessToken.getCurrentAccessToken)
								.then((token) => resolve(token.accessToken));
						}

						return resolve(token.accessToken);
					} else {
						// no token, let's request permissions and get one
						LoginManager.logInWithReadPermissions(['public_profile', 'email'])
							.then((data) => {
								if (data.isCancelled) {
									return reject(data);
								}
								return AccessToken.getCurrentAccessToken()
									.then((token) => resolve(token.accessToken));
							})
							.catch((error) => {
								if (error) {
									return reject();
								}
							});
					}
				});
		});
	},

	getUserInfo() {
		return new Promise((resolve, reject) => {
			const processUserInfo = (error, result) => {
				if (error) {
					return reject(error);
				}

				const {
					email = '',
					first_name:firstName = '',
					last_name:lastName = '',
				} = result;
				return resolve({
					email,
					firstName,
					lastName,
				});
			};

			const infoRequest = new GraphRequest(
				'/me?fields=first_name,last_name,email',
				null,
				processUserInfo,
			);
			// Start the graph request.
			new GraphRequestManager().addRequest(infoRequest).start();
		});
	},

};

module.exports = facebookService;
