'use strict';

jest.mock('../../services/httpClient', () => ({}));
jest.mock('../../store/configStore', () => ({}));
jest.mock('../../lib/analytics/tracking');
jest.mock('../../lib/styles');
jest.mock('BuildNative');
jest.mock('BuildLibrary');
jest.mock('../../components/Form', () => 'Form');
jest.mock('../../components/FormInput', () => 'FormInput');
jest.mock('../../components/login/LoginForm', () => 'LoginForm');

jest.unmock('react-native');

import { LoginModal } from '../LoginModal';
import React from 'react';
import helpers from '../../lib/helpers';

const defaultProps = {
	loginFail: helpers.noop,
	loginSuccess: helpers.noop,
	actions: {
		trackState: jest.fn(),
	},
	isCheckout: false,
	features: {},
};

describe('LoginModal component', () => {

	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<LoginModal {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});
});
