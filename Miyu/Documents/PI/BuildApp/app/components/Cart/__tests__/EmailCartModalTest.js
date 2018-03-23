import React from 'react';
import { shallow } from 'enzyme';
import EmailCartModal from '../EmailCartModal';

jest.mock('../../../store/configStore', () => ({}));
jest.mock('../../../lib/styles');
jest.mock('../../../components/Form', () => 'Form');
jest.mock('../../../components/FormInput', () => 'FormInput');
jest.mock('BuildLibrary');
jest.mock('BuildNative');

jest.unmock('react-native');

const defaultProps = {
	onEmail: jest.fn(),
	email: 'email@email.com',
	name: 'Foo Bar',
};

describe('EmailCartModal component', () => {
	const wrapper = shallow(<EmailCartModal {...defaultProps} />);

	it('should render with default props', () => {
		expect(wrapper).toMatchSnapshot();
	});
});
