import { createAction } from 'redux-actions';
import store from 'react-native-simple-store';
import customerService from '../services/customerService';
import securityService from '../services/securityService';
import auth from '../lib/auth';
import {
	CREATE_USER_FAIL,
	UPDATE_USER_FAIL,
	REQUEST_CREATE_USER,
	GET_CUSTOMER_ID_SUCCESS,
	KEYCHAIN_FETCH_CREDS_FAIL,
	GET_CUSTOMER_SUCCESS,
	GET_CUSTOMER_FAIL,
	GET_CUSTOMER_REP_SUCCESS,
	GET_CUSTOMER_REP_FAIL,
	GET_CUSTOMER_REWARDS_TIER,
	UPDATE_SIGNUP_ERROR,
	LOGIN_USER_BEGIN,
	LOGIN_USER_FINISH,
	LOGIN_USER_RESET,
	LOGIN_USER_SUCCESS,
	LOGIN_USER_ERROR,
	UPDATE_USER,
	UPDATE_DEVICE_TOKEN,
	SET_IMPERSONATOR_ID,
} from '../constants/Auth';
import {
	SOCIAL_GET_CLIENT_DATA,
} from '../constants/SocialConstants';
import environment from '../lib/environment';
import {
	NOTIFICATION_SETTINGS_HAVE_BEEN_UPDATED,
	SAVE_NOTIFICATION_SETTINGS_SUCCESS,
	GUEST_NOTIFICATIONS_SETTINGS,
	SAVE_GUEST_NOTIFICATION_SETTINGS_SUCCESS,
	ALLOW_NOTIFICATIONS_SUCCESS,
	ALLOW_NOTIFICATIONS_FAILED,
} from '../constants/Notifications';
import { getCustomerFavorites } from '../actions/FavoritesActions';
import {
	getProjects,
	getShoppingLists,
} from '../actions/ProjectActions';
import {
	clearNotificationsData,
	getUnacknowledgedNotificationCount,
} from '../actions/NotificationActions';
import productsActions from '../actions/ProductsActions';
import { historyClear } from '../actions/HistoryActions';
import { getSessionCart } from '../actions/CartActions';
import {
	SHIPPING_ADDRESS,
	BILLING_ADDRESS,
} from '../constants/Addresses';
import { LISTS } from '../constants/constants';
import tracking from '../lib/analytics/tracking';
import Instabug from 'Instabug';
import { LoginManager } from 'react-native-fbsdk';
import SimpleStoreHelpers from '../lib/SimpleStoreHelpers';
import helpers from '../lib/helpers';
import { NavigationActions } from '@expo/ex-navigation';

/**
 * Log In
 */
function login(username, payload) {
	return {
		type: LOGIN_USER_SUCCESS,
		username,
		payload,
	};
}

function resetLoginState() {
	return {
		type: LOGIN_USER_RESET,
	};
}

function loginFail(error) {
	return {
		type: LOGIN_USER_ERROR,
		error,
	};
}

function loginBegin() {
	return {
		type: LOGIN_USER_BEGIN,
	};
}

function loginFinish() {
	return {
		type: LOGIN_USER_FINISH,
	};
}

function updateUser(user) {
	return {
		type: UPDATE_USER,
		payload: {
			user,
		},
	};
}

/**
 * We need to save notifications settings that are only allowed for Guest users. We need to honor those settings
 * for guest user in case auth user logs out. Currently, we only support MARKETING for guest users.
 *
 * @param settings, can be an array of settings or a single object (e.g. MARKETING).
 */
function saveGuestNotificationSettings(settings) {
	const guestSettings = [];
	if (Array.isArray(settings)) {
		settings.forEach((setting) => {
			if (setting.eventType === 'MARKETING') {
				guestSettings.push(setting);
			}
		});
	} else {
		if (settings.eventType === 'MARKETING') {
			guestSettings.push(settings);
		}
	}
	store.save(GUEST_NOTIFICATIONS_SETTINGS, guestSettings).catch(helpers.noop).done();
	return {
		type: SAVE_GUEST_NOTIFICATION_SETTINGS_SUCCESS,
	};
}

const saveNotificationSettingsSuccess = createAction(SAVE_NOTIFICATION_SETTINGS_SUCCESS, (options) => {
	if (Array.isArray(options)) {
		return options.map((option) => {
			return {
				type: option.eventType,
				enabled: option.enabled,
			};
		});
	}
	return {
		type: options.eventType,
		enabled: options.enabled,
	};
});

