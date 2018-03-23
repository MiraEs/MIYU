jest.unmock('react-native');

jest.mock('BuildLibrary');

import NotificationSoftAsk from '../NotificationSoftAsk';

import 'react-native';
import React from 'react';

describe('NotificationSoftAsk component', () => {

	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(<NotificationSoftAsk />).toJSON();
		expect(tree).toMatchSnapshot();
	});

});
