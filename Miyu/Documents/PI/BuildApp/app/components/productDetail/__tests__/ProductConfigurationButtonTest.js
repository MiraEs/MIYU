import React from 'react';
import 'react-native';
import { shallow } from 'enzyme';

jest.unmock('react-native');
jest.mock('build-library');
jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');
jest.mock('../../../lib/styles');
jest.mock('../../../lib/analytics/TrackingActions', () => ({}));

import ProductConfigurationButton from '../ProductConfigurationButton';

const fullProps = {
	onPress: jest.fn(),
	label: 'label',
	options: [{
		name: 'name 1',
		value: 'value 1',
	}, {
		name: 'name 2',
		value: 'value 2',
	}],
};

describe('ProductConfigurationButton', () => {
	it('should render with full props', () => {
		const wrapper = shallow(<ProductConfigurationButton {...fullProps} />);
		expect(wrapper).toMatchSnapshot();
	});
});
