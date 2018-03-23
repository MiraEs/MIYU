
const dispatch = jest.fn();
const getState = jest.fn(() => ({
	navigation: {
		navigators: {
			root: {},
			main: {},
		},
	},
}));
jest.mock('redux-actions');
jest.mock('../../../app/store/configStore', () => ({}));
jest.mock('../../../app/router/DeepLinking', () => ({
	getAppLocationByURI: jest.fn(() => ({
		route: 'route',
	})),
	getURIFromBranchPayload: jest.fn((payload) => payload.$canonical_url),
}));
jest.mock('../../../app/lib/bugsnag', () =>
	({
		leaveBreadcrumb: jest.fn(),
	})
);
jest.mock('../../../app/actions/AnalyticsActions');
jest.mock('../../../app/lib/Instabug', () => ({
	log: jest.fn(),
}));

import deepLinking from '../../router/DeepLinking';

jest.unmock('../../../app/actions/DeepLinkingActions');
import deepLinkingActions from '../DeepLinkingActions';

describe('DeepLinkingActions', () => {

	afterEach(() => {
		deepLinking.getAppLocationByURI.mockClear();
	});

	describe('handleLink', () => {
		it('should call getAppLocationByURI', () => {
			deepLinkingActions.handleLink('buildapp://test/route')(dispatch, getState);
			expect(deepLinking.getAppLocationByURI).toBeCalledWith('/test/route');
		});
	});

	describe('handleBranchLink', () => {
		it('should call getAppLocationByURI with route', () => {
			const payload = {
				$canonical_url: 'http://build.com/another/test/route',
			};
			deepLinkingActions.handleBranchLink(payload)(dispatch, getState);
			deepLinkingActions.handleBranchLink(payload)(dispatch, getState); // this second call is on purpose to make sure it disables itself after the first call
			expect(deepLinking.getAppLocationByURI).toBeCalledWith('/another/test/route');
			expect(deepLinking.getAppLocationByURI).toHaveBeenCalledTimes(1);
		});
	});

	describe('getStandardUrlPath', () => {
		it('should return paths for given URLs', () => {
			const path = '/slug/s1234?test=meh';
			const pathOne = deepLinkingActions.getStandardUrlPath(`https://www.build.com${path}`);
			expect(pathOne).toEqual(path);
			const pathTwo = deepLinkingActions.getStandardUrlPath(`http://build.com${path}`);
			expect(pathTwo).toEqual(path);
			const pathThree = deepLinkingActions.getStandardUrlPath(`buildapp:/${path}`);
			expect(pathThree).toEqual(path);
		});
	});


});
