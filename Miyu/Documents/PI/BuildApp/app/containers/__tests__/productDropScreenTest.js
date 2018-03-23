'use strict';

import React from 'react';

jest.mock('../../../app/services/httpClient', () => ({}));
jest.mock('../../../app/store/configStore', () => ({}));
jest.mock('../../../app/lib/analytics/tracking');
jest.mock('BuildNative');
jest.mock('BuildLibrary');
jest.mock('../../../app/components/Form', () => 'Form');
jest.mock('../../../app/components/FormInput', () => 'FormInput');
jest.mock('../../../app/components/IconBadge', () => 'IconBadge');
jest.mock('../../../app/components/ProductDrop', () => 'ProductDrop');
jest.mock('../../../app/components/LoadingView', () => 'LoadingView');
jest.mock('../../../app/containers/HeaderSearch', () => 'HeaderSearch');
jest.mock('../../../app/content/Atoms/AtomText@1', () => 'AtomText@1');
jest.mock('react-native-vector-icons/Ionicons', () => 'Icons');

jest.unmock('react-native');

import { ProductDrops } from '../productDropScreen';

const defaultProps = {
	actions: {
		trackState: jest.fn(),
		historyUpsert: jest.fn(),
	},
	productDrops: [],
	numFound: 0,
	numSelectedFacets: 0,
	searchCriteria: {
		keyword: 'faucet',
		page: 1,
		pageSize: 50,
	},
	sortOption: 'SCORE',
	facets: [],
	tracking: {},
};

describe('ProductDrops component', () => {

	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<ProductDrops {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render correctly when results are found', () => {
		const tree = require('react-test-renderer').create(
			<ProductDrops
				{...defaultProps}
				num={1}
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

});
