import searchService from '../services/searchService';

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
	VIEW_STYLE_LOADED,
	CLEAR_FACETS,
	SET_NULL_SEARCH_RESULT,
} from '../constants/searchConstants';
import { historyUpsert } from './HistoryActions';
import store from 'react-native-simple-store';

const searchActions = {

	getSearchSuccess(payload, compositeId, criteria) {
		return {
			type: criteria.onlyFacets ? SEARCH_SUCCESS_ONLY_FACETS : SEARCH_SUCCESS,
			keyword: criteria.keyword,
			categoryId: criteria.categoryId,
			payload,
			compositeId,
		};
	},

	getSearchFail(error) {
		return {
			type: SEARCH_FAIL,
			error,
		};
	},

	clearFacets(criteria) {
		return {
			type: CLEAR_FACETS,
			...criteria,
		};
	},

	applySelectedFacets(criteria) {
		return {
			type: APPLY_SELECTED_FACETS,
			...criteria,
		};
	},

	startLoading(dispatch) {
		store.get('VIEW_STYLE').then((viewStyle) => {
			if (viewStyle) {
				dispatch({
					type: VIEW_STYLE_LOADED,
					viewStyle,
				});
			}
		});
		return {
			type: START_LOADING,
		};
	},

	typeAheadResults(term, results) {
		return {
			type: TYPEAHEAD,
			term,
			results,
		};
	},

	/**
	 * Do a search by keyword
	 * @param  {object} criteria    Search criteria containing information about keyword, page number and page length
	 * @param  {number} compositeId An optional compositeId to associate with a search
	 * @return {function}           thunk
	 */
	searchByKeyword(criteria, compositeId) {
		return (dispatch, getState) => {

			function handleSearchSuccess(data) {
				if (data && data.productDrops) {
					const { selectedFacetResponses } = data;
					const { categoryId, keyword, sortOption } = criteria;
					const history = {
						categoryId,
						compositeId,
						keyword,
						data: {},
					};

					if (selectedFacetResponses.length) {
						history.data = {
							...history.data,
							selectedFacetResponses,
						};
					}
					if (sortOption) {
						history.data = {
							...history.data,
							sortOption,
						};
					}
					dispatch(historyUpsert(history));

					dispatch(searchActions.getSearchSuccess(data, compositeId, criteria));
					if (!data.productDrops.length && !criteria.clearFacets) {
						criteria.clearFacets = true;
						dispatch(searchActions.searchByKeyword(criteria));
					} else {
						dispatch(searchActions.applySelectedFacets(criteria));
					}
				} else {
					dispatch(searchActions.getSearchFail(data));
				}
			}

			dispatch(searchActions.startLoading(dispatch));
			let search;
			if (criteria.categoryId) {
				search = getState().searchReducer.categorySearches[criteria.categoryId];
			} else if (criteria.keyword) {
				search = getState().searchReducer.keywordSearches[criteria.keyword];
			}
			const selectedFacetCriteriaList = [],
				selectedFacets = search ? search.selectedFacets || {} : {};
			if (criteria.clearFacets) {
				dispatch(searchActions.clearFacets(criteria));
			} else {
				for (const key of Object.keys(selectedFacets)) {
					const currFacet = selectedFacets[key];
					if (currFacet.selected.length) {
						selectedFacetCriteriaList.push({
							facetId: key,
							include: true,
							multiSelect: currFacet.selected.length > 1,
							value: currFacet.selected,
						});
					}
				}
			}
			const request = {
				selectedFacetCriteriaList,
				page: criteria.page,
				pageSize: criteria.pageSize,
				pricebookId: 1,
				allowRedirect: false,
				siteId: 82,
				storeId: 248,
				sortOption: criteria.sortOption || 'SCORE',
			};
			if (criteria.categoryId) {
				request.categoryId = criteria.categoryId;
				return searchService.searchByCategory(request).then(handleSearchSuccess, (error) => {
					dispatch(searchActions.getSearchFail(error));
				});
			} else if (criteria.keyword) {
				request.keyword = criteria.keyword.replace(/^BCI/gi, '');
				return searchService.searchByKeyword(request).then(handleSearchSuccess, (error) => {
					dispatch(searchActions.getSearchFail(error));
				});
			}
		};
	},

	typeAhead(term) {
		return (dispatch, getState) => {
			const body = {
				term,
				page: 0,
				pageSize: 5,
				maxSuggestions: 5,
				pricebookId: getState().userReducer.user.pricebookId || 1,
				searchArticles: false,
				searchVideos: false,
				siteId: 82,
				storeId: 248,
				sortOption: 'SCORE',
			};
			body.term = term.replace(/^BCI/gi, '');
			return searchService.typeAhead(body).then((responses) => {
				dispatch(searchActions.typeAheadResults(term, responses));
			});
		};
	},

	updateSelectedFacets(criteria) {
		return {
			type: UPDATE_SELECTED_FACETS,
			...criteria,
		};
	},

	setSortOption(sortParams) {
		return {
			type: SET_SORT_OPTION,
			...sortParams,
		};
	},

	cycleViewStyle() {
		return { type: CYCLE_VIEW_STYLE };
	},

	setNullSearchResult(status) {
		return {
			type: SET_NULL_SEARCH_RESULT,
			status,
		};
	},

};

module.exports = searchActions;
