'use strict';

jest.mock('../../../app/services/httpClient', () => ({}));
jest.mock('../../../app/store/configStore', () => ({}));
jest.mock('../../../app/lib/analytics/tracking');
jest.mock('../../lib/styles');
jest.mock('BuildNative');
jest.mock('BuildLibrary');
jest.mock('../../../app/components/Form', () => 'Form');
jest.mock('../../../app/components/FormInput', () => 'FormInput');

jest.unmock('react-native');

import { ProductCustomizationScreen } from '../ProductCustomizationScreen';
import React from 'react';

const defaultProps = {
	actions: {
		trackState: jest.fn(),
	},
	optionName: 'Finish',
	pricedOptionGroups: [],
	selectedPricedOptions: [],
};

describe('ProductCustomizationScreen component', () => {

	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<ProductCustomizationScreen {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});
});
