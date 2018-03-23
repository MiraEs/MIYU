
'use strict';
jest.unmock('react-native');
jest.mock('../../../../../app/store/configStore', () => ({}));
jest.mock('BuildNative');
jest.mock('BuildLibrary');

import 'react-native';
import React from 'react';
import Text from '../Text';

const defaultProps = {};

describe('BuildLibrary Text', () => {
	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<Text {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

});



