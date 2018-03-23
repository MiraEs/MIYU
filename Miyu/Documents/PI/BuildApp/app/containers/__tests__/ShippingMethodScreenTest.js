'use strict';

jest.mock('../../../app/services/httpClient', () => ({}));
jest.mock('../../../app/store/configStore', () => ({}));
jest.mock('../../../app/lib/analytics/tracking');
jest.mock('BuildNative');
jest.mock('BuildLibrary');
jest.mock('../../../app/components/Form', () => 'Form');
jest.mock('../../../app/components/FormInput', () => 'FormInput');

jest.unmock('react-native');

import { ShippingMethodScreen } from '../ShippingMethodScreen';
import React from 'react';

const defaultProps = {
	selectedShippingIndex: 0,
	shippingOptions: [],
	actions: {
		trackState: jest.fn(),
	},
	isLoading: false,
};

describe('ShippingMethodScreen component', () => {

	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<ShippingMethodScreen {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});
});
