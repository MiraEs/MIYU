import PagingListView from '../PagingListView';
import React from 'react';

jest.mock('BuildLibrary');

describe('PagingListView component', () => {

	const emptyProps = {
		paging: {},
		loadPage: jest.fn(),
		data: [],
		renderRow: jest.fn(),
		renderEmpty: () => null,
	};

	const defaultProps = {
		paging: {},
		loadPage: jest.fn(),
		data: [{}, {}, {}],
		renderRow: () => null,
		renderEmpty: () => null,
	};

	it('should render empty correctly', () => {
		const tree = require('react-test-renderer').create(
			<PagingListView {...emptyProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<PagingListView {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

});
