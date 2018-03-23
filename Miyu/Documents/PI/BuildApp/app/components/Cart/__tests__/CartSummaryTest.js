jest.mock('../../../../app/store/configStore', () => ({}));
jest.mock('../../../../app/components/Cart/PricedOptions', () => 'PricedOptions');

jest.mock('BuildLibrary');
jest.mock('BuildNative');

jest.unmock('react-native');

import React from 'react';
import { shallow } from 'enzyme';
import CartSummary from '../CartSummary';
import cartReducer from '../../../../__mocks__/reducers/cartReducer';

const defaultProps = {
	cart: { ...cartReducer.cart },
	selectedShippingIndex: cartReducer.selectedShippingIndex,
};

describe('CartSummary component', () => {
	const wrapper = shallow(<CartSummary {...defaultProps} />);

	it('should render with default props', () => {
		expect(wrapper).toMatchSnapshot();
	});
});
