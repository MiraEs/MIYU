
jest.unmock('react-native');
jest.mock('BuildNative');
jest.mock('../../../app/services/httpClient', () => ({}));
import 'react-native';
import React from 'react';
import PurchaseOrder from '../PurchaseOrder';

const defaultProps = {
	purchaseOrder: {
		shippingTrackingDetails: [],
		cartItems: [{
			finish: 'finish name',
		}],
	},
	itemCount: 2,
	orderDetails: {
		cartItems: [{
			finish: 'finish name',
		}],
	},
	navigator: {
		push: jest.fn(),
	},
};

describe('PurchaseOrder', () => {
	it('should render with default props', () => {
		const tree = require('react-test-renderer').create(
			<PurchaseOrder {...defaultProps} />
		);
		expect(tree).toMatchSnapshot();
	});
});
