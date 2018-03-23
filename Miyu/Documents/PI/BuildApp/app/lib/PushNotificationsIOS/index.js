/**
 * @providesModule PushNotificationsIOS
 */

'use strict';

import {
	PushNotificationIOS,
	NativeModules,
} from 'react-native';
import { STORE_NOTIFICATIONS_OPT_IN } from '../../constants/constants';
import store from 'react-native-simple-store';

class PushNotificationsIOS {
	requestPermissions() {
		store.save(STORE_NOTIFICATIONS_OPT_IN, true);
		return PushNotificationIOS.requestPermissions().then((permissions) => {
			NativeModules.LocalyticsManager
				.didRequestUserNotificationAuthorizationWithOptions(permissions, !!permissions);
			return permissions;
		});
	}

	checkPermissions(callback = null) {
		PushNotificationIOS.checkPermissions(callback);
	}
}

module.exports = new PushNotificationsIOS();
