'use strict';

jest.mock('../../../app/services/httpClient', () => ({}));
jest.mock('../../../app/store/configStore', () => ({}));
jest.mock('../../../app/lib/analytics/tracking');
jest.mock('../../../app/lib/styles');
jest.mock('../../../app/lib/NotificationUtils', () => ({
	areIOSPushNotificationsOn: jest.fn(() => ({ then: jest.fn(() => ({ done: jest.fn() })) })),
	areNotificationsEnabled: jest.fn(() => ({ then: jest.fn(() => ({ done: jest.fn() })) })),
}));
jest.mock('BuildNative');
jest.mock('BuildLibrary');
jest.mock('../../../app/components/Form', () => 'Form');
jest.mock('../../../app/components/FormInput', () => 'FormInput');

jest.unmock('react-native');

import { SettingsScreen } from '../pushNotificationSettingsScreen';
import React from 'react';

const defaultProps = {
	actions: {
		trackState: jest.fn(),
		getNotificationSettings: jest.fn(),
	},
};

describe('SettingsScreen component', () => {

	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<SettingsScreen {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});
});
