jest.mock('react-native');
jest.mock('BuildNative');
jest.mock('BuildLibrary');
jest.mock('../../components/OrderListItem', () => 'OrderListItem');

import { ReturnsScreen } from '../ReturnsScreen';
import React from 'react';

const defaultProps = {
	actions: {
		loadReturns: jest.fn(() => Promise.resolve({})),
	},
	navigator: {
		push: jest.fn(),
	},
	returns: [],
	user: {
		customerId: 1,
	},
};

describe('ReturnsScreen component', () => {
	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<ReturnsScreen {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render an error', () => {
		const tree = require('react-test-renderer').create(
			<ReturnsScreen
				{...defaultProps}
				error="Error message"
				orders={undefined}
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});
});

describe('ReturnsScreen functions', () => {
	const mockReturn = {
		orderNumber: 1,
		returnId: 2,
		returnTotal: 1,
		returnDate: new Date('1/1/2001'),
		productImage: 'test',
	};

	it('renderReturn', () => {
		const tree = require('react-test-renderer').create(
			<ReturnsScreen {...defaultProps} />
		);
		const result = tree.getInstance().renderReturn({
			item: mockReturn,
		});
		expect(result).toMatchSnapshot();
	});

	it('renderHeader', () => {
		const tree = require('react-test-renderer').create(
			<ReturnsScreen {...defaultProps} />
		);
		const result = tree.getInstance().renderHeader();
		expect(result).toMatchSnapshot();
	});

	it('onPressReturn', () => {
		const tree = require('react-test-renderer').create(
			<ReturnsScreen {...defaultProps} />
		);
		tree.getInstance().onPressReturn(mockReturn.returnId);
		expect(defaultProps.navigator.push).toBeCalledWith(
			'returnDetails', {
				returnId: mockReturn.returnId,
			});
	});

	it('returnKeyExtractor', () => {
		const tree = require('react-test-renderer').create(
			<ReturnsScreen {...defaultProps} />
		);
		const result = tree.getInstance().returnKeyExtractor(mockReturn, 0);
		const result2 = tree.getInstance().returnKeyExtractor({}, 0);
		expect(result).toEqual(mockReturn.returnId);
		expect(result2).toEqual(0);
	});

	it('setScreenTrackingInformation', () => {
		const tree = require('react-test-renderer').create(
			<ReturnsScreen {...defaultProps} />
		);
		const result = tree.getInstance().setScreenTrackingInformation();
		expect(result).toMatchSnapshot();
	});

	it('getScreenData', () => {
		const tree = require('react-test-renderer').create(
			<ReturnsScreen {...defaultProps} />
		);
		tree.getInstance().getScreenData();
		expect(defaultProps.actions.loadReturns).toBeCalledWith(defaultProps.user.customerId);
	});
});
