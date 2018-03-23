jest.unmock('react-native');
jest.mock('../../../app/services/httpClient', () => ({}));
jest.mock('BuildLibrary');
jest.mock('BuildNative');

import React from 'react';
import { NotificationsTab } from '../NotificationsTab';

const defaultProps = {
	actions: { getNotifications: jest.fn() },
	notifications: [
		{
			message: 'test',
			projectName: 'projectName',
			createdDate: 0,
			active: true,
			loading: false,
			eventType: 'QUOTE',
		},
	],
	paging: {
		pages: 1,
		page: 1,
	},
};

const emptyProps = {
	...defaultProps,
	notifications: [],
	showEmptyButton: true,
};

describe('NotificationsTab component', () => {

	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<NotificationsTab {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render empty correctly', () => {
		const tree = require('react-test-renderer').create(
			<NotificationsTab {...emptyProps} />
		);
		expect(tree).toMatchSnapshot();
	});

});
