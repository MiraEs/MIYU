'use strict';

jest.mock('BuildNative');
jest.mock('BuildLibrary');
jest.mock('../../../../app/components/Avatar', () => 'Avatar');
jest.mock('../../../../app/components/events/Comments', () => 'Comments');
jest.unmock('react-native');

import TeamMemberComponent from '../teamExpert';
import React from 'react';

const defaultProps = {
	event: {
		eventId: 1,
		user: {},
	},
	eventStoreType: 'eventStoreType',
};

describe('Team Expert Event component', () => {
	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<TeamMemberComponent {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});
});