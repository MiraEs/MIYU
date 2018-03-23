
jest.mock('BuildLibrary');
jest.mock('BuildNative');
jest.mock('../../../app/components/SwatchImage', () => 'SwatchImage');
jest.mock('../../../app/components/FavoriteButton', () => 'FavoriteButton');
jest.mock('../../../app/components/ArIcon', () => 'ArIcon');
jest.mock('react-native-star-rating', () => 'StarRating');

jest.unmock('react-native');
import 'react-native';
import React from 'react';

import ProductDrop from '../ProductDrop';

const defaultProps = {
	productDrop: {
		reviewRating: {
			numReviews: 1,
		},
		minPrice: 77.32,
		productId: '12345',
		squareFootageBased: false,
		productCompositeId: 12345,
		finishes: [{}],
	},
	selectedFinish: {
		uniqueId: 12345,
	},
};

describe('ProductDrop component', () => {

	it('should render with required props', () => {
		const tree = require('react-test-renderer').create(
			<ProductDrop {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render with SEARCH_GRID', () => {
		const tree = require('react-test-renderer').create(
			<ProductDrop
				{...defaultProps}
				viewStyle="SEARCH_GRID"
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render with SEARCH_GALLERY', () => {
		const tree = require('react-test-renderer').create(
			<ProductDrop
				{...defaultProps}
				viewStyle="SEARCH_GALLERY"
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render with squareFootageBased prop', () => {
		const props = {
			...defaultProps,
			productDrop: {
				...defaultProps.productDrop,
				squareFootageBased: true,
				squareFootagePerCarton: 60,
			},
		};
		const tree = require('react-test-renderer').create(
			<ProductDrop {...props} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

});
