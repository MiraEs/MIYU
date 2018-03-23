'use strict';

jest.mock('react-native');

jest.mock('../../../lib/analytics/tracking');
jest.mock('BuildNative');
jest.mock('BuildLibrary');
jest.mock('../../../components/Returns/ReturnPolicyLink', () => 'ReturnPolicyLink');
jest.mock('../../../components/Returns/StepText', () => 'StepText');
jest.mock('../../../components/Returns/ItemForReturn', () => 'ItemForReturn');
jest.mock('../../../actions/ReturnsActions', () => ({
	updateItemInReturn: jest.fn(),
}));
jest.mock('../../../actions/AlertActions', () => ({
	showAlert: jest.fn(),
}));

import { SelectItemsForReturn, mapStateToProps } from '../SelectItemsForReturn';
import React from 'react';

const defaultProps = {
	actions: {
		showAlert: jest.fn(),
		updateItemInReturn: jest.fn(),
	},
	items: [{
		productUniqueId: 1,
		selected: false,
	}],
	navigator: {
		push: jest.fn(),
	},
};

describe('SelectItemsForReturn component', () => {
	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<SelectItemsForReturn {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

});

describe('SelectItemsForReturn functions', () => {
	it('setScreenTrackingInformation', () => {
		const tree = require('react-test-renderer').create(
			<SelectItemsForReturn {...defaultProps} />
		);
		const result = tree.getInstance().setScreenTrackingInformation();
		expect(result).toMatchSnapshot();
	});

	it('keyExtractor', () => {
		const tree = require('react-test-renderer').create(
			<SelectItemsForReturn {...defaultProps} />
		);
		const result = tree.getInstance().keyExtractor({ productUniqueId: 1});
		expect(result).toEqual(1);
	});

	it('onUpdateItem', () => {
		const index = 0;
		const partialItem = { selected: true };
		const tree = require('react-test-renderer').create(
			<SelectItemsForReturn {...defaultProps} />
		);
		tree.getInstance().onUpdateItem(index, partialItem);
		expect(defaultProps.actions.updateItemInReturn).toBeCalledWith({
			index,
			item: {
				...partialItem,
			},
		});
	});

	describe('onContinuePress', () => {
		it('should log an error when none are selected', () => {
			const tree = require('react-test-renderer').create(
				<SelectItemsForReturn {...defaultProps} />
			);
			const wrapper = tree.getInstance();
			wrapper.onContinuePress();
			expect(defaultProps.actions.showAlert).toBeCalledWith(
				'To continue, please select the items you wish to return.',
				'error',
				undefined,
				undefined,
				5000
			);
		});

		it('should log an error when there are no valid, selected items', () => {
			const items = [{
				productUniqueId: 1,
				selected: true,
			}];
			const tree = require('react-test-renderer').create(
				<SelectItemsForReturn
					{...defaultProps}
					items={items}
				/>
			);
			const wrapper = tree.getInstance();
			wrapper.itemRefs[0] = {
				valid: false,
			};
			wrapper.onContinuePress();
			expect(defaultProps.actions.showAlert).toBeCalledWith(
				'To continue, please select the reasons why you are returning each item.',
				'error',
				undefined,
				undefined,
				5000
			);
		});

		it('should forward user to next page', () => {
			const items = [{
				productUniqueId: 1,
				selected: true,
			}];
			const tree = require('react-test-renderer').create(
				<SelectItemsForReturn
					{...defaultProps}
					items={items}
				/>
			);
			const wrapper = tree.getInstance();
			wrapper.itemRefs[0] = {
				valid: true,
			};
			wrapper.onContinuePress();
			expect(defaultProps.navigator.push).toBeCalledWith('selectShippingMethodForReturn');
		});

	});

	it('toggleItemSelected', () => {
		const index = 0;
		const tree = require('react-test-renderer').create(
			<SelectItemsForReturn {...defaultProps} />
		);
		tree.getInstance().toggleItemSelected(index);
		expect(defaultProps.actions.updateItemInReturn).toBeCalledWith({
			index,
			item: {
				selected: !defaultProps.items[index].selected,
			},
		});
	});

	it('renderItem', () => {
		const tree = require('react-test-renderer').create(
			<SelectItemsForReturn {...defaultProps} />
		);
		const result = tree.getInstance().renderItem({
			item: defaultProps.items[0],
			index: 0,
		});
		expect(result).toMatchSnapshot();
	});

	it('displayName', () => {
		const tree = require('react-test-renderer').create(
			<SelectItemsForReturn {...defaultProps} />
		);
		const result = tree.getInstance();
		expect(result.displayName).toMatchSnapshot();
	});

	it('route', () => {
		const tree = require('react-test-renderer').create(
			<SelectItemsForReturn {...defaultProps} />
		);
		const result = tree.getInstance();
		expect(result.route).toMatchSnapshot();
	});

	it('mapStateToProps', () => {
		const fakeState = {
			ReturnsReducer: {
				returnInProgress: {
					items: defaultProps.items,
				},
			},
		};
		const result = mapStateToProps(fakeState);
		expect(result).toEqual({
			items: defaultProps.items,
		});
	});

});
