import React from 'react';
import { shallow } from 'enzyme';
import PricedOptions from '../PricedOptions';

jest.mock('../../../../app/store/configStore', () => ({}));

jest.mock('BuildLibrary');
jest.mock('BuildNative');

jest.unmock('react-native');

const defaultProps = {
	options: [],
};

describe('PricedOptions component', () => {
	const wrapper = shallow(<PricedOptions {...defaultProps} />);

	it('should render with default props', () => {
		expect(wrapper).toMatchSnapshot();
	});
});
