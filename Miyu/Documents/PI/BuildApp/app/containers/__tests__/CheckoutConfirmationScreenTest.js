'use strict';

jest.mock('../../../app/services/httpClient', () => ({}));
jest.mock('../../../app/store/configStore', () => ({}));
jest.mock('../../../app/lib/analytics/tracking');
jest.mock('BuildNative');
jest.mock('BuildLibrary');
jest.mock('../../../app/components/Form', () => 'Form');
jest.mock('../../../app/components/FormInput', () => 'FormInput');

jest.unmock('react-native');

import { CheckoutConfirmationScreen } from '../CheckoutConfirmationScreen';
import React from 'react';

const defaultProps = {
	user: {
		isGuest: true,
	},
	actions: {
		trackState: jest.fn(),
		getNotificationSettings: jest.fn(),
	},
};

describe('CheckoutConfirmationScreen component', () => {

	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<CheckoutConfirmationScreen {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});
});