function saveNotificationSettingsFail(error, options) {
	return {
		type: 'SAVE_NOTIFICATION_SETTINGS_FAIL',
		payload: {
			error,
			type: options.eventType,
			enabled: options.enabled,
		},
	};
}

function deviceTokenChanged(token) {
	return {
		type: UPDATE_DEVICE_TOKEN,
		token,
	};
}

function saveNotificationSettings(options) {
	return (dispatch, getState) => {
		dispatch(saveNotificationSettingsSuccess(options));
		dispatch(saveGuestNotificationSettings(options));
		const { isLoggedIn } = getState().userReducer;
		if (isLoggedIn) {
			return customerService.saveNotificationSettings({
				customerId: getState().userReducer.user.customerId,
				body: options,
			})
				.then(() => dispatch(saveNotificationSettingsSuccess(options)))
				.catch((error) => {
					options.enabled = !options.enabled;
					dispatch(saveNotificationSettingsFail(error, options));
				});
		} else {
			// We cannot save push settings for guest users since the endpoint requires a customerId
			return Promise.resolve();
		}
	};
}

/**
 * Toggle all notifications on and store the flag that we have
 * toggled them on device
 */
function initializePushNotificationSettings() {
	return (dispatch, getState) => {
		return store.get(NOTIFICATION_SETTINGS_HAVE_BEEN_UPDATED).then((hasBeenUpdated) => {
			if (!hasBeenUpdated) {
				return customerService.getNotificationSettings({
					customerId: getState().userReducer.user.customerId,
				}).then((response) => {
					if (response && response.eventTypeNotifications) {
						const settingsToUpdate = Object
						.keys(response.eventTypeNotifications)
						.filter((key) => !response.eventTypeNotifications[key].PUSH)
						.map((key) => {
							return dispatch(saveNotificationSettings({
								enabled: true,
								eventType: key,
								notificationType: 'PUSH',
							}));
						});
						return Promise
						.all(settingsToUpdate)
						.then(() => store.save(NOTIFICATION_SETTINGS_HAVE_BEEN_UPDATED, true));
					}
				});
			}
		});
	};
}

function registerDeviceToken() {
	return (dispatch, getState) => {
		const { user, deviceToken } = getState().userReducer;
		return customerService.registerDeviceToken(user.customerId, deviceToken);
	};
}

function unRegisterDeviceToken() {
	return (dispatch, getState) => {
		const { deviceToken } = getState().userReducer;
		return customerService.unRegisterDeviceToken(deviceToken);
	};
}

function loginWithCreds(username, password) {
	return (dispatch, getState) => {
		const { impersonatorId } = getState().userReducer;
		const request = {
			username,
			password,
			impersonatorId,
		};
		dispatch(loginBegin());
		return customerService.login(request)
			.then((data) => {
				dispatch(loginFinish());
				dispatch(login(username, data));
				dispatch(productsActions.clearProductCache());
				return dispatch(initializePushNotificationSettings());
			})
			.catch((error) => {
				dispatch(loginFinish());
				dispatch(loginFail(error.message || error));
				throw error;
			});
	};
}

const setImpersonatorId = createAction(SET_IMPERSONATOR_ID);

function resetLogin() {
	return (dispatch) => {
		dispatch(resetLoginState());
	};
}

function getCustomerIdSuccess(data) {
	return {
		type: GET_CUSTOMER_ID_SUCCESS,
		payload: data,
	};
}

function keychainFetchCredsFail(error) {
	return {
		type: KEYCHAIN_FETCH_CREDS_FAIL,
		payload: {
			error,
		},
	};
}

function getMyCustomerId() {
	return (dispatch) => {
		return securityService.getMyCustomerId().then((data) => {
			if (data && data.customerId) {
				dispatch(getCustomerIdSuccess(data));
			} else {
				dispatch(keychainFetchCredsFail('sumError'));
			}

			return data;
		}).catch((error) => {
			dispatch(keychainFetchCredsFail(error));
			throw new Error(error);
		});
	};
}

/**
 * Sign up
 */
function updateSignUpError(message) {
	return {
		type: UPDATE_SIGNUP_ERROR,
		message,
	};
}

function requestCreateUser() {
	return {
		type: REQUEST_CREATE_USER,
	};
}

function receiveCreateUserFail(error) {
	return {
		type: CREATE_USER_FAIL,
		error: error.message,
	};
}

function receiveUpdateUserFail(error) {
	return {
		type: UPDATE_USER_FAIL,
		error: error.message,
	};
}

function create(user, promptForNotifications) {
	return (dispatch) => {
		dispatch(requestCreateUser());
		return customerService.createCustomer(user).then(() => {
			return dispatch(loginWithCreds(
				user.email,
				user.password,
				promptForNotifications
			));
		})
		.catch((error) => {
			dispatch(receiveCreateUserFail(error));
			throw new Error(error.message);
		});
	};
}

