'use strict';
jest.unmock('react-native');
jest.mock('../../../../../app/store/configStore', () => ({}));
jest.mock('BuildNative');
jest.mock('BuildLibrary');

import 'react-native';
import React from 'react';
import IconButton from '../IconButton';

const defaultProps = {
	onPress: jest.fn(),
	trackAction: 'trackAction',
	accessibilityLabel: 'accessibilityLabel',
	iconName:'ios-alert',
	children : [],
};

describe('BuildLibrary IconButton', () => {
	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<IconButton {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

});
