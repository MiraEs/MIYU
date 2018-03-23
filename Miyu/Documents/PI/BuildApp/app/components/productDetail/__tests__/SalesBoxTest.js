
import 'react-native';
import React from 'react';
import SalesBox from '../SalesBox';

const defaultProps = {
	sale: {
		catchLine: 'Test Sale',
		saleDetail: 'Test sale details.',
		endDate: 1481830580534,
	},
};

describe('SalesBox Container', () => {

	it('should render with a sale', () => {
		const tree = require('react-test-renderer').create(
			<SalesBox {...defaultProps} />
		);
		expect(tree.toJSON()).toMatchSnapshot();
	});
});
