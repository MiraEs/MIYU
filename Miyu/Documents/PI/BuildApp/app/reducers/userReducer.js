'use strict';

import {
	CREATE_USER_FAIL,
	UPDATE_USER_FAIL,
	REQUEST_CREATE_USER,
	AUTH_STATUS_UNKNOWN,
	AUTH_STATUS_ANONYMOUS,
	AUTH_STATUS_AUTHENTICATED,
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
	UPDATE_DEVICE_TOKEN,
	KEYCHAIN_FETCH_CREDS_FAIL,
	SET_IMPERSONATOR_ID,
} from '../constants/Auth';
import {
	GET_NOTIFICATION_SETTINGS_SUCCESS,
	SAVE_NOTIFICATION_SETTINGS_SUCCESS,
	SAVE_NOTIFICATION_SETTINGS_FAIL,
	ALLOW_NOTIFICATIONS_FAILED,
	ALLOW_NOTIFICATIONS_SUCCESS,
} from '../constants/Notifications';
import {
	SOCIAL_GET_CLIENT_DATA,
	SOCIAL_LOGIN_PROMPT_CREDS,
	SOCIAL_LINK_USER,
	SOCIAL_LINK_USER_ERROR,
} from '../constants/SocialConstants';
import {
	SHOULD_PRESENT_NO_EMAIL_ERROR_MESSAGE,
} from '../constants/constants';

const ANONYMOUS_USER = {
	status: AUTH_STATUS_ANONYMOUS,
	isGuest: true,
};

const initialState = {
	user: {
		notificationCount: 0,
		status: AUTH_STATUS_UNKNOWN,
		isGuest: true,
		username: '',
		shippingAddresses: [],
		billingAddresses: [],
		defaultShippingAddressId: null,
		storeCredit: 0,
		rep: {},
		tierInfo: {},
	},
	notificationSettings: {
		MARKETING: {
			PUSH: true,
			SMS: false,
		},
	},
	userPushNotificationsEnabled: true,
	isCreatingUser: false,
	isLoading: false,
	isLoggingIn: true, // defaulting this to true so we have a chance to log in before data load
	isLoggingInSocial: true, // defaulting this to true so we have a chance to log in before data load
	isLoggedIn: false,
	_error: '',
	errors: {
		signUp: '',
		login: '',
		rep: '',
		update: '',
	},
	deviceToken: '',
	impersonatorId: null,
};

