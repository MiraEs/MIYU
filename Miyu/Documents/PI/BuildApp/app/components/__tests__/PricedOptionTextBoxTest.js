
jest.unmock('react-native');
jest.mock('BuildNative');
jest.mock('../FormInput', () => 'FormInput');

import 'react-native';
import React from 'react';
import PricedOptionTextBox from '../PricedOptionTextBox';

const defaultProps = {
	labelText: 'test',
	placeholderText: 'test',
	refName: 'test',
	onFocus: jest.fn(),
	dismiss: jest.fn(),
	onSelect: jest.fn(),
	onSubmit: jest.fn(),
	pricedOptionId: 'test',
};

describe('PricedOptionTextBox component', () => {

	it('should render PricedOptionTextBox with required props', () => {
		const tree = require('react-test-renderer').create(
			<PricedOptionTextBox {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

});
