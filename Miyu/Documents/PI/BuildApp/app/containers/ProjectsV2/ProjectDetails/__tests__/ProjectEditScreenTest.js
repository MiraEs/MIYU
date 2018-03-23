jest.mock('react-native');
jest.mock('BuildLibrary');
jest.mock('react-native-star-rating', () => 'StarRating');
jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');
jest.mock('../../../../lib/styles');
jest.mock('../../../../components/ExpandCollapseContainer', () => 'ExpandCollapseContainer');
jest.mock('../../../../components/Library/View/KeyboardSpacer', () => 'KeyboardSpacer');
jest.mock('../../../../components/navigationBar/NavigationBarTextButton', () => 'NavigationBarTextButton');

import React from 'react';
import {
	mapDispatchToProps,
	ProductEditScreen,
} from '../ProductEditScreen';

const defaultProps = {
	actions: {
		addItemToShoppingList: jest.fn(() => Promise.resolve({})),
		addItemsToCartFromProject: jest.fn(),
		showAlert: jest.fn(),
	},
	item: {
		isPurchased: false,
		product: {
			manufacturer: 'manufacturer',
			image: 'image',
			displayName: 'Display Name',
			productTitle: 'Product Title',
			stockCount: 1,
			freeShipping: 'Y',
		},
		quantityPurchased: 0,
		quantityUnpurchased: 0,
		unitPrice: 1,
		leadTimeText: 'Lead Time',
	},
	navigator: {
		pop: jest.fn(),
	},
	onUpdateItem: jest.fn(),
	projectId: 1,
	reviewRating: {
		avgRating: 3,
		numReviews: 1,
	},
	sessionCartId: 2,
};

describe('ProductEditScreen', () => {
	it('should render', () => {
		const wrapper = require('react-test-renderer')
			.create(<ProductEditScreen {...defaultProps} />);
		expect(wrapper.toJSON()).toMatchSnapshot();
	});
});

describe('ProductEditScreen functions', () => {
	const wrapper = require('react-test-renderer')
		.create(<ProductEditScreen {...defaultProps} />);

	it('should mapDispatchToProps', () => {
		const dispatch = jest.fn();
		const result = mapDispatchToProps(dispatch);
		expect(result).toMatchSnapshot();
	});

	it('onPressCancel', () => {
		wrapper.getInstance().onPressCancel();
		expect(defaultProps.navigator.pop).toBeCalled();
	});

	it('onPressSave', () => {
		wrapper.getInstance().onPressSave();
		expect(defaultProps.navigator.pop).toBeCalled();
	});

	it('setScreenTrackingInformation', () => {
		const result = wrapper.getInstance().setScreenTrackingInformation();
		expect(result).toMatchSnapshot();
	});

});
