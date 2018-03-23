jest.unmock('react-native');

import { create } from 'react-test-renderer';
import React from 'react';
import 'react-native';
import FormErrorMessage from '../FormErrorMessage';

const props = {
	message: 'There was an error',
	errorStyle: {
		backgroundColor: 'white',
	},
};

describe('FormErrorMessage ', () => {
	it('should render with full props', () => {
		const result = create(<FormErrorMessage {...props} />).toJSON();
		expect(result).toMatchSnapshot();
	});
});
