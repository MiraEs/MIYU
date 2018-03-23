'use strict';

jest.mock('BuildNative');
jest.mock('../../../../app/services/httpClient', () => ({}));
jest.unmock('react-native');

import { AtomLinkPicker } from '../AtomLinkPicker@1';
import React from 'react';

const defaultProps = {
	actions: {},
	children: [],
	group: { id: 1 },
	contentItemId: 'contentItemId',
	links: {},
	trackAction: 'trackAction',
};

describe('AtomLinkPicker component', () => {
	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<AtomLinkPicker {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render correctly for category', () => {
		const links = {
			'248': {
				linkType: 'category',
				facets: [],
				data: {
					selected: [{ storeId: '248', categoryId: '123456' }],
				},
			},
		};

		const tree = require('react-test-renderer').create(
			<AtomLinkPicker
				{...defaultProps}
				links={links}
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render correctly for video', () => {
		const links = {
			'248': {
				linkType: 'video',
				data: {
					selected: ['video'],
				},
			},
		};

		const videoIncludes = { 'video': { 'foo': 'bar' } };

		const tree = require('react-test-renderer').create(
			<AtomLinkPicker
				{...defaultProps}
				links={links}
				videoIncludes={videoIncludes}
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render correctly for profile', () => {
		const links = {
			'248': {
				linkType: 'profile',
				data: {
					selected: ['profile'],
				},
			},
		};

		const profileIncludes = { 'profile': { 'foo': 'bar' } };

		const tree = require('react-test-renderer').create(
			<AtomLinkPicker
				{...defaultProps}
				links={links}
				profileIncludes={profileIncludes}
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render correctly for product', () => {
		const links = {
			'248': {
				linkType: 'product',
				finish: 1234,
				data: {
					selected: ['12345'],
				},
			},
		};

		const tree = require('react-test-renderer').create(
			<AtomLinkPicker
				{...defaultProps}
				links={links}
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render correctly for favorite', () => {
		const links = {
			'248': {
				linkType: 'favorite',
				data: {
					selected: ['12345'],
				},
			},
		};

		const tree = require('react-test-renderer').create(
			<AtomLinkPicker
				{...defaultProps}
				links={links}
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render correctly for article', () => {
		const links = {
			'248': {
				linkType: 'article',
				data: {
					selected: ['12345'],
				},
			},
		};

		const tree = require('react-test-renderer').create(
			<AtomLinkPicker
				{...defaultProps}
				links={links}
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render correctly for page', () => {
		const links = {
			'248': {
				linkType: 'page',
				data: {
					selected: [{ id: '12345' }],
				},
			},
		};

		const tree = require('react-test-renderer').create(
			<AtomLinkPicker
				{...defaultProps}
				links={links}
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render correctly for brand', () => {
		const links = {
			'248': {
				linkType: 'brand',
				data: {
					selected: [{ id: '12345' }],
				},
			},
		};

		const tree = require('react-test-renderer').create(
			<AtomLinkPicker
				{...defaultProps}
				links={links}
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});
});
