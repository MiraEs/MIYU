jest.unmock('../../../app/actions/UserActions');

import UserActions from '../UserActions';
import CartActions from '../CartActions';
import { NavigationActions } from '@expo/ex-navigation';

jest.mock('../../../app/services/customerService', () => ({
	saveNotificationSettings: jest.fn(() => Promise.resolve({})),
	registerDeviceToken: jest.fn(() => Promise.resolve({})),
	login: jest.fn(() => Promise.resolve({})),
	createCustomer: jest.fn(() => Promise.resolve({})),
	guestLogin: jest.fn(() => Promise.resolve({})),
	createGuestUser: jest.fn(() => Promise.resolve({})),
	verifyPassword: jest.fn(() => Promise.resolve({})),
	resetPassword: jest.fn(() => Promise.resolve({})),
	getCustomerRep: jest.fn(() => Promise.resolve({})),
	getCustomerRewardsTierInfo: jest.fn(() => Promise.resolve({})),
	getCustomer: jest.fn(() => Promise.resolve({})),
	getCustomerAddresses: jest.fn(() => Promise.resolve({})),
	saveCustomerAddress: jest.fn(() => Promise.resolve({})),
	deleteCustomerAddress: jest.fn(() => Promise.resolve({})),
	getNotificationSettings: jest.fn(() => Promise.resolve({})),
	uploadUserPhoto: jest.fn(() => Promise.resolve({})),
	getStoreCredit: jest.fn(() => Promise.resolve({})),
	getDefaultShippingAddress: jest.fn(() => Promise.resolve({})),
	signOut: jest.fn(() => Promise.resolve({})),
	allowNotifications: jest.fn(() => Promise.resolve({})),
	saveProfessionalData: jest.fn(() => ({
		then: jest.fn(),
	})),
	saveUserAnswers: jest.fn(() => ({
		then: jest.fn(),
	})),
}));
jest.mock('../../../app/services/securityService', () => ({
	getMyCustomerId: jest.fn(() => Promise.resolve({})),
}));
jest.mock('../../../app/lib/SimpleStoreHelpers', () => ({
	storePushDeviceToken: jest.fn(() => ({ done: jest.fn() })),
}));
jest.mock('../../../app/lib/auth', () => ({
	getCredentialsForDomain: jest.fn(() => Promise.resolve({})),
	resetCredentialsForDomain: jest.fn(() => Promise.resolve({})),
}));
jest.mock('Promise', () => ({
	all: jest.fn(),
}));
jest.mock('react-native-simple-store', () => ({
	save: jest.fn(() => ({
		catch: jest.fn(() => ({
			done: jest.fn(),
		})),
	})),
	delete: jest.fn(() => Promise.resolve()),
}));
jest.mock('../../../app/lib/analytics/tracking', () => ({
	trackCustomerLoggedOut: jest.fn(),
}));
jest.mock('BuildNative');
jest.mock('../../../app/services/httpClient', () => ({}));
jest.mock('../../../app/actions/NotificationActions');

jest.unmock('react-native');

import tracking from '../../lib/analytics/tracking';
import { LoginManager } from 'react-native-fbsdk';
import simpleStore from 'react-native-simple-store';
import customerService from '../../services/customerService';
import securityService from '../../services/securityService';
import {
	SHIPPING_ADDRESS,
	BILLING_ADDRESS,
} from '../../constants/Addresses';
import SimpleStoreHelpers from '../../lib/SimpleStoreHelpers';
import auth from '../../lib/auth';
import environment from '../../lib/environment';

const dispatch = jest.fn();
const getState = jest.fn(() => ({
	userReducer: {
		user: {
			customerId: 1234,
			email: 'test@test.com',
			username: 'test@test.com',
		},
		deviceToken: '',
		impersonatorId: 1234,
		userPushNotificationsEnabled: true,
	},
	cartReducer: {
		cart: {
			sessionCartId: 1234567890,
		},
	},
	navigation: {
		navigators: {
			lists: {},
		},
	},
}));

