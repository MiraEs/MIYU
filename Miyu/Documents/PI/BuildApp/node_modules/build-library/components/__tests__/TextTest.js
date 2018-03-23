import React from 'react';
jest.unmock('react-native');
import 'react-native';
import {shallow} from 'enzyme';

import Text from '../Text';

describe('Text', () => {

	it('should render default', () => {
		const wrapper = shallow(<Text/>);
		expect(wrapper).toMatchSnapshot();
	});

});
