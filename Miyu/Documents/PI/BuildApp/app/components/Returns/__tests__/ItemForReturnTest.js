jest.mock('BuildNative');
jest.mock('BuildLibrary');
jest.mock('../../../lib/helpers', () => ({
	getIcon: jest.fn((name) => `ios-${name}`),
}));
jest.mock('../../Form', () => 'Form');
jest.mock('../../FormDropDown', () => 'FormDropDown');
jest.mock('../../FormInput', () => 'FormInput');
jest.mock('../SimplifiedProductInfo', () => 'SimplifiedProductInfo');
jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');
jest.mock('react-native');

import ItemForReturn from '../ItemForReturn';
import React from 'react';
import renderer from 'react-test-renderer';

const defaultProps = {
	index: 1,
	item: {
		productCompositeId: 1,
		productId: 1,
		productUniqueId: 1,
	},
	onUpdateItem: jest.fn(),
	parentScrollHandle: {},
};

describe('ItemForReturn component', () => {
	it('should render', () => {
		const tree = renderer.create(
			<ItemForReturn {...defaultProps} />
		);
		expect(tree.toJSON()).toMatchSnapshot();
		expect(tree.getInstance().valid).toEqual(true);
		expect(defaultProps.onUpdateItem).toBeCalledWith(1, { returnQuantity: 1 });
	});

	it('should render selected', () => {
		const tree = renderer.create(
			<ItemForReturn
				{...defaultProps}
				item={{
					...defaultProps.item,
					selected: true,
				}}
			/>
		);
		expect(tree.toJSON()).toMatchSnapshot();
		expect(tree.getInstance().valid).toEqual(false);
	});

	it('should render quantity selector & quantity error', () => {
		const tree = renderer.create(
			<ItemForReturn
				{...defaultProps}
				item={{
					...defaultProps.item,
					quantity: 2,
					returnQuantity: 5,
					selected: true,
				}}
			/>
		);
		expect(tree.toJSON()).toMatchSnapshot();
		expect(tree.getInstance().isQuantityValid()).toEqual(false);
		expect(tree.getInstance().valid).toEqual(false);
	});

	it('should render a reason', () => {
		const tree = renderer.create(
			<ItemForReturn
				{...defaultProps}
				item={{
					...defaultProps.item,
					quantity: 1,
					reason: 1,
					returnQuantity: 1,
					selected: true,
				}}
			/>
		);
		expect(tree.toJSON()).toMatchSnapshot();
		expect(tree.getInstance().valid).toEqual(true);
	});

	it('should render other reason', () => {
		const tree = renderer.create(
			<ItemForReturn
				{...defaultProps}
				item={{
					...defaultProps.item,
					quantity: 1,
					reason: 3,
					returnQuantity: 1,
					selected: true,
				}}
			/>
		);
		expect(tree.toJSON()).toMatchSnapshot();
		expect(tree.getInstance().valid).toEqual(false);
	});

	it('should render other reason & text', () => {
		const tree = renderer.create(
			<ItemForReturn
				{...defaultProps}
				item={{
					...defaultProps.item,
					quantity: 1,
					reason: 3,
					reasonText: 'test',
					returnQuantity: 1,
					selected: true,
				}}
			/>
		);
		expect(tree.toJSON()).toMatchSnapshot();
		expect(tree.getInstance().valid).toEqual(true);
	});
});

describe('ItemForReturn functions', () => {
	it('should update the item selected', () => {
		const tree = renderer.create(
			<ItemForReturn
				{...defaultProps}
			/>
		);
		tree.getInstance().onPressItem();
		expect(defaultProps.onUpdateItem).toBeCalledWith(1, {
			selected: true,
		});
	});

	it('should update the item quantity', () => {
		const tree = renderer.create(
			<ItemForReturn
				{...defaultProps}
			/>
		);
		tree.getInstance().onUpdateQuantity(1);
		expect(defaultProps.onUpdateItem).toBeCalledWith(1, {
			returnQuantity: 1,
		});
	});

	it('should update the item quantity', () => {
		const tree = renderer.create(
			<ItemForReturn
				{...defaultProps}
			/>
		);
		tree.getInstance().handleChange({
			reason: {
				value: 1,
				valid: true,
			},
			reasonText: {
				value: 'test',
				valid: true,
			},
		});
		expect(defaultProps.onUpdateItem).toBeCalledWith(1, {
			reason: 1,
			reasonText: 'test',
		});
	});

});
