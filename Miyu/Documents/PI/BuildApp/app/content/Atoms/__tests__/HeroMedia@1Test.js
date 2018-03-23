'use strict';

jest.mock('BuildNative');
jest.mock('BuildLibrary');


jest.unmock('react-native');

jest.mock('../../../../app/content/AtomComponent', () => 'AtomComponent');
jest.mock('../../../../app/components/Video', () => 'Video');
jest.mock('../../../../app/components/VideoPreview', () => 'VideoPreview');

import { HeroMedia } from '../HeroMedia@1';
import React from 'react';

const defaultProps = {
	media_image: { url: 'media_image' },
	media_video: {
		selected: [0],
	},
	videoIncludes: {
		0: {
			hashKey: 'hashKey',
			streamProviderCode: 0,
		},
	},
};

describe('HeroMedia component', () => {

	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<HeroMedia
				{...defaultProps}
				media_type={{ value: 'test' }}
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render hero image correctly', () => {
		const tree = require('react-test-renderer').create(
			<HeroMedia
				{...defaultProps}
				media_type={{ value: 'media_image' }}
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render hero video correctly', () => {
		const tree = require('react-test-renderer').create(
			<HeroMedia
				{...defaultProps}
				media_type={{ value: 'media_video' }}
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render hero video preview correctly', () => {
		const tree = require('react-test-renderer').create(
			<HeroMedia
				{...defaultProps}
				media_type={{ value: 'media_video' }}
				preview={true}
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

});
