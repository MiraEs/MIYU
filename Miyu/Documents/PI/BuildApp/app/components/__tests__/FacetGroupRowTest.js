
jest.unmock('react-native');
jest.mock('BuildNative');
jest.mock('BuildLibrary');
jest.mock('UIManager', () => ({
	configureNextLayoutAnimation: jest.fn(),
}));
jest.mock('Dimensions');

import 'react-native';
import React from 'react';
import FacetGroupRow from '../FacetGroupRow';

jest.mock('../../components/TextHighlighter', () => 'TextHighlighter');
jest.mock('../../components/SearchFilterInput', () => 'SearchFilterInput');
jest.mock('../../lib/animations', () => ({}));
jest.mock('../../lib/styles');
jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');

const defaultProps = {
	rowData: {
		resultValues: [{
			status: 'selected',
			value: 'one',
		}, {
			status: 'selected',
			value: 'two',
		}],
		groupName: 'Group Name',
		selectedFacetResponses: [{
			criteria: {
				value: ['one', 'two'],
			},
			groupName: 'Group Name',
		}],
	},
};

describe('FacetGroupRow component', () => {

	it('should render with default props', () => {
		const tree = require('react-test-renderer').create(
			<FacetGroupRow {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render facet search with 7 results', () => {
		const props = {
			rowData: {
				...defaultProps.rowData,
				resultValues: [{
					value: '1',
				}, {
					value: '2',
				}, {
					value: '3',
				}, {
					value: '4',
				}, {
					value: '5',
				}, {
					value: '6',
				}, {
					value: '7',
				}],
				selectedFacetResponses: [],
			},
		};
		const component = require('react-test-renderer').create(
			<FacetGroupRow {...props} />
		);
		const tree = component.toJSON();
		expect(tree).toMatchSnapshot();
	});

});
