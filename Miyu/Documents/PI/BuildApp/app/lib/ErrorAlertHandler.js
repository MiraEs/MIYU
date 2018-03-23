import { Alert } from 'react-native';
import helpers from '../lib/helpers';
import EventEmitter from '../lib/eventEmitter';
import store from 'react-native-simple-store';

const SHOULD_TRY_REFRESH = 'SHOULD_TRY_REFRESH';

class ErrorAlertHandler {
	constructor() {
		this.isAlertShowing = false;
		this.resetShouldTryRefresh();
	}

	showErrorAlert(refreshCallback, isNetworkError = false, phone = {}) {
		if (!this.isAlertShowing) {
			this.isAlertShowing = true;
			if (isNetworkError) {
				this.showNetworkErrorAlert(refreshCallback, phone);
			} else {
				this.showGeneralErrorAlert(refreshCallback, phone);
			}
		}
	}

	showNetworkErrorAlert(refreshCallback, phone) {
		Alert.alert(
			'Turn off Airplane Mode or Use Wi-Fi to Access Data',
			'You need an internet connection in order to use our app. Please check your network settings or call us.',
			[
				{
					text: 'Refresh',
					onPress: () => {
						store.save(SHOULD_TRY_REFRESH, true);
						this.errorAlertActionHelper(refreshCallback);
					},
				},
				{ text: 'Call Us', onPress: () => this.errorAlertActionHelper(() => EventEmitter.emit('onCallUs', phone, true))},
				{ text: 'Ok', onPress: () => this.errorAlertActionHelper(helpers.noop) },
			]
		);

	}

	showGeneralErrorAlert(refreshCallback, phone) {
		Alert.alert(
			'Oops, something went wrong',
			'Please refresh and try again. If you continue to see this error, please call us.',
			[
				{ text: 'Refresh', onPress: () => this.errorAlertActionHelper(refreshCallback) },
				{ text: 'Call Us', onPress: () => this.errorAlertActionHelper(() => EventEmitter.emit('onCallUs', phone, true))},
				{ text: 'Ok', onPress: () => this.errorAlertActionHelper(helpers.noop) },
			]
		);
	}

	errorAlertActionHelper(resolve) {
		this.isAlertShowing = false;
		resolve();
	}

	/**
	 * Returns a {@link Promise} that will return a boolean on success.
	 */
	shouldTryRefresh() {
		return store.get(SHOULD_TRY_REFRESH);
	}

	resetShouldTryRefresh() {
		store.save(SHOULD_TRY_REFRESH, false);
	}
}

const errorAlertHandler = new ErrorAlertHandler();

module.exports = errorAlertHandler;
