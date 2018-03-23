
jest.mock('react-native');
import React from 'react';

jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');
jest.mock('../../../app/lib/styles');
jest.mock('BuildLibrary');
jest.mock('BuildNative');

import AuthWithFacebookButton from '../authWithFacebookButton';

const defaultProps = {
	onPress: jest.fn(),
	text: 'Test',
};

describe('AuthWithFacebookButton', () => {
	it('should render with default props', () => {
		const tree = require('react-test-renderer').create(
			<AuthWithFacebookButton {...defaultProps} />
		);
		expect(tree).toMatchSnapshot();
	});
});
