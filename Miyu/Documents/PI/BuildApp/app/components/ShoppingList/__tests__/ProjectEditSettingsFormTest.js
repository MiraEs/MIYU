'use strict';

jest.unmock('react-native');
import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';

jest.mock('../../Form', () => 'Form');
jest.mock('../../FormInput', () => 'FormInput');
jest.mock('BuildNative');
jest.mock('BuildLibrary');

import ProjectEditSettingsForm from '../ProjectEditSettingsForm';

const defaultProps = {
	description: 'Test',
	isLoading: false,
	name: 'Test',
	onSave: jest.fn(),
};

describe('ProjectEditSettingsForm component', () => {
	it('should render correctly', () => {
		const tree = renderer.create(<ProjectEditSettingsForm {...defaultProps} />);
		expect(tree.toJSON()).toMatchSnapshot();
	});

	it('should render w/o a description', () => {
		const tree = renderer.create(
			<ProjectEditSettingsForm
				{...defaultProps}
				description=""
			/>
		);
		expect(tree.toJSON()).toMatchSnapshot();
	});
});

describe('ProjectEditSettingsForm function tests', () => {

	// the negative test has to come before the positive so
	// that we can correctly detect if the function has been called
	it('should not call onSave', () => {
		const wrapper = renderer.create(<ProjectEditSettingsForm {...defaultProps} />);
		wrapper.getInstance().handleChange({
			description: {
				value: '',
				valid: true,
			},
			name: {
				value: '',
				valid: false,
			},
		}, false);
		wrapper.getInstance().onPressSave();
		expect(defaultProps.onSave).not.toHaveBeenCalled();
	});

	it('should call onSave', () => {
		renderer.create(<ProjectEditSettingsForm {...defaultProps} />)
			.getInstance()
			.onPressSave();
		expect(defaultProps.onSave).toBeCalledWith({
			description: defaultProps.description,
			name: defaultProps.name,
		});
	});

	it('should initialize the state', () => {
		const state = renderer.create(<ProjectEditSettingsForm {...defaultProps} />).getInstance().state;
		expect(state).toMatchSnapshot();
	});

	it('handleChange should change the state', () => {
		const wrapper = renderer.create(<ProjectEditSettingsForm {...defaultProps} />);
		wrapper.getInstance().handleChange({
			description: {
				value: '',
				valid: true,
			},
			name: {
				value: 'another value',
				valid: true,
			},
		}, true);
		const state = wrapper.getInstance().state;
		expect(state).toMatchSnapshot();
	});
});
