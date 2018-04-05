'use strict';

jest.mock('../../../app/services/httpClient', () => ({}));
jest.mock('../../../app/store/configStore', () => ({}));
jest.mock('../../../app/lib/analytics/tracking');
jest.mock('BuildNative');
jest.mock('BuildLibrary');
jest.mock('../../../app/components/Form', () => 'Form');
jest.mock('../../../app/components/FormInput', () => 'FormInput');

jest.unmock('react-native');

import { ProductReviewScreen } from '../productReviewScreen';
import React from 'react';

const defaultProps = {
	actions: {
		trackState: jest.fn(),
		getProductReviews: jest.fn(),
	},
	reviews: [],
};

describe('ProductReviewScreen component', () => {

	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<ProductReviewScreen {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});
});