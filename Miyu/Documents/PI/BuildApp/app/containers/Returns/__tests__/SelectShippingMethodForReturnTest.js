'use strict';

jest.mock('react-native');

jest.mock('../../../lib/analytics/tracking');
jest.mock('BuildNative');
jest.mock('BuildLibrary');
jest.mock('../../../components/Returns/ReturnPolicyLink', () => 'ReturnPolicyLink');
jest.mock('../../../components/Returns/StepText', () => 'StepText');
jest.mock('../../../components/Returns/SimplifiedProductInfo', () => 'SimplifiedProductInfo');
jest.mock('../../../lib/helpers', () => ({
	toUSD: jest.fn(),
}));
jest.mock('../../../actions/ReturnsActions', () => ({
	updateShippingMethods: jest.fn(),
}));
jest.mock('../../../actions/AlertActions', () => ({
	showAlert: jest.fn(),
}));

import { SelectShippingMethodForReturn, mapStateToProps } from '../SelectShippingMethodForReturn';
import React from 'react';
import cloneDeep from 'lodash.clonedeep';

const defaultProps = {
	actions: {
		showAlert: jest.fn(),
		updateShippingMethods: jest.fn(),
	},
	itemsGroups: [{
		id: 1,
		items: [{
			productUniqueId: 1,
		}],
		shippingMethods: [{
			description: 'Return shipping cost will be deducted from your refund. A printer is required.',
			title: 'Drop off at UPS',
			price: 7,
		}, {
			description: 'Return shipping cost will be deducted from your refund. A printer is required. You will need to call UPS to schedule a pick-up.',
			title: 'Have UPS come pick up',
			price: 12,
		}, {
			description: 'You are responsible for obtaining your own shipping label and will not have full visibility into return tracking/status.',
			isPro: true,
			title: 'Return with your own shipping label & provider',
		}],
	}],
	navigator: {
		push: jest.fn(),
	},
	userIsPro: false,
};

describe('SelectShippingMethodForReturn component', () => {
	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<SelectShippingMethodForReturn {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

});

describe('SelectShippingMethodForReturn functions', () => {
	it('setScreenTrackingInformation', () => {
		const tree = require('react-test-renderer').create(
			<SelectShippingMethodForReturn {...defaultProps} />
		);
		const result = tree.getInstance().setScreenTrackingInformation();
		expect(result).toMatchSnapshot();
	});

	describe('onContinuePress', () => {
		it('should log an error when no shipping methods are selected', () => {
			const tree = require('react-test-renderer').create(
				<SelectShippingMethodForReturn {...defaultProps} />
			);
			const wrapper = tree.getInstance();
			wrapper.onContinuePress();
			expect(defaultProps.actions.showAlert).toBeCalledWith(
				'To continue, please select the return shipping method for each group of items.',
				'error',
				undefined,
				undefined,
				5000
			);
		});

		it('should forward user to next page', () => {
			const newProps = cloneDeep(defaultProps);
			newProps.itemsGroups[0].shippingMethods[0].selected = true;
			const tree = require('react-test-renderer').create(
				<SelectShippingMethodForReturn
					{...newProps}
				/>
			);
			const wrapper = tree.getInstance();
			wrapper.onContinuePress();
			expect(defaultProps.navigator.push).toBeCalledWith('reviewSubmitReturn');
		});

	});

	it('onPressShippingMethod', () => {
		const groupIndex = 0;
		const shippingIndex = 0;
		const method = defaultProps.itemsGroups[groupIndex].shippingMethods[shippingIndex];
		const tree = require('react-test-renderer').create(
			<SelectShippingMethodForReturn {...defaultProps} />
		);
		tree.getInstance().onPressShippingMethod(method, groupIndex, shippingIndex);
		const expectedResult = cloneDeep(defaultProps.itemsGroups[groupIndex].shippingMethods);
		expectedResult.forEach((result, index) => {
			result.selected = shippingIndex === index;
		});
		expect(defaultProps.actions.updateShippingMethods).toBeCalledWith({
			groupIndex,
			shippingMethods: expectedResult,
		});
	});

	it('renderItem', () => {
		const tree = require('react-test-renderer').create(
			<SelectShippingMethodForReturn {...defaultProps} />
		);
		const result = tree.getInstance().renderItem({
			item: defaultProps.itemsGroups[0].items[0],
		});
		expect(result).toMatchSnapshot();
	});

	it('renderItemsGroup', () => {
		const tree = require('react-test-renderer').create(
			<SelectShippingMethodForReturn {...defaultProps} />
		);
		const result = tree.getInstance().renderItemsGroup({
			item: defaultProps.itemsGroups[0],
			index: 0,
		});
		expect(result).toMatchSnapshot();
	});

	describe('renderShippingMethod', () => {
		it('should render an unselected shipping method', () => {
			const groupIndex = 0;
			const methodIndex = 0;
			const tree = require('react-test-renderer').create(
				<SelectShippingMethodForReturn {...defaultProps} />
			);
			const result = tree.getInstance().renderShippingMethod({
				item: defaultProps.itemsGroups[groupIndex].shippingMethods[methodIndex],
				index: methodIndex,
			}, groupIndex);
			expect(result).toMatchSnapshot();
		});

		it('should render a selected shipping method', () => {
			const groupIndex = 0;
			const methodIndex = 0;
			const tree = require('react-test-renderer').create(
				<SelectShippingMethodForReturn {...defaultProps} />
			);
			const result = tree.getInstance().renderShippingMethod({
				item: {
					...defaultProps.itemsGroups[groupIndex].shippingMethods[methodIndex],
					selected: true,
				},
				index: methodIndex,
			}, groupIndex);
			expect(result).toMatchSnapshot();
		});
	});

	it('displayName', () => {
		const tree = require('react-test-renderer').create(
			<SelectShippingMethodForReturn {...defaultProps} />
		);
		const result = tree.getInstance();
		expect(result.displayName).toMatchSnapshot();
	});

	it('route', () => {
		const tree = require('react-test-renderer').create(
			<SelectShippingMethodForReturn {...defaultProps} />
		);
		const result = tree.getInstance();
		expect(result.route).toMatchSnapshot();
	});

	it('mapStateToProps', () => {
		const fakeState = {
			ReturnsReducer: {
				returnInProgress: {
					itemsGroups: defaultProps.itemsGroups,
				},
			},
			userReducer: {
				user: {
					isPro: false,
				},
			},
		};
		const result = mapStateToProps(fakeState);
		expect(result).toEqual({
			itemsGroups: defaultProps.itemsGroups,
			userIsPro: false,
		});
	});

});
