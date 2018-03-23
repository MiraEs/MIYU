'use strict';

jest.mock('../../../app/services/httpClient', () => ({}));
jest.mock('../../../app/store/configStore', () => ({}));
jest.mock('../../../app/lib/analytics/tracking');
jest.mock('BuildNative');
jest.mock('BuildLibrary');

jest.unmock('react-native');

import Address from '../Address';
import React from 'react';

const defaultProps = {

};

describe('AddToCartButton component', () => {
	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<Address {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

});
