import { PermissionsAndroid } from 'react-native';

export default class Permissions {
	/**
	 * Permissions helper currently only supports Android. iOS permissions for Contacts is handled by the
	 * react-native-contact-picker.
	 *
	 * @param rationale, object with title and message to explain why the app is requesting permission
	 * @returns {Promise}
	 */
	static requestContacts(rationale = null) {
		return Permissions.checkAndRequest(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, rationale);
	}

	/**
	 * Request camera permission for Android and iOS.
	 *
	 * @param rationale, object with title and message to explain why the app is requesting permission
	 * @returns {Promise}
	 */
	static requestCamera(rationale = null) {
		return Permissions.checkAndRequest(PermissionsAndroid.PERMISSIONS.CAMERA, rationale);
	}

	/**
	 * Requesting external read storage will also provide write storage permission since these are "grouped" permissions.
	 * Android Only.
	 *
	 * @param rationale, object with title and message to explain why the app is requesting permission
	 * @returns {Promise}
	 */
	static requestExternalReadStorage(rationale = null) {
		return Permissions.checkAndRequest(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE, rationale);
	}

	static requestExternalWriteStorage(rationale = null) {
		return Permissions.checkAndRequest(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE, rationale);
	}

	/**
	 * General method that checks if the permission is granted or denied. If denied then it requests for the permission.
	 * There are three statuses for Android permissions: granted, denied and never_ask_again
	 *
	 * @param permission
	 * @param rationale
	 * @returns {Promise.<*>}
	 */
	static async checkAndRequest(permission, rationale = null) {
		try {
			const granted = await PermissionsAndroid.check(permission);
			let permStatus = PermissionsAndroid.RESULTS.GRANTED;
			if (!granted) {
				permStatus = await PermissionsAndroid.request(permission, rationale);
			}
			return Promise.resolve(permStatus);
		} catch (error) {
			return Promise.reject(error);
		}
	}

	static isGranted(status) {
		return status === PermissionsAndroid.RESULTS.GRANTED;
	}

	static isDenied(status) {
		return status === PermissionsAndroid.RESULTS.DENIED;
	}

	static isNeverAskAgain(status) {
		return status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN;
	}
}
