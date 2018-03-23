import userReducer from '../userReducer';

import {
	CREATE_USER_FAIL,
	UPDATE_USER_FAIL,
	REQUEST_CREATE_USER,
	GET_CUSTOMER_ID_SUCCESS,
	SIGN_USER_OUT,
	GET_CUSTOMER_FAIL,
	GET_CUSTOMER_SUCCESS,
	GET_CUSTOMER_REP_SUCCESS,
	GET_CUSTOMER_REP_FAIL,
	GET_CUSTOMER_REWARDS_TIER,
	UPDATE_SIGNUP_ERROR,
	LOGIN_USER_ERROR,
	LOGIN_USER_SUCCESS,
	LOGIN_USER_BEGIN,
	LOGIN_SOCIAL_USER_BEGIN,
	LOGIN_USER_FINISH,
	LOGIN_USER_RESET,
	UPDATE_USER,
	KEYCHAIN_FETCH_CREDS_FAIL,
	SET_IMPERSONATOR_ID,
} from '../../constants/Auth';
import {
	GET_NOTIFICATION_SETTINGS_SUCCESS,
	SAVE_NOTIFICATION_SETTINGS_SUCCESS,
	SAVE_NOTIFICATION_SETTINGS_FAIL,
	ALLOW_NOTIFICATIONS_SUCCESS,
	ALLOW_NOTIFICATIONS_FAILED,
} from '../../constants/Notifications';
import {
	SOCIAL_GET_CLIENT_DATA,
	SOCIAL_LOGIN_PROMPT_CREDS,
	SOCIAL_LINK_USER,
	SOCIAL_LINK_USER_ERROR,
} from '../../constants/SocialConstants';
import {
	SHOULD_PRESENT_NO_EMAIL_ERROR_MESSAGE,
} from '../../constants/constants';


