'use strict';

import React from 'react';
import {
	Alert,
	Linking,
} from 'react-native';
import tracking from './analytics/tracking';
import SessionInformationModal from '../components/SessionInformationModal';
import EventEmitter from './eventEmitter';
import environment from './environment';
import helpers from './helpers';
import PhoneHelper from '../lib/PhoneHelper';

export default class ContactUsHelper {
	static callUs({ phoneNumber = environment.phone, extension = '' }, isPro) {
		const fullExtension = extension ? `,${extension}` : '';
		const fullPhone = `${phoneNumber}${fullExtension}`;
		tracking.trackPhoneDial(fullPhone, isPro);
		const telString = helpers.isIOS() ? 'telprompt' : 'tel';
		const url = `${telString}:${fullPhone}`;
		Linking
			.canOpenURL(url)
			.then((supported) => {
				if (supported) {
					Linking.openURL(url).catch(helpers.noop);
				}
			});
	}

	static callWithAlert(phone, isPro, sessionCartId, lastViewedProduct = {}) {
		Alert.alert(
			PhoneHelper.formatPhoneNumber(phone),
			'',
			[
				{
					text: 'Cancel',
				},
				{
					text: 'Call',
					onPress: () => {
						ContactUsHelper.callUs(phone, isPro);
						EventEmitter.emit('showScreenOverlay', (
							<SessionInformationModal
								sessionCartId={sessionCartId}
								lastViewedProduct={lastViewedProduct}
							/>
						));
					},
				},
			]
		);
	}
}
