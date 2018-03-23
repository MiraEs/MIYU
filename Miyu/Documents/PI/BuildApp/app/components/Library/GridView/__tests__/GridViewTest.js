
'use strict';
jest.unmock('react-native');
jest.mock('../../../../../app/store/configStore', () => ({}));
jest.mock('BuildNative');
jest.mock('BuildLibrary');

import 'react-native';
import React from 'react';
import GridView from '../GridView';

const defaultProps = {
	items: [],
	itemsPerRow: 2,
	renderItem: jest.fn(),
	maxItems: 10,
};

describe('BuildLibrary GridView', () => {
	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<GridView {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

});
