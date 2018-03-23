jest.mock('react-native');
jest.mock('BuildNative');
jest.mock('BuildLibrary');
jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');
jest.mock('react-native-swipeable', () => 'Swipeable');
jest.mock('../../SwipeRowAction', () => 'SwipeRowAction');
jest.mock('../../SwipeRowAction', () => 'SwipeRowAction');
jest.mock('../../Cart/PricedOptions', () => 'PricedOptions');
jest.mock('../../../router', () => ({
	getRoute: jest.fn(),
}));


import { ShoppingListItem } from '../ShoppingListItem';
import React from 'react';
import renderer from 'react-test-renderer';

const defaultProps = {
	item: {
		isPurchased: true,
		name: 'test',
		quantityPurchased: 1,
		quantityUnpurchased: 1,
		estimatedArrival: 'Arriving Monday',
		orderNum: '123456',
		product: {
			displayName: 'test',
			finish: 'steel',
			image: 'test',
			manufacturer: 'test',
			stockCount: 1,
		},
		unitPrice: 1,
	},
	navigation: {
		getNavigator: jest.fn(() => ({
			push: jest.fn(),
		})),
		getNavigatorByUID: jest.fn(),
		performAction: jest.fn(),
	},
	projectId: 1,
	sessionCartId: 2,
};

describe('ShoppingListItem component', () => {
	it('it should render', () => {
		const tree = renderer.create(<ShoppingListItem {...defaultProps} />);
		expect(tree.toJSON()).toMatchSnapshot();
	});

	it('it should render collapsed', () => {
		const newProps = { ...defaultProps };
		newProps.item.isPurchased = false;
		const tree = renderer.create(
			<ShoppingListItem
				{...newProps}
			/>
		);
		expect(tree.toJSON()).toMatchSnapshot();
	});

	it('it should render a child item', () => {
		const tree = renderer.create(
			<ShoppingListItem
				{...defaultProps}
				isSubItem={true}
			/>
		);
		expect(tree.toJSON()).toMatchSnapshot();
	});

	it('should push productEdit to navigator', () => {
		const instance = new ShoppingListItem(defaultProps);
		instance.onPressEdit();
		expect(instance.props.navigation.getNavigator).toHaveBeenCalled();
	});

});
