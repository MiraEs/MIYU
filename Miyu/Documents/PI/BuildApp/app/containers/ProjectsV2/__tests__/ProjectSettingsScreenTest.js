jest.mock('../../../../app/lib/analytics/tracking');
jest.mock('BuildNative');
jest.mock('BuildLibrary');
jest.mock('Switch', () => 'Switch');  // something is wrong with the Switch returned by React Native
jest.mock('../../../components/ErrorText', () => 'ErrorText');
jest.mock('../../../actions/ProjectActions', () => {
	return {
		changeProjectStatus: jest.fn(),
	};
});


jest.unmock('react-native');

import { ProjectSettingsScreen } from '../ProjectSettingsScreen';
import React from 'react';

const defaultProps = {
	actions: {
		changeProjectStatus: jest.fn(),
		trackAction: jest.fn(),
	},
	error: '',
	loading: false,
	project: {
		archived: false,
		description: 'Test',
		id: 1,
		name: 'Test',
	},
	projectId: 1,
};

describe('ProjectSettingsScreen component', () => {
	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<ProjectSettingsScreen {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render w/o a description', () => {
		const tree = require('react-test-renderer').create(
			<ProjectSettingsScreen
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

describe('ProjectSettingsScreen function tests', () => {
	it('should return the screen tracking info', () => {
		const tree = require('react-test-renderer').create(
			<ProjectSettingsScreen {...defaultProps} />
		).getInstance().setScreenTrackingInformation();
		expect(tree).toMatchSnapshot();
	});
});
