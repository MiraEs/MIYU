import { shallow } from 'enzyme';
import React from 'react';
import 'react-native';

jest.unmock('react-native');
jest.mock('build-library');
jest.mock('../../../lib/helpers', () => ({
	toUSD: jest.fn((price) => `$${price}`),
}));
jest.mock('../../../lib/styles');

import ProductConfigurationOptionButton from '../ProductConfigurationOptionButton';

const props = {
	isSelected: true,
	imageURI: 'http://image.com/',
	onPress: jest.fn(),
	text: 'this is test text',
	price: 123.45,
};

describe('ProductConfigurationOptionButton', () => {
	it('should render with full props', () => {
		const wrapper = shallow(<ProductConfigurationOptionButton {...props} />);
		expect(wrapper).toMatchSnapshot();
	});
	it('should render with no price, no image and not selected', () => {
		const wrapper = shallow(
			<ProductConfigurationOptionButton
				{...props}
				price={undefined}
				isSelected={false}
				imageURI={undefined}
			/>
		);
		expect(wrapper).toMatchSnapshot();
	});
});