// eslint-disable-next-line complexity
const userReducer = (state = initialState, action = {}) => {
	function toggleNotification (type, enabled) {
		const notificationSettings = {...state.notificationSettings};
		notificationSettings[type] = notificationSettings[type] || {};
		notificationSettings[type].PUSH = enabled;
		return notificationSettings;
	}
	switch (action.type) {
		case UPDATE_SIGNUP_ERROR:
			return {
				...state,
				errors: {
					...state.errors,
					signUp: action.message,
				},
			};

		case KEYCHAIN_FETCH_CREDS_FAIL:
			return {
				...state,
				user: {
					...state.user,
					status: AUTH_STATUS_ANONYMOUS,
				},
			};

		case GET_CUSTOMER_ID_SUCCESS:
			return {
				...state,
				user: {
					...state.user,
					status: AUTH_STATUS_AUTHENTICATED,
					customerId: action.payload.customerId,
				},
				isLoggedIn: true,
			};

		case GET_CUSTOMER_SUCCESS:
			return {
				...state,
				user: {
					...state.user,
					...action.payload,
				},
			};

		case GET_CUSTOMER_FAIL:
			return {
				...state,
				user: ANONYMOUS_USER,
			};

		case GET_CUSTOMER_REP_SUCCESS:
			return {
				...state,
				user: {
					...state.user,
					rep: action.payload,
				},
			};

		case GET_CUSTOMER_REP_FAIL:
			return {
				...state,
				user: {
					...state.user,
					rep: {},
				},
				errors: {
					...state.errors,
					rep: action.error,
				},
			};

		case GET_CUSTOMER_REWARDS_TIER:
			return {
				...state,
				user: {
					...state.user,
					tierInfo: action.payload,
				},
			};

		case LOGIN_USER_BEGIN:
			return {
				...state,
				isLoggingIn: true,
				errors: {
					...state.errors,
					login: '',
				},
			};

		case LOGIN_SOCIAL_USER_BEGIN:
			return {
				...state,
				isLoggingInSocial: true,
				errors: {
					...state.errors,
					login: '',
				},
			};

		case LOGIN_USER_FINISH:
			return {
				...state,
				isLoggingIn: false,
				isLoggingInSocial: false,
			};

		case LOGIN_USER_RESET:
			return {
				...state,
				isLoggingIn: false,
				isLoggingInSocial: false,
				isLoggedIn: false,
				errors: {
					...state.errors,
					login: '',
				},
			};

		case LOGIN_USER_SUCCESS:
			return {
				...state,
				user: {
					...state.user,
					notificationCount: state.user.notificationCount,
					status: AUTH_STATUS_AUTHENTICATED,
					username: action.username,
					...action.payload,
				},
				isCreatingUser: false,
				isLoggedIn: true,
				errors: {
					...state.errors,
					login: '',
				},
			};

		case LOGIN_USER_ERROR:
			return {
				...state,
				user: {
					status: AUTH_STATUS_ANONYMOUS,
				},
				errors: {
					...state.errors,
					login: action.error,
				},
				impersonatorId: null,
			};

		case REQUEST_CREATE_USER:
			return {
				...state,
				isCreatingUser: true,
			};

		case UPDATE_DEVICE_TOKEN:
			return {
				...state,
				deviceToken: action.token,
			};

		case CREATE_USER_FAIL:
			return {
				...state,
				errors: {
					...state.errors,
					signUp: action.error,
				},
				isCreatingUser: false,
			};

		case UPDATE_USER_FAIL:
			return {
				...state,
				errors: {
					...state.errors,
					update: action.error,
				},
			};

		case SOCIAL_GET_CLIENT_DATA:
			return {
				...state,
				user: {
					...state.user,
					...action.data,
				},
			};

		case SOCIAL_LOGIN_PROMPT_CREDS:
			const { email, socialUserAccessToken } = action.data;
			return {
				...state,
				user: {
					...state.user,
					email,
					socialUserAccessToken,
				},
			};

		case SOCIAL_LINK_USER:
			return {
				...state,
				user: {
					...state.user,
					socialLinkError: '',
				},
			};

		case SOCIAL_LINK_USER_ERROR:
			return {
				...state,
				user: {
					...state.user,
					socialLinkError: action.error.message,
				},
			};

		case SIGN_USER_OUT:
			return {
				...state,
				user: {
					...ANONYMOUS_USER,
				},
				isLoggedIn: false,
				impersonatorId: null,
				notificationSettings: initialState.notificationSettings,
				userPushNotificationsEnabled: initialState.userPushNotificationsEnabled,
			};

		case GET_NOTIFICATION_SETTINGS_SUCCESS:
			return {
				...state,
				notificationSettings: action.payload.eventTypeNotifications,
				userPushNotificationsEnabled: action.payload.userPushNotificationsEnabled,
			};

		case SAVE_NOTIFICATION_SETTINGS_SUCCESS:
		case SAVE_NOTIFICATION_SETTINGS_FAIL:
			let payload = action.payload;
			if (!Array.isArray(payload)) {
				payload = [payload];
			}
			let notificationSettings = {...state.notificationSettings};
			payload.forEach(({ type, enabled }) => {
				notificationSettings = toggleNotification(type, enabled);
			});
			return {
				...state,
				notificationSettings,
			};
		case ALLOW_NOTIFICATIONS_FAILED:
		case ALLOW_NOTIFICATIONS_SUCCESS:
			return {
				...state,
				...action.payload,
			};
		case SHOULD_PRESENT_NO_EMAIL_ERROR_MESSAGE:
			return {
				...state,
				user: {
					...state.user,
					noEmailErrorMessage: action.present ? 'We were unable to create your account because the Facebook login you used is not associated with an email address. Please create a new account here.' : '',
				},
			};
		case UPDATE_USER:
			return {
				...state,
				user: {
					...state.user,
					...action.payload.user,
				},
			};
		case SET_IMPERSONATOR_ID:
			return {
				...state,
				impersonatorId: action.payload,
			};
		default:
			return state;
	}

};


export default userReducer;
