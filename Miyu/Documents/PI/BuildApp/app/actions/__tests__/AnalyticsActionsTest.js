
jest.unmock('../../../app/actions/AnalyticsActions');
jest.mock('../../../app/lib/analytics/tracking', () => ({
	trackState: jest.fn(),
	trackAction: jest.fn(),
	trackAddToCart: jest.fn(),
	trackCustomerRegistered: jest.fn(),
}));

import analyticsActions from '../AnalyticsActions';
import tracking from '../../lib/analytics/tracking';
import TrackingActions from '../../lib/analytics/TrackingActions';

describe('Action::Analytics', () => {
	describe('AnalyticsActions#trackStateHelper', () => {
		const testState = 'test_state';
		const data = {};
		const expectedResult = {
			state: testState,
			data,
		};

		it('should call tracking.trackState', () => {
			const result = analyticsActions.trackStateHelper(testState, data);
			expect(result).toEqual(expectedResult);
			expect(tracking.trackState).toBeCalledWith(testState, data);
		});
	});

	describe('AnalyticsActions#trackActionHelper', () => {
		it('should call tracking.trackAction', () => {
			const data = {};
			const action = 'random_action';
			const expectedResult = {
				action,
				data,
			};
			const result = analyticsActions.trackActionHelper(action, data);
			expect(result).toEqual(expectedResult);
			expect(tracking.trackAction).toBeCalledWith(action, data);
		});

		it('should call tracking.trackAddToCart', () => {
			const data = {};
			const action = TrackingActions.FAVORITE_ADD_TO_CART;
			const expectedResult = {
				action,
				data,
			};
			const result = analyticsActions.trackActionHelper(action, data);
			expect(result).toEqual(expectedResult);
			expect(tracking.trackAddToCart).toBeCalledWith(action, data);
		});

		it('should call tracking.trackCustomerRegistered', () => {
			const data = {
				user: {},
				methodName: 'Email',
				cart: {},
			};
			const action = TrackingActions.CUSTOMER_SIGNUP_COMPLETE;
			const expectedResult = {
				action,
				data,
			};
			const result = analyticsActions.trackActionHelper(action, data);
			expect(result).toEqual(expectedResult);
			expect(tracking.trackCustomerRegistered).toBeCalledWith(data.user, data.cart, data.methodName);
		});
	});
});
