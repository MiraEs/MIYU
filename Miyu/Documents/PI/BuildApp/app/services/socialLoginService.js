'use strict';

import client from './httpClient';
import environment from '../lib/environment';
import securityService from './securityService';
import customerService from './customerService';
import facebookService from './facebookService';
import store from 'react-native-simple-store';
import {
	DID_LOGIN_WITH_SOCIAL,
	SOCIAL_LOGIN_TYPE,
} from '../constants/constants';

function getAnonymousAuthClientData(socialLoginType) {
	const url = `${environment.api.url}/v1/socialLogin/${socialLoginType}/clientLoginData`;
	return client.anonymousOauthAuthentication()
		.then((token) => {
			if (token) {
				return fetch(url, {
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`,
					},
				});
			}
		})
		.then((response) => response.json())
		.then((response) => response.clientId);
}

/**
 * Authenticate with social user token
 * Basically, grant the user access to other endpoints that sit behind oauth
 */
function socialLoginAuth(socialUserAccessToken, socialLoginType) {
	const request = {
		userAccessToken: socialUserAccessToken,
		grant_type: 'social_login',
		socialLoginType,
	};
	return client.authenticate(request);
}

const socialLoginService = {

	/**
	 * Get client login data from Build public API and social login provider
	 */
	getClientLoginData(socialLoginType = 'facebook') {
		let socialClientId;
		let socialUserAccessToken;

		return Promise
			.all([getAnonymousAuthClientData(socialLoginType), facebookService.getToken()])
			.then((response) => {
				socialClientId = response[0];
				socialUserAccessToken = response[1];
			})
			.then(() => socialLoginAuth(socialUserAccessToken, socialLoginType))
			.then(() => client.get('/v1/security/socialUserData'))
			.then((response) => {
				const { promptForCustomer, socialUserId } = response;

				if (!promptForCustomer) {
					return socialLoginService.login({
						socialLoginType,
					});
				} else {
					// if they need to create an account with social or link an existing
					// account with social return this data for later use
					return {
						socialClientId,
						socialUserId,
						socialUserAccessToken,
						promptForCustomer,
					};
				}
			})
			.catch((error) => {
				if (error && error.isCancelled) {
					return error;
				}
				if (error instanceof Error) {
					throw error;
				}
				throw new Error(error);
			});
	},

	/**
	 * Create a user from social login token
	 */
	createSocialLoginCustomer({ socialUserAccessToken, socialLoginType = 'facebook' }) {

		return client.post(`/v1/socialLogin/${socialLoginType}`)
			.then((response) => {
				if (response && response.customerId) {
					return socialLoginAuth(socialUserAccessToken, socialLoginType).then(() => response);
				}
				return response;
			})
			.then((response) => {
				if (response && response.length === 1 && response[0].code) {
					if (response[0].code === 'CUSTOMER-7') {
						// CUSTOMER-7 means the email address is already signed up
						const emailMatches = response[0].message.match(/\[(.*?)\]/);
						const email = emailMatches ? emailMatches[1] : undefined;
						return {
							shouldPromptForCredentials: true,
							email,
							socialUserAccessToken,
						};
					} else if (response[0].code === 'CUSTOMER-1') {
						// CUSTOMER-1 means that there is no email address associated with
						// the provided social account and our system doesn't handle
						// creating an account without an email address
						return {
							shouldShowNoEmailErrorMessage: true,
						};
					}
				} else if (response && response.customerId) {
					// customer was created successfully
					store.save(DID_LOGIN_WITH_SOCIAL, true);
					store.save(SOCIAL_LOGIN_TYPE, socialLoginType);
					return response;
				}
			})
			.catch((error) => { throw error; });
	},

	/**
	 * login the user
	 */
	login({ socialLoginType }) {
		return securityService.getMyCustomerId()
			.then((customer) => {
				return customerService.getCustomer({
					customerId: customer.customerId,
				});
			})
			.then((response) => {
				store.save(DID_LOGIN_WITH_SOCIAL, true);
				store.save(SOCIAL_LOGIN_TYPE, socialLoginType);
				return response;
			})
			.catch((error) => { throw error; });
	},

	/**
	 * Link existing customer to social login token
	 */
	linkExistingCustomer(request) {
		const { username, password, socialLoginType, socialUserAccessToken, socialUserId } = request;
		return client
			.authenticate({
				username,
				password,
				grant_type: 'password',
			})
			.then((response) => {
				if (response && response.access_token) {
					return securityService.getMyCustomerId();
				} else {
					throw new Error('Could not authenticate with given credentials.');
				}
			})
			.then((response) => {
				if (response && response.customerId) {
					const { customerId } = response;
					return client
						.post(`/v1/socialLogin/${socialLoginType}/${customerId}?userAccessToken=${socialUserAccessToken}&socialUserId=${socialUserId}`);
				} else {
					throw new Error('Could not get customerId with new auth token.');
				}
			})
			.then((response) => {
				if (response && response.customerId) {
					store.save(DID_LOGIN_WITH_SOCIAL, true);
					store.save(SOCIAL_LOGIN_TYPE, socialLoginType);
					return response;
				} else {
					throw new Error('Could not link existing customer to social login.');
				}
			})
			.catch((error) => {
				if (error instanceof Error) {
					throw error;
				}
				throw new Error(error);
			});
	},
};

export default socialLoginService;
