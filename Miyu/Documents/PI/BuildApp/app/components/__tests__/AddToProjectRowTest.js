'use strict';

jest.unmock('../../../app/components/AddToProjectRow');
jest.unmock('react-native');
jest.mock('../../../app/lib/styles');
jest.mock('BuildLibrary');
jest.mock('BuildNative');
jest.mock('../../../app/lib/helpers');
jest.mock('../../../app/services/httpClient', () => ({}));
jest.mock('../../../app/store/configStore', () => ({}));

jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');
import { AddToProjectRow } from '../AddToProjectRow';
import React from 'react';
import renderer from 'react-test-renderer';

const defaultProps = {
	expandRow: false,
	listViewRef: {},
	onRowPress: jest.fn(),
	onCreateNewGroupPress: jest.fn(),
	onCreateNewGroup: jest.fn(),
	onGroupRowPress: jest.fn(),
	sectionID: '',
	rowData: {
		project: {},
		shoppingLists: [],
	},
	rowID: '',
};

describe('AddToProjectRow component', () => {

	it('should render AddToProjectRow with required props', () => {
		const tree = renderer.create(<AddToProjectRow {...defaultProps} />);
		expect(tree).toMatchSnapshot();
	});

	describe('filterEmptyGroups', () => {
		it('should return empty array', () => {
			const tree = renderer.create(<AddToProjectRow {...defaultProps} />);
			const result = tree.getInstance().filterEmptyGroups(null);
			expect(result).toEqual([]);
		});

		it('should return filtered array', () => {
			const tree = renderer.create(<AddToProjectRow {...defaultProps} />);
			const result = tree.getInstance().filterEmptyGroups([
				{
					name: null,
				},
				{
					name: undefined,
				},
				{
					name: '',
				},
				{
					name: 'test group 1',
				},
			]);
			expect(result).toEqual([{ name: 'test group 1' }]);
		});
	});
});
