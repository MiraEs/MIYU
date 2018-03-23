
jest.mock('../../../app/services/httpClient', () => ({}));
jest.mock('../../../app/store/configStore', () => ({}));
jest.mock('../../../app/lib/analytics/tracking');
jest.mock('BuildNative');
jest.mock('BuildLibrary');
jest.unmock('react-native');
import 'react-native';
import React from 'react';
import { ProductUpsell } from '../ProductUpsell';

const defaultProps = {
	recommendedOptions: [],
	actions: {
		getRelatedUpsellProducts: jest.fn(),
		trackState: jest.fn(),
	},
};

describe('ProductUpsell component', () => {

	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<ProductUpsell {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

});
