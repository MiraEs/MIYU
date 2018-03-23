'use strict';

jest.mock('../../../app/lib/analytics/tracking');
jest.mock('../../../app/lib/eventEmitter');
jest.mock('../../../app/lib/environment', () => ({
	phone: '1234567890',
}));
jest.mock('../../../app/lib/helpers', () => ({
	isIOS: jest.fn(() => true),
	formatPhoneNumber: jest.fn(() => '(123) 123-1234'),
}));
jest.mock('../../../app/components/SessionInformationModal', () => 'SessionInformationModal');
jest.mock('react-native', () => ({
	Alert: {
		alert: jest.fn(),
	},
	Linking: {
		canOpenURL: jest.fn(() => ({ then: (callback) => callback(true) })),
		openURL: jest.fn(() => ({ catch: jest.fn() })),
	},
	NativeModules: {
		MarketingCloud: {
			trackAction: jest.fn(),
			trackState: jest.fn(),
		},
		LocalyticsManager: {
			tagScreen: jest.fn(),
			tagEvent: jest.fn(),
			tagCustomerLoggedOut: jest.fn(),
		},
	},
}));
jest.mock('BuildNative');
import ContactUsHelper from '../ContactUsHelper';
import {
	Alert,
	Linking,
} from 'react-native';

describe('ContactUsHelper', () => {
	describe('callUs', () => {
		beforeEach(() => {
			Linking.canOpenURL.mockClear();
			Linking.openURL.mockClear();
		});

		it('should call Linking.openURL with environment.phone and no extension', () => {
			ContactUsHelper.callUs({}, false);
			const telString = 'telprompt:1234567890';
			expect(Linking.canOpenURL).toHaveBeenCalledWith(telString);
			expect(Linking.openURL).toHaveBeenCalledWith(telString);
		});

		it('should call Linking.openURL with environment.phone with extension', () => {
			ContactUsHelper.callUs({ extension: '123' }, false);
			const telString = 'telprompt:1234567890,123';
			expect(Linking.canOpenURL).toHaveBeenCalledWith(telString);
			expect(Linking.openURL).toHaveBeenCalledWith(telString);
		});
	});

	describe('callWithAlert', () => {
		it('should call Alert.alert', () => {
			ContactUsHelper.callWithAlert('1231231234', false, 0, {});
			expect(Alert.alert).toHaveBeenCalled();
		});
	});
});
