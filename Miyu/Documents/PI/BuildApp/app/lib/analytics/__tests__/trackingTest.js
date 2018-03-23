jest.mock('../../bugsnag', () => ({
	leaveBreadcrumb: jest.fn(),
}));
jest.mock('../TrackingActions', () => ({
	FB_FAVORITE_ITEM: 'FB_FAVORITE_ITEM',
}));
jest.mock('react-native-simple-store', () => ({
	get: jest.fn(() => ({
		then: jest.fn((fn) => {
			fn();
			return {
				done: jest.fn(),
			};
		}),
	})),
	save: jest.fn(() => ({
		done: jest.fn(),
	})),
}));
import TrackingActions from '../TrackingActions';
import store from 'react-native-simple-store';
jest.mock('../../../constants/constants', () => ({
	USER_LOGIN_STATUS: 'USER_LOGIN_STATUS',
}));
jest.mock('../CustomDimensions');
jest.mock('Instabug');
jest.mock('../../helpers');
jest.mock('../../../constants/AdjustConstants', () => ({
	INSTALL: 'INSTALL',
	FIRST_LAUNCH: 'FIRST_LAUNCH',
	CREATE_PROJECT: 'CREATE_PROJECT',
	CREATE_ACCOUNT: 'CREATE_ACCOUNT',
	FAVORITE_ITEM: 'FAVORITE_ITEM',
}));
import {
	INSTALL,
	FIRST_LAUNCH,
	CREATE_PROJECT,
	CREATE_ACCOUNT,
	FAVORITE_ITEM,
} from '../../../constants/AdjustConstants';
jest.mock('react-native-adjust');
import { Adjust, AdjustEvent } from 'react-native-adjust';
jest.mock('react-native-fbsdk');
import { AppEventsLogger } from 'react-native-fbsdk';

jest.mock('react-native');
import { NativeModules } from 'react-native';
import tracking from '../tracking';

describe('app/lib/tracking.js', () => {
	beforeEach(() => {
		Adjust.trackEvent.mockClear();
		AdjustEvent.mockImplementation((input) => ({
			trackerName: input,
		}));
	});

	describe('initLoginStatus', () => {
		it('should get login status', () => {
			tracking.initLoginStatus();
			expect(store.get).toHaveBeenCalled();
		});
	});

	describe('trackAction function', () => {
		it('should call MarketingCloud.trackAction', () => {
			tracking.trackAction('testAction', {});
			expect(NativeModules.MarketingCloud.trackAction).toBeCalledWith('testAction', {});
		});
	});

	describe('trackState function', () => {

		it('should call MarketingCloud.trackState', () => {
			const STATE = 'testing_state';
			const DATA = { 'user.LoginStatus': 'not logged in' };
			tracking.trackState(STATE, DATA);
			expect(NativeModules.MarketingCloud.trackState).toBeCalledWith(STATE, DATA);
		});

	});

	describe('trackInstallAndFirstLaunch', () => {
		it('should track in adjust and facebook', () => {
			tracking.trackInstallAndFirstLaunch();
			expect(Adjust.trackEvent.mock.calls.length).toBe(2);
			expect(Adjust.trackEvent.mock.calls[0][0]).toEqual(new AdjustEvent(INSTALL));
			expect(Adjust.trackEvent.mock.calls[1][0]).toEqual(new AdjustEvent(FIRST_LAUNCH));
		});
	});

	describe('trackProjectCreated', () => {
		it('should call adjust', () => {
			tracking.trackProjectCreated();
			expect(Adjust.trackEvent.mock.calls[0][0]).toEqual(new AdjustEvent(CREATE_PROJECT));
		});
	});

	describe('trackAccountCreated', () => {
		it('should call adjust', () => {
			tracking.trackAccountCreated();
			expect(Adjust.trackEvent.mock.calls[0][0]).toEqual(new AdjustEvent(CREATE_ACCOUNT));
		});
	});

	describe('trackFavoriteItem', () => {
		it('should call adjust and facebook', () => {
			tracking.trackFavoriteItem();
			expect(Adjust.trackEvent.mock.calls[0][0]).toEqual(new AdjustEvent(FAVORITE_ITEM));
			expect(AppEventsLogger.logEvent).toBeCalledWith(TrackingActions.FB_FAVORITE_ITEM);
		});
	});

});
