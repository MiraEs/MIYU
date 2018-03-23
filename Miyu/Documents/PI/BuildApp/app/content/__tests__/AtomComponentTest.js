'use strict';

jest.mock('BuildNative');
jest.mock('BuildLibrary');

jest.mock('../../../app/content/Atoms/AtomText@1', () => 'AtomText@1');
jest.mock('../../../app/content/Atoms/AtomCloudinary@1', () => 'AtomCloudinary@1');
jest.mock('../../../app/content/Atoms/HeroMedia@1', () => 'HeroMedia@1');
jest.mock('../../../app/content/Atoms/AtomList@1', () => 'AtomList@1');
jest.mock('../../../app/content/Atoms/EditorialBlob@1', () => 'EditorialBlob@1');
jest.mock('../../../app/content/Atoms/ContentAuthor@1', () => 'ContentAuthor@1');
jest.mock('../../../app/content/Atoms/SaleSection@1', () => 'SaleSection@1');
jest.mock('../../../app/content/Atoms/NativeSaleSection@1', () => 'NativeSaleSection@1');
jest.mock('../../../app/content/Atoms/AtomGroupItemPicker@1', () => 'AtomGroupItemPicker@1');
jest.mock('../../../app/content/Atoms/AtomGroupItem@1', () => 'AtomGroupItem@1');
jest.mock('../../../app/content/Atoms/AtomLinkPicker@1', () => 'AtomLinkPicker@1');
jest.mock('../../../app/content/Atoms/AtomLinkPicker@1', () => 'AtomLinkPicker@1');
jest.mock('../../../app/content/Atoms/EditorialSection@1', () => 'EditorialSection@1');
jest.mock('../../../app/content/Atoms/AtomMultiselect@1', () => 'AtomMultiselect@1');
jest.mock('../../../app/content/Atoms/NativePromo@1', () => 'NativePromo@1');

jest.unmock('react-native');

import AtomComponent from '../AtomComponent';
import React from 'react';

const defaultProps = {};


describe('AtomComponent component', () => {
	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<AtomComponent {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<AtomComponent
				{...defaultProps}
				_type="atom-text@1.0"
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<AtomComponent
				{...defaultProps}
				_type="atom-cloudinary@1.0"
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<AtomComponent
				{...defaultProps}
				_type="hero-media@1.0"
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<AtomComponent
				{...defaultProps}
				_type="atom-list@1.0"
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<AtomComponent
				{...defaultProps}
				_type="editorial-blob@1.0"
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<AtomComponent
				{...defaultProps}
				_type="content-author@1.0"
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<AtomComponent
				{...defaultProps}
				_type="sale-section@1.0"
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<AtomComponent
				{...defaultProps}
				_type="native-sale-section@1.0"
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<AtomComponent
				{...defaultProps}
				_type="atom-group-item-picker@1.0"
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<AtomComponent
				{...defaultProps}
				_type="atom-group-item@1.0"
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<AtomComponent
				{...defaultProps}
				_type="atom-link-picker@1.0"
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<AtomComponent
				{...defaultProps}
				_type="not-a-real-type@1.0"
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<AtomComponent
				{...defaultProps}
				_type="editorial-section@1.0"
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<AtomComponent
				{...defaultProps}
				_type="atom-multiselect@1.0"
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<AtomComponent
				{...defaultProps}
				_type="native-promo@1.0"
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

});
