'use strict';

jest.mock('../../../app/services/httpClient', () => ({}));
jest.mock('../../../app/store/configStore', () => ({}));
jest.mock('../../../app/lib/analytics/tracking');
jest.mock('BuildNative');
jest.mock('BuildLibrary');
jest.mock('../../../app/components/Form', () => 'Form');
jest.mock('../../../app/components/FormInput', () => 'FormInput');

jest.unmock('react-native');

import { ModelDetailPickerScreen } from '../ModelDetailPickerScreen';
import React from 'react';

const defaultProps = {
	actions: {
		trackState: jest.fn(),
		getProductSpecs: jest.fn(() => ({ done: jest.fn() })),
	},
	optionProducts: [
		{
			productDrop: {
				finishes: [{}],
			},
		},
	],
};

describe('ModelDetailPickerScreen component', () => {

	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<ModelDetailPickerScreen {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});
});
