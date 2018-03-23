'use strict';

import socialLoginService from '../services/socialLoginService';
import {
	SOCIAL_GET_CLIENT_DATA,
	SOCIAL_LINK_USER,
	SOCIAL_LINK_USER_ERROR,
	SOCIAL_LOGIN_PROMPT_CREDS,
	SHOULD_PRESENT_NO_EMAIL_ERROR_MESSAGE,
} from '../constants/constants';
import {
	LOGIN_SOCIAL_USER_BEGIN,
	LOGIN_USER_FINISH,
	LOGIN_USER_SUCCESS,
	LOGIN_USER_ERROR,
} from '../constants/Auth';
import Instabug from 'Instabug';

function updatePresentNoEmailError(present) {
	return {
		type: SHOULD_PRESENT_NO_EMAIL_ERROR_MESSAGE,
		present,
	};
}

/**
 * Get client login data from Build public API and social login provider
 */
function loginUserSuccess(payload) {
	return {
		type: LOGIN_USER_SUCCESS,
		payload,
	};
}

function socialGetClientData(data) {
	return {
		type: SOCIAL_GET_CLIENT_DATA,
		data,
	};
}

function loginUserError(_error) {
	return {
		type: LOGIN_USER_ERROR,
		payload: {
			_error,
		},
	};
}

function loginSocialBegin() {
	return {
		type: LOGIN_SOCIAL_USER_BEGIN,
	};
}

function loginFinish() {
	return {
		type: LOGIN_USER_FINISH,
	};
}

function getClientLoginData() {
	return (dispatch) => {
		dispatch(loginSocialBegin());

		return socialLoginService.getClientLoginData().then((data) => {
			dispatch(loginFinish());

			if (!data.isCancelled) {
				if (data.customerId) {
					// ^^ this happens when the user is logged in implicitly
					Instabug.setUserEmail(`${data.email}`);
					Instabug.setUserName(`${data.customerId}`);
					Instabug.setUserData(`${data.customerId}-${data.email}`);
					dispatch(loginUserSuccess(data));
				} else {
					// ^^ this happens when the user has not yet created a Build account with social
					// or they have not linked an existing Build account with social
					dispatch(socialGetClientData(data));
				}
			}

			return data;
		}).catch((error) => {
			dispatch(loginFinish());
			dispatch(loginUserError(error));
			throw new Error(error);
		});
	};
}

/**
 * Create new customer from social login tokens
 */

function socialLoginPromptCreds(data) {
	return {
		type: SOCIAL_LOGIN_PROMPT_CREDS,
		data,
	};
}

function createSocialLoginCustomer() {
	return (dispatch, getState) => {
		const { socialUserAccessToken } = getState().userReducer.user;

		const request = {
			socialUserAccessToken,
		};

		return socialLoginService.createSocialLoginCustomer(request)
			.then((response) => {
				if (response.error) {
					dispatch(loginUserError(response.error));
				} else if (response && response.shouldPromptForCredentials) {
					dispatch(socialLoginPromptCreds(response));
				} else if (response && response.shouldShowNoEmailErrorMessage) {
					dispatch(updatePresentNoEmailError(true));
				} else {
					dispatch(loginUserSuccess(response));
				}

				return response;
			})
			.catch((error) => {
				dispatch(loginUserError(error));
			});
	};

}

function login() {
	return (dispatch) => {
		return socialLoginService
			.login()
			.then((response) => {
				if (response.error) {
					dispatch(loginUserError(response.error));
					return;
				}
				dispatch(loginUserSuccess(response));
			});
	};
}

/**
 * Link the social login tokens to an existing user
 */
function socialLinkUser() {
	return {
		type: SOCIAL_LINK_USER,
	};
}

function socialLinkUserError(error) {
	return {
		type: SOCIAL_LINK_USER_ERROR,
		error,
	};
}

function linkExistingCustomer(request) {
	return (dispatch, getState) => {
		request.socialUserAccessToken = getState().userReducer.user.socialUserAccessToken;
		request.socialUserId = getState().userReducer.user.socialUserId;
		dispatch(loginSocialBegin());
		dispatch(socialLinkUser());

		return socialLoginService.linkExistingCustomer(request).then((data) => {
			dispatch(loginFinish());
			if (data.error || data.message) {
				dispatch(socialLinkUserError(data.error || data.message));
			} else {
				dispatch(loginUserSuccess(data));
			}
			return data;
		}).catch(() => {
			const message = 'Could not link existing customer to social login.';
			dispatch(loginFinish());
			dispatch(socialLinkUserError({ message }));
			throw new Error(message);
		});
	};
}

module.exports = {
	updatePresentNoEmailError,
	getClientLoginData,
	createSocialLoginCustomer,
	login,
	linkExistingCustomer,
};
