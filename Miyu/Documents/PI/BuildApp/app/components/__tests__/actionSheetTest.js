
import 'react-native';
import React from 'react';

import ActionSheet from '../actionSheet';

describe('actionSheet component', () => {

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

	it('should render ActionSheet with required props', () => {
		const tree = require('react-test-renderer').create(
			<ActionSheet />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render ActionSheet with prop icon', () => {
		const tree = require('react-test-renderer').create(
			<ActionSheet icon="md-hammer" />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render ActionSheet with prop title', () => {
		const tree = require('react-test-renderer').create(
			<ActionSheet title="test" />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render ActionSheet with prop description', () => {
		const tree = require('react-test-renderer').create(
			<ActionSheet description="test" />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render ActionSheet with prop options', () => {
		const tree = require('react-test-renderer').create(
			<ActionSheet options={[]} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render ActionSheet with prop styleSheet', () => {
		const tree = require('react-test-renderer').create(
			<ActionSheet styleSheet={{}} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});
});