function guestLogin(customerId, username) {
	//In the guest login we use the customerId for the username and the generated username for the password. The actual username is needed later.
	const request = {
		username: customerId,
		password: username,
	};

	return (dispatch) => {
		dispatch(loginBegin());
		return customerService.guestLogin(request)
		.then((data) => {
			tracking.setCustomerValues(data);
			dispatch(loginFinish());

			auth.setCredentialsForDomain(environment.keychainDomain, request.username.toString(), request.password);

			return dispatch(login(username, data));
		}).catch((error) => {
			dispatch(loginFinish());
			dispatch(loginFail(error));
		});
	};
}

function createGuest(options) {
	return (dispatch) => {
		return customerService.createGuestUser(options)
			.then((user) => {
				return dispatch(guestLogin(user.customerId, user.userName))
					.then(() => user)
					.catch((error) => {
						throw new Error(error);
					});
			})
			.catch((error) => {
				dispatch(receiveCreateUserFail(error));
				return error;
			});
	};
}

function updateCustomer(options) {
	return (dispatch, getState) => {
		const user = getState().userReducer.user,
			newCustomer = {
				customerId: user.customerId,
				email: user.email,
				userName: user.userName,
				firstName: user.firstName,
				lastName: user.lastName,
				isSubscriber: user.isSubscriber || false,
				isPro: user.isPro,
				isGuest: user.isGuest,
				...options,
			};
		return auth.getCredentialsForDomain(environment.keychainDomain)
			.then((credentials = {}) => {
				const { password } = credentials;
				if (typeof newCustomer.password === 'undefined') {
					newCustomer.password = password;
				}

				return customerService.saveCustomer(newCustomer);
			})
			.then(() => {
				auth.setCredentialsForDomain(environment.keychainDomain, newCustomer.email, newCustomer.password);
				delete newCustomer.password;
				delete newCustomer.passwordConfirm;
				dispatch(updateUser(newCustomer));
			})
			.catch((error) => {
				dispatch(receiveUpdateUserFail(error));
				throw new Error(error);
			});
	};
}

function updatePassword(options) {
	return (dispatch, getState) => {
		dispatch(receiveUpdateUserFail({ message: '' }));

		const user = {
			username: getState().userReducer.user.email,
			password: options.password,
		};
		return customerService.verifyPassword(user)
			.then(() => {
				const user = {
					password: options.newPassword,
					passwordConfirm: options.passwordConfirm,
				};
				return dispatch(updateCustomer(user));
			})
			.catch((error) => {
				dispatch(receiveUpdateUserFail(error));
				throw error;
			});
	};
}

function resetPassword(email) {
	return () => customerService.resetPassword(email);
}

function getCustomerRepSuccess(payload) {
	return {
		type: GET_CUSTOMER_REP_SUCCESS,
		payload,
	};
}

function getCustomerRepFail(error) {
	return {
		type: GET_CUSTOMER_REP_FAIL,
		error: error.message,
	};
}

function getCustomerRep(customerId) {
	return (dispatch) => {
		return customerService.getCustomerRep(customerId).then((response) => {
			dispatch(getCustomerRepSuccess(response));
		}).catch((error) => {
			dispatch(getCustomerRepFail(error));
		});
	};
}

function getCustomerSuccess(payload) {
	return {
		type: GET_CUSTOMER_SUCCESS,
		payload,
	};
}

function getCustomerFail(error) {
	return {
		type: GET_CUSTOMER_FAIL,
		payload: {
			error,
		},
	};
}

function getCustomerRewardsTierInfo() {
	return (dispatch, getState) => {
		return customerService.getCustomerRewardsTierInfo(getState().userReducer.user.customerId)
		.then((tierInfo) => {
			dispatch({
				type: GET_CUSTOMER_REWARDS_TIER,
				payload: tierInfo,
			});
		}).catch((error) => error);
	};
}

function getCustomer() {
	return (dispatch, getState) => {
		const { customerId } = getState().userReducer.user;
		return customerService.getCustomer({
			customerId,
		})
		.then((response) => {
			// analytics
			tracking.setLoginStatus('logged in');
			tracking.setCustomerValues(response);
			Instabug.setUserEmail(`${response.email}`);
			Instabug.setUserName(`${response.customerId}`);
			Instabug.setUserData(`${response.customerId}-${response.email}`);
			dispatch(getCustomerSuccess(response));
			if (response && response.isPro) {
				dispatch(getCustomerRep(customerId));
			}
			dispatch(getCustomerRewardsTierInfo());
			dispatch(getCustomerFavorites());
			dispatch(getUnacknowledgedNotificationCount());
			dispatch(getProjects());
			dispatch(getShoppingLists());
			return response;
		}).catch((error) => {
			dispatch(getCustomerFail(error));
			throw new Error(error);
		});
	};
}

