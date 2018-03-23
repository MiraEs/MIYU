'use strict';
import {
	NativeModules,
	Linking,
} from 'react-native';
const { BuildLinkingManager } = NativeModules;
import helpers from '../helpers';

export default class LinkingManager {
	openPhoneSettings() {
		if (helpers.isAndroid()) {
			BuildLinkingManager.openPhoneSettings();
		}
	}

	openBuildAppSettings() {
		if (helpers.isAndroid()) {
			return BuildLinkingManager.openBuildAppSettings();
		} else {
			return Linking.openURL('app-settings:');
		}
	}

	openArView(sceneConfig, arCloseCallback = helpers.noop) {
		BuildLinkingManager.openArView(sceneConfig, arCloseCallback);
	}

}
