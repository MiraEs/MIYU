'use strict';

jest.mock('BuildNative');
jest.mock('BuildLibrary');

jest.unmock('react-native');

import Onboarding from '../Onboarding';
import React from 'react';

const defaultProps = {
	event: {
		eventId: 1,
		user: {},
		heading: 'heading',
		icon: 'ios-add',
	},
	eventStoreType: 'eventStoreType',
};

describe('Team member event component', () => {
	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<Onboarding {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});
});
