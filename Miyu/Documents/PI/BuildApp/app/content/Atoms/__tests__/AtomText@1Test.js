'use strict';

jest.mock('BuildNative');

jest.unmock('react-native');

import AtomText from '../AtomText@1';
import React from 'react';

const defaultProps = {
	text: '',
	shadow: false,
	style: {},
};

describe('AtomText component', () => {
	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<AtomText {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render shadow correctly', () => {
		const tree = require('react-test-renderer').create(
			<AtomText
				{...defaultProps}
				shadow={true}
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render text correctly', () => {
		const tree = require('react-test-renderer').create(
			<AtomText
				{...defaultProps}
				text="text"
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

});
