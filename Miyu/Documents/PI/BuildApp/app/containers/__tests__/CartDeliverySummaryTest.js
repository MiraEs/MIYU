jest.unmock('react-native');
jest.mock('../../../app/services/httpClient', () => ({}));
jest.mock('../../../app/components/CartItemInfo', () => 'CartItemInfo');
jest.mock('BuildNative');
jest.mock('../../../app/actions/CartActions', () => ({
	getSessionCartErrors: jest.fn(),
}));
import React from 'react';
import { CartDeliverySummary } from '../CartDeliverySummary';

const defaultProps = {
	cart: {
		cartItems: [],
	},
};

describe('CartDeliverySummary container', () => {

	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<CartDeliverySummary {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

});
