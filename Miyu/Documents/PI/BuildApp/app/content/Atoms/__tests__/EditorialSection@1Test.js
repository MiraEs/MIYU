'use strict';

jest.mock('BuildNative');
jest.mock('BuildLibrary');

jest.unmock('react-native');
jest.mock('../../../lib/styles');
jest.mock('../../../content/AtomComponent', () => 'AtomComponent');

import React from 'react';
import EditorialSection from '../EditorialSection@1';

describe('EditorialSection component', () => {

	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<EditorialSection />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

});
