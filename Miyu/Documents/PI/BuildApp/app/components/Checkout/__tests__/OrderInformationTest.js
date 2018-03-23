import { shallow } from 'enzyme';
import React from 'react';
import 'react-native';
import OrderInformation from '../OrderInformation';

jest.unmock('react-native');
jest.mock('../../../lib/styles');
jest.mock('../../../lib/helpers', () => ({
	getCouponCodeFromCart: jest.fn(),
	getImageUrl: jest.fn(),
	toFloat: jest.fn(),
	toUSD: jest.fn(),
}));
jest.mock('../../../lib/productHelpers', () => ({
	isGeProduct: jest.fn(),
}));
jest.mock('BuildLibrary');
jest.mock('../../../constants/CloudinaryConstants', () => ({}));
jest.mock('../../Cart/CartSubTotal', () => ({}));


const props = {
	cart: {
		sessionCartItems: [{
			product: {
				manufacturer: 'mgf',
			},
			leadTimeInformation: {
				text: 'lead time info text',
			},
		}],
	},
	user: {},
	selectedShippingIndex: 0,
	useStoreCredit: true,
	storeCredit: 200,
	actualTaxes: true,
};

describe('OrderInformation', () => {
	it('should render with props', () => {
		const wrapper = shallow(<OrderInformation {...props} />);
		expect(wrapper).toMatchSnapshot();
	});
});
