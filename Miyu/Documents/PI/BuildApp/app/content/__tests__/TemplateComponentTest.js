'use strict';

jest.mock('BuildNative');
jest.mock('BuildLibrary');

jest.mock('../../../app/content/Atoms/AtomText@1', () => 'AtomText@1');
jest.mock('../../../app/content/Templates/DealsTemplate@1', () => 'DealsTemplate@1');
jest.mock('../../../app/content/Templates/SharedPromo@1', () => 'SharedPromo@1');
jest.mock('../../../app/content/Templates/NativeHome@1', () => 'NativeHome@1');
jest.mock('../../../app/content/Templates/Article.js', () => 'Article');
jest.mock('../../../app/services/httpClient', () => 'httpClient');

jest.unmock('react-native');

import TemplateComponent from '../TemplateComponent';
import React from 'react';

const defaultProps = {
	contentItem: {},
};


describe('TemplateComponent component', () => {

	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<TemplateComponent {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render unknown type correctly', () => {
		const contentItem = {
			content: {
				_type: 'notreal@1.0',
			},
		};
		const tree = require('react-test-renderer').create(
			<TemplateComponent
				{...defaultProps}
				contentItem={contentItem}
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render deals template correctly', () => {
		const contentItem = {
			content: {
				_type: 'deals-template@1.0',
			},
		};
		const tree = require('react-test-renderer').create(
			<TemplateComponent
				{...defaultProps}
				contentItem={contentItem}
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render shared promo correctly', () => {
		const contentItem = {
			content: {
				_type: 'shared-promo@1.0',
			},
		};
		const tree = require('react-test-renderer').create(
			<TemplateComponent
				{...defaultProps}
				contentItem={contentItem}
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render native home correctly', () => {
		const contentItem = {
			content: {
				_type: 'native-home@1.0',
			},
		};
		const tree = require('react-test-renderer').create(
			<TemplateComponent
				{...defaultProps}
				contentItem={contentItem}
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render articles correctly', () => {
		const contentItem = {
			content: {
				_type: 'article-vendor-product-spotlight@1.0',
			},
		};
		const tree = require('react-test-renderer').create(
			<TemplateComponent
				{...defaultProps}
				contentItem={contentItem}
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

});
