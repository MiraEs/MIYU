
'use strict';
jest.unmock('react-native');
jest.mock('../../../../../app/store/configStore', () => ({}));
jest.mock('BuildNative');
jest.mock('BuildLibrary');

import 'react-native';
import React from 'react';
import { KeyboardSpacer } from '../KeyboardSpacer';

const defaultProps = {
	topSpacing: 0,
};

describe('BuildLibrary KeyboardSpacer', () => {
	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<KeyboardSpacer {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

});



