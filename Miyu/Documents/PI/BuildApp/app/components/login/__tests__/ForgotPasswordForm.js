
jest.mock('../../../../app/store/configStore', () => ({}));
jest.mock('../../../../app/lib/analytics/tracking');
jest.mock('../../../../app/services/httpClient', () => ({}));
jest.mock('BuildLibrary');
jest.mock('BuildNative');
jest.mock('../../../../app/components/Form', () => 'Form');
jest.mock('../../../../app/components/FormInput', () => 'FormInput');

jest.unmock('react-native');

import React from 'react';
import { ForgotPasswordForm } from '../ForgotPasswordForm';

const defaultProps = {
	navLogin: jest.fn(),
	user: {},
};

describe('ForgotPasswordForm component', () => {
	it('should render ForgotPasswordForm', () => {
		const tree = require('react-test-renderer').create(
			<ForgotPasswordForm {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});
});
