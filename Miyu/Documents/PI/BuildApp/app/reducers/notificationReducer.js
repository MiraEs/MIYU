'use strict';

import {
	CLEAR_NOTIFICATIONS_DATA,
	LOAD_NOTIFICATIONS_SUCCESS,
	LOAD_NOTIFICATIONS_FAILED,
	MARK_NOTIFICATION_READ,
	SAVE_NOTIFICATION_SUCCESS,
	UPDATE_NOTIFICATION_COUNT,
} from '../constants/Notifications';
import messages from '../lib/messages';

const initialState = {
	composites: {},
	error: '',
	notificationCount: 0,
};

function notificationReducer(state = initialState, action = {}) {

	switch (action.type) {
		case CLEAR_NOTIFICATIONS_DATA:
			return {
				...initialState,
			};

		case LOAD_NOTIFICATIONS_SUCCESS:
			let notifications = action.payload.data;
			if (action.payload.paging.page > 1) {
				notifications = state.composites[action.eventTypes].notifications.concat(notifications);
			}
			return {
				...state,
				composites: {
					...state.composites,
					[action.eventTypes]: {
						paging: action.payload.paging,
						loading: false,
						notifications,
					},
				},
				error: undefined,
			};

		case LOAD_NOTIFICATIONS_FAILED:
			return {
				...state,
				composites: {
					...state.composites,
					[action.eventTypes]: {
						error: messages.errors.retrieveNotifications,
						loading: false,
					},
				},
			};

		case SAVE_NOTIFICATION_SUCCESS:
			return {
				...state,
				id: action.id,
				payload: action.payload,
			};

		case UPDATE_NOTIFICATION_COUNT:
			return {
				...state,
				notificationCount: action.count,
			};

		case MARK_NOTIFICATION_READ:
			const composites = { ...state.composites };
			for (const key in composites) {
				if (composites[key]) {
					composites[key].notifications = composites[key].notifications.map((notification) => {
						notification.active = notification.id === action.notificationId ? false : notification.active;
						return { ...notification };
					});
				}
			}
			return {
				...state,
				composites,
			};

		default:
			return state;

	}

}

export default notificationReducer;
