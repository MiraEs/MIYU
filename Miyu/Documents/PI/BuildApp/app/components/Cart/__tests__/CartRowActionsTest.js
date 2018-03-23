jest.mock('BuildLibrary');
jest.mock('BuildNative');
jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');
jest.mock('react-native');
jest.mock('../../../lib/analytics/tracking', () => ({
	trackCartItemDelete: jest.fn(),
}));

import React from 'react';
import CartRowActions from '../CartRowActions';
import cartReducer from '../../../../__mocks__/reducers/cartReducer';
import { trackCartItemDelete } from '../../../lib/analytics/tracking';

const defaultProps = {
	rowId: '0',
	cartItem: { ...cartReducer.cart.sessionCartItems[0]},
	enableShoppingLists: false,
	onAddToProject: jest.fn(),
	onDeleteCartItem: jest.fn(),
};

describe('CartRowActions component', () => {
	it('should render with default props', () => {
		const wrapper = require('react-test-renderer').create(<CartRowActions {...defaultProps} />).toJSON();
		expect(wrapper).toMatchSnapshot();
	});

	it('should render with Add to Project button', () => {
		const wrapper = require('react-test-renderer')
			.create(
				<CartRowActions
					{...defaultProps}
					enableShoppingLists={true}
				/>
			).toJSON();
		expect(wrapper).toMatchSnapshot();
	});
});

describe('CartRowActions functions', () => {
	it('onAddToProject', () => {
		const wrapper = require('react-test-renderer').create(<CartRowActions {...defaultProps} />).getInstance();
		wrapper.onAddToProject();
		expect(defaultProps.onAddToProject).toBeCalledWith(defaultProps.cartItem);
	});

	it('onDeleteCartItem', () => {
		const wrapper = require('react-test-renderer').create(<CartRowActions {...defaultProps} />).getInstance();
		wrapper.onDeleteCartItem();
		expect(trackCartItemDelete).toBeCalledWith(defaultProps.cartItem, true);
		expect(defaultProps.onDeleteCartItem).toBeCalledWith(defaultProps.cartItem);
	});
});
