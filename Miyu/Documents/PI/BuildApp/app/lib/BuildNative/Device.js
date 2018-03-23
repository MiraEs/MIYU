'use strict';
import {
	Platform,
	NativeModules,
} from 'react-native';
const { BNDevice } = NativeModules;

export default class Device {
	appVersion = BNDevice.appVersion;
	appBuild = BNDevice.appBuild;
	systemName = BNDevice.systemName;
	systemVersion = BNDevice.systemVersion;
	model = BNDevice.model;
	brand = BNDevice.brand;
	deviceId = BNDevice.deviceId;
	deviceName = BNDevice.deviceName;
	deviceLocale = BNDevice.deviceLocale;
	deviceCountry = BNDevice.deviceCountry;
	uniqueId = BNDevice.uniqueId;
	bundleId = BNDevice.bundleId;
	systemManufacturer = BNDevice.systemManufacturer;
	userAgent = BNDevice.userAgent;
	timezone = BNDevice.timezone;

	version() {
		return BNDevice.systemVersion;
	}

	isMetal() {
		return BNDevice.isMetal;
	}

	isArKitEnabled() {
		return BNDevice.isArKitEnabled;
	}
	is3dModelEnabled() {
		return BNDevice.is3dModelEnabled;
	}
	isDebug() {
		return BNDevice.isDebug;
	}
	isBeta() {
		return BNDevice.isBeta;
	}
	isTest() {
		return BNDevice.isTest;
	}
	isRelease() {
		return (!__DEV__ && !this.isBeta());
	}


	isTablet() {
		if (Platform.OS === 'ios') {
			return this.model.indexOf('iPad') >= 0;
		} else {
			return false;
		}
	}

	isMobile() {
		if (Platform.OS === 'ios') {
			return !this.isTablet();
		} else {
			return true;
		}
	}
	async getInfo() {
		try {
			return Promise.resolve(await BNDevice.getInfo());
		} catch (e) {
			console.error(e);
		}
	}

	areNotificationsEnabled() {
		return BNDevice.areNotificationsEnabled();
	}
}
