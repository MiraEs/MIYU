
jest.mock('../../../app/services/httpClient', () => ({}));
jest.mock('../../../app/store/configStore', () => ({}));
jest.mock('../../../app/lib/analytics/tracking');
jest.mock('BuildNative');
jest.mock('BuildLibrary');

jest.unmock('react-native');

import CheckBox from '../Checkbox';
import React from 'react';
import renderer from 'react-test-renderer';
import ShallowRenderer from 'react-test-renderer/shallow';

const defaultProps = {
	name: 'name',
};

const fullProps = {
	name: 'name',
	label: 'label',
	onChange: jest.fn(),
	value: true,
	style: {},
};

describe('CheckBox component', () => {
	it('should render correctly', () => {
		const tree = renderer.create(
			<CheckBox {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});


	it('should handle a change', () => {
		const shallowRenderer = new ShallowRenderer();
		const onInputValueChange = jest.fn();
		shallowRenderer.render(<CheckBox {...fullProps} />, { onInputValueChange });
		const instance = shallowRenderer.getMountedInstance();
		instance.handleChange();
		expect(fullProps.onChange).toBeCalledWith(false, true);
		expect(onInputValueChange).toBeCalledWith('name', false, true);
	});

	it('should register itself with the form', () => {
		const shallowRenderer = new ShallowRenderer();
		const registerInputWithForm = jest.fn();
		shallowRenderer.render(<CheckBox {...defaultProps} />, { registerInputWithForm });
		expect(registerInputWithForm).toBeCalledWith(shallowRenderer.getMountedInstance());
	});

	it('should handle isValid and triggerValidation for the Forms sake', () => {
		const shallow = renderer.create(
			<CheckBox {...defaultProps} />
		);
		const result1 = shallow.getInstance().isValid();
		expect(result1).toEqual(true);
		const result2 = shallow.getInstance().triggerValidation();
		expect(result2).toEqual(true);
	});
});
