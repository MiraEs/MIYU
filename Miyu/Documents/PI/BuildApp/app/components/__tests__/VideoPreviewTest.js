'use strict';

jest.unmock('react-native');

jest.mock('BuildNative');
jest.mock('BuildLibrary');
jest.mock('../../../app/services/httpClient', () => ({ get: () => Promise.resolve({}) }));

import React from 'react';
import VideoPreview from '../VideoPreview';

describe('VideoPreview component', () => {

	const defaultProps = {
		width: 1920,
		height: 1080,
	};

	it('should render Wistia preview correctly', () => {
		const tree = require('react-test-renderer').create(
			<VideoPreview
				{...defaultProps}
				video={{
					hashKey: 'hashKey',
					streamProviderCode: 1,
				}}
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render YouTube preview correctly', () => {
		const tree = require('react-test-renderer').create(
			<VideoPreview
				{...defaultProps}
				video={{
					hashKey: 'hashKey',
					streamProviderCode: 2,
				}}
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

});


