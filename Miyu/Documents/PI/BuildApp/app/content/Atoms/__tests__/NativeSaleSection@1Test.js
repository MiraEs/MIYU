'use strict';

jest.mock('BuildNative');
jest.mock('BuildLibrary');


jest.unmock('react-native');

jest.mock('../../../../app/content/AtomComponent', () => 'AtomComponent');
jest.mock('react-native-parallax-scroll-view');

import NativeSaleSection from '../NativeSaleSection@1';
import React from 'react';

const defaultProps = {
	contentItem: {},
};

describe('NativeSaleSection component', () => {
	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<NativeSaleSection {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

});
