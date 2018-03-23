jest.unmock('react-native');
jest.mock('BuildNative');
jest.mock('BuildLibrary');
jest.mock('../../../app/lib/productHelpers', () => ({ cartHasGeProducts: () => true }));

import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';

import RequestDeliveryDate from '../RequestDeliveryDate';

const defaultProps = {
	cart: {},
	testID: '',
	trackAction: '',
};

describe('RequestDeliveryDate component', () => {

	it('should render correctly', () => {
		const tree = renderer.create( <RequestDeliveryDate {...defaultProps} /> ).toJSON();
		expect(tree).toMatchSnapshot();
	});

});

describe('RequestDeliveryDate component', () => {

	it('should render correctly when provided a delivery date', () => {
		const tree = renderer.create(
			<RequestDeliveryDate
				{...defaultProps}
				cart={{ requestedDeliveryDate: 1490031085322 }}
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

});
