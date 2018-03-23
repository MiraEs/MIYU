jest.unmock('../../../app/actions/SocialLoginActions');

jest.mock('../../../app/services/socialLoginService', () => ({
	getClientLoginData: jest.fn(() => Promise.resolve({})),
	createSocialLoginCustomer: jest.fn(() => Promise.resolve({})),
	login: jest.fn(() => Promise.resolve({})),
	linkExistingCustomer: jest.fn(() => Promise.resolve({})),
}));

import SocialLoginActions from '../SocialLoginActions';
import socialLoginService from '../../services/socialLoginService';
import { SHOULD_PRESENT_NO_EMAIL_ERROR_MESSAGE } from '../../constants/constants';

const dispatch = jest.fn();
const getState = jest.fn(() => ({
	userReducer: {
		user: {
			socialUserAccessToken: 'my_access_token',
			socialUserId: 1,
		},
	},
}));

describe('SocialLoginActions', () => {

	describe('updatePresentNoEmailError', () => {
		it('should return object with matching props', () => {
			const present = {};
			const result = SocialLoginActions.updatePresentNoEmailError(present);
			expect(result.type).toEqual(SHOULD_PRESENT_NO_EMAIL_ERROR_MESSAGE);
			expect(result.present).toEqual(present);
		});
	});

	describe('getClientLoginData', () => {
		it('should call socialLoginService.getClientLoginData', () => {
			SocialLoginActions.getClientLoginData()(dispatch);
			expect(socialLoginService.getClientLoginData).toHaveBeenCalled();
		});
	});

	describe('createSocialLoginCustomer', () => {
		it('should call socialLoginService.createSocialLoginCustomer', () => {
			const request = {
				socialUserAccessToken: getState().userReducer.user.socialUserAccessToken,
			};
			SocialLoginActions.createSocialLoginCustomer()(dispatch, getState);
			expect(socialLoginService.createSocialLoginCustomer).toHaveBeenCalledWith(request);
		});
	});

	describe('login', () => {
		it('should call socialLoginService.login', () => {
			SocialLoginActions.login()(dispatch);
			expect(socialLoginService.login).toHaveBeenCalled();
		});
	});

	describe('linkExistingCustomer', () => {
		it('should call socialLoginService.linkExistingCustomer', () => {
			const request = {};
			SocialLoginActions.linkExistingCustomer(request)(dispatch, getState);
			expect(socialLoginService.linkExistingCustomer).toHaveBeenCalledWith(request);
		});
	});
});
