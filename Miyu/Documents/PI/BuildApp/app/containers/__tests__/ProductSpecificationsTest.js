'use strict';

jest.mock('../../services/httpClient', () => ({}));
jest.mock('../../store/configStore', () => ({}));
jest.mock('../../lib/analytics/tracking');
jest.mock('../../lib/styles');
jest.mock('BuildNative');
jest.mock('BuildLibrary');
jest.mock('../../components/Form', () => 'Form');
jest.mock('../../components/FormInput', () => 'FormInput');

jest.unmock('react-native');

import { ProductSpecifications } from '../ProductSpecifications';
import React from 'react';

const defaultProps = {
	actions: {
		trackState: jest.fn(),
		trackAction: jest.fn(),
	},
	productSpecFilter: '',
	productSpecs: [],
};

describe('ProductSpecifications component', () => {

	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<ProductSpecifications {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});
});
