'use strict';

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
} from '../constants/searchConstants';
import {
	toFloat,
} from '../lib/helpers';
import store from 'react-native-simple-store';

const initialState = {
	categorySearches: {},
	keywordSearches: {},
	isLoading: false,
	typeAheadResults: {},
	viewStyle: SEARCH_LIST,
	nullSearchResult: false,
};

function decorateProductDrops(productDrops = []) {

	if (!Array.isArray(productDrops)) {
		productDrops = [];
	}

	return productDrops.map((productDrop) => {
		if (productDrop.squareFootageBased) {
			let squareFootagePerCarton;
			const squareFootSpec = productDrop.productSpecs.find((spec) => spec.attributeName.toLowerCase() === 'square foot per carton');
			squareFootSpec.productSpecValue.forEach((item) => squareFootagePerCarton = toFloat(item.value));
			productDrop.squareFootagePerCarton = squareFootagePerCarton;
		}
		try {
			// @offload
			delete productDrop.favoriteCount;
			delete productDrop.finishIndexMap;
			delete productDrop.freeShipping;
			delete productDrop.hasAddToCartMapBuster;
			delete productDrop.hasReplacementParts;
			delete productDrop.isDiscontinued;
			delete productDrop.isConfigurable;
			delete productDrop.productSale;
			delete productDrop.productSpecs;
			delete productDrop.restrictions;
			delete productDrop.slugOverride;
			delete productDrop.oneTrueLink;
			delete productDrop.series;
			delete productDrop.maxPrice;
			delete productDrop.reviewRating.bvProductId;
			if (Array.isArray(productDrop.finishes)) {
				productDrop.finishes.forEach((finish) => {
					delete finish.finishSampleUniqueId;
					delete finish.msrp;
					if (finish.finishSwatch) {
						delete finish.finishSwatch.swatchIdentifier;
						delete finish.finishSwatch.swatchImage;
					}
					delete finish.imagePaths;
				});
			}
		} catch (error) {
			// meh
		}

		return productDrop;
	});
}

function getCurrentSearch(state, action) {
	const { categoryId, keyword } = action;
	return categoryId ? state.categorySearches[categoryId] : state.keywordSearches[keyword];
}

function applyFacets(facets, currentSearch) {
	return facets.map((facetGroup) => {
		const newFacetGroup = { ...facetGroup };
		newFacetGroup.resultValues = facetGroup.resultValues.map((facet) => {
			const newFacet = { ...facet },
				selectedFacetResult = currentSearch.selectedFacets[facet.facetId];
			newFacet.status = null;
			if (selectedFacetResult) {
				const match = selectedFacetResult.selected.find((result) => result.toLowerCase() === facet.value.toLowerCase());
				if (match) {
					newFacet.status = 'selected';
				}
			}
			return newFacet;
		});
		return newFacetGroup;
	});
}

/**
 * Get the matching facet name from the list of facets that the services return us.
 * This is useful in the instance that we get the facet name from a deep link URL query string and it's all lowercased.
 * @param facetGroups
 * @param facetId
 * @param name
 * @returns {*}
 */
function getMatchingFacetName(facetGroups, facetId, name) {
	let matchingName = name;
	if (Array.isArray(facetGroups)) {
		facetGroups.forEach((group) => {
			if (group && Array.isArray(group.resultValues)) {
				group.resultValues.forEach((facet) => {
					if (facet && facet.facetId === facetId && facet.value.toLowerCase() === name.toLowerCase()) {
						matchingName = facet.value;
					}
				});
			}
		});
	}
	return matchingName;
}

function searchSuccess(state, action) {
	action.payload = action.payload || {};
	const currentSearch = getCurrentSearch(state, action);
	const { categoryId, keyword } = action;
	const search = {
		facets: action.payload.facetResultGroups,
		numFound: action.payload.numFound,
	};
	if (action.payload.page > 1) {
		search.productDrops = [
			...currentSearch.productDrops,
			...decorateProductDrops(action.payload.productDrops)];
	} else {
		search.productDrops = decorateProductDrops(action.payload.productDrops);
	}
	if (categoryId) {
		state.categorySearches[action.categoryId] = {
			selectedFacets: {},
			...state.categorySearches[action.categoryId],
			...search,
			selectedFacetResponses: action.payload.selectedFacetResponses,
		};
		return {
			...state,
			isLoading: false,
			categorySearches: {
				...state.categorySearches,
			},
		};
	} else if (keyword) {
		state.keywordSearches[action.keyword] = {
			selectedFacets: {},
			...state.keywordSearches[action.keyword],
			...search,
			selectedFacetResponses: action.payload.selectedFacetResponses,
		};
		return {
			...state,
			isLoading: false,
			keywordSearches: {
				...state.keywordSearches,
			},
		};
	}
	return {
		...state,
	};
}

function searchSuccessOnlyFacets(state, action) {
	action.payload = action.payload || {};
	const { categoryId, keyword } = action;
	state.isLoading = false;
	if (categoryId) {
		return {
			...state,
			categorySearches: {
				...state.categorySearches,
				[categoryId]: {
					...state.categorySearches[categoryId],
					facets: action.payload.facetResultGroups,
					numFound: action.payload.numFound,
					selectedFacetResponses: action.payload.selectedFacetResponses,
				},
			},
		};
	} else {
		return {
			...state,
			keywordSearches: {
				...state.keywordSearches,
				[keyword]: {
					...state.keywordSearches[keyword],
					facets: action.payload.facetResultGroups,
					numFound: action.payload.numFound,
					selectedFacetResponses: action.payload.selectedFacetResponses,
				},
			},
		};
	}
}

