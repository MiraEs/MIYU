'use strict';

jest.mock('BuildNative');
jest.mock('BuildLibrary');
jest.mock('../../../../components/ErrorText', () => 'ErrorText');
jest.mock('../../../../components/ShoppingList/ProjectEditSettingsForm', () => 'ProjectEditSettingsForm');
jest.mock('../../../../actions/ProjectActions', () => {
	return {
		saveProject: jest.fn(),
	};
});


jest.unmock('react-native');

import { ProjectEditSettingsScreen } from '../ProjectEditSettingsScreen';
import React from 'react';

const defaultProps = {
	actions: {
		saveProject: jest.fn(),
	},
	error: '',
	project: {
		description: 'Test',
		id: 1,
		name: 'Test',
	},
};

describe('ProjectEditSettingsScreen component', () => {
	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<ProjectEditSettingsScreen {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render w/o a description', () => {
		const tree = require('react-test-renderer').create(
			<ProjectEditSettingsScreen
				{...defaultProps}
				project={{
					...defaultProps.project,
					description: '',
				}}
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});
});

describe('ProjectEditSettingsScreen function tests', () => {
	it('should return the screen tracking info', () => {
		const tree = require('react-test-renderer').create(
			<ProjectEditSettingsScreen {...defaultProps} />
		).getInstance().setScreenTrackingInformation();
		expect(tree).toMatchSnapshot();
	});
});
