jest.mock('react-native');
jest.mock('BuildNative');
jest.mock('BuildLibrary');
jest.mock('../../components/OrderListItem', () => 'OrderListItem');


import React from 'react';
import { OrdersScreen } from '../OrdersScreen';

const defaultProps = {
	actions: {
		loadOrders: jest.fn(() => Promise.resolve({})),
	},
	customerId: 1,
	orders: [],
	navigator: {
		push: jest.fn(),
	},
};

describe('OrdersScreen component', () => {
	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<OrdersScreen {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render an error', () => {
		const tree = require('react-test-renderer').create(
			<OrdersScreen
				{...defaultProps}
				error="Error message"
				orders={undefined}
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});
});

describe('OrdersScreen functions', () => {
	const mockOrder = {
		orderNumber: 1,
		itemCount: 1,
		total: 1,
		orderDate: new Date('1/1/2001'),
		productImage: 'test',
		orderStatus: 'test',
		projectName: 'test',
		friendlyStatus: {
			status: 'test',
		},
	};

	it('renderOrder', () => {
		const tree = require('react-test-renderer').create(
			<OrdersScreen {...defaultProps} />
		);
		const result = tree.getInstance().renderOrder({
			item: mockOrder,
		});
		expect(result).toMatchSnapshot();
	});

	it('renderOrderHeader', () => {
		const tree = require('react-test-renderer').create(
			<OrdersScreen {...defaultProps} />
		);
		const result = tree.getInstance().renderOrderHeader(mockOrder);
		expect(result).toMatchSnapshot();
	});

	it('viewOrder', () => {
		const tree = require('react-test-renderer').create(
			<OrdersScreen {...defaultProps} />
		);
		tree.getInstance().viewOrder(mockOrder);
		expect(defaultProps.navigator.push).toBeCalledWith(
			'orderDetails', {
				orderNumber: mockOrder.orderNumber,
			});
	});

	it('orderKeyExtractor', () => {
		const tree = require('react-test-renderer').create(
			<OrdersScreen {...defaultProps} />
		);
		const result = tree.getInstance().orderKeyExtractor(mockOrder);
		expect(result).toEqual(mockOrder.orderNumber);
	});

	it('setScreenTrackingInformation', () => {
		const tree = require('react-test-renderer').create(
			<OrdersScreen {...defaultProps} />
		);
		const result = tree.getInstance().setScreenTrackingInformation();
		expect(result).toMatchSnapshot();
	});

	it('getScreenData', () => {
		const tree = require('react-test-renderer').create(
			<OrdersScreen {...defaultProps} />
		);
		tree.getInstance().getScreenData();
		expect(defaultProps.actions.loadOrders).toBeCalledWith(defaultProps.customerId);
	});
});
