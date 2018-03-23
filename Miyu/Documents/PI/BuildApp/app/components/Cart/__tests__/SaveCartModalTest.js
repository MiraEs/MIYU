import React from 'react';
import { shallow } from 'enzyme';
import SaveCartModal from '../SaveCartModal';

jest.mock('../../../store/configStore', () => ({}));

jest.mock('../../../components/Form', () => 'Form');
jest.mock('../../../components/FormInput', () => 'FormInput');
jest.mock('../../../lib/styles');
jest.mock('BuildLibrary');
jest.mock('BuildNative');

jest.unmock('react-native');

const defaultProps = {
	onSave: jest.fn(),
};

describe('SaveCartModal component', () => {
	const wrapper = shallow(<SaveCartModal {...defaultProps} />);

	it('should render with default props', () => {
		expect(wrapper).toMatchSnapshot();
	});
});
