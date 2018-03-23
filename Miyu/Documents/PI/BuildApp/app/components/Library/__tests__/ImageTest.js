
jest.unmock('react-native');
jest.mock('BuildNative');

import 'react-native';
import React from 'react';

import Image from '../Image/Image';

const defaultProps = {
	source: {},
};

describe('Image component', () => {

	it('should render correctly with default props', () => {
		const tree = require('react-test-renderer').create(
			<Image {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render correctly with onPress prop', () => {
		const tree = require('react-test-renderer').create(
			<Image
				{...defaultProps}
				onPress={jest.fn()}
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render correctly with height width props', () => {
		const tree = require('react-test-renderer').create(
			<Image
				{...defaultProps}
				height={200}
				width={200}
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render correctly with width, resourceWidth, and resourceHeight props', () => {
		const tree = require('react-test-renderer').create(
			<Image
				{...defaultProps}
				width={200}
				resourceWidth={200}
				resourceHeight={200}
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

});
