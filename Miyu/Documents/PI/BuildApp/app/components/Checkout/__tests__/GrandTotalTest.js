jest.mock('../../../store/configStore', () => ({}));
jest.mock('BuildLibrary');
jest.mock('BuildNative');
jest.mock('../../../lib/styles');
jest.mock('../../../lib/helpers', () => {
	return {
		subTotal: jest.fn(),
		calcGrandTotal: jest.fn(),
		toUSD: jest.fn(),
	};
});

jest.unmock('react-native');

import React from 'react';
import { shallow } from 'enzyme';
import GrandTotal from '../GrandTotal';
import cartReducer from '../../../../__mocks__/reducers/cartReducer';


const defaultProps = {
	cart: cartReducer.cart,
	storeCredit: 10,
	useStoreCredit: true,
};


describe('GrandTotal component', () => {
	const wrapper = shallow(<GrandTotal {...defaultProps} />);

	beforeEach(() => jest.resetModules());

	it('should render with default props', () => {
		expect(wrapper).toMatchSnapshot();
	});
});
