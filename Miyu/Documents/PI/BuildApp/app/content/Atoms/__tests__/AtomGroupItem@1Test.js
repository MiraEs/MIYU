'use strict';

jest.mock('BuildNative');
jest.mock('BuildLibrary');


jest.unmock('react-native');
jest.mock('../../../lib/styles');
jest.mock('../../../content/AtomComponent', () => 'AtomComponent');

import { AtomGroupItem } from '../AtomGroupItem@1';
import React from 'react';

const defaultProps = {
	linkType: 'category',
	linkReferenceId: {
		categoryId: '1234',
		storeId: '248',
	},
	categoryIncludes: { '248': { '1234': { categoryName: 'categoryName', link: '1234' } } },
};

describe('AtomGroupItem component', () => {
	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<AtomGroupItem {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

});
