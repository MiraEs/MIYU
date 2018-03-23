'use strict';

jest.mock('../../../app/services/httpClient', () => ({}));
jest.mock('../../../app/store/configStore', () => ({}));
jest.mock('../../../app/lib/analytics/tracking');
jest.mock('BuildNative');
jest.mock('BuildLibrary');

jest.unmock('react-native');

import { CheckoutLoginModal } from '../CheckoutLoginModal';
import React from 'react';

const defaultProps = {
	onCheckoutLogin: jest.fn(),
	paymentType: 'CREDIT_CARD',
};

describe('CheckoutLoginModal component', () => {
	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<CheckoutLoginModal {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

});
