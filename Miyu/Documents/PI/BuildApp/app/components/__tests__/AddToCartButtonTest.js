'use strict';

jest.mock('../../services/httpClient', () => ({}));
jest.mock('../../store/configStore', () => ({}));
jest.mock('../../lib/analytics/tracking');
jest.mock('../../lib/styles');
jest.mock('BuildNative');
jest.mock('BuildLibrary');

jest.unmock('react-native');

import AddToCartButton from '../AddToCartButton';
import React from 'react';

const defaultProps = {

};

describe('AddToCartButton component', () => {
	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<AddToCartButton {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});
	it('should render correctly with button disabled', () => {
		const tree = require('react-test-renderer').create(
			<AddToCartButton
				{...defaultProps}
				disabled={true}
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});
});
