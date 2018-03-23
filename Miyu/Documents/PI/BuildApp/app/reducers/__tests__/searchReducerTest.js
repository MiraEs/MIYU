'use strict';

jest.unmock('../../../app/reducers/searchReducer');

import searchReducer from '../searchReducer';

import {
	SEARCH_SUCCESS,
	SEARCH_SUCCESS_ONLY_FACETS,
	SET_SORT_OPTION,
	UPDATE_SELECTED_FACETS,
	APPLY_SELECTED_FACETS,
	START_LOADING,
	CLEAR_FACETS,
	TYPEAHEAD,
	SEARCH_LIST,
	SEARCH_GRID,
	SEARCH_GALLERY,
	CYCLE_VIEW_STYLE,
	VIEW_STYLE_LOADED,
	SET_NULL_SEARCH_RESULT,
} from '../../constants/searchConstants' ;


describe('searchReducer reducer', () => {

	it('should return initialState', () => {
		expect(searchReducer(undefined, {})).toMatchSnapshot();
	});


	it('should SEARCH_SUCCESS', () => {
		const action = {
			type: SEARCH_SUCCESS,
		};
		const state = searchReducer(undefined, action);
		expect(
			state
		).toMatchSnapshot();
	});

	it('should SEARCH_SUCCESS_ONLY_FACETS', () => {
		const action = {
			type: SEARCH_SUCCESS_ONLY_FACETS,
		};
		const state = searchReducer(undefined, action);
		expect(
			state
		).toMatchSnapshot();
	});

	it('should SET_SORT_OPTION for a category search', () => {
		const action = {
			type: SET_SORT_OPTION,
			categoryId: '1234',
		};
		const state = searchReducer({categorySearches: {'1234' : {} } }, action);
		expect(
			state
		).toMatchSnapshot();
	});

	it('should SET_SORT_OPTION for a keyword search', () => {
		const action = {
			type: SET_SORT_OPTION,
			keyword: 'keyword',
		};
		const state = searchReducer({keywordSearches:{'keyword': {} } }, action);
		expect(
			state
		).toMatchSnapshot();
	});
	it('should UPDATE_SELECTED_FACETS', () => {
		const action = {
			type: UPDATE_SELECTED_FACETS,
			categoryId: '1234',
		};
		const state = searchReducer({categorySearches: {'1234' : {facets:[]} }}, action);
		expect(
			state
		).toMatchSnapshot();
	});

	it('should APPLY_SELECTED_FACETS', () => {
		const action = {
			type: APPLY_SELECTED_FACETS,
			categoryId: '1234',
		};
		const state = searchReducer({categorySearches: {'1234' : {facets:[]} }}, action);
		expect(
			state
		).toMatchSnapshot();
	});

	it('should START_LOADING', () => {
		const action = {
			type: START_LOADING,
		};
		const state = searchReducer(undefined, action);
		expect(
			state
		).toMatchSnapshot();
	});

	it('should CLEAR_FACETS', () => {
		const action = {
			type: CLEAR_FACETS,
		};
		const state = searchReducer(undefined, action);
		expect(
			state
		).toMatchSnapshot();
	});

	it('should TYPEAHEAD', () => {
		const action = {
			type: TYPEAHEAD,
		};
		const state = searchReducer(undefined, action);
		expect(
			state
		).toMatchSnapshot();
	});

	it('should SEARCH_LIST', () => {
		const action = {
			type: SEARCH_LIST,
		};
		const state = searchReducer(undefined, action);
		expect(
			state
		).toMatchSnapshot();
	});

	it('should SEARCH_GRID', () => {
		const action = {
			type: SEARCH_GRID,
		};
		const state = searchReducer(undefined, action);
		expect(
			state
		).toMatchSnapshot();
	});

	it('should SEARCH_GALLERY', () => {
		const action = {
			type: SEARCH_GALLERY,
		};
		const state = searchReducer(undefined, action);
		expect(
			state
		).toMatchSnapshot();
	});

	it('should CYCLE_VIEW_STYLE', () => {
		const action = {
			type: CYCLE_VIEW_STYLE,
		};
		const state = searchReducer(undefined, action);
		expect(
			state
		).toMatchSnapshot();
	});

	it('should VIEW_STYLE_LOADED', () => {
		const action = {
			type: VIEW_STYLE_LOADED,
		};
		const state = searchReducer(undefined, action);
		expect(
			state
		).toMatchSnapshot();
	});

	it('should SET_NULL_SEARCH_RESULT', () => {
		const action = {
			type: SET_NULL_SEARCH_RESULT,
			status: true,
		};
		const state = searchReducer(undefined, action);
		expect(state).toMatchSnapshot();
	});

});
