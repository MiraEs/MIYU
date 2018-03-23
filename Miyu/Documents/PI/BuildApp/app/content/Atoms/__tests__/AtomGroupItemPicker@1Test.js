
'use strict';

jest.mock('BuildNative');

jest.mock('../../../lib/styles');
jest.unmock('react-native');

jest.mock('../../../../app/content/AtomComponent', () => 'AtomComponent');

import AtomGroupItemPicker from '../AtomGroupItemPicker@1';
import React from 'react';

const defaultProps = {
	label: 'test',
	selected: [0, 1],
};

describe('AtomGroupItemPicker component', () => {
	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<AtomGroupItemPicker {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

});
