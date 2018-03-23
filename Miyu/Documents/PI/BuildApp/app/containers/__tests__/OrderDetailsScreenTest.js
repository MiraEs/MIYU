'use strict';

jest.mock('../../../app/services/httpClient', () => ({}));
jest.mock('../../../app/store/configStore', () => ({}));
jest.mock('../../../app/lib/analytics/tracking');
jest.mock('BuildNative');
jest.mock('BuildLibrary');
jest.mock('../../../app/components/Form', () => 'Form');
jest.mock('../../../app/components/FormInput', () => 'FormInput');
jest.mock('../../../app/components/CartItemList', () => 'CartItemList');

jest.unmock('react-native');

import { OrderDetailsScreen } from '../OrderDetailsScreen';
import React from 'react';

const defaultProps = {
	actions: {
		trackState: jest.fn(),
		trackAction: jest.fn(),
	},
	order: {},
	orderDetails: {},
	orderNumber: 1,
	projects: {},
	returnsFeature: false,
	user: {
		tierInfo: {},
	},
};

describe('OrderDetailsScreen component', () => {

	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<OrderDetailsScreen {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});
});
