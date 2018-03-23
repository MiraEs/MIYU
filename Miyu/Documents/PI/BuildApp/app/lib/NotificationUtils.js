'use strict';
import helpers from './helpers';
import { PushNotificationIOS } from 'react-native';
import { Device } from 'BuildNative';

export default class NotificationUtils {

	static areIOSPushNotificationsOn() {
		return new Promise((resolve) => {
			PushNotificationIOS.checkPermissions((notificationsObj) => {
				resolve(helpers.isPushNotificationsAllowed(notificationsObj));
			});
		});
	}

	static areNotificationsEnabled() {
		if (helpers.isAndroid()) {
			return Device.areNotificationsEnabled();
		}
		return NotificationUtils.areIOSPushNotificationsOn();
	}

	static areNotificationsOn(notificationSettings = {}, settingsToCheck = null) {
		if (!settingsToCheck) {
			settingsToCheck = Object.keys(notificationSettings);
		}
		return settingsToCheck.some((setting) => notificationSettings[setting].PUSH);
	}
}
