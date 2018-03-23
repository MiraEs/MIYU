'use strict';

import customerService from '../services/customerService';
import helpers from '../lib/helpers';
import { PushNotificationIOS } from 'react-native';
import {
	CLEAR_NOTIFICATIONS_DATA,
	LOAD_NOTIFICATIONS,
	LOAD_NOTIFICATIONS_SUCCESS,
	LOAD_NOTIFICATIONS_FAILED,
	MARK_NOTIFICATIONS_ACKNOWLEDGED,
	UPDATE_NOTIFICATION_COUNT,
	MARK_NOTIFICATION_READ,
} from '../constants/Notifications';
import { createAction } from 'redux-actions';

function loadNotificationsSuccess(payload, eventTypes) {
	return {
		type: LOAD_NOTIFICATIONS_SUCCESS,
		eventTypes,
		payload,
	};
}

function loadNotificationsError(error, eventTypes) {
	return {
		type: LOAD_NOTIFICATIONS_FAILED,
		error,
		eventTypes,
	};
}

function updateNotificationCount(count) {
	if (helpers.isIOS()) {
		PushNotificationIOS.setApplicationIconBadgeNumber(count);
	}
	return {
		type: UPDATE_NOTIFICATION_COUNT,
		count: count < 0 ? 0 : count,
	};
}

function getUnacknowledgedNotificationCount() {
	return (dispatch, getState) => {
		const { customerId } = getState().userReducer.user;
		return customerService.getUnacknowledgedNotificationCount({ customerId })
		.then((data) => {
			helpers.serviceErrorCheck(data);
			dispatch(updateNotificationCount(data.count));
		})
		.catch((error) => error);
	};
}

/**
 * Get notifications for a customer
 */
export function getNotifications({markRead = false, page, eventTypes}) {
	if (eventTypes) {
		eventTypes = eventTypes.join();
	}
	return (dispatch, getState) => {
		dispatch(createAction(LOAD_NOTIFICATIONS)(eventTypes || 'all'));
		return customerService.getNotifications(getState().userReducer.user.customerId, markRead, page, eventTypes).then(({data, paging}) => {
			if (markRead && data && data.length) {
				data.forEach((notification) => {
					if (notification.active) {
						notification.active = false;
					}
				});
			}

			dispatch(getUnacknowledgedNotificationCount());

			dispatch(loadNotificationsSuccess({data, paging}, eventTypes || 'all'));
			return data;
		}).catch((error) => {
			dispatch(loadNotificationsError(error, eventTypes));
			return error;
		});
	};
}

function clearNotificationsData() {
	if (helpers.isIOS()) {
		PushNotificationIOS.setApplicationIconBadgeNumber(0);
	}
	return {
		type: CLEAR_NOTIFICATIONS_DATA,
	};
}

function markNotificationRead(notificationId) {
	return (dispatch, getState) => {
		return customerService.markNotificationRead({
			customerId: getState().userReducer.user.customerId,
			notificationId,
		}).then(() => {
			dispatch(updateNotificationCount(getState().notificationReducer.notificationCount - 1));
			dispatch({
				type: MARK_NOTIFICATION_READ,
				notificationId,
			});
		}).catch((error) => error);
	};
}

function markNotificationsAcknowledged() {
	return (dispatch, getState) => {
		const customerId = getState().userReducer.user.customerId;
		customerService.markNotificationsAcknowledged({ customerId })
		.catch((error) => error);
		dispatch({
			type: MARK_NOTIFICATIONS_ACKNOWLEDGED,
		});
	};
}

module.exports = {
	loadNotificationsSuccess,
	loadNotificationsError,
	updateNotificationCount,
	getUnacknowledgedNotificationCount,
	getNotifications,
	clearNotificationsData,
	markNotificationRead,
	markNotificationsAcknowledged,
};
