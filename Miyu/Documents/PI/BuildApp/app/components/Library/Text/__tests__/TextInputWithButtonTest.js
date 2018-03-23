jest.unmock('react-native');
jest.mock('../../../../../app/store/configStore', () => ({}));
jest.mock('BuildNative');

import 'react-native';
import React from 'react';
import TextInputWithButton from '../TextInputWithButton';
import renderer from 'react-test-renderer';

const defaultProps = {
	onCreate: jest.fn(),
	buttonText: 'Test',
	placeholderText: 'Placeholder Test',
	analytics: {
		actionName: 'test',
	},
};

describe('BuildLibrary TextInputWithButton', () => {
	it('should render correctly', () => {
		const tree = renderer.create(<TextInputWithButton {...defaultProps} />);
		expect(tree.toJSON()).toMatchSnapshot();
	});

	it('should render with create button', () => {
		const tree = renderer.create(<TextInputWithButton {...defaultProps} />);
		tree.getInstance().setState({ showButton: true });
		expect(tree).toMatchSnapshot();
	});

	describe('onPressCreate', () => {
		it('should set error when create button pressed with empty input', () => {
			const tree = new TextInputWithButton(defaultProps);
			tree.state = {
				text: null,
			};
			tree.setState = jest.fn();
			tree.onPressCreate();
			expect(tree.setState).toHaveBeenCalledWith({ error: true });
			expect(tree.props.onCreate).not.toHaveBeenCalled();
		});

		it('should call props.onCreate', () => {
			const tree = new TextInputWithButton(defaultProps);
			tree.state = {
				text: 'test',
			};
			tree.onPressCreate();
			expect(tree.props.onCreate).toHaveBeenCalledWith('test');
		});
	});

	describe('clearInput', () => {
		it('should call clear and blur on textInput', () => {
			const tree = new TextInputWithButton(defaultProps);
			tree.textInput = {
				clear: jest.fn(),
				blur: jest.fn(),
			};
			tree.clearInput();
			expect(tree.textInput.clear).toHaveBeenCalled();
			expect(tree.textInput.blur).toHaveBeenCalled();
		});
	});
});
