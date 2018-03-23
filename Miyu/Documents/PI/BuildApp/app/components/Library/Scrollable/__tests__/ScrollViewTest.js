

'use strict';
jest.unmock('react-native');
jest.mock('../../../../../app/store/configStore', () => ({}));
jest.mock('BuildNative');
jest.mock('BuildLibrary');

import 'react-native';
import React from 'react';
import ScrollView from '../ScrollView';

const defaultProps = {};

describe('BuildLibrary ScrollView', () => {
	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<ScrollView {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});
});
