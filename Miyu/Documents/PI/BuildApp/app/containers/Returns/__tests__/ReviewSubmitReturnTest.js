'use strict';

jest.mock('react-native');

jest.mock('../../../lib/analytics/tracking');
jest.mock('BuildNative');
jest.mock('BuildLibrary');
jest.mock('../../../components/Returns/ReturnPolicyLink', () => 'ReturnPolicyLink');
jest.mock('../../../components/Returns/StepText', () => 'StepText');
jest.mock('../../../components/Returns/StoreCreditModal', () => 'StoreCreditModal');
jest.mock('../../../components/Returns/SimplifiedProductInfo', () => 'SimplifiedProductInfo');
jest.mock('../../../components/CreditCardInfo', () => 'CreditCardInfo');
jest.mock('../../../lib/eventEmitter', () => ({
	emit: jest.fn(),
}));
jest.mock('../../../lib/animations', () => ({
	fadeIn: {},
}));
jest.mock('../../../lib/helpers');
jest.mock('../../../actions/ReturnsActions', () => ({
	submitReturn: jest.fn(() => Promise.resolve({})),
	updateItemInReturn: jest.fn(() => Promise.resolve({})),
}));

import { ReviewSubmitReturn, mapStateToProps } from '../ReviewSubmitReturn';
import React from 'react';
import EventEmitter from '../../../lib/eventEmitter';
import StoreCreditModal from '../../../components/Returns/StoreCreditModal';

const defaultProps = {
	actions: {
		submitReturn: jest.fn(),
		updateItemInReturn: jest.fn(),
	},
	groupsForReturn: [{
		id: 1,
		items: [{
			productUniqueId: 1,
		}],
		shippingMethod: {
			title: 'UPS Drop-off',
			price: 7,
		},
		refund: {
			type: 'Store Credit',
		},
		groupSummary: {
			originalCost: 630,
			tax: 8,
			returnShipping: -7,
			total: 631,
		},
	}, {
		id: 2,
		items: [{
			productUniqueId: 2,
		}],
		shippingMethod: {
			title: 'UPS Pick-up',
			price: 12,
		},
		refund: {
			type: 'Credit Card',
			cardInfo: {
				cardType: 'Discover',
				lastFour: 1234,
				expDate: '1/1/21',
			},
		},
		groupSummary: {
			originalCost: 630,
			tax: 8,
			returnShipping: -12,
			total: 631,
		},
	}],
	navigator: {
		pop: jest.fn(),
		push: jest.fn(),
		updateCurrentRouteParams: jest.fn(),
	},
};

describe('ReviewSubmitReturn component', () => {
	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<ReviewSubmitReturn {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

});

describe('ReviewSubmitReturn functions', () => {
	it('setScreenTrackingInformation', () => {
		const tree = require('react-test-renderer').create(
			<ReviewSubmitReturn {...defaultProps} />
		);
		const result = tree.getInstance().setScreenTrackingInformation();
		expect(result).toMatchSnapshot();
	});

	it('displayStoreCreditModal', () => {
		const tree = require('react-test-renderer').create(
			<ReviewSubmitReturn {...defaultProps} />
		);
		tree.getInstance().displayStoreCreditModal();
		expect(EventEmitter.emit).toBeCalledWith('showCustomScreenOverlay', {
			component: <StoreCreditModal />,
			animation: {},
			overlayStyles: {
				justifyContent: 'center',
			},
		});
	});

	it('onPressEditShippingMethod', () => {
		const tree = require('react-test-renderer').create(
			<ReviewSubmitReturn {...defaultProps} />
		);
		tree.getInstance().onPressEditShippingMethod();
		expect(defaultProps.navigator.pop).toBeCalled();
	});

	it('onPressEditItem', () => {
		const tree = require('react-test-renderer').create(
			<ReviewSubmitReturn {...defaultProps} />
		);
		tree.getInstance().onPressEditItem();
		expect(defaultProps.navigator.pop).toBeCalledWith(2);
	});

	it('renderItem', () => {
		const tree = require('react-test-renderer').create(
			<ReviewSubmitReturn {...defaultProps} />
		);
		const result = tree.getInstance().renderItem({
			item: defaultProps.groupsForReturn[0].items[0],
		});
		expect(result).toMatchSnapshot();
	});

	it('renderItemsGroup', () => {
		const tree = require('react-test-renderer').create(
			<ReviewSubmitReturn {...defaultProps} />
		);
		const result = tree.getInstance().renderItemsGroup({
			item: defaultProps.groupsForReturn[0],
			index: 0,
		});
		expect(result).toMatchSnapshot();
	});

	it('renderGroupSummary', () => {
		const tree = require('react-test-renderer').create(
			<ReviewSubmitReturn {...defaultProps} />
		);
		const result = tree.getInstance().renderGroupSummary(defaultProps.groupsForReturn[0]);
		expect(result).toMatchSnapshot();
	});

	it('renderRefundType', () => {
		const tree = require('react-test-renderer').create(
			<ReviewSubmitReturn {...defaultProps} />
		);
		let result = tree.getInstance().renderRefundType(defaultProps.groupsForReturn[0].refund);
		expect(result).toMatchSnapshot();
		result = tree.getInstance().renderRefundType(defaultProps.groupsForReturn[1].refund);
		expect(result).toMatchSnapshot();
	});

	it('renderShippingMethod', () => {
		const tree = require('react-test-renderer').create(
			<ReviewSubmitReturn {...defaultProps} />
		);
		const result = tree.getInstance().renderShippingMethod(defaultProps.groupsForReturn[0].shippingMethod);
		expect(result).toMatchSnapshot();
	});

	it('displayName', () => {
		const tree = require('react-test-renderer').create(
			<ReviewSubmitReturn {...defaultProps} />
		);
		const result = tree.getInstance();
		expect(result.displayName).toMatchSnapshot();
	});

	it('route', () => {
		const tree = require('react-test-renderer').create(
			<ReviewSubmitReturn {...defaultProps} />
		);
		const result = tree.getInstance();
		expect(result.route).toMatchSnapshot();
	});

	it('mapStateToProps', () => {
		const fakeState = {
			ReturnsReducer: {
				returnInProgress: {
					groupsForReturn: defaultProps.groupsForReturn,
				},
			},
			userReducer: {
				user: {
					isPro: false,
				},
			},
		};
		const result = mapStateToProps(fakeState);
		expect(result.groupsForReturn).toEqual(defaultProps.groupsForReturn);
	});

});
