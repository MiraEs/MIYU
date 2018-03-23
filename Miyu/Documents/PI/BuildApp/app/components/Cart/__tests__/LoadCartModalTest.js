jest.mock('../../../../app/store/configStore', () => ({}));

jest.mock('BuildLibrary');
jest.mock('BuildNative');
jest.mock('../../../lib/styles');
jest.unmock('react-native');

import React from 'react';
import { shallow } from 'enzyme';
import LoadCartModal from '../LoadCartModal';
import cartReducer from '../../../../__mocks__/reducers/cartReducer';

const defaultProps = {
	carts: cartReducer.carts,
	isLoggedIn: false,
	onLoadCart: jest.fn(),
	onLoadQuote: jest.fn(),
	onLogin: jest.fn(),
};


describe('LoadCartModal component', () => {
	const wrapper = shallow(<LoadCartModal {...defaultProps} />);

	it('should render with default props', () => {
		expect(wrapper).toMatchSnapshot();
	});
});
