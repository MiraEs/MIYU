'use strict';

jest.mock('BuildNative');
jest.mock('BuildLibrary');
jest.mock('../../../../app/components/events/Comments', () => 'Comments');
jest.mock('../../../../app/components/events/ProductList', () => 'ProductList');

jest.unmock('react-native');

import Order from '../Order';
import React from 'react';

const defaultProps = {
	event: {
		eventId: 1,
		user: {},
	},
	eventStoreType: 'eventStoreType',
};

describe('Team member event component', () => {
	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<Order {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});
});
