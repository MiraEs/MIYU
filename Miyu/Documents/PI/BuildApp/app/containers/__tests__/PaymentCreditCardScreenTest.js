'use strict';

jest.mock('../../../app/services/httpClient', () => ({}));
jest.mock('../../../app/store/configStore', () => ({}));
jest.mock('../../../app/lib/analytics/tracking');
jest.mock('BuildNative');
jest.mock('BuildLibrary');
jest.mock('../../../app/components/Form', () => 'Form');
jest.mock('../../../app/components/FormInput', () => 'FormInput');

jest.unmock('react-native');

import { PaymentCreditCardScreen } from '../PaymentCreditCardScreen';
import React from 'react';

const defaultProps = {
	actions: {
		trackState: jest.fn(),
		getCreditCards: jest.fn(() => ({ catch: jest.fn(() => ({ done: jest.fn() })) })),
	},
	isGuestCheckout: false,
	creditCards: [],
};

describe('PaymentCreditCardScreen component', () => {

	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<PaymentCreditCardScreen {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});
});
