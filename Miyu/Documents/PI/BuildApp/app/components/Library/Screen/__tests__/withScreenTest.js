

'use strict';
jest.unmock('react-native');
jest.mock('../../../../../app/store/configStore', () => ({}));
jest.mock('BuildNative');
jest.mock('BuildLibrary');

import 'react-native';
import React from 'react';
import withScreen from '../withScreen';

const defaultProps = {};

describe('BuildLibrary withScreen', () => {
	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<withScreen {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

});