describe('UserActions', () => {

	describe('saveGuestNotificationSettings', () => {
		it('should convert setting object to array and call simpleStore.save', () => {
			const setting = {
				eventType: 'MARKETING',
				enabled: true,
			};
			const result = UserActions.saveGuestNotificationSettings(setting);
			expect(result.type).toEqual('SAVE_GUEST_NOTIFICATION_SETTINGS_SUCCESS');
			expect(simpleStore.save).toHaveBeenCalledWith('GUEST_NOTIFICATIONS_SETTINGS', [setting]);
		});

		it('should iterate over settings array to find supported push types and call simpleStore with an array', () => {
			const setting = {
				eventType: 'MARKETING',
				enabled: true,
			};
			const settings = [ setting ];
			const result = UserActions.saveGuestNotificationSettings(settings);
			expect(result.type).toEqual('SAVE_GUEST_NOTIFICATION_SETTINGS_SUCCESS');
			expect(simpleStore.save).toHaveBeenCalledWith('GUEST_NOTIFICATIONS_SETTINGS', settings);
		});
	});

	describe('saveNotificationSettings', () => {

		it('should expect to call saveNotificationSettings endpoint if logged in user', () => {
			const customGetState = jest.fn(() => ({
				userReducer: {
					user: {
						customerId: 1234,
						email: 'test@test.com',
						username: 'test@test.com',
					},
					deviceToken: '',
					impersonatorId: 1234,
					isLoggedIn: true,
				},
			}));
			const options = {};
			UserActions.saveNotificationSettings(options)(dispatch, customGetState);
			expect(customerService.saveNotificationSettings).toBeCalledWith({
				customerId: getState().userReducer.user.customerId,
				body: options,
			});
		});

		it('should expect to call Promise.resolve', () => {
			const promiseResolveSpy = spyOn(Promise, 'resolve').and.returnValue({});
			const customGetState = jest.fn(() => ({
				userReducer: {
					user: {
						customerId: 1234,
						email: 'test@test.com',
						username: 'test@test.com',
					},
					deviceToken: '',
					impersonatorId: 1234,
					isLoggedIn: false,
				},
			}));
			const options = {};
			UserActions.saveNotificationSettings(options)(dispatch, customGetState);
			expect(promiseResolveSpy).toHaveBeenCalled();
		});
	});

	describe('registerDeviceToken', () => {
		it('should return a function', () => {
			UserActions.registerDeviceToken()(dispatch, getState);
			const { user, deviceToken } = getState().userReducer;
			expect(customerService.registerDeviceToken).toBeCalledWith(user.customerId, deviceToken);
		});
	});

	describe('loginWithCreds', () => {
		it('should return a function', () => {
			const username = 'myusername';
			const password = 'abc123';
			UserActions.loginWithCreds(username, password)(dispatch, getState);
			expect(customerService.login).toBeCalledWith({
				username,
				password,
				impersonatorId: getState().userReducer.impersonatorId,
			});
		});
	});

	describe('setImpersonatorId', () => {
		it('should return object with matching props', () => {
			const result = UserActions.setImpersonatorId();
			expect(result.type).toEqual('SET_IMPERSONATOR_ID');
		});
	});

	describe('getMyCustomerId', () => {
		it('should return a function', () => {
			UserActions.getMyCustomerId()(dispatch);
			expect(securityService.getMyCustomerId).toBeCalled();
		});
	});

	describe('updateSignUpError', () => {
		it('should return object with matching props', () => {
			const message = 'hello';
			const result = UserActions.updateSignUpError(message);
			expect(result.type).toEqual('UPDATE_SIGNUP_ERROR');
			expect(result.message).toEqual(message);
		});
	});

	describe('receiveUpdateUserFail', () => {
		it('should return object with matching props', () => {
			const message = 'error message';
			const result = UserActions.receiveUpdateUserFail({ message });
			expect(result.type).toEqual('UPDATE_USER_FAIL');
			expect(result.error).toEqual(message);
		});
	});

	describe('saveProfessionalData', () => {
		it('should return a function', () => {
			const result = UserActions.saveProfessionalData();
			expect(typeof result).toEqual('function');
		});
		it('should call customerService.saveProfessionalData', () => {
			UserActions.saveProfessionalData()(dispatch, getState);
			expect(customerService.saveProfessionalData).toBeCalledWith({
				customerId: 1234,
			});
		});
	});

	describe('saveUserAnswers', () => {
		it('should return a function', () => {
			const result = UserActions.saveUserAnswers();
			expect(typeof result).toEqual('function');
		});
		it('should call customerService.saveUserAnswers', () => {
			UserActions.saveUserAnswers({})(dispatch, getState);
			expect(customerService.saveUserAnswers).toBeCalledWith({
				customerId: 1234,
			});
		});
	});


	describe('create', () => {
		const user = {
			email: getState().userReducer.user.email,
			password: 'abc123',
		};
		it('should return a function', () => {
			UserActions.create(user, false)(dispatch);
			expect(customerService.createCustomer).toBeCalledWith(user);
		});
	});

	describe('guestLogin', () => {
		const { username, customerId } = getState().userReducer.user;
		it('should return a function', () => {
			UserActions.guestLogin(customerId, username)(dispatch);
			expect(customerService.guestLogin).toBeCalledWith({
				username: customerId,
				password: username,
			});
		});
	});

	describe('createGuest', () => {
		const options = {};
		it('should return a function', () => {
			UserActions.createGuest(options)(dispatch);
			expect(customerService.createGuestUser).toBeCalledWith(options);
		});
	});

	describe('updateCustomer', () => {
		const options = {};
		it('should return a function', () => {
			UserActions.updateCustomer(options)(dispatch, getState);
			expect(auth.getCredentialsForDomain).toBeCalledWith(environment.keychainDomain);
		});
	});

	describe('updatePassword', () => {
		const options = {
			password: 'abc123',
		};
		const user = {
			...options,
			username: getState().userReducer.user.email,
		};
		it('should return a function', () => {
			UserActions.updatePassword(options)(dispatch, getState);
			expect(customerService.verifyPassword).toBeCalledWith(user);
		});
	});

	describe('resetPassword', () => {
		const { email } = getState().userReducer.user;
		it('should return a function', () => {
			UserActions.resetPassword(email)();
			expect(customerService.resetPassword).toBeCalledWith(email);
		});
	});

	describe('getCustomerRep', () => {
		const { customerId } = getState().userReducer.user;
		it('should return a function', () => {
			UserActions.getCustomerRep(customerId)(dispatch);
			expect(customerService.getCustomerRep).toBeCalledWith(customerId);
		});
	});

	describe('getCustomerRewardsTierInfo', () => {
		const { customerId } = getState().userReducer.user;
		it('should return a function', () => {
			UserActions.getCustomerRewardsTierInfo()(dispatch, getState);
			expect(customerService.getCustomerRewardsTierInfo).toBeCalledWith(customerId);
		});
	});

	describe('getCustomer', () => {
		const { customerId } = getState().userReducer.user;
		it('should return a function', () => {
			UserActions.getCustomer(customerId)(dispatch, getState);
			expect(customerService.getCustomer).toBeCalledWith({ customerId });
		});
	});

	describe('getCustomerShippingAddresses', () => {
		const { customerId } = getState().userReducer.user;
		const request = {
			customerId,
			addressType: SHIPPING_ADDRESS,
		};
		it('should return a function', () => {
			UserActions.getCustomerShippingAddresses()(dispatch, getState);
			expect(customerService.getCustomerAddresses).toBeCalledWith(request);
		});
	});

	describe('getCustomerBillingAddresses', () => {
		const { customerId } = getState().userReducer.user;
		const request = {
			customerId,
			addressType: BILLING_ADDRESS,
		};
		it('should return a function', () => {
			UserActions.getCustomerBillingAddresses()(dispatch, getState);
			expect(customerService.getCustomerAddresses).toBeCalledWith(request);
		});
	});

	describe('getCustomerAddresses', () => {
		let spy;
		beforeEach(() => {
			spy = spyOn(Promise, 'all');
		});

		it('should return a function', () => {
			UserActions.getCustomerAddresses()(dispatch);
			expect(spy).toBeCalledWith([
				dispatch(UserActions.getCustomerShippingAddresses()),
				dispatch(UserActions.getCustomerBillingAddresses()),
			]);
		});
	});

	describe('saveCustomerAddress', () => {
		const { customerId } = getState().userReducer.user;
		const address = {};
		const request = {
			customerId,
			body: address,
			query: `?addressType=${SHIPPING_ADDRESS}`,
		};
		it('should return a function', () => {
			UserActions.saveCustomerAddress(address, SHIPPING_ADDRESS)(dispatch, getState);
			expect(customerService.saveCustomerAddress).toBeCalledWith(request);
		});
	});

	describe('deleteCustomerAddress', () => {
		const { customerId } = getState().userReducer.user;
		const addressId = 1234;
		const request = {
			customerId,
			addressId,
		};
		it('should return a function', () => {
			UserActions.deleteCustomerAddress(addressId)(dispatch, getState);
			expect(customerService.deleteCustomerAddress).toBeCalledWith(request);
		});
	});

	describe('getNotificationSettings', () => {
		const { customerId } = getState().userReducer.user;
		const request = {
			customerId,
		};
		it('should return a function', () => {
			UserActions.getNotificationSettings()(dispatch, getState);
			expect(customerService.getNotificationSettings).toBeCalledWith(request);
		});
	});

	describe('updateDeviceToken', () => {
		const token = 'super_secret_token';
		it('should return a function', () => {
			UserActions.updateDeviceToken(token)(dispatch);
			expect(SimpleStoreHelpers.storePushDeviceToken).toBeCalledWith(token);
		});
	});

	describe('signUserOut', () => {
		CartActions.getSessionCart = jest.fn();

		beforeEach(() => {
			tracking.trackCustomerLoggedOut.mockClear();
		});

		it('should call signUserOut without successCallback', () => {
			UserActions.signUserOut()(dispatch, getState);
			expect(NavigationActions.popToTop).toBeCalledWith('lists');
			expect(auth.resetCredentialsForDomain).toBeCalledWith(environment.keychainDomain);
			expect(simpleStore.delete).toBeCalledWith('DID_LOGIN_WITH_SOCIAL');
			expect(simpleStore.delete).toBeCalledWith('SOCIAL_LOGIN_TYPE');
			expect(customerService.signOut).toBeCalled();
			expect(LoginManager.logOut).toBeCalled();
			expect(CartActions.getSessionCart).toBeCalled();
			expect(tracking.trackCustomerLoggedOut).toBeCalledWith(false);
		});

		it('should call signUserOut with successCallback', () => {
			UserActions.signUserOut(() => jest.fn())(dispatch, getState);
			expect(NavigationActions.popToTop).toBeCalledWith('lists');
			expect(auth.resetCredentialsForDomain).toBeCalledWith(environment.keychainDomain);
			expect(simpleStore.delete).toBeCalledWith('DID_LOGIN_WITH_SOCIAL');
			expect(simpleStore.delete).toBeCalledWith('SOCIAL_LOGIN_TYPE');
			expect(customerService.signOut).toBeCalled();
			expect(LoginManager.logOut).toBeCalled();
			expect(CartActions.getSessionCart).toBeCalled();
			expect(tracking.trackCustomerLoggedOut).toBeCalledWith(false);
		});

		it('should call signUserOut with successCallback and isGuest true', () => {
			UserActions.signUserOut(() => jest.fn(), true)(dispatch, getState);
			expect(NavigationActions.popToTop).toBeCalledWith('lists');
			expect(auth.resetCredentialsForDomain).toBeCalledWith(environment.keychainDomain);
			expect(simpleStore.delete).toBeCalledWith('DID_LOGIN_WITH_SOCIAL');
			expect(simpleStore.delete).toBeCalledWith('SOCIAL_LOGIN_TYPE');
			expect(customerService.signOut).toBeCalled();
			expect(LoginManager.logOut).toBeCalled();
			expect(CartActions.getSessionCart).toBeCalled();
			expect(tracking.trackCustomerLoggedOut).toBeCalledWith(true);
		});
	});

	describe('uploadUserPhoto', () => {
		const { customerId } = getState().userReducer.user;
		const options = {
			uri: 'www.testinginprogress.com',
		};
		const request = {
			customerId,
			uri: options.uri,
		};
		it('should return a function', () => {
			UserActions.uploadUserPhoto(customerId, options)(dispatch, getState);
			expect(customerService.uploadUserPhoto).toBeCalledWith(request);
		});
	});

	describe('getSocialClientData', () => {
		const data = {};
		it('should return object with matching props', () => {
			const result = UserActions.getSocialClientData(data);
			expect(result.type).toEqual('SOCIAL_GET_CLIENT_DATA');
			expect(result.data).toEqual(data);
		});
	});

	describe('update', () => {
		const { user } = getState().userReducer;
		it('should return a function', () => {
			UserActions.update(user)(dispatch);
			expect(dispatch).toBeCalledWith(UserActions.updateUser(user));
		});
	});

	describe('getStoreCredit', () => {
		const { customerId } = getState().userReducer.user;
		it('should return a function', () => {
			UserActions.getStoreCredit()(dispatch, getState);
			expect(customerService.getStoreCredit).toBeCalledWith(customerId);
		});
	});

	describe('getDefaultShippingAddress', () => {
		const { customerId } = getState().userReducer.user;
		it('should return a function', () => {
			UserActions.getDefaultShippingAddress()(dispatch, getState);
			expect(customerService.getDefaultShippingAddress).toBeCalledWith({ customerId });
		});
	});

	describe('allowNotifications', () => {
		it('should return a function', () => {
			UserActions.allowNotifications(true)(dispatch, getState);
			expect(customerService.allowNotifications).toHaveBeenCalledWith({
				customerId: getState().userReducer.user.customerId,
				enabled: true,
			});
		});
	});
});
