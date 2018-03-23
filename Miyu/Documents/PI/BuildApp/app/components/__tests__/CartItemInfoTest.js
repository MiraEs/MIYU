'use strict';
jest.unmock('react-native');
import 'react-native';
import React from 'react';
import CartItemInfo from '../CartItemInfo';
jest.mock('../../../app/store/configStore', () => ({}));
jest.mock('BuildLibrary');
jest.mock('BuildNative');

const defaultProps = {
	cartItem: {
		id: 139862546,
		product: {
			productCompositeId: 1005548,
			uniqueId: 2702408,
			productId: 'PWE23K',
			manufacturer: 'GE',
			finish: 'Slate',
			displayName: 'GE PWE23K',
			cost: 2600,
			image: 'ge-pwe23kmdes-1.jpg',
			status: 'stock',
			series: 'Profile',
			freeShipping: 'N',
			saleId: 3878,
			sku: 'PWE23KMKES',
			upc: null,
			containerType: 'Product',
			productTitle: '36 Inch Wide 23.1 Cu. Ft. Counter-Depth French Door Refrigerator with TwinChill Evaporators',
			notForForeignShipment: true,
			stockCount: 20,
			compositeSlugOverride: null,
		},
		itemKey: '2702408',
		parentKey: '',
		parentUniqueId: null,
		quantity: 1,
		unitPrice: 2599,
		hasPricedOptions: false,
		hasSubItems: false,
		deleted: false,
		isPackage: false,
		leadTimeText: 'Leaves the Warehouse in 1 to 2 business days',
		leadTimeInformation: {
			id: null,
			itemId: null,
			lowDays: 1,
			highDays: 2,
			shippingEstimateMethod: 'VENDOR',
			estimatedShippingDate: 1490079600000,
			text: 'Leaves the Warehouse in 1 to 2 business days',
			shippingCutOffHour: 0,
			isOutOfStock: false,
			isMadeToOrder: false,
			isPreOrder: false,
			cartShippingEstimateStockStatus: 'IN_STOCK',
			deliveryEstimate: null,
		},
		sqftPerCarton: null,
		containerType: 'Product',
		pmgItem: {
			id: null,
			uniqueId: 2702408,
			originalPrice: null,
			newPrice: null,
			itemKey: '2702408',
			parentKey: '',
			expires: null,
		},
		pricedOptions: [],
		subItems: null,
		relatedProducts: null,
		couponAmount: 0,
		productUrl: null,
		productImage: null,
		pricebookMap: {
			1: 2599,
			22: 2521.03,
			27: 2521.03,
			28: 2521.03,
			29: 2521.03,
			30: 2560.02,
		},
	},
};

describe('CartItemInfo component', () => {

	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<CartItemInfo {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render when there is an error', () => {
		const tree = require('react-test-renderer').create(
			<CartItemInfo
				cartItem={{
					...defaultProps.cartItem,
					error: 'Test Error',
				}}
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

});
