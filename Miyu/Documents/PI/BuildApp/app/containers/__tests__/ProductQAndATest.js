'use strict';
import React from 'react';

jest.mock('../../../app/services/httpClient', () => ({}));
jest.mock('../../../app/store/configStore', () => ({}));
jest.mock('../../../app/lib/analytics/tracking');
jest.mock('BuildNative');
jest.mock('BuildLibrary');
jest.mock('../../../app/components/Form', () => 'Form');
jest.mock('../../../app/components/FormInput', () => 'FormInput');

jest.unmock('react-native');

import { ProductQAndA } from '../ProductQAndA';

const defaultProps = {
	actions: {
		trackState: jest.fn(),
	},
	filterTerm: '',
	productQuestions: [],
};

describe('ProductQAndA component', () => {

	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<ProductQAndA {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});
});
