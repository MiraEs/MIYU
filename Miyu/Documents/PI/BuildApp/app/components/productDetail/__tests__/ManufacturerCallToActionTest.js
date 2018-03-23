jest.unmock('react-native');

import 'react-native';
import React from 'react';
import ManufacturerCallToAction from '../ManufacturerCallToAction';

jest.mock('../../../lib/styles');
jest.mock('BuildNative');
jest.mock('BuildLibrary');

const defaultProps = {
	manufacturerCallToAction: {
		title: 'Test Sale',
		description: 'Test sale details.',
		active: true,
	},
};

describe('ManufacturerCallToAction Container', () => {

	it('should render with a sale', () => {
		const tree = require('react-test-renderer').create(
			<ManufacturerCallToAction {...defaultProps} />
		);
		expect(tree.toJSON()).toMatchSnapshot();
	});
});
