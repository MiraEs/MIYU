'use strict';

jest.mock('../../../app/services/httpClient', () => ({}));
jest.mock('../../../app/store/configStore', () => ({}));
jest.mock('../../../app/lib/analytics/tracking');
jest.mock('BuildNative');
jest.mock('BuildLibrary');
jest.mock('../../../app/components/Form', () => 'Form');
jest.mock('../../../app/components/FormInput', () => 'FormInput');
jest.mock('../../../app/content/Atoms/AtomText@1', () => 'AtomText@1');
jest.mock('../../../app/containers/TabBar', () => 'TabBar');
jest.mock('../../../app/router', () => ({}));
jest.mock('PushNotificationIOS', () => ({
	addEventListener: jest.fn(),
}));

jest.unmock('react-native');
import 'react-native';
jest.mock('Linking', () => ({
	getInitialURL: jest.fn(() => Promise.resolve()),
	addEventListener: jest.fn(),
}));
import { Main } from '../Main';
import React from 'react';

const defaultProps = {
	actions: {
		trackState: jest.fn(),
	},
	features: {},
	isLoggedIn: false,
};

describe('Main component', () => {

	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<Main {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});
});
