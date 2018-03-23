
'use strict';
jest.unmock('react-native');
jest.mock('../../../../../app/store/configStore', () => ({}));
jest.mock('BuildNative');
jest.mock('BuildLibrary');

import 'react-native';
import React from 'react';
import Screen from '../Screen';

const defaultProps = {};

describe('BuildLibrary Screen', () => {
	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<Screen {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

});



