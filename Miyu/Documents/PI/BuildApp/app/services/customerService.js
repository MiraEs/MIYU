'use strict';

import Joi from 'rn-joi';
import environment from	'../lib/environment';
import messages from	'../lib/messages';
import helpers from '../lib/helpers';
import auth from '../lib/auth';
import client from './httpClient';
import securityService from './securityService';
import {
	BILLING_ADDRESS,
	SHIPPING_ADDRESS,
} from '../constants/Addresses';
import Service from './Service';
import proTypeConstants from '../constants/proTypeConstants';

const service = new Service({
	constraints: {
		customerId: Joi.number().required(),
	},
});

const customerService = {

	login(options) {

		const request = {
			username: options.username,
			password: options.password,
			grant_type: 'password',
		};

		return client.authenticate(request)
			.then((response) => {
				if (response && response.access_token) {
					return true;
				} else {
					throw new Error('Unable to authenticate');
				}
			})
			.then(() => {
				if (__DEV__ && options.impersonatorId) {
					return { customerId: options.impersonatorId };
				}
				return securityService.getMyCustomerId();
			})
			.then((response) => {
				if (response && response.customerId) {
					return customerService.getCustomer({
						customerId: response.customerId,
					});
				} else {
					throw new Error('Failed to get customerId');
				}
			})
			.then((response) => {
				if (response && response.customerId) {
					if (!options.impersonatorId) {
						auth.setCredentialsForDomain(environment.keychainDomain, request.username, request.password);
					}
					return response;
				} else {
					throw new Error('Failed to fetch customer data');
				}
			})
			.catch((error) => { throw error; });
	},

	guestLogin(options) {

		const request = {
			username: options.username,
			password: options.password,
			grant_type: 'password',
		};

		return client.authenticate(request)
			.then((response) => {
				if (response && response.access_token) {
					return true;
				} else {
					throw new Error('Unable to authenticate');
				}
			})
			.then(() => securityService.getMyCustomerId())
			.then(({ customerId }) => {
				if (customerId) {
					return customerService.getCustomer({
						customerId,
					});
				} else {
					throw new Error('Failed to get customerId');
				}
			})
			.then((response) => {
				if (response && response.customerId) {
					return response;
				} else {
					throw new Error('Failed to fetch customer data');
				}
			})
			.catch((error) => { throw error; });
	},

	signOut() {
		client.clearBearerToken();
	},

	getCustomer(request) {
		const url = `/v1/customers/${request.customerId}`;
		return client.get(url)
			.then((response) => {
				if (response && response.code) {
					throw new Error(response.code.message);
				}
				return response;
			})
			.catch((error) => { throw error; });
	},

	getCustomerAddresses(request) {
		const addressType = request.addressType === BILLING_ADDRESS ? BILLING_ADDRESS : SHIPPING_ADDRESS;
		const url = `/v1/customers/${request.customerId}/addresses?addressType=${addressType}`;
		return client.get(url)
			.then((addresses) => {
				if (addresses && addresses.code) {
					throw new Error(addresses.code.message);
				}
				return { addresses };
			})
			.catch((error) => { throw error; });
	},

	getDefaultShippingAddress(request) {
		const url = `/v1/customers/${request.customerId}/addresses/shipping/default`;
		return client.get(url)
			.then((address) => {
				if (address && address.code) {
					throw new Error(address.message);
				}
				return { address };
			})
			.catch((error) => { throw error; });
	},

	saveCustomerAddress(request) {
		const url = `/v1/customers/${request.customerId}/addresses${request.query}`;

		return client.post(url, request.body)
			.then((results) => {
				helpers.serviceErrorCheck(results);
				return results;
			})
			.catch((error) => {
				throw error;
			});
	},

	deleteCustomerAddress(request) {
		const url = `/v1/customers/${request.customerId}/addresses/${request.addressId}`;
		return client.delete(url);
	},

	saveCustomer(options) {
		const url = '/v1/customers/';
		const body = {
			...options,
			countryId: 1,
		};

		return client.post(url, body)
			.then((response) => {
				if (response && response.customerId) {
					return {
						success: true,
					};
				} else if (response && response[0] && (response[0].code === 'CUSTOMER-2' || response[0].code === 'CUSTOMER-7')) {
					throw new Error(messages.errors.signUp.userExists);
				} else {
					throw new Error(messages.errors.server);
				}
			})
			.catch((error) => { throw error; });
	},

	createCustomer(options) {
		const { firstName, lastName, email, password, passwordConfirm } = options;
		// validate requirements for new user
		const schema = Joi.object().keys({
			firstName: Joi.string().required(),
			lastName: Joi.string().required(),
			email: Joi.string().email().required(),
			password: Joi.string().min(6).required(),
			passwordConfirm: Joi.any().valid(Joi.ref('password')).required(),
		});

		try {
			Joi.assert({
				firstName,
				lastName,
				email,
				password,
				passwordConfirm,
			}, schema);
		} catch (error) {
			const { path, type } = error.details[0];
			const messages = {
				firstName: { 'any.required': 'You must enter a first name' },
				lastName: { 'any.required': 'You must enter a last name' },
				email: { 'string.email': 'You must enter a valid email address' },
				password: {
					'any.required': 'You must enter a password',
					'string.min': 'Your password must be 6 or more characters',
				},
				passwordConfirm: {
					'any.required': 'You must enter a confirmation password',
					'any.allowOnly': 'Confirmation password must match password',
				},
			};

			return new Promise((resolve, reject) => reject(new Error(messages[path][type])));
		}

		return customerService.saveCustomer(options);
	},

	createGuestUser(options) {
		return client.createCustomer(options);
	},

	registerDeviceToken(customerId, deviceToken) {
		if (customerId) {
			const url = `/v1/customers/${customerId}/devices`;
			return client.post(url, {
				deviceToken,
				platform: environment.apnsPlatform,
			});
		}

		return Promise.resolve();
	},

	unRegisterDeviceToken(token) {
		const url = `/v1/customers/devices?platform=${environment.apnsPlatform}&deviceToken=${token}`;
		return client.delete(url);
	},

	getProjectPhotoGalleryViews(request) {
		const url = `/v1/customers/${request.customerId}/projects/${request.projectId}/gallery`;
		return client.get(url);
	},

	getNotificationSettings(request) {
		const url = `/v1/customers/${request.customerId}/notificationSettings`;
		return client.get(url);
	},

	saveNotificationSettings(request = {}) {
		let url = `/v1/customers/${request.customerId}/notificationSettings`;
		if (Array.isArray(request.body)) {
			url += '/multi';
		}
		return client.post(url, request.body);
	},

	/**
	 * This service endpoint enables/disables All push notification setting.
	 * NOTE: the individual push settings will not be effected by this.
	 *
	 * @param request, object with customer id and query param to enable/disable All push switch
	 * @returns {Promise}
	 */
	allowNotifications(request) {
		const url = `/v1/customers/${request.customerId}/notificationSettings/userPushNotificationsEnabled?enabled=${request.enabled}`;
		return client.post(url);
	},

	resetPassword(email) {
		const url = `${environment.api.url}/v1/customers/resetPassword?email=${email}`;

		return client.anonymousOauthAuthentication()
			.then((response) => {
				if (response) {
					return fetch(url, {
						method: 'post',
						body: '',
						headers: {
							'Content-Type': 'application/json',
							Authorization: `Bearer ${response}`,
							Accept: 'application/json',
						},
					});
				}
			})
			.then((response) => !!(response && response.status === 200))
			.catch(() => {
				return false;
			});
	},

	getNotifications(customerId, markRead = false, page = null, eventTypes = null) {
		const url = `/v1/customers/${customerId}/pagedNotifications/?markRead=${markRead}${page ? `&page=${page}` : ''}${eventTypes ? `&eventTypes=${eventTypes}` : ''}`;
		return client.get(url);
	},

	markNotificationRead(request) {
		const url = `/v1/customers/${request.customerId}/notification/${request.notificationId}`;
		return client.post(url);
	},

	markNotificationsAcknowledged: service.createEndpoint(
		(request) => client.post(`/v1/customers/${request.customerId}/notifications/markAllAcknowledged`)
	),

	getUnacknowledgedNotificationCount: service.createEndpoint(
		(request) => client.get(`/v1/customers/${request.customerId}/notifications/unacknowledgedCount`)
	),

	getProjectInviteViews(request, successCallback, errorCallback) {
		const url = `/v1/customers/${request.customerId}/projects/${request.projectId}/invites`;

		client.get(url)
			.then((result) => {
				if (result.code) {
					errorCallback(result);
				} else {
					successCallback(result);
				}
			})
			.catch((error) => {
				errorCallback(error);
			});
	},

	resendProjectInvite(request) {
		const url = `/v1/customers/${request.customerId}/projects/${request.projectId}/invites/${request.inviteId}`;
		return client.post(url);
	},

	rejectProjectInvite(request, successCallback, errorCallback) {
		const url = `/v1/customers/${request.customerId}/projects/${request.projectId}/invites/${request.inviteId}`;

		client.delete(url)
			.then((result) => {
				if (result && result.code) {
					errorCallback(result);
				} else {
					successCallback();
				}
			})
			.catch((error) => {
				errorCallback(error);
			});
	},

	getEvent(request) {
		const url = `/v1/customers/${request.customerId}/events/${request.eventId}`;
		return client.get(url);
	},

	getProjectOwner(request) {
		const url = `/v1/customers/${request.customerId}/projects/${request.projectId}/owner`;
		return client.get(url);
	},

	getProjectTeam(request) {
		const url = `/v1/customers/${request.customerId}/projects/${request.projectId}/team`;
		return client.get(url);
	},

	saveEventComment(options, successCallback, errorCallback) {
		const url = `/v1/customers/${options.customerId}/eventComments`;
		client.post(url, options)
			.then((result) => {
				if ((result && result.code) || (result && !result.commentId)) {
					errorCallback(result);
				} else {
					successCallback(result);
				}
			})
			.catch((error) => {
				errorCallback(error);
			});
	},

	uploadUserPhoto(request) {
		const url = `/v1/customers/${request.customerId}/photos`;
		return client.upload(url, {
			imageFile: request.uri,
		});

	},

	getFavorites(request) {
		const url = `/v1/customers/${request.customerId}/favorites`;
		return client.get(url);
	},

	saveProjectFavorite(request) {
		const url = `/v1/customers/${request.customerId}/projects/${request.projectId}/favorites/${request.favoriteId}`;
		return client.post(url, {});
	},

	saveProjectOrder(request) {
		const url = `/v1/customers/${request.customerId}/projects/${request.projectId}/orders/${request.order.orderNumber}`;

		return client.post(url, {});
	},

	getOrders(customerId) {
		const url = `/v1/customers/${customerId}/orders`;
		return client.get(url);
	},

	getOrder(customerId, orderNumber) {
		const url = `/v1/customers/${customerId}/orders/${orderNumber}`;
		return client.get(url);
	},

	getShippingInfo(customerId, orderNumber) {
		const url = `/v1/customers/${customerId}/shipments/${orderNumber}/Build`;
		return client.get(url);
	},

	getReturns(customerId) {
		const url = `/v1/customers/${customerId}/returns`;
		return client.get(url);
	},

	getReturn(customerId, returnId) {
		const url = `/v1/customers/${customerId}/returns/${returnId}`;
		return client.get(url);
	},

	addCreditCard(creditCard) {
		const { url } = environment.paymentGateway;
		return client.post(url, creditCard)
			.then((results) => {
				helpers.serviceErrorCheck(results);
				return results;
			})
			.catch((error) => { throw error; });
	},

	getCreditCards(customerId) {
		const url = `/v1/customers/${customerId}/creditCards`;

		return client.get(url)
			.then((results) => {
				helpers.serviceErrorCheck(results);
				return results;
			})
			.catch((error) => { throw error; });
	},

	getDefaultCreditCards(customerId) {
		const url = `/v1/customers/${customerId}/creditCards/default`;

		return client.get(url)
			.then((results) => {
				helpers.serviceErrorCheck(results);
				return results;
			})
			.catch((error) => { throw error; });
	},

	deleteCreditCard(customerId, creditCardId) {
		const url = `/v1/customers/${customerId}/creditCards/${creditCardId}`;
		return client.delete(url)
			.then((result) => {
				helpers.serviceErrorCheck(result);
				return result;
			});
	},

	getStoreCredit(customerId) {
		const url = `/v1/customers/${customerId}/storeCredit`;
		return client.get(url);
	},

	getCustomerRep(customerId) {
		const url = `/v1/customers/${customerId}/rep`;
		return client.get(url);
	},

	createCustomerServiceRequest(request) {
		const url = '/v1/customers/serviceRequest';

		//indicate that it is from the app
		request.body.comments = `Request from buildapp \n ${request.body.comments}`;

		return client.post(url, request.body);
	},

	getCustomerRewardsTierInfo(customerId) {
		const url = `/v1/customers/${customerId}/rewards/info`;
		return client.get(url);
	},

	verifyPassword(options) {
		const request = {
			username: options.username,
			password: options.password,
			grant_type: 'password',
		};

		return client.verifyPassword(request)
			.then((response) => {
				if (response && response.access_token) {
					return true;
				} else {
					throw new Error('Unable to authenticate');
				}
			})
			.catch((error) => {
				throw error;
			});
	},

	saveProfessionalData(request) {
		const url = `/v1/customers/${request.customerId}/professionalData`;
		const body = {
			confirmed: null,
			employeeId: null,
			proType: proTypeConstants.SELF_IDENTIFIED,
			subscribed: true,
		};
		return client.post(url, body);
	},

	saveUserAnswers(request) {
		const url = `/v1/customers/${request.customerId}/questionnaires/answers`;
		return client.post(url, request.body);
	},
};


module.exports = customerService;
