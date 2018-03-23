jest.mock('react-native');
jest.mock('BuildNative');
jest.mock('BuildLibrary');
jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');

import React from 'react';
import OrderListItem from '../OrderListItem';

const defaultProps = {
	details: ['1', '2', '3'],
	image: {},
	onPress: jest.fn(),
	projectName: 'test',
	renderHeader: jest.fn(),
	title: 'title',
};

describe('OrderListItem component', () => {
	it('should render OrderListItem with projectName', () => {
		const tree = require('react-test-renderer').create(
			<OrderListItem {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render OrderListItem without projectName', () => {
		const tree = require('react-test-renderer').create(
			<OrderListItem
				{...defaultProps}
				projectName={undefined}
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render default header', () => {
		const tree = require('react-test-renderer').create(
			<OrderListItem
				{...defaultProps}
				renderHeader={undefined}
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

});
