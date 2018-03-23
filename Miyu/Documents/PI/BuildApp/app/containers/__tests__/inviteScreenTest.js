'use strict';

jest.mock('../../../app/services/httpClient', () => ({}));
jest.mock('../../../app/store/configStore', () => ({}));
jest.mock('../../../app/lib/analytics/tracking');
jest.mock('BuildNative');
jest.mock('BuildLibrary');
jest.mock('../../../app/components/Form', () => 'Form');
jest.mock('../../../app/components/FormInput', () => 'FormInput');

jest.unmock('react-native');
jest.mock('TextInput', () => 'TextInput');

import { InviteScreen } from '../inviteScreen';
import React from 'react';

const defaultProps = {
	fromManagePeopleScreen: false,
	actions: {
		trackState: jest.fn(),
	},
};

describe('InviteScreen component', () => {

	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<InviteScreen {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});
});
