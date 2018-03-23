import {
	LOAD_CONTENT,
	LOAD_CONTENT_SUCCESS,
	LOAD_CONTENT_FAIL,
	LOAD_SHARED_PROMO_SUCCESS,
	LOAD_SHARED_PROMO_FAIL,
	LOAD_CONTENT_GROUP_SUCCESS,
	LOAD_CONTENT_GROUP_FAIL,
	LOAD_ROUTE_PAGE,
	LOAD_ROUTE_PAGE_SUCCESS,
	LOAD_ROUTE_PAGE_FAIL,
	LOAD_NAMED_SHARED_ITEM_SUCCESS,
	LOAD_NAMED_SHARED_ITEM_FAIL,
} from '../constants/ContentConstants';
import { createAction } from 'redux-actions';
import contentService from '../services/ContentService';

const loadContent = createAction(LOAD_CONTENT);
const loadContentSuccess = createAction(LOAD_CONTENT_SUCCESS);
const loadContentFail = createAction(LOAD_CONTENT_FAIL);

const loadSharedPromoSuccess = createAction(LOAD_SHARED_PROMO_SUCCESS);
const loadSharedPromoFail = createAction(LOAD_SHARED_PROMO_FAIL);

const loadContentGroupSuccess = createAction(LOAD_CONTENT_GROUP_SUCCESS);
const loadContentGroupFail = createAction(LOAD_CONTENT_GROUP_FAIL);

const loadRoutePage = createAction(LOAD_ROUTE_PAGE);
const loadRoutePageSuccess = createAction(LOAD_ROUTE_PAGE_SUCCESS);
const loadRoutePageFail = createAction(LOAD_ROUTE_PAGE_FAIL);

const loadNamedSharedItemSuccess = createAction(LOAD_NAMED_SHARED_ITEM_SUCCESS);
const loadNamedSharedItemFail = createAction(LOAD_NAMED_SHARED_ITEM_FAIL);

function getContent(id, type) {
	return (dispatch) => {
		dispatch(loadContent({ id }));
		contentService.getContent(id, type)
		.then((response) => {
			dispatch(loadContentSuccess({
				...response,
				id,
			}));
		})
		.catch((error) => {
			dispatch(loadContentFail({
				error,
				id,
			}));
		});
	};
}

function getSharedPromos(categoryId) {
	return (dispatch) => {
		contentService.getSharedPromos(categoryId)
		.then((response) => {
			dispatch(loadSharedPromoSuccess({
				...response,
				categoryId,
			}));
		})
		.catch((error) => {
			dispatch(loadSharedPromoFail(error));
		});
	};
}

function getContentGroup(type) {
	return (dispatch) => {
		contentService.getContentGroup(type)
		.then((response) => {
			dispatch(loadContentGroupSuccess({
				...response,
				type,
			}));
		})
		.catch((error) => {
			dispatch(loadContentGroupFail(error));
		});
	};
}

function getNamedSharedItem(name) {
	return async (dispatch) => {
		try {
			const response = await contentService.getNamedSharedItem(name);
			dispatch(loadNamedSharedItemSuccess({
				...response,
				name,
			}));
		} catch (error) {
			dispatch(loadNamedSharedItemFail({
				name,
				error,
			}));
		}
	};
}

function getRoutePage(route) {
	return (dispatch) => {
		dispatch(loadRoutePage({ route }));
		return contentService.getRoutePage(route)
			.then((response) => {
				if (response.status && parseInt(response.status, 10) >= 500 && parseInt(response.status, 10) < 600) {
					dispatch(loadRoutePageFail({
						error: response.error || response.status,
						route,
					}));
				} else if (!response.data.length) {
					dispatch(loadRoutePageFail({
						error: 'No content found at route',
						route,
					}));
				} else {
					dispatch(loadRoutePageSuccess({
						...response,
						route,
					}));
				}
			});
	};
}

module.exports = {
	getContent,
	getSharedPromos,
	getContentGroup,
	getRoutePage,
	getNamedSharedItem,
	loadRoutePageFail,
	loadRoutePageSuccess,
};
