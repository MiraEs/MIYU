
jest.mock('../../../lib/helpers', () => ({
	isIOS: jest.fn(() => true),
	isAndroid: jest.fn(() => false),
	getIcon: jest.fn(name => name),
}));
jest.mock('react-native');
jest.mock('prop-types', () => ({
	oneOf: jest.fn(),
}));
jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');
jest.mock('build-library');
jest.mock('../../../lib/styles');

import { create } from 'react-test-renderer';
import React from 'react';
import 'react-native';
import NavigationBarIconTitle from '../NavigationBarIconTitle';

describe('NavigationBarIconTitle', () => {
	it('should render on iOS', () => {
		const wrapper = create(<NavigationBarIconTitle />).toJSON();
		expect(wrapper).toMatchSnapshot();
	});
});
