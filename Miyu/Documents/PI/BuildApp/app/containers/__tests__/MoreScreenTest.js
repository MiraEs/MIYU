'use strict';

jest.mock('../../../app/services/httpClient', () => ({}));
jest.mock('../../../app/store/configStore', () => ({}));
jest.mock('../../../app/lib/analytics/tracking');
jest.mock('BuildNative');
jest.mock('BuildLibrary');
jest.mock('../../../app/components/Form', () => 'Form');
jest.mock('../../../app/components/FormInput', () => 'FormInput');

jest.unmock('react-native');

import { MoreScreen } from '../MoreScreen';
import React from 'react';

const defaultProps = {
	actions: {
		getUnacknowledgedNotificationCount: jest.fn(() => ({catch: jest.fn(() => ({done:jest.fn()}))})),
	},
	articles: false,
	customer: {},
	isLoggedIn: false,
	cart: {},
	favorites: false,
	projects: false,
	notificationCount: 0,
	onboarding: false,
	tutorialMode: false,
	navigator: {
		push: jest.fn(),
	},
	navigation: {
		getNavigator: jest.fn(),
		performAction: jest.fn(),
	},
};

describe('MoreScreen component', () => {

	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<MoreScreen {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});


	it('should render when logged in', () => {
		const tree = require('react-test-renderer').create(
			<MoreScreen
				{...defaultProps}
				isLoggedIn={true}
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should track properly', () => {
		const moreScreen = new MoreScreen(defaultProps);
		const trackingName = moreScreen.setScreenTrackingInformation().name;
		expect(trackingName).toMatchSnapshot('build:app:more');
	});
});
