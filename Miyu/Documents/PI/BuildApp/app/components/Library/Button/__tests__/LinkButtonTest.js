'use strict';
jest.unmock('react-native');
jest.mock('../../../../../app/store/configStore', () => ({}));
jest.mock('BuildNative');
jest.mock('BuildLibrary');

import 'react-native';
import React from 'react';
import LinkButton from '../LinkButton';

const defaultProps = {
	onPress: jest.fn(),
	trackAction: 'trackAction',
	accessibilityLabel: 'accessibilityLabel',
	children : [],
};

describe('BuildLibrary LinkButton', () => {
	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<LinkButton {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

});



