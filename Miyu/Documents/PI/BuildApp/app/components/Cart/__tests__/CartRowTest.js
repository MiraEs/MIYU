import React from 'react';
import CartRow from '../CartRow';

jest.mock('../../../store/configStore', () => ({}));
jest.mock('../../../components/Cart/PricedOptions', () => 'PricedOptions');
jest.mock('../../../lib/styles');
jest.mock('BuildLibrary');
jest.mock('BuildNative');

jest.unmock('react-native');

import cartReducer from '../../../../__mocks__/reducers/cartReducer';

const defaultProps = {
	rowId: '0',
	cartItem: { ...cartReducer.cart.sessionCartItems[0]},
	hideQuantitySelectors: false,
	onUpdateQuantity: jest.fn(),
	onUndoDeleteCartItem: jest.fn(),
};


describe('CartRow component', () => {
	it('should render with default props', () => {
		const wrapper = require('react-test-renderer').create(<CartRow {...defaultProps} />);
		expect(wrapper.toJSON()).toMatchSnapshot();
	});

	it('should hide quantity selector edit', () => {
		const wrapper = require('react-test-renderer').create(
			<CartRow
				{...defaultProps}
				hideQuantitySelectors={true}
			/>
		);
		expect(wrapper.toJSON()).toMatchSnapshot();
	});

	it('should show quantity selector edit', () => {
		const wrapper = require('react-test-renderer').create(<CartRow {...defaultProps} />);
		wrapper.getInstance().setState({ isSelectorVisible: { '0': true } });
		expect(wrapper.toJSON()).toMatchSnapshot();
	});
});