function setSortOption(state, action) {
	const currentSearch = getCurrentSearch(state, action);
	const { sortOption } = action;
	currentSearch.sortOption = sortOption;
	return {
		...state,
	};
}

function startLoading(state) {
	return {
		...state,
		isLoading: true,
	};
}

function clearFacets(state, action) {
	const { categoryId, keyword } = action;
	if (categoryId) {
		return {
			...state,
			categorySearches: {
				...state.categorySearches,
				[categoryId]: {
					...state.categorySearches[categoryId],
					selectedFacetResponses: [],
					selectedFacets: {},
					numSelectedFacets: 0,
				},
			},
		};
	} else {
		return {
			...state,
			keywordSearches: {
				...state.keywordSearches,
				[keyword]: {
					...state.keywordSearches[keyword],
					selectedFacetResponses: [],
					selectedFacets: {},
					numSelectedFacets: 0,
				},
			},
		};
	}
}

function typeahead(state, action) {
	const newResults = { ...state.typeAheadResults };
	newResults[action.term] = action.results;
	return {
		...state,
		typeAheadResults: newResults,
	};
}

function applySelectedFacets(state, action) {
	let currentSearch = getCurrentSearch(state, action);
	const { categoryId, keyword } = action;
	const newFacets = applyFacets(currentSearch.facets, currentSearch);
	currentSearch = {
		...currentSearch,
		facets: newFacets,
	};
	if (categoryId) {
		return {
			...state,
			categorySearches: {
				...state.categorySearches,
				[categoryId]: currentSearch,
			},
		};
	} else if (keyword) {
		return {
			...state,
			keywordSearches: {
				...state.keywordSearches,
				[keyword]: currentSearch,
			},
		};
	}
	return {
		...state,
	};
}

function updateSelectedFacets(state, action) {
	const currentSearch = getCurrentSearch(state, action);
	const { categoryId, facetId, keyword } = action;
	currentSearch.selectedFacets = {
		...currentSearch.selectedFacets,
	};
	currentSearch.selectedFacets[facetId] =
		currentSearch.selectedFacets[facetId] || {
			selected: [],
			excluded: [],
		};
	const currentFacet = currentSearch.selectedFacets[facetId];
	if (action.status === 'selected') {
		// make sure we have the name with the right casing
		const name = getMatchingFacetName(currentSearch.facets, facetId, action.value);
		if (!currentFacet.selected.find((selection) => selection === name)) {
			currentFacet.selected.push(name);
		}
	} else {
		currentFacet.selected = currentFacet.selected.filter((f) => f !== action.value);
	}

	const numSelectedFacets = Object.keys(currentSearch.selectedFacets).map(
		(facetId) => {
			const facet = currentSearch.selectedFacets[facetId];
			return facet.selected.length + facet.excluded.length;
		}).reduce((a, b) => a + b, 0);
	currentSearch.numSelectedFacets = numSelectedFacets;
	if (categoryId) {
		return {
			...state,
			categorySearches: {
				...state.categorySearches,
				[categoryId]: currentSearch,
			},
		};
	} else if (keyword) {
		return {
			...state,
			keywordSearches: {
				...state.keywordSearches,
				[keyword]: currentSearch,
			},
		};
	}
	return {
		...state,
	};
}

function cycleViewStyle(state) {
	let viewStyle;
	switch (state.viewStyle) {
		case SEARCH_GRID:
			viewStyle = SEARCH_GALLERY;
			break;
		case SEARCH_GALLERY:
			viewStyle = SEARCH_LIST;
			break;
		default:
			viewStyle = SEARCH_GRID;
	}
	store.save('VIEW_STYLE', viewStyle);
	return {
		...state,
		viewStyle,
	};
}

function viewStyleLoaded(state, action) {
	return {
		...state,
		viewStyle: action.viewStyle,
	};
}

function setNullSearchResult(state, action) {
	return {
		...state,
		nullSearchResult: action.status,
	};
}

const searchReducer = (state = initialState, action = {}) => {
	switch (action.type) {
		case SEARCH_SUCCESS: return searchSuccess(state, action);
		case SEARCH_SUCCESS_ONLY_FACETS: return searchSuccessOnlyFacets(state, action);
		case SET_SORT_OPTION: return setSortOption(state, action);
		case START_LOADING: return startLoading(state);
		case CLEAR_FACETS: return clearFacets(state, action);
		case TYPEAHEAD: return typeahead(state, action);
		case APPLY_SELECTED_FACETS: return applySelectedFacets(state, action);
		case UPDATE_SELECTED_FACETS: return updateSelectedFacets(state, action);
		case CYCLE_VIEW_STYLE: return cycleViewStyle(state);
		case VIEW_STYLE_LOADED: return viewStyleLoaded(state, action);
		case SET_NULL_SEARCH_RESULT: return setNullSearchResult(state, action);
		default: return state;
	}
};

export default searchReducer;
