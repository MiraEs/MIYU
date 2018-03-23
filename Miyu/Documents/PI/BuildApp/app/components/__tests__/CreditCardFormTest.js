
jest.unmock('react-native');
jest.mock('BuildNative');
jest.mock('BuildLibrary');
jest.mock('../../../app/components/Form', () => 'Form');
jest.mock('../../../app/components/FormInput', () => 'FormInput');

import 'react-native';
import React from 'react';
import CreditCardForm from '../CreditCardForm';

const defaultProps = {
	creditCard: {},
	onChange: jest.fn(),
	onFocus: jest.fn(),
	onBlur: jest.fn(),
	renderHeader: jest.fn(),
	renderFooter: jest.fn(),
};

describe('CreditCardForm component', () => {

	it('should render CreditCardForm with required props', () => {
		const tree = require('react-test-renderer').create(
			<CreditCardForm {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});
});
