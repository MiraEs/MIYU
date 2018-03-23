'use strict';

jest.mock('../../../app/services/httpClient', () => ({}));
jest.mock('../../../app/store/configStore', () => ({}));
jest.mock('../../../app/lib/analytics/tracking');
jest.mock('../../../app/components/FixedBottomButton', () => 'FixedBottomButton');
jest.mock('BuildNative');
jest.mock('BuildLibrary');

jest.unmock('react-native');

import { AddressScreen } from '../AddressScreen';
import React from 'react';
import { SHIPPING_ADDRESS } from '../../constants/Addresses';

const defaultProps = {
	selectedAddressIndex: 0,
	addressId: 0,
	addresses: [],
	addressTypeId: SHIPPING_ADDRESS,
	actions: {
		trackState: jest.fn(),
	},
	defaultAddressId: null,
	title: 'Checkout',
	navigator: {
		push: jest.fn(),
	},
};

describe('AddressScreen component', () => {

	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<AddressScreen {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});
});
