'use strict';
jest.mock('BuildNative');
jest.mock('BuildLibrary');
jest.mock('../../../lib/styles');
jest.unmock('react-native');

import RelatedCategories from '../RelatedCategories';
import React from 'react';

const defaultProps = {
	categoryIncludes: { },
	relatedCategories: { selected: [] },
};

describe('RelatedCategories component', () => {
	it('should render correctly with no categories', () => {
		const tree = require('react-test-renderer').create(
			<RelatedCategories {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render correctly with products', () => {
		const categoryIncludes = {
			'1' : { '2': {} },
		};
		const relatedCategories = {
			selected: [ { storeId: 1, categoryid: 2}],
		};
		const tree = require('react-test-renderer').create(
			<RelatedCategories
				relatedCategories={relatedCategories}
				categoryIncludes={categoryIncludes}
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});
});
