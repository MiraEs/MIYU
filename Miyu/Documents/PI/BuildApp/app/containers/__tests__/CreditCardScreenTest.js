'use strict';

jest.mock('../../../app/services/httpClient', () => ({}));
jest.mock('../../../app/store/configStore', () => ({}));
jest.mock('../../../app/lib/analytics/tracking');
jest.mock('BuildNative');
jest.mock('BuildLibrary');
jest.mock('../../../app/components/Form', () => 'Form');
jest.mock('../../../app/components/FormInput', () => 'FormInput');
jest.mock('../../../app/components/FixedBottomButton', () => 'FixedBottomButton');

jest.unmock('react-native');

import { CreditCardScreen } from '../CreditCardScreen';
import React from 'react';

const defaultProps = {
	actions: {
		trackState: jest.fn(),
	},
	isGuestCheckout: false,
	isCheckout: true,
	shippingAddresses: [],
	billingAddresses: [],
};

describe('CreditCardScreen component', () => {

	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<CreditCardScreen {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});
});
