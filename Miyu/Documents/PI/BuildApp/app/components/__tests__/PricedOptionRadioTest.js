
jest.unmock('react-native');
jest.mock('BuildNative');
import 'react-native';
import React from 'react';
import PricedOptionRadio from '../PricedOptionRadio';

const defaultProps = {
	isSelected: false,
	optionText: 'test',
	onPress: jest.fn(),
};

describe('PricedOptionRadio component', () => {

	// Doing this resolves this error:
	//
	// Invariant Violation: ReactCompositeComponent:
	// injectEnvironment() can only be called once."
	//
	// This error is caused by trying to import react-test-renderer and enzyme at
	// the top of this test file
	//
	// Supposedly this is a bug in React and is resolved in React 15.4.0
	// https://github.com/facebook/jest/issues/1353#issuecomment-260968365
	beforeEach(() => jest.resetModules());

	it('should render PricedOptionRadio with required props', () => {
		const tree = require('react-test-renderer').create(
			<PricedOptionRadio {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render PricedOptionRadio with prop image', () => {
		const tree = require('react-test-renderer').create(
			<PricedOptionRadio
				{...defaultProps}
				image="test"
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render PricedOptionRadio with with a border', () => {
		const tree = require('react-test-renderer').create(
			<PricedOptionRadio
				{...defaultProps}
				isSelected={true}
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});
});
