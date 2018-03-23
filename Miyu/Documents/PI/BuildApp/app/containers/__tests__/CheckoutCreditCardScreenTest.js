'use strict';

jest.mock('../../../app/services/httpClient', () => ({}));
jest.mock('../../../app/store/configStore', () => ({}));
jest.mock('../../../app/lib/analytics/tracking');
jest.mock('BuildNative');
jest.mock('BuildLibrary');
jest.mock('../../../app/components/Form', () => 'Form');
jest.mock('../../../app/components/FormInput', () => 'FormInput');

jest.unmock('react-native');

import { CheckoutCreditCardScreen } from '../CheckoutCreditCardScreen';
import React from 'react';

const defaultProps = {
	actions: {
		trackState: jest.fn(),
		getDefaultShippingAddress: jest.fn(() => ({ then: jest.fn(() => ({ then: jest.fn() })) })),
		updateSessionCart: jest.fn(),
		updateShippingAddress: jest.fn(),
		getCustomerAddresses: jest.fn(),
		getDefaultCard: jest.fn(),
		getStoreCredit: jest.fn(),

	},
	isGuestCheckout: false,
	couponCode: '',
	validationErrors: null,
	user: {
		isGuest: false,
	},
	cart: {
		cart: {
			subTotal: 0,
		},
	},
	checkout: {
		creditCart: null,
	},
	shippingAddresses: [],
	features: {
		applePay: false,
	},
};

describe('CheckoutCreditCardScreen component', () => {

	beforeAll(() => {
		spyOn(Promise, 'all').and.returnValue({ catch: jest.fn(() => ({ done: jest.fn() }))});
	});

	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<CheckoutCreditCardScreen {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});
});
