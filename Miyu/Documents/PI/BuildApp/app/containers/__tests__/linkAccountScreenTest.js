'use strict';

jest.mock('../../services/httpClient', () => ({}));
jest.mock('../../store/configStore', () => ({}));
jest.mock('../../lib/analytics/tracking');
jest.mock('../../lib/styles');
jest.mock('BuildNative');
jest.mock('BuildLibrary');
jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');
jest.mock('../../components/Form', () => 'Form');
jest.mock('../../components/FormInput', () => 'FormInput');
jest.mock('../../components/button', () => 'Button');

jest.mock('react-native');

import { LinkAccountScreen } from '../linkAccountScreen';
import React from 'react';

const defaultProps = {
	actions: {
		trackState: jest.fn(),
		trackAction: jest.fn(),
	},
	loginSuccess: jest.fn(),
};

describe('LinkAccountScreen component', () => {

	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<LinkAccountScreen {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});
});
