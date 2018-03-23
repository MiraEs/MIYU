jest.mock('../../../../app/store/configStore', () => ({}));
jest.mock('../../../../app/components/Cart/PricedOptions', () => 'PricedOptions');

jest.mock('BuildLibrary');
jest.mock('BuildNative');

jest.unmock('react-native');

import React from 'react';
import { shallow } from 'enzyme';
import CartRowPrice from '../CartRowPrice';
import cartReducer from '../../../../__mocks__/reducers/cartReducer';

const defaultProps = {
	cartItem: { ...cartReducer.cart.sessionCartItems[0] },
};

describe('CartRowPrice component', () => {
	const wrapper = shallow(<CartRowPrice {...defaultProps} />);

	it('should render with default props', () => {
		expect(wrapper).toMatchSnapshot();
	});
});
