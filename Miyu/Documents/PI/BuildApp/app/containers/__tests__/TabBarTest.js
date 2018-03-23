'use strict';

jest.mock('../../../app/services/httpClient', () => ({}));
jest.mock('../../../app/store/configStore', () => ({}));
jest.mock('../../../app/lib/analytics/tracking');
jest.mock('../../../app/router', () => ({
	getRoute: jest.fn(),
}));

// override the global mock
jest.mock('@expo/ex-navigation', () => ({
	createRouter: jest.fn(),
	withNavigation: jest.fn(),
	NavigationStyles: {},
	StackNavigation: 'StackNavigation',
	TabNavigation: 'TabNavigation',
	TabNavigationItem: 'TabNavigationItem',
}));

jest.mock('BuildNative');
jest.mock('BuildLibrary');
jest.mock('../../../app/components/Form', () => 'Form');
jest.mock('../../../app/components/FormInput', () => 'FormInput');
jest.mock('../../../app/components/IconBadge', () => 'IconBadge');
jest.mock('../../../app/components/TabBarIcon', () => 'TabBarIcon');
jest.mock('../../../app/content/Atoms/AtomText@1', () => 'AtomText@1');

jest.unmock('react-native');

import { TabBar } from '../TabBar';
import React from 'react';

const defaultProps = {
	actions: {
		trackState: jest.fn(),
		setComponentMeasurements: jest.fn(),
	},
};

describe('TabBar component', () => {

	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<TabBar {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render the Lists button', () => {
		const tree = require('react-test-renderer').create(
			<TabBar
				{...defaultProps}
				projects={false}
				shoppingLists={true}
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});
});
