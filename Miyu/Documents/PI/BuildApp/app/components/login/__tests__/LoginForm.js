
jest.mock('../../../../app/store/configStore', () => ({}));
jest.mock('../../../../app/lib/analytics/tracking');
jest.mock('../../../../app/services/httpClient', () => ({}));
jest.mock('BuildLibrary');
jest.mock('BuildNative');
jest.mock('../../../../app/components/Form', () => 'Form');
jest.mock('../../../../app/components/FormInput', () => 'FormInput');

jest.unmock('react-native');

import React from 'react';
import { LoginForm } from '../LoginForm';

const defaultProps = {
	navForgotPassword: jest.fn(),
	user: {},
};

describe('LoginForm component', () => {
	it('should render LoginForm', () => {
		const tree = require('react-test-renderer').create(
			<LoginForm {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});
});
