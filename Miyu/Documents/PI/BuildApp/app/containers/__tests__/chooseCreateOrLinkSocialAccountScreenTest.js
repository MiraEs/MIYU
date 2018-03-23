'use strict';

jest.mock('../../../app/services/httpClient', () => ({}));
jest.mock('../../../app/store/configStore', () => ({}));
jest.mock('../../../app/lib/analytics/tracking');
jest.mock('BuildNative');
jest.mock('BuildLibrary');
jest.mock('../../../app/components/Form', () => 'Form');
jest.mock('../../../app/components/FormInput', () => 'FormInput');

jest.unmock('react-native');

import { ChooseCreateOrLinkSocialAccountScreen } from '../chooseCreateOrLinkSocialAccountScreen';
import React from 'react';
import helpers from '../../lib/helpers';

const defaultProps = {
	actions: {
		trackState: jest.fn(),
	},
	loginSuccess: helpers.noop,
	user: {
		noEmailErrorMessage: false,
	},
};

describe('ChooseCreateOrLinkSocialAccountScreen component', () => {

	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<ChooseCreateOrLinkSocialAccountScreen {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});
});
