'use strict';

jest.mock('../../../app/services/httpClient', () => ({}));
jest.mock('../../../app/store/configStore', () => ({}));
jest.mock('../../../app/lib/analytics/tracking');
jest.mock('../../../app/lib/styles');
jest.mock('BuildNative');
jest.mock('BuildLibrary');
jest.mock('../../../app/components/AddressEdit', () => 'AddressEdit');
jest.mock('../../../app/components/FixedBottomButton', () => 'FixedBottomButton');

jest.unmock('react-native');

import React from 'react';
import { NewAddressScreen } from '../NewAddressScreen';
import {
	BILLING_ADDRESS,
	SHIPPING_ADDRESS,
} from '../../constants/Addresses';

const defaultProps = {
	onSaveSuccess: jest.fn(),
	user: {},
};

describe('NewAddressScreen component', () => {

	it('should render a shipping address form correctly', () => {
		const tree = require('react-test-renderer').create(
			<NewAddressScreen
				{...defaultProps}
				addressTypeId={SHIPPING_ADDRESS}
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render a billing address form correctly', () => {
		const tree = require('react-test-renderer').create(
			<NewAddressScreen
				{...defaultProps}
				addressTypeId={BILLING_ADDRESS}
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});
});
