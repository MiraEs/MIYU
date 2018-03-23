'use strict';

jest.mock('../../../app/services/httpClient', () => ({}));
jest.mock('../../../app/store/configStore', () => ({}));
jest.mock('../../../app/lib/analytics/tracking');
jest.mock('BuildNative');
jest.mock('BuildLibrary');
jest.mock('../../../app/components/Form', () => 'Form');
jest.mock('../../../app/components/FormInput', () => 'FormInput');

jest.unmock('react-native');

import { CheckoutPayPalScreen } from '../CheckoutPayPalScreen';
import React from 'react';

const defaultProps = {
	actions: {
		trackState: jest.fn(),
		hideAccessories: jest.fn(),
		createPayPalPayment: jest.fn(() => ({ catch: jest.fn(() => ({ done: jest.fn()})) })),
		getStoreCredit: jest.fn(() => ({ catch: jest.fn(() => ({ done: jest.fn()})) })),
	},
	user: {
		isGuest: false,
	},
	cart: {
		cart: {
			subTotal: 0,
		},
	},
	features: {
		applePay: false,
	},
};

describe('CheckoutPayPalScreen component', () => {

	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<CheckoutPayPalScreen {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});
});
