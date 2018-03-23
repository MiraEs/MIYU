
jest.unmock('react-native');
jest.mock('BuildNative');
jest.mock('BuildLibrary');
jest.mock('../../../../lib/styles');

import 'react-native';
import React from 'react';
import InputAccessoryView from '../InputAccessoryView';

jest.mock('../../../../components/PinToKeyboard', () => 'PinToKeyboard');

const defaultProps = {
};

describe('InputAccessoryView', () => {

	it('should render with default props', () => {
		const tree = require('react-test-renderer').create(
			<InputAccessoryView {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render with isAccessoryHidden prop', () => {
		const tree = require('react-test-renderer').create(
			<InputAccessoryView
				{...defaultProps}
				isAccessoryHidden={true}
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

});
