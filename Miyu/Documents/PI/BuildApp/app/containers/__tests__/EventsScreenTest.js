'use strict';

import React from 'react';

jest.mock('../../../app/services/httpClient', () => ({}));
jest.mock('../../../app/store/configStore', () => ({}));
jest.mock('../../../app/lib/analytics/tracking');
jest.mock('BuildNative');
jest.mock('BuildLibrary');
jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');
jest.mock('../../../app/components/Avatar', () => 'Avatar');
jest.mock('../../../app/components/button', () => 'Button');
jest.mock('../../../app/components/Event', () => 'Event');
jest.mock('../../../app/components/eventsFilters', () => 'EventsFilters');
jest.mock('../../../app/components/fetchErrorMessage', () => 'FetchErrorMessage');
jest.mock('../../../app/components/LoadingView', () => 'LoadingView');
jest.mock('../../../app/components/projectOnboardingPrompt', () => 'ProjectOnboardingPrompt');
jest.mock('../../../app/components/navigationBar/NavigationBarIconButton', () => 'NavigationBarIconButton');
jest.mock('../../lib/styles');
jest.mock('Dimensions');

jest.unmock('react-native');

import { EventsScreen } from '../EventsScreen';

const defaultProps = {
	actions: {
		trackState: jest.fn(),
		trackAction: jest.fn(),
		getEvents: jest.fn(),
		getCustomerFavorites: jest.fn(),
	},
	customerId: 12345,
	dispatch: jest.fn(),
	isDemo: false,
	isFiltering: false,
	showEvents: false,
	user: {
		firstName: '',
		lastName: '',
		apiUser: {
			avatar: '',
		},
	},
	photos: [],
	events: [],
};

describe('EventsScreen component', () => {

	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<EventsScreen {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render filtering correctly', () => {
		const tree = require('react-test-renderer').create(
			<EventsScreen
				{...defaultProps}
				isFiltering={true}
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render events correctly', () => {
		const tree = require('react-test-renderer').create(
			<EventsScreen
				{...defaultProps}
				showEvents={true}
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});
});
