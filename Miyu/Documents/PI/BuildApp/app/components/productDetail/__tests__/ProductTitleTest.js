
jest.unmock('react-native');
jest.mock('BuildNative');
jest.mock('redux-persist');
jest.mock('redux-persist-transform-compress');
jest.mock('redux');
jest.mock('../../../lib/styles');

import 'react-native';
import React from 'react';

import ProductTitle from '../ProductTitle';

const defaultProps = {
	cost: 300.2,
	squareFootageBased: false,
	onCalculateItemPrice: jest.fn(),
};

describe('ProductTitle component', () => {

	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<ProductTitle {...defaultProps}/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

});
