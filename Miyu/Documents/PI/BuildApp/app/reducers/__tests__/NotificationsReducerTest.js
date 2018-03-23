'use strict';

jest.unmock('../../../app/reducers/notificationReducer');

import notificationReducer from '../notificationReducer';
import {
	CLEAR_NOTIFICATIONS_DATA,
	LOAD_NOTIFICATIONS_SUCCESS,
	LOAD_NOTIFICATIONS_FAILED,
	MARK_NOTIFICATION_READ,
	SAVE_NOTIFICATION_SUCCESS,
	UPDATE_NOTIFICATION_COUNT,
} from '../../constants/Notifications';

const initialState = {
	composites: {},
	error: '',
	notificationCount: 0,
};

describe('notificationReducer reducer', () => {

	it('should return initialState', () => {
		expect(notificationReducer(undefined, {})).toMatchSnapshot();
	});

	it('should CLEAR_NOTIFICATIONS_DATA', () => {

		const state = {
			...initialState,
			test: 'value',
		};

		const action = {
			type: CLEAR_NOTIFICATIONS_DATA,
		};

		expect(notificationReducer(state, action)).toMatchSnapshot();

	});

	it('should LOAD_NOTIFICATIONS_SUCCESS', () => {

		const action = {
			type: LOAD_NOTIFICATIONS_SUCCESS,
			payload: {
				data: [],
				paging: {},
			},
		};

		expect(notificationReducer(undefined, action)).toMatchSnapshot();

	});

	it('should LOAD_NOTIFICATIONS_SUCCESS', () => {

		const action = {
			type: LOAD_NOTIFICATIONS_SUCCESS,
			payload: {
				data: [],
				paging: {
					page: 1,
				},
			},
		};

		expect(notificationReducer(undefined, action)).toMatchSnapshot();

	});

	it('should LOAD_NOTIFICATIONS_SUCCESS for page 2', () => {

		const state = {
			...initialState,
			composites: {
				test: {
					notifications: [1],
				},
			},
		};

		const action = {
			type: LOAD_NOTIFICATIONS_SUCCESS,
			eventTypes: 'test',
			payload: {
				data: [2],
				paging: {
					page: 2,
				},
			},
		};

		expect(notificationReducer(state, action)).toMatchSnapshot();

	});

	it('should store error in LOAD_NOTIFICATION_FAILED', () => {

		const action = {
			type: LOAD_NOTIFICATIONS_FAILED,
			error: 'error',
		};

		expect(notificationReducer(undefined, action)).toMatchSnapshot();

	});

	it('should SAVE_NOTIFICATION_SUCCESS', () => {

		const action = {
			type: SAVE_NOTIFICATION_SUCCESS,
			id: 0,
			payload: {},
		};

		expect(notificationReducer(undefined, action)).toMatchSnapshot();

	});

	it('should UPDATE_NOTIFICATION_COUNT', () => {

		const action = {
			type: UPDATE_NOTIFICATION_COUNT,
			count: 0,
		};

		expect(notificationReducer(undefined, action)).toMatchSnapshot();

	});

	it('should MARK_NOTIFICATION_READ', () => {

		const action = {
			type: MARK_NOTIFICATION_READ,
			notificationId: 0,
		};

		const state = {
			...initialState,
			composites: {
				a: {
					notifications: [
						{
							id: 0,
							active: true,
						},
						{
							id: 1,
							active: true,
						},
					],
				},
				b: {
					notifications: [
						{
							id: 1,
							active: true,
						},
					],
				},
			},
		};
		expect(notificationReducer(state, action)).toMatchSnapshot();

	});

	it('should return default', () => {

		const action = {
			type: 'other',
		};

		expect(notificationReducer(undefined, action)).toMatchSnapshot();

	});

});
