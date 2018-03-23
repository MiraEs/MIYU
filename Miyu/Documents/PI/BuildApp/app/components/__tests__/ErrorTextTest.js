'use strict';

jest.mock('../../../app/services/httpClient', () => ({}));
jest.mock('../../../app/store/configStore', () => ({}));
jest.mock('../../../app/lib/analytics/tracking');
jest.mock('BuildNative');
jest.mock('BuildLibrary');

jest.unmock('react-native');

import ErrorText from '../ErrorText';
import React from 'react';

const defaultProps = {};

describe('ErrorText component', () => {
	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<ErrorText {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<ErrorText
				{...defaultProps}
				text="text"
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

});
