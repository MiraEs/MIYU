'use strict';

jest.mock('../../../app/services/httpClient', () => ({}));
jest.mock('../../../app/store/configStore', () => ({}));
jest.mock('../../../app/lib/analytics/tracking');
jest.mock('BuildNative');
jest.mock('BuildLibrary');
jest.mock('../../../app/components/Form', () => 'Form');
jest.mock('../../../app/components/FormInput', () => 'FormInput');
jest.mock('../../../app/components/FixedBottomButton', () => 'FixedBottomButton');

jest.unmock('react-native');

import { EmailScreen } from '../EmailScreen';
import React from 'react';

const defaultProps = {
	valid: false,
	actions: {
		trackState: jest.fn(),
	},
	user: {},
	isLoggedIn: false,
};

describe('EmailScreen component', () => {

	it('should render correctly with defaultProps', () => {
		const tree = require('react-test-renderer').create(
			<EmailScreen {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should track properly', () => {
		const emailScreen = new EmailScreen(defaultProps);
		const trackingName = emailScreen.setScreenTrackingInformation().name;
		expect(trackingName).toMatchSnapshot('build:app:email');
	});
});
