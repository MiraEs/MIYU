
'use strict';
jest.unmock('react-native');
jest.mock('../../../../../app/store/configStore', () => ({}));
jest.mock('BuildNative');
jest.mock('BuildLibrary');

import 'react-native';
import React from 'react';
import KeyboardAwareView from '../KeyboardAwareView';

const defaultProps = {};

describe('BuildLibrary KeyboardAwareView', () => {
	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<KeyboardAwareView {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

});



