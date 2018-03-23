
jest.mock('../../../app/services/httpClient', () => ({}));

jest.mock('BuildNative');
jest.mock('BuildLibrary');
jest.mock('../../../app/components/FacetGroupRow', () => 'FacetGroupRow');
jest.mock('../../../app/lib/analytics/tracking');

jest.unmock('react-native');
import 'react-native';
import React from 'react';
import { FacetList } from '../FacetList';

const defaultProps = {
	facets: [],
	actions: {
		optimisticallySelectFacet: jest.fn(),
		searchByKeyword: jest.fn(),
		trackState: jest.fn(),
		trackAction: jest.fn(),
	},
	navigator: {
		updateCurrentRouteParams: jest.fn(),
	},
	searchCriteria: {},
	isLoading: false,
	numFound: 1,
	numSelectedFacets: 0,
};

describe('FacetList Container', () => {

	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<FacetList {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

});
