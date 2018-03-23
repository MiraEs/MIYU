
jest.mock('BuildLibrary');
jest.mock('BuildNative');
jest.mock('../../../components/Triangle', () => 'Triangle');
jest.mock('redux-persist');
jest.mock('redux-persist-transform-compress');
jest.mock('redux');

jest.unmock('react-native');
import 'react-native';
import React from 'react';

import ProductPrice from '../ProductPrice';

const defaultProps = {
	consumerPrice: 350.22,
	cost: 300.2,
	isProPricing: false,
	minPrice: 200,
	msrp: 350.22,
};

describe('ProductPrice component', () => {

	it('should render correctly with default props', () => {
		const tree = require('react-test-renderer').create(
			<ProductPrice {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render correctly with pro pricing', () => {
		const props = {
			...defaultProps,
			isProPricing: true,
		};
		const tree = require('react-test-renderer').create(
			<ProductPrice {...props} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render pro pricing with square footage product', () => {
		const props = {
			...defaultProps,
			isProPricing: true,
			squareFootageBased: true,
		};
		const tree = require('react-test-renderer').create(
			<ProductPrice {...props} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render square footage based pricing', () => {
		const props = {
			...defaultProps,
			squareFootageBased: true,
		};
		const tree = require('react-test-renderer').create(
			<ProductPrice {...props} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render with MAP', () => {
		const props = {
			...defaultProps,
			hasMAP: true,
		};
		const tree = require('react-test-renderer').create(
			<ProductPrice {...props} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render discontinued product (with no cost)', () => {
		const props = {
			...defaultProps,
		};
		delete props.cost;
		const tree = require('react-test-renderer').create(
			<ProductPrice {...props} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

});
