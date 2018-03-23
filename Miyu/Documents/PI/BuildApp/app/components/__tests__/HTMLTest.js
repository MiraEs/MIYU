
jest.mock('build-library', () => ({
	Text: 'Text',
}));
jest.unmock('react-native');
import 'react-native';
import React from 'react';

import productDescription from './productDescription';
import HTML from '../HTML';

const defaultProps = {
	json: productDescription.blocks,
};

describe('HTML', () => {

	beforeEach(() => jest.resetModules());

	it('should render default props', () => {
		const tree = require('react-test-renderer').create(
			<HTML {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

});
