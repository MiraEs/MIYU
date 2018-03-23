
const dispatch = jest.fn();
const getState = jest.fn(() => ({
	userReducer: {
		user: {
			customerId: 7,
		},
	},
}));
jest.mock('redux-actions');
jest.mock('PushNotificationIOS', () => ({
	setApplicationIconBadgeNumber: jest.fn(),
}));

jest.unmock('react-native');
jest.unmock('../../../app/actions/NotificationActions');
import notificationActions from '../NotificationActions';

jest.mock('../../../app/services/customerService', () => ({
	getUnacknowledgedNotificationCount: jest.fn(() => Promise.resolve({})),
	getNotifications: jest.fn(() => Promise.resolve({})),
	markNotificationRead: jest.fn(() => Promise.resolve({})),
	markNotificationsAcknowledged: jest.fn(() => Promise.resolve({})),
}));
import customerService from '../../services/customerService';

describe('NotificationActions', () => {

	afterEach(() => {
		customerService.getUnacknowledgedNotificationCount.mockClear();
		customerService.getNotifications.mockClear();
		customerService.markNotificationRead.mockClear();
		customerService.markNotificationsAcknowledged.mockClear();
	});

	describe('loadNotificationsSuccess', () => {
		it('should return an object', () => {
			const result = notificationActions.loadNotificationsSuccess({}, []);
			expect(result).toEqual({
				type: 'LOAD_NOTIFICATIONS_SUCCESS',
				eventTypes: [],
				payload: {},
			});
		});
	});

	describe('loadNotificationsError', () => {
		it('should return an object', () => {
			const error = new Error('test');
			const result = notificationActions.loadNotificationsError(error);
			expect(result).toEqual({
				type: 'LOAD_NOTIFICATIONS_FAILED',
				error,
			});
		});
	});

	describe('updateNotificationCount', () => {
		it('should return an object', () => {
			const result = notificationActions.updateNotificationCount(1);
			expect(result).toEqual({
				type: 'UPDATE_NOTIFICATION_COUNT',
				count: 1,
			});
		});
		it('should return a count of 0 if passed a negative count', () => {
			const result = notificationActions.updateNotificationCount(-1);
			expect(result).toEqual({
				type: 'UPDATE_NOTIFICATION_COUNT',
				count: 0,
			});
		});
	});

	describe('getUnacknowledgedNotificationCount', () => {
		it('should return a function', () => {
			notificationActions.getUnacknowledgedNotificationCount()(dispatch, getState);
			expect(customerService.getUnacknowledgedNotificationCount).toBeCalledWith({
				customerId: 7,
			});
		});
	});

	describe('getNotifications', () => {
		it('should return a function', () => {
			notificationActions.getNotifications({})(dispatch, getState);
			expect(customerService.getNotifications).toBeCalledWith(7, false, undefined, undefined);
		});
	});

	describe('clearNotificationsData', () => {
		it('should return an object', () => {
			const result = notificationActions.clearNotificationsData();
			expect(result).toEqual({
				type: 'CLEAR_NOTIFICATIONS_DATA',
			});
		});
	});

	describe('markNotificationRead', () => {
		it('should return a function', () => {
			notificationActions.markNotificationRead(2)(dispatch, getState);
			expect(customerService.markNotificationRead).toBeCalledWith({
				customerId: 7,
				notificationId: 2,
			});
		});
	});

	describe('markNotificationsAcknowledged', () => {
		it('should return a function', () => {
			notificationActions.markNotificationsAcknowledged()(dispatch, getState);
			expect(customerService.markNotificationsAcknowledged).toBeCalledWith({
				customerId: 7,
			});
		});
	});

});
