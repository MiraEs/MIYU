
'use strict';

jest.mock('BuildNative');
jest.unmock('react-native');

jest.mock('../../../../app/content/AtomComponent', () => 'AtomComponent');
import AtomList from '../AtomList@1';
import React from 'react';

const defaultProps = {
	items: [{}, {}],
};

describe('AtomList component', () => {
	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<AtomList {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

});
