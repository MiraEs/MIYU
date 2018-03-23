import {
	LOAD_CONTENT,
	LOAD_CONTENT_SUCCESS,
	LOAD_CONTENT_FAIL,
	LOAD_SHARED_PROMO_SUCCESS,
	LOAD_CONTENT_GROUP_SUCCESS,
	LOAD_ROUTE_PAGE,
	LOAD_ROUTE_PAGE_SUCCESS,
	LOAD_ROUTE_PAGE_FAIL,
	LOAD_NAMED_SHARED_ITEM_SUCCESS,
	LOAD_NAMED_SHARED_ITEM_FAIL,
} from '../constants/ContentConstants';

const initialState = {

	// content includes
	categoryIncludes: {},
	favoriteIncludes: {},
	productIncludes: {},
	profileIncludes: {},
	tagIncludes: {},
	userIncludes: {},
	videoIncludes: {},

	// content items
	contentItems: {},
	routePages: {},
	sharedPromos: {},
	namedSharedItems: {},

	errors: {},

};

const updateIncludes = (state, composite) => {
	if (!composite) {
		return state;
	}
	for (const subCompositeId in composite.contentItemCompositeIncludes) {
		if (composite.contentItemCompositeIncludes[subCompositeId]) { // Sonarqube requires this check...
			const newState = updateIncludes(state, composite.contentItemCompositeIncludes[subCompositeId]);
			state = {
				...newState,
				contentItems: {
					...newState.contentItems,
					[subCompositeId]: composite.contentItemCompositeIncludes[subCompositeId].contentItem,
				},
			};
		}
	}

	const categoryIncludes = {...state.categoryIncludes};
	for (const storeId in composite.categoryIncludes) {
		if (composite.categoryIncludes[storeId]) {
			categoryIncludes[storeId] = {
				...composite.categoryIncludes[storeId],
				...state.categoryIncludes[storeId],
			};
		}
	}
	return {
		...state,
		categoryIncludes,
		favoriteIncludes: {
			...state.favoriteIncludes,
			...composite.favoriteIncludes,
		},
		productIncludes: {
			...state.productIncludes,
			...composite.productIncludes,
		},
		profileIncludes: {
			...state.profileIncludes,
			...composite.profileIncludes,
		},
		tagIncludes: {
			...state.tagIncludes,
			...composite.tagIncludes,
		},
		userIncludes: {
			...state.userIncludes,
			...composite.userIncludes,
		},
		videoIncludes: {
			...state.videoIncludes,
			...composite.videoIncludes,
		},
	};
};

const contentReducer = (state = initialState, action = {}) => {
	switch (action.type) {
		case LOAD_CONTENT:
			return {
				...state,
				errors: {
					...state.errors,
					[action.payload.id]: null,
				},
			};
		case LOAD_CONTENT_SUCCESS:
			if (action.payload.data) {
				return {
					...updateIncludes(state, action.payload.data[0]),
					contentItems: {
						...state.contentItems,
						[action.payload.id]: action.payload.data[0].contentItem,
					},
				};
			}
			return state;
		case LOAD_CONTENT_FAIL:
			return {
				...state,
				errors: {
					...state.errors,
					[action.payload.id]: action.payload.error,
				},
			};
		case LOAD_SHARED_PROMO_SUCCESS:
			return {
				...updateIncludes(state, action.payload.data[0]),
				sharedPromos: {
					...state.sharedPromos,
					[action.payload.categoryId]: action.payload.data.map((promo) => promo.contentItem),
				},
			};
		case LOAD_NAMED_SHARED_ITEM_SUCCESS:
			return {
				...updateIncludes(state, action.payload.data[0]),
				namedSharedItems: {
					...state.namedSharedItems,
					[action.payload.name]: action.payload.data.map((sharedItem) => sharedItem.contentItem),
				},
			};
		case LOAD_NAMED_SHARED_ITEM_FAIL:
			return {
				...state,
				errors: {
					...state.errors,
					[action.payload.name]: action.payload.error,
				},
			};
		case LOAD_CONTENT_GROUP_SUCCESS:
			return {
				...state,
				[action.payload.type]: action.payload.data,
			};
		case LOAD_ROUTE_PAGE:
			return {
				...state,
				errors: {
					...state.errors,
					[action.payload.route]: null,
				},
			};
		case LOAD_ROUTE_PAGE_SUCCESS:
			return {
				...updateIncludes(state, action.payload.data[0]),
				routePages: {
					...state.routePages,
					[action.payload.route]: action.payload.data[0].contentItem || {},
				},
			};
		case LOAD_ROUTE_PAGE_FAIL:
			return {
				...state,
				errors: {
					...state.errors,
					[action.payload.route]: action.payload.error,
				},
			};
		default:
			return state;
	}
};

export default contentReducer;
