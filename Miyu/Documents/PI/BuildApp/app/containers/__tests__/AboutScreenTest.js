'use strict';

jest.mock('../../../app/services/httpClient', () => ({}));
jest.mock('../../../app/store/configStore', () => ({}));
jest.mock('../../../app/lib/analytics/tracking');
jest.mock('BuildNative');
jest.mock('BuildLibrary');

jest.unmock('react-native');

import { AboutScreen } from '../AboutScreen';
import React from 'react';

const defaultProps = {
	navigation: {
		getNavigator: jest.fn(),
	},
};

describe('AboutScreen component', () => {
	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<AboutScreen {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should track properly', () => {
		const aboutScreen = new AboutScreen();
		const trackingName = aboutScreen.setScreenTrackingInformation().name;
		expect(trackingName).toMatchSnapshot('build:app:more:about');
	});

});
