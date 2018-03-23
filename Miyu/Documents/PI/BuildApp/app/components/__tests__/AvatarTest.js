'use strict';

jest.mock('../../../app/services/httpClient', () => ({}));
jest.mock('../../../app/store/configStore', () => ({}));
jest.mock('../../../app/lib/analytics/tracking');
jest.mock('BuildNative');
jest.mock('BuildLibrary');

jest.unmock('react-native');

import Avatar from '../Avatar';
import React from 'react';

const defaultProps = {

};

describe('Avatar component', () => {
	it('should render an empty avatar correctly', () => {
		const tree = require('react-test-renderer').create(
			<Avatar {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<Avatar
				{...defaultProps}
				firstName="Test"
				lastName="Test"
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render a non-default color correctly', () => {
		const tree = require('react-test-renderer').create(
			<Avatar
				{...defaultProps}
				backgroundColor="black"
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

});
