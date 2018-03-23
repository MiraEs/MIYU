'use strict';

jest.unmock('react-native');

jest.mock('BuildNative');
jest.mock('BuildLibrary');
jest.mock('WebView', () => 'WebView');

import React from 'react';
import Video from '../Video';

describe('Video component', () => {

	const defaultProps = {
		hashKey: 'hashKey',
		width: 1920,
		height: 1080,
	};

	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<Video {...defaultProps}/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render Wistia video correctly', () => {
		const tree = require('react-test-renderer').create(
			<Video
				{...defaultProps}
				streamProviderCode={1}
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render YouTube video correctly', () => {
		const tree = require('react-test-renderer').create(
			<Video
				{...defaultProps}
				streamProviderCode={2}
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

});
