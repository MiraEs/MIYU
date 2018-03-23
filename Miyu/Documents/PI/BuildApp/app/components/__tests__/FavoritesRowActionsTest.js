'use strict';

jest.unmock('react-native');

jest.mock('BuildLibrary');
jest.mock('BuildNative');

import React from 'react';
import FavoritesRowActions from '../Favorites/FavoritesRowActions';

const defaultProps = {
	product: {},
};

describe('FavoritesRowActions component', () => {

	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<FavoritesRowActions {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

});
