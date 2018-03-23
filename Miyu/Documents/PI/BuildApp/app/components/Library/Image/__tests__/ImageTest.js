
'use strict';
jest.unmock('react-native');
jest.mock('../../../../../app/store/configStore', () => ({}));
jest.mock('BuildNative');
jest.mock('BuildLibrary');

import 'react-native';
import React from 'react';
import Image from '../Image';

const defaultProps = {
	source: 'source',
};

describe('BuildLibrary Image', () => {
	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<Image {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

});



