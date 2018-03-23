'use strict';

jest.mock('../../../app/services/httpClient', () => ({}));
jest.mock('../../../app/store/configStore', () => ({}));
jest.mock('../../../app/lib/analytics/tracking');
jest.mock('BuildNative');
jest.mock('BuildLibrary');
jest.mock('../../../app/components/Form', () => 'Form');
jest.mock('../../../app/components/FormInput', () => 'FormInput');
jest.mock('../../../app/router', () => ({}));

jest.unmock('react-native');

import { NotificationsScreen } from '../notificationsScreen';
import React from 'react';

const defaultProps = {
	actions: {
		trackState: jest.fn(),
		markNotificationsAcknowledged: jest.fn(),
	},
	notifications: [],
};

describe('NotificationsScreen component', () => {

	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<NotificationsScreen {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});
});