function getCustomerInfoOnAppStartUp() {
	return (dispatch) => {
		return dispatch(getMyCustomerId())
			.then(({ customerId }) => {
				if (customerId) {
					dispatch(getCustomer(customerId)).then(({ isGuest }) => {
						if (isGuest) {
							dispatch(signUserOut(null, isGuest));
						}
					});
				}
				dispatch(loginFinish());
			})
			.catch((error) => { throw error; });
	};
}

function getCustomerShippingAddresses() {
	return (dispatch, getState) => {
		const request = {
			customerId: getState().userReducer.user.customerId,
			addressType: SHIPPING_ADDRESS,
		};
		return customerService.getCustomerAddresses(request).then((response) => {
			const shippingAddresses = response.addresses || [];
			dispatch(updateUser({ shippingAddresses }));
			return shippingAddresses;
		}).catch((error) => {
			dispatch(getCustomerFail(error));
			return error;
		});
	};
}

function getCustomerBillingAddresses() {
	return (dispatch, getState) => {
		const request = {
			customerId: getState().userReducer.user.customerId,
			addressType: BILLING_ADDRESS,
		};
		return customerService.getCustomerAddresses(request).then((response) => {
			const billingAddresses = response.addresses || [];
			dispatch(updateUser({ billingAddresses }));
			return billingAddresses;
		}).catch((error) => {
			dispatch(getCustomerFail(error));
			return error;
		});
	};
}

function getCustomerAddresses() {
	return (dispatch) => Promise.all([dispatch(getCustomerShippingAddresses()), dispatch(getCustomerBillingAddresses())]);
}

function saveCustomerAddress(address, addressTypeId, customerId) {
	return (dispatch, getState) => {
		return customerService.saveCustomerAddress({
			customerId: customerId || getState().userReducer.user.customerId,
			body: address,
			query: `?addressType=${addressTypeId}`,
		})
			.then((newAddress) => {
				// update the user with the latest list of addresses
				return dispatch(getCustomerAddresses())
					.then(() => newAddress)
					.catch((error) => {
						throw new Error(error);
					});
			})
			.catch((error) => {
				throw new Error(error);
			});
	};
}

function saveProfessionalData() {
	return (dispatch, getState) => {
		const { customerId } = getState().userReducer.user;
		return customerService.saveProfessionalData({
			customerId,
		});
	};
}

function saveUserAnswers(options) {
	return (dispatch, getState) => {
		const { customerId } = getState().userReducer.user;
		return customerService.saveUserAnswers({
			...options,
			customerId,
		});
	};
}

function deleteCustomerAddress(addressId) {
	return (dispatch, getState) => {
		return customerService.deleteCustomerAddress({
			customerId: getState().userReducer.user.customerId,
			addressId,
		}).then(() => {
			dispatch(getCustomerAddresses());
		}).catch((error) => error);
	};
}

function createCustomerServiceRequest(body) {
	return () => {
		return new Promise((resolve, reject) => {
			customerService.createCustomerServiceRequest({
				body,
			})
			.then((csr) => {
				resolve(csr);
			})
			.catch((err) => {
				reject(err.message);
			});
		});
	};
}

function getNotificationSettingsSuccess(payload) {
	return {
		type: 'GET_NOTIFICATION_SETTINGS_SUCCESS',
		payload,
	};
}

function getNotificationSettingsFail(error) {
	return {
		type: 'GET_NOTIFICATION_SETTINGS_FAIL',
		payload: {
			error,
		},
	};
}

function getNotificationSettings() {
	return (dispatch, getState) => {
		return customerService.getNotificationSettings({
			customerId: getState().userReducer.user.customerId,
		})
		.then((response) => {
			dispatch(getNotificationSettingsSuccess(response));
		})
		.catch((error) => {
			dispatch(getNotificationSettingsFail(error));
		});
	};
}

function allowNotificationsFailed(enabled) {
	return {
		type: ALLOW_NOTIFICATIONS_FAILED,
		payload: {
			userPushNotificationsEnabled: !enabled,
		},
	};
}

function allowNotificationsSuccess(enabled) {
	return {
		type: ALLOW_NOTIFICATIONS_SUCCESS,
		payload: {
			userPushNotificationsEnabled: enabled,
		},
	};
}

