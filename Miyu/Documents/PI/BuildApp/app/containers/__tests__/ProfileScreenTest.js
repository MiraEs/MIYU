'use strict';

jest.mock('../../../app/services/httpClient', () => ({}));
jest.mock('../../../app/store/configStore', () => ({}));
jest.mock('../../../app/lib/analytics/tracking');
jest.mock('BuildNative');
jest.mock('BuildLibrary');
jest.unmock('react-native');

import { ProfileScreen } from '../ProfileScreen';
import React from 'react';

const defaultProps = {
	profile: {
		employeeId: 0,
	},
};

describe('ProfileScreen component', () => {

	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<ProfileScreen {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});
});
