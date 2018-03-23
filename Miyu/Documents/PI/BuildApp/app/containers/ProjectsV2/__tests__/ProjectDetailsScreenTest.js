'use strict';

jest.mock('../../../lib/analytics/tracking');
jest.mock('react-native');
jest.mock('BuildNative');
jest.mock('BuildLibrary');
jest.mock('../../../components/navigationBar/NavigationBarIconButton', () => 'NavigationBarIconButton');
jest.mock('../../../components/Library/Pager/Pager', () => 'Pager');
jest.mock('../../../components/Library/Pager/PagerTabBar', () => 'PagerTabBar');
jest.mock('../ProjectDetails/TeamTab', () => 'TeamTab');
jest.mock('../ProjectDetails/ShoppingListTab', () => 'ShoppingListTab');
jest.mock('../ProjectDetails/PhotosTab', () => 'PhotosTab');

import { ProjectDetailsScreen } from '../ProjectDetailsScreen';
import React from 'react';

const defaultProps = {
	error: '',
	loading: false,
	projectId: 1,
	navigator: {
		push: jest.fn(),
		updateCurrentRouteParams: jest.fn(),
	},
};

describe('ProjectDetailsScreen component', () => {
	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<ProjectDetailsScreen {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render the shopping list tab', () => {
		const tree = require('react-test-renderer').create(
			<ProjectDetailsScreen
				{...defaultProps}
				selectedTabIndex={0}
			/>
		);
		expect(tree).toMatchSnapshot();
	});

	it('should render the team tab', () => {
		const tree = require('react-test-renderer').create(
			<ProjectDetailsScreen
				{...defaultProps}
				selectedTabIndex={1}
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render the photos tab', () => {
		const tree = require('react-test-renderer').create(
			<ProjectDetailsScreen
				{...defaultProps}
				selectedTabIndex={2}
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

});
