jest.mock('react-native');
jest.mock('prop-types', () => ({
	oneOf: jest.fn(),
}));
jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');
jest.mock('../../../lib/helpers', () => ({
	isIOS: jest.fn(() => false),
	isAndroid: jest.fn(() => true),
	getIcon: jest.fn(name => name),
}));
jest.mock('build-library');
jest.mock('../../../lib/styles');

import { create } from 'react-test-renderer';
import React from 'react';
import 'react-native';
import NavigationBarIconTitle from '../NavigationBarIconTitle';

describe('NavigationBarIconTitle', () => {
	it('should render on Android', () => {
		const wrapper = create(<NavigationBarIconTitle />).toJSON();
		expect(wrapper).toMatchSnapshot();
	});
});
