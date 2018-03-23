jest.unmock('../../../app/actions/SearchActions');

jest.mock('../../../app/services/searchService', () => ({
	searchByCategory: jest.fn(() => Promise.resolve({})),
	searchByKeyword: jest.fn(() => Promise.resolve({})),
	typeAhead: jest.fn(() => Promise.resolve({})),
}));

import SearchActions from '../SearchActions';
import searchService from '../../services/searchService';
import {
	SEARCH_SUCCESS,
	SEARCH_SUCCESS_ONLY_FACETS,
	SEARCH_FAIL,
	SET_SORT_OPTION,
	START_LOADING,
	UPDATE_SELECTED_FACETS,
	APPLY_SELECTED_FACETS,
	TYPEAHEAD,
	CYCLE_VIEW_STYLE,
	CLEAR_FACETS,
	SET_NULL_SEARCH_RESULT,
} from '../../constants/searchConstants';
import store from 'react-native-simple-store';

const dispatch = jest.fn();
const getState = jest.fn(() => ({
	searchReducer: {
		categorySearches: [],
		keywordSearches: [],
	},
	userReducer: {
		user: {
			pricebookId: 1,
		},
	},
}));

describe('SearchActions', () => {
	describe('getSearchSuccess', () => {
		const compositeId = 1;
		const criteria = {
			onlyFacets: true,
			keyword: 'test',
			categoryId: 1,
		};
		const payload = {};

		it('should match type SEARCH_SUCCESS_ONLY_FACETS', () => {
			const result = SearchActions.getSearchSuccess(payload, compositeId, criteria);
			expect(result.type).toEqual(SEARCH_SUCCESS_ONLY_FACETS);
		});

		it('should match type SEARCH_SUCCESS', () => {
			criteria.onlyFacets = false;
			const result = SearchActions.getSearchSuccess(payload, compositeId, criteria);
			expect(result.type).toEqual(SEARCH_SUCCESS);
		});
	});

	describe('getSearchFail', () => {
		it('should match type SEARCH_FAIL', () => {
			const error = 'error message';
			const result = SearchActions.getSearchFail(error);
			expect(result.type).toEqual(SEARCH_FAIL);
			expect(result.error).toEqual(error);
		});
	});

	describe('clearFacets', () => {
		it('should match type CLEAR_FACETS', () => {
			const result = SearchActions.clearFacets({});
			expect(result.type).toEqual(CLEAR_FACETS);
		});
	});

	describe('applySelectedFacets', () => {
		it('should match type APPLY_SELECTED_FACETS', () => {
			const result = SearchActions.applySelectedFacets({});
			expect(result.type).toEqual(APPLY_SELECTED_FACETS);
		});
	});

	describe('startLoading', () => {
		it('should match type START_LOADING', () => {
			const result = SearchActions.startLoading(dispatch);
			expect(store.get).toHaveBeenCalledWith('VIEW_STYLE');
			expect(result.type).toEqual(START_LOADING);
		});
	});

	describe('typeAheadResults', () => {
		it('should match type TYPEAHEAD', () => {
			const term = 'test';
			const result = SearchActions.typeAheadResults(term, {});
			expect(result.type).toEqual(TYPEAHEAD);
			expect(result.term).toEqual(term);
		});
	});

	describe('searchByKeyword', () => {
		const compositeId = 1;

		afterEach(() => {
			searchService.searchByCategory.mockClear();
			searchService.searchByKeyword.mockClear();
		});

		it('should call searchService.searchByCategory', () => {
			const criteria = {
				categoryId: 1,
			};
			SearchActions.searchByKeyword(criteria, compositeId)(dispatch, getState);
			expect(searchService.searchByCategory).toHaveBeenCalled();
		});

		it('should call searchService.searchByKeyword', () => {
			const criteria = {
				keyword: 'test',
			};
			SearchActions.searchByKeyword(criteria, compositeId)(dispatch, getState);
			expect(searchService.searchByKeyword).toHaveBeenCalled();
		});
	});

	describe('updateSelectedFacets', () => {
		it('should match type UPDATE_SELECTED_FACETS', () => {
			const result = SearchActions.updateSelectedFacets({});
			expect(result.type).toEqual(UPDATE_SELECTED_FACETS);
		});
	});

	describe('setSortOption', () => {
		it('should match type SET_SORT_OPTION', () => {
			const result = SearchActions.setSortOption({});
			expect(result.type).toEqual(SET_SORT_OPTION);
		});
	});

	describe('cycleViewStyle', () => {
		it('should match type CYCLE_VIEW_STYLE', () => {
			const result = SearchActions.cycleViewStyle();
			expect(result.type).toEqual(CYCLE_VIEW_STYLE);
		});
	});

	describe('setNullSearchResult', () => {
		it('should match type SET_NULL_SEARCH_RESULT', () => {
			const result = SearchActions.setNullSearchResult(true);
			expect(result.type).toEqual(SET_NULL_SEARCH_RESULT);
		});
	});

});
