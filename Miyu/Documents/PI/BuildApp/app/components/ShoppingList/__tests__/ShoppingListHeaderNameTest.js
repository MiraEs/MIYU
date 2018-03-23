jest.mock('BuildNative');
jest.mock('BuildLibrary');
jest.mock('../../Form', () => 'Form');
jest.mock('../../FormInput', () => 'FormInput');
jest.mock('../../ErrorText', () => 'ErrorText');
jest.mock('../../../store/configStore', () => ({}));
jest.mock('../../../lib/styles');
jest.mock('../../../lib/helpers');

jest.mock('react-native');

import ShoppingListHeaderName from '../ShoppingListHeaderName';
import React from 'react';
import renderer from 'react-test-renderer';

const defaultProps = {
	isEditing: false,
	name: '',
	onSaveName: jest.fn(),
};

describe('ShoppingListHeaderName component', () => {
	it('it should render', () => {
		const tree = renderer.create(<ShoppingListHeaderName {...defaultProps} />);
		expect(tree.toJSON()).toMatchSnapshot();
	});

	it('it should render a name', () => {
		const tree = renderer.create(
			<ShoppingListHeaderName
				{...defaultProps}
				name="Test"
			/>
		);
		expect(tree.toJSON()).toMatchSnapshot();
	});

	it('it should handle a null name', () => {
		const tree = renderer.create(
			<ShoppingListHeaderName
				{...defaultProps}
				name={null}
			/>
		);
		expect(tree.toJSON()).toMatchSnapshot();
	});

	it('it should render in editing mode', () => {
		const tree = renderer.create(
			<ShoppingListHeaderName
				{...defaultProps}
				isEditing={true}
			/>
		);
		expect(tree.toJSON()).toMatchSnapshot();
	});
});