describe('userReducer', () => {
	it('should return initialState', () => {
		expect(userReducer(undefined, {})).toMatchSnapshot();
	});


	it('should return the state for UPDATE_SIGNUP_ERROR', () => {
		expect(userReducer(undefined, {
			type: UPDATE_SIGNUP_ERROR,
			payload: { refresh: true },
		})).toMatchSnapshot();
	});

	it('should return the state for KEYCHAIN_FETCH_CREDS_FAIL', () => {
		expect(userReducer( { user: { name:'Testy McTestory'} }, {
			type: KEYCHAIN_FETCH_CREDS_FAIL,
		})).toMatchSnapshot();
	});


	it('should return the state for GET_CUSTOMER_ID_SUCCESS', () => {
		expect(userReducer( { }, {
			type: GET_CUSTOMER_ID_SUCCESS,
			payload: {
				customerId: 1234,
			},
		})).toMatchSnapshot();
	});

	it('should return the state for GET_CUSTOMER_SUCCESS', () => {
		expect(userReducer( { user: { name: 'Testy McTestory' } }, {
			type: GET_CUSTOMER_SUCCESS,
			payload: {
				customerId: 1234,
				name: 'NotTesty McTestory',
			},
		})).toMatchSnapshot();
	});

	it('should return the state for GET_CUSTOMER_FAIL', () => {
		expect(userReducer( { user: { name: 'Testy McTestory' } }, {
			type: GET_CUSTOMER_FAIL,
			payload: { },
		})).toMatchSnapshot();
	});

	it('should return the state for GET_CUSTOMER_REP_SUCCESS', () => {
		expect(userReducer( { user: { name: 'Testy McTestory' } }, {
			type: GET_CUSTOMER_REP_SUCCESS,
			payload: { profileId: 1234 },
		})).toMatchSnapshot();
	});

	it('should return the state for GET_CUSTOMER_REP_FAIL', () => {
		expect(userReducer( { user: { name: 'Testy McTestory' } }, {
			type: GET_CUSTOMER_REP_FAIL,
			error: { not: 'found' },
		})).toMatchSnapshot();
	});

	it('should return the state for GET_CUSTOMER_REWARDS_TIER', () => {
		expect(userReducer( { user: { name: 'Testy McTestory' } }, {
			type: GET_CUSTOMER_REWARDS_TIER,
			payload: { tier: 'silver' },
		})).toMatchSnapshot();
	});

	it('should return the state for LOGIN_USER_BEGIN', () => {
		expect(userReducer( { }, {
			type: LOGIN_USER_BEGIN,
		})).toMatchSnapshot();
	});

	it('should return the state for LOGIN_SOCIAL_USER_BEGIN', () => {
		expect(userReducer( { }, {
			type: LOGIN_SOCIAL_USER_BEGIN,
		})).toMatchSnapshot();
	});

	it('should return the state for LOGIN_USER_FINISH', () => {
		expect(userReducer( { }, {
			type: LOGIN_USER_FINISH,
		})).toMatchSnapshot();
	});

	it('should return the state for LOGIN_USER_RESET', () => {
		expect(userReducer( { }, {
			type: LOGIN_USER_RESET,
		})).toMatchSnapshot();
	});

	it('should return the state for LOGIN_USER_SUCCESS', () => {
		expect(userReducer( { user: { notificationCount: 0 } }, {
			type: LOGIN_USER_SUCCESS,
			username: 'username',
			payload: {
				pay: 'load',
			},
		})).toMatchSnapshot();
	});

	it('should return the state for LOGIN_USER_ERROR', () => {
		expect(userReducer( { }, {
			type: LOGIN_USER_ERROR,
		})).toMatchSnapshot();
	});

	it('should return the state for REQUEST_CREATE_USER', () => {
		expect(userReducer( { }, {
			type: REQUEST_CREATE_USER,
		})).toMatchSnapshot();
	});

	it('should return the state for UPDATE_DEVICE_TOKEN', () => {
		expect(userReducer( { }, {
			type: REQUEST_CREATE_USER,
			token: 'token',
		})).toMatchSnapshot();
	});
	it('should return the state for CREATE_USER_FAIL', () => {
		expect(userReducer( { }, {
			type: CREATE_USER_FAIL,
			error: 'error',
		})).toMatchSnapshot();
	});

	it('should return the state for UPDATE_USER_FAIL', () => {
		expect(userReducer( { }, {
			type: UPDATE_USER_FAIL,
			error: { error: 'error' },
		})).toMatchSnapshot();
	});

	it('should return the state for SOCIAL_GET_CLIENT_DATA', () => {
		expect(userReducer( { }, {
			type: SOCIAL_GET_CLIENT_DATA,
			data: { data: 'data' },
		})).toMatchSnapshot();
	});

	it('should return the state for SOCIAL_LOGIN_PROMPT_CREDS', () => {
		expect(userReducer( { }, {
			type: SOCIAL_LOGIN_PROMPT_CREDS,
			data: { email: 'email', socialUserAccesToken: 'socialUserAccesToken' },
		})).toMatchSnapshot();
	});

	it('should return the state for SOCIAL_LINK_USER', () => {
		expect(userReducer( { }, {
			type: SOCIAL_LINK_USER,
		})).toMatchSnapshot();
	});
	it('should return the state for SOCIAL_LINK_USER_ERROR', () => {
		expect(userReducer( { }, {
			type: SOCIAL_LINK_USER_ERROR,
			error: { message: 'message' },
		})).toMatchSnapshot();
	});

	it('should return the state for SIGN_USER_OUT', () => {
		expect(userReducer( { user: { name: 'name' } }, {
			type: SIGN_USER_OUT,
		})).toMatchSnapshot();
	});

	it('should return the state for GET_NOTIFICATION_SETTINGS_SUCCESS', () => {
		expect(userReducer( { user: { name: 'name' } }, {
			type: GET_NOTIFICATION_SETTINGS_SUCCESS,
			payload: {
				eventTypeNotifications : [],
			},
		})).toMatchSnapshot();
	});

	it('should return the state for SAVE_NOTIFICATION_SETTINGS_SUCCESS', () => {
		expect(userReducer( { user: { name: 'name' }, notificationSettings: [{ marketing: true, foo:true }]}, {
			type: SAVE_NOTIFICATION_SETTINGS_SUCCESS,
			payload: ['marketing'],
		})).toMatchSnapshot();
	});

	it('should return the state for SAVE_NOTIFICATION_SETTINGS_FAIL', () => {
		expect(userReducer( { user: { name: 'name' }, notificationSettings: [{ marketing: true, foo:true }]}, {
			type: SAVE_NOTIFICATION_SETTINGS_FAIL,
			payload: [],
		})).toMatchSnapshot();
	});

	it('should return the state for SHOULD_PRESENT_NO_EMAIL_ERROR_MESSAGE', () => {
		expect(userReducer( { user: { name: 'name' } }, {
			type: SHOULD_PRESENT_NO_EMAIL_ERROR_MESSAGE,
			present: true,
		})).toMatchSnapshot();
	});

	it('should return the state for UPDATE_USER', () => {
		expect(userReducer( { user: { name: 'name' } }, {
			type: UPDATE_USER,
			payload: {user: {name: 'name2'}},
		})).toMatchSnapshot();
	});

	it('should return the state for SET_IMPERSONATOR_ID', () => {
		expect(userReducer( { user: { name: 'name' } }, {
			type: SET_IMPERSONATOR_ID,
			payload: {name: 'name2'},
		})).toMatchSnapshot();
	});

	it('should return the state for ALLOW_NOTIFICATIONS_SUCCESS', () => {
		expect(userReducer( { userPushNotificationsEnabled:  true }, {
			type: ALLOW_NOTIFICATIONS_SUCCESS,
			payload: { userPushNotificationsEnabled: false },
		})).toMatchSnapshot();
	});

	it('should return the state for ALLOW_NOTIFICATIONS_FAILED', () => {
		expect(userReducer( { userPushNotificationsEnabled:  true }, {
			type: ALLOW_NOTIFICATIONS_FAILED,
			payload: { userPushNotificationsEnabled: false },
		})).toMatchSnapshot();
	});
});
