jest.mock('../../../../app/store/configStore', () => ({}));
jest.mock('../../../../app/components/Cart/PricedOptions', () => 'PricedOptions');

jest.mock('BuildLibrary');
jest.mock('BuildNative');

jest.unmock('react-native');

import React from 'react';
import { shallow } from 'enzyme';
import CartSubTotal from '../CartSubTotal';
import cartReducer from '../../../../__mocks__/reducers/cartReducer';
import userReducer from '../../../../__mocks__/reducers/userReducer';

const defaultProps = {
	cart: { ...cartReducer.cart },
	selectedShippingIndex: cartReducer.selectedShippingIndex,
	useStoreCredit: false,
	storeCredit: 0,
	user: { ...userReducer.user },
	actualTaxes: false,
};

describe('CartSubTotal component', () => {
	const wrapper = shallow(<CartSubTotal {...defaultProps} />);

	it('should render with default props', () => {
		expect(wrapper).toMatchSnapshot();
	});
});
