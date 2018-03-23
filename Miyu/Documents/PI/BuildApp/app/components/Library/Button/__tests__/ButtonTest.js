'use strict';
jest.unmock('react-native');
jest.mock('../../../../../app/store/configStore', () => ({}));
jest.mock('BuildNative');
jest.mock('BuildLibrary');

import 'react-native';
import React from 'react';
import Button from '../Button';

const defaultProps = {
	onPress: jest.fn(),
	trackAction: 'trackAction',
	accessibilityLabel: 'accessibilityLabel',
};

describe('BuildLibrary Button', () => {
	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<Button {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

});



