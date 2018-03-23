import React from 'react';
import { shallow } from 'enzyme';
import EmptyCart from '../EmptyCart';

jest.mock('../../../../app/store/configStore', () => ({}));
jest.mock('BuildLibrary');
jest.mock('BuildNative');

jest.unmock('react-native');

const defaultProps = {
	onLoadCartModal: jest.fn(),
};

describe('EmptyCart component', () => {
	const wrapper = shallow(<EmptyCart {...defaultProps} />);

	beforeEach(() => jest.resetModules());

	it('should render with default props', () => {
		expect(wrapper).toMatchSnapshot();
	});
});
