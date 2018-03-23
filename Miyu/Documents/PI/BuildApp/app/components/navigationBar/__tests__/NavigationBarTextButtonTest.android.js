jest.unmock('react-native');
jest.mock('react-native-vector-icons/Ionicons');
jest.mock('../../../lib/helpers', () => ({
	isIOS: jest.fn(() => false),
	isAndroid: jest.fn(() => true),
}));
jest.mock('../../../lib/styles');
jest.mock('../../../store/configStore', () => {});
jest.mock('../../../actions/AnalyticsActions', () => ({

}));

import { create } from 'react-test-renderer';
import React from 'react';
import 'react-native';
import NavigationBarTextButton from '../NavigationBarTextButton';

describe('NavigationBarTextButton', () => {
	it('should render on Android', () => {
		const wrapper = create(<NavigationBarTextButton>Text</NavigationBarTextButton>).toJSON();
		expect(wrapper).toMatchSnapshot();
	});
});