/**
 * enables/disables <b>All</b> push notification switch. NOTE: the individual push settings will not be affected by this.
 */
function allowNotifications(enabled) {
	return (dispatch, getState) => {
		dispatch(allowNotificationsSuccess(enabled));
		const { customerId } = getState().userReducer.user;
		if (customerId) {
			return customerService.allowNotifications({
				customerId,
				enabled,
			}).catch(() => {
				dispatch(allowNotificationsFailed(enabled));
			});
		} else {
			// guest users
			return Promise.resolve();
		}
	};
}

function updateDeviceToken(token) {
	SimpleStoreHelpers.storePushDeviceToken(token).done();
	return (dispatch) => {
		dispatch(deviceTokenChanged(token));
	};
}

function signOutBegin() {
	return {
		type: 'SIGN_USER_OUT',
	};
}

function signUserOut(successCallback = null, isGuest = false) {
	return (dispatch, getState) => {
		const {sessionCartId} = getState().cartReducer.cart;

		// before we wipe the user data, reset the lists nav stack
		const { navigators = {} } = getState().navigation;
		const hasListsTab = !!navigators[LISTS];
		if (hasListsTab) {
			dispatch(NavigationActions.popToTop(LISTS));
		}

		auth.resetCredentialsForDomain(environment.keychainDomain);
		// These are flags stored on device that we check on app startup
		// to see if we should attempt to log the user in with Facebook
		store.delete('DID_LOGIN_WITH_SOCIAL');
		store.delete('SOCIAL_LOGIN_TYPE');

		dispatch(signOutBegin());
		customerService.signOut();

		if (!isGuest) {
			// remove facebook login token
			LoginManager.logOut();
			dispatch(unRegisterDeviceToken());
			dispatch(clearNotificationsData());
			dispatch(productsActions.clearProductCache());
			dispatch(historyClear());
		}

		dispatch(getSessionCart({ sessionCartId, recalculatePrice: true }));

		tracking.trackCustomerLoggedOut(isGuest);
		if (successCallback && typeof successCallback === 'function') {
			successCallback();
		}
	};
}

function uploadUserPhoto(customerID, options) {
	return () => {
		const request = {
			customerId: customerID,
			uri: options.uri,
		};

		return customerService.uploadUserPhoto(request)
		.then((data) => data)
		.catch((error) => error);
	};
}

function getSocialClientData(data) {
	return {
		type: SOCIAL_GET_CLIENT_DATA,
		data,
	};
}

function update(user) {
	return (dispatch) => {
		dispatch(updateUser(user));
	};
}

function getStoreCredit() {
	return (dispatch, getState) => {
		return customerService.getStoreCredit(getState().userReducer.user.customerId)
		.then((storeCredit) => {
			if (storeCredit.error || storeCredit.code) {
				throw new Error(storeCredit.message);
			}

			dispatch(updateUser({
				storeCredit,
			}));
		})
		.catch((error) => {
			dispatch(receiveUpdateUserFail(error.message));
			throw error;
		});
	};
}

function getDefaultShippingAddress() {
	return (dispatch, getState) => {
		return customerService.getDefaultShippingAddress({customerId: getState().userReducer.user.customerId})
		.then((address) => {
			if (address.error || address.code) {
				throw new Error(address.message);
			}

			dispatch(updateUser({
				defaultShippingAddressId: address.address.addressId,
			}));

			return address;
		})
		.catch((error) => {
			dispatch(receiveUpdateUserFail(error));
			throw new Error(error);
		});
	};
}

module.exports = {
	updateUser,
	saveGuestNotificationSettings,
	saveNotificationSettings,
	allowNotifications,
	registerDeviceToken,
	loginWithCreds,
	setImpersonatorId,
	resetLogin,
	getMyCustomerId,
	updateSignUpError,
	receiveUpdateUserFail,
	create,
	saveProfessionalData,
	saveUserAnswers,
	guestLogin,
	createGuest,
	updateCustomer,
	updatePassword,
	resetPassword,
	getCustomerRep,
	getCustomerRewardsTierInfo,
	getCustomer,
	getCustomerInfoOnAppStartUp,
	getCustomerShippingAddresses,
	getCustomerBillingAddresses,
	getCustomerAddresses,
	saveCustomerAddress,
	deleteCustomerAddress,
	createCustomerServiceRequest,
	getNotificationSettings,
	updateDeviceToken,
	signUserOut,
	uploadUserPhoto,
	getSocialClientData,
	update,
	getStoreCredit,
	getDefaultShippingAddress,
};
