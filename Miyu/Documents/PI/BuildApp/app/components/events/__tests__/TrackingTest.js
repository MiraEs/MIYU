'use strict';

jest.mock('BuildNative');
jest.mock('BuildLibrary');
jest.mock('../../../services/httpClient', () => ({}));
jest.mock('../../../lib/styles');
jest.mock('../../../components/events/Comments', () => 'Comments');
jest.unmock('react-native');

import Tracking from '../Tracking';
import React from 'react';

const defaultProps = {
	event: {
		eventId: 1,
		user: {},
	},
	eventStoreType: 'eventStoreType',
};

describe('Tracking Event component', () => {
	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<Tracking {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

});
