'use strict';
jest.unmock('react-native');
jest.mock('../../../../../app/store/configStore', () => ({}));
jest.mock('BuildNative');
jest.mock('BuildLibrary');

import 'react-native';
import React from 'react';
import TouchableOpacity from '../TouchableOpacity';

const defaultProps = {
	onPress: jest.fn(),
	trackAction: 'trackAction',
};

describe('BuildLibrary TouchableOpacity', () => {
	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<TouchableOpacity {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

});
