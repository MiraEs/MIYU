

'use strict';

jest.mock('BuildNative');
jest.mock('BuildLibrary');

jest.mock('../../../../app/components/BannerGradient', () => 'BannerGradient');
jest.unmock('react-native');
import { View } from 'react-native';


import AtomCloudinary from '../AtomCloudinary@1';
import React from 'react';

const defaultProps = {
	children : <View />,
};


describe('AtomCloudinary component', () => {
	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<AtomCloudinary />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});
	it('should render correctly with a fillWidth', () => {
		const tree = require('react-test-renderer').create(
			<AtomCloudinary
				{...defaultProps}
				fillWidth={true}
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render correctly with a gradient', () => {
		const tree = require('react-test-renderer').create(
			<AtomCloudinary
				{...defaultProps}
				gradient={true}
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render correctly with a loadingLogo', () => {

		const tree = require('react-test-renderer').create(
			<AtomCloudinary
				{...defaultProps}
				loadingLogo={true}
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

});
