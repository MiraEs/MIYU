
jest.mock('BuildNative');
jest.mock('../../../services/httpClient', () => ({}));

jest.unmock('react-native');

import React from 'react';
import 'react-native';
import renderer from 'react-test-renderer';

import { ProductQAndAButton } from '../ProductQAndAButton';

const fullProps = {
	productQuestions: [],
	compositeId: 777,
	navigation: {
		getNavigator: jest.fn(() => ({
			push: jest.fn(),
		})),
	},
};

describe('ProductQAndAButton', () => {
	it('should render a Q and A button if there are Q and A entries', () => {
		const wrapper = renderer.create(<ProductQAndAButton {...fullProps} />);
		expect(wrapper.toJSON()).toMatchSnapshot();
	});
	it('should return null if there are no Q and A entries', () => {
		const wrapper = renderer.create(<ProductQAndAButton productQuestions={[]} />);
		expect(wrapper.toJSON()).toMatchSnapshot();
	});
	it('should call navigator push with compositeId', () => {
		const wrapper = renderer.create(<ProductQAndAButton {...fullProps} />);
		wrapper.getInstance().onQAndAPress();
		expect(fullProps.navigation.getNavigator).toBeCalledWith('root');
	});
});
