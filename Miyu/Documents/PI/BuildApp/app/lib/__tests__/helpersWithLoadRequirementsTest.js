'use strict';

jest.mock('BuildNative');
jest.mock('redux-persist');
jest.mock('redux-persist-transform-compress');
jest.mock('react-native-safari-view', () => ({
	isAvailable: jest.fn(() => ({
		then: jest.fn((callback) => callback()),
	})),
	show: jest.fn(),
}));
import SafariView from 'react-native-safari-view';

jest.mock('redux');
jest.mock('../../../app/store/configStore', () => ({
	dispatch: jest.fn(),
}));
jest.mock('../../../app/actions/AnalyticsActions', () => ({
	trackAction: jest.fn(),
}));

jest.unmock('../../../app/lib/helpersWithLoadRequirements');

jest.mock('../../../app/lib/styles');

import helpers from '../helpersWithLoadRequirements';

describe('app/lib/helpers.js', () => {

	describe('openURL function', () => {
		const URL = 'http://build.com';

		beforeEach(() => {
			SafariView.isAvailable.mockClear();
			SafariView.show.mockClear();
		});

		it('should not call SafariView.isAvailable when passed nothing', () => {
			helpers.openURL();
			expect(SafariView.isAvailable).not.toBeCalled();
		});

		it('should call SafariView.isAvailable', () => {
			helpers.openURL(URL);
			expect(SafariView.isAvailable).toBeCalled();
		});

		it('should call SafariView.isAvailable with encoded URL with intcmp', () => {
			const URL = 'http://build.com/this needs encoding';
			helpers.openURL(URL);
			expect(SafariView.isAvailable).toBeCalled();
			expect(SafariView.show).toBeCalledWith({
				url: 'http://build.com/this%20needs%20encoding?intcmp=buildapp',
				tintColor: '#00A499',
			});
		});

		it('should handle unicode characters', () => {
			const URL = 'https://s2.img-b.com/unicode/test/’/';
			helpers.openURL(URL);
			expect(SafariView.isAvailable).toBeCalled();
			expect(SafariView.show).toBeCalledWith({
				url: 'https://s2.img-b.com/unicode/test/%E2%80%99/?intcmp=buildapp',
				tintColor: '#00A499',
			});
		});
	});

});
