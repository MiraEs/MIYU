'use strict';

jest.mock('BuildNative');
jest.mock('BuildLibrary');
jest.mock('../../../../app/components/events/Comments', () => 'Comments');
jest.unmock('react-native');

import ProductList from '../ProductList';
import React from 'react';

const defaultProps = {
	products: [],
	event: {
		eventId: 1,
		user: {},
	},
	eventStoreType: 'eventStoreType',
};

describe('ProductList component', () => {
	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<ProductList {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});
});
