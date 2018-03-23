import React from 'react';
import { shallow } from 'enzyme';
import PaymentMethodModal from '../PaymentMethodModal';

jest.mock('../../../store/configStore', () => ({}));
jest.mock('../../../lib/styles');
jest.mock('BuildLibrary');
jest.mock('BuildNative');

jest.unmock('react-native');

const defaultProps = {
	onCheckout: jest.fn(),
};

describe('PaymentMethodModal component', () => {
	const wrapper = shallow(<PaymentMethodModal {...defaultProps} />);

	it('should render with default props', () => {
		expect(wrapper).toMatchSnapshot();
	});
});
