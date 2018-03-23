'use strict';

jest.unmock('react-native');

jest.mock('BuildLibrary');
jest.mock('BuildNative');
jest.mock('../../../app/components/AddToCartSelector', () => 'AddToCartSelector');

import React from 'react';
import FavoritesRow from '../Favorites/FavoritesRow';

const defaultProps = {
	product: {
		uniqueId: 0,
		finishes: [{
			uniqueId: 0,
			status: '',
			image: '',
		}],
	},
};

const paintProps = {
	...defaultProps,
	product: {
		...defaultProps.product,
		type: 'paint',
	},
};

const discontinuedProps = {
	product: {
		finishes: [{
			uniqueId: 0,
			status: 'discontinued',
			image: '',
		}],
	},
};

const fallbackProps = {
	product: {
		uniqueId: 1,
		finishes: [{
			uniqueId: 0,
			status: '',
			image: '',
		}],
	},
};

describe('FavoritesRow component', () => {

	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<FavoritesRow {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render a paint product correctly', () => {
		const tree = require('react-test-renderer').create(
			<FavoritesRow {...paintProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render a product with a discontinued finish correctly', () => {
		const tree = require('react-test-renderer').create(
			<FavoritesRow {...discontinuedProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render with a fallback finish', () => {
		const tree = require('react-test-renderer').create(
			<FavoritesRow {...fallbackProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

});
