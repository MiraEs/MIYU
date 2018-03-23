
jest.unmock('react-native');
jest.mock('BuildNative');
import 'react-native';
import React from 'react';
import OptionSelectButton from '../OptionSelectButton';

const defaultProps = {
	optionName: 'Test',
	onPress: jest.fn(),
};

describe('OptionSelectButton component', () => {

	it('should render unconfigured', () => {
		const tree = require('react-test-renderer').create(
			<OptionSelectButton {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render configured', () => {
		const tree = require('react-test-renderer').create(
			<OptionSelectButton
				{...defaultProps}
				isConfigured={true}
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

});
