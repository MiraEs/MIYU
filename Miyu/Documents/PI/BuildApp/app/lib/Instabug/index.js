/**
 * @providesModule Instabug
 */

'use strict';
import { NativeModules } from 'react-native';

class Instabug {
	setUserData(userData) {
		NativeModules.Instabug.setUserData(userData);
	}
	setUserName(userName) {
		NativeModules.Instabug.setUserName(userName);
	}
	setUserEmail(email) {
		NativeModules.Instabug.setUserEmail(email);
	}
	log(log) {
		NativeModules.Instabug.log(log);
	}
}

module.exports = new Instabug();
