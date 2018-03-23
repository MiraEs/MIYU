import React from 'react';
import { shallow } from 'enzyme';
import CartRowFooter from '../CartRowFooter';

jest.mock('../../../../app/lib/ApplePay', () => {
	return {
		updateShippingMethods: jest.fn(),
		invalidShippingAddress: jest.fn(),
		paymentRequest: jest.fn(),
		selectShippingMethod: jest.fn(),
		invalidPayment: jest.fn(),
		authorizedPayment: jest.fn(),
		canMakePayments: () => {
			return Promise.resolve({
				canMakePayments: true,
				canMakePaymentsUsingNetworks: true,
			});
		},
	};
});
jest.mock('../../../../app/services/httpClient', () => ({}));
jest.mock('../../../../app/store/configStore', () => ({}));
jest.mock('../../../../app/components/Cart/CartSubTotal', () => 'CartSubTotal');
jest.mock('../../../../app/components/CouponButton', () => 'CouponButton');
jest.mock('BuildLibrary');
jest.mock('BuildNative');

jest.unmock('react-native');

import cartReducer from '../../../../__mocks__/reducers/cartReducer';
import userReducer from '../../../../__mocks__/reducers/userReducer';

const defaultProps = {
	applePay: false,
	cart: { ...cartReducer.cart },
	checkForErrors: jest.fn(),
	navigator: {
		push: jest.fn((index) => index),
	},
	onShippingEstimateModal: jest.fn(),
	selectedShippingIndex: cartReducer.selectedShippingIndex,
	user: { ...userReducer.user },
};


describe('CartRowFooter component', () => {
	const wrapper = shallow(<CartRowFooter {...defaultProps} />);

	beforeEach(() => jest.resetModules());

	it('should render with default props', () => {
		expect(wrapper).toMatchSnapshot();
	});
});
