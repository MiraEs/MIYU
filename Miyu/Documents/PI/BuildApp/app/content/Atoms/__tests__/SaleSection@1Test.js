'use strict';

jest.mock('BuildNative');
jest.mock('BuildLibrary');

jest.unmock('react-native');

jest.mock('../../../../app/content/AtomComponent', () => 'AtomComponent');
jest.mock('react-native-parallax-scroll-view');

import SaleSection from '../SaleSection@1';
import React from 'react';

const defaultProps = {};

describe('SaleSection component', () => {
	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<SaleSection {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

});
