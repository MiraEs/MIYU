
jest.mock('BuildNative');
jest.mock('BuildLibrary');
jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');
jest.mock('react-native-deprecated-custom-components');
jest.mock('../../lib/helpers', () => ({}));
jest.mock('../../lib/styles');
jest.mock('react-native');

import React from 'react';
import FormInput from '../FormInput';

describe('FormInput component', () => {
	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<FormInput testID="TestFormInput" />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

});
