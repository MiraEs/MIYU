jest.mock('../../../../app/store/configStore', () => ({}));
jest.mock('BuildLibrary');
jest.mock('BuildNative');

jest.unmock('react-native');

import React from 'react';
import { shallow } from 'enzyme';
import ShippingMethodSelection from '../ShippingMethodSelection';
import cartReducer from '../../../../__mocks__/reducers/cartReducer';
import userReducer from '../../../../__mocks__/reducers/userReducer';


const defaultProps = {
	cart: cartReducer,
	isDisabled: false,
	hasError: false,
	onPress: jest.fn(),
	user: userReducer.user,
};

describe('ShippingMethodSelection component', () => {
	const wrapper = shallow(<ShippingMethodSelection {...defaultProps} />);

	beforeEach(() => jest.resetModules());

	it('should render with default props', () => {
		expect(wrapper).toMatchSnapshot();
	});
});
