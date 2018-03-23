'use strict';
jest.unmock('react-native');
jest.mock('../../../../../app/store/configStore', () => ({}));
jest.mock('BuildNative');
jest.mock('BuildLibrary');
jest.mock('../../../../lib/styles');

import 'react-native';
import React from 'react';
import ImageButton from '../ImageButton';

const defaultProps = {
	onPress: jest.fn(),
	trackAction: 'trackAction',
	accessibilityLabel: 'accessibilityLabel',
	children : [],
};

describe('BuildLibrary ImageButton', () => {
	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<ImageButton {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

});



