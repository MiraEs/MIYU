'use strict';

jest.unmock('react-native');

jest.mock('../../../lib/analytics/tracking');
jest.mock('BuildNative');
jest.mock('BuildLibrary');
jest.mock('../../../components/navigationBar/NavigationBarTextButton', () => 'NavigationBarTextButton');
jest.mock('../../../components/Form', () => 'Form');
jest.mock('../../../components/FormInput', () => 'FormInput');
jest.mock('../../../lib/styles');

jest.mock('../../../actions/ProjectActions', () => ({
	createProjectWithDefaultGroup: jest.fn(() => Promise.resolve({})),
}));

import { CreateProjectScreen } from '../CreateProjectScreen';
import React from 'react';

const defaultProps = {
	actions: {
		createProjectWithDefaultGroup: jest.fn(() => Promise.resolve({})),
	},
	error: '',
	navigator: {
		pop: jest.fn(),
		push: jest.fn(),
		updateCurrentRouteParams: jest.fn(),
	},
};

describe('CreateProjectScreen component', () => {
	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<CreateProjectScreen {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

});

describe('CreateProjectScreen functions', () => {
	it('setScreenTrackingInformation', () => {
		const tree = require('react-test-renderer')
			.create(<CreateProjectScreen {...defaultProps} />)
			.getInstance()
			.setScreenTrackingInformation();
		expect(tree).toMatchSnapshot();
	});

	it('handleChange', () => {
		const instance = require('react-test-renderer')
			.create(<CreateProjectScreen {...defaultProps} />)
			.getInstance();
		instance
			.handleChange({
				name: 'test',
				description: 'test',
			}, true);
		expect(instance.state).toMatchSnapshot();
	});

	it('onPressSave', () => {
		require('react-test-renderer').create(<CreateProjectScreen {...defaultProps} />)
			.getInstance()
			.onPressSave();
		expect(defaultProps.actions.createProjectWithDefaultGroup).toBeCalledWith({
			description: '',
			name: '',
		});
	});

});
