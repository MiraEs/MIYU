
'use strict';

jest.mock('BuildNative');
jest.mock('BuildLibrary');

jest.mock('../../../../app/components/FavoriteButton', () => 'FavoriteButton');
jest.unmock('react-native');

import RelatedProducts from '../RelatedProducts';
import React from 'react';

const defaultProps = {
	productIncludes: {},
	relatedProducts: { selected: [] },
};

describe('RelatedProducts component', () => {
	it('should render correctly with no products', () => {
		const tree = require('react-test-renderer').create(
			<RelatedProducts {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render correctly with products', () => {
		const productIncludes = {
			'one fish' : { finishes: [{}] },
			'two fish' : { finishes: [{}] },
			'blue fish' : { finishes: [{}] },
			'red fish' : { finishes: [{}] },
		};
		const relatedProducts = {
			selected: ['one fish', 'two fish', 'blue fish'],
		};
		const tree = require('react-test-renderer').create(
			<RelatedProducts
				relatedProducts={relatedProducts}
				productIncludes={productIncludes}
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});
});
