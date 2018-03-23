
jest.unmock('react-native');
jest.mock('BuildNative');
jest.mock('BuildLibrary');
jest.mock('redux-persist');
jest.mock('redux-persist-transform-compress');
jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');
jest.mock('redux');
jest.mock('../../../lib/styles');

import 'react-native';
import React from 'react';

import ProductShortDescription from '../ProductShortDescription';

const fullProps = {
	onCollectionPress: jest.fn(),
	onPressReadMore: jest.fn(),
	series: 'Series',
	specifications: [{
		attributeName: 'attribute name',
		productSpecValue: [{
			value: 'one',
		}, {
			value: 'two',
		}, {
			value: 'three',
		}],
	}],
	title: 'Title',
	style: {},
	freeShipping: true,
};

describe('ProductShortDescription component', () => {

	it('should render with full props', () => {
		const tree = require('react-test-renderer').create(
			<ProductShortDescription {...fullProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render without onCollectionPress prop', () => {
		const props = {
			...fullProps,
		};
		delete props.onCollectionPress;
		const tree = require('react-test-renderer').create(
			<ProductShortDescription {...props} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render without onPressReadMore prop', () => {
		const props = {
			...fullProps,
		};
		delete props.onPressReadMore;
		const tree = require('react-test-renderer').create(
			<ProductShortDescription {...props} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<ProductShortDescription title="Title" />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

});
