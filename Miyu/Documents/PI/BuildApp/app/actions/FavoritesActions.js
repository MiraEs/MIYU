
import { createAction } from 'redux-actions';
import favoritesService from '../services/FavoritesService';
import helpers from '../lib/helpers';
import {
	LOAD_CUSTOMER_FAVORITES,
	LOAD_CUSTOMER_FAVORITES_SUCCESS,
	LOAD_CUSTOMER_FAVORITES_FAIL,
	LOAD_FAVORITE_COMPOSITE_SUCCESS,
	LOAD_FAVORITE_COMPOSITE_FAIL,
	DELETE_FAVORITE_PRODUCT,
	SAVE_FAVORITE_PRODUCT,
	SAVE_FAVORITE_PRODUCT_SUCCESS,
	SAVE_FAVORITE_PRODUCT_FAIL,
	SAVE_NEW_FAVORITES,
	SAVE_NEW_FAVORITES_SUCCESS,
	UPDATE_FAVORITES_SUCCESS,
	SAVE_FAVORITES_FAIL,
	DELETE_FAVORITES,
	DELETE_FAVORITES_SUCCESS,
	DELETE_FAVORITES_FAIL,
	CLEAR_SAVE_ERROR,
	SET_SHOW_MODAL_PENDING,
} from '../constants/FavoritesConstants';
import tracking from '../lib/analytics/tracking';

function hasValidationError(error) {
	return error && error.code && error.code.indexOf('CONTENT-' === 0);
}

const loadCustomerFavorites = createAction(LOAD_CUSTOMER_FAVORITES);
const loadCustomerFavoritesSuccess = createAction(LOAD_CUSTOMER_FAVORITES_SUCCESS);
const loadCustomerFavoritesFail = createAction(LOAD_CUSTOMER_FAVORITES_FAIL);

function getCustomerFavorites() {
	return (dispatch, getState) => {
		const customerId = getState().userReducer.user.customerId;
		return favoritesService.getFavoritesComposite(customerId).then((payload) => {
			dispatch(loadCustomerFavoritesSuccess({
				favorites: payload,
				currentCustomerId: customerId,
			}));
		}).catch((error) => {
			dispatch(loadCustomerFavoritesFail(error));
			throw new Error(error);
		});
	};
}

const loadFavoriteCompositeSuccess = createAction(LOAD_FAVORITE_COMPOSITE_SUCCESS);
const loadFavoriteCompositeFail = createAction(LOAD_FAVORITE_COMPOSITE_FAIL);

function getFavoriteComposite(favoriteId) {
	return (dispatch, getState) => {
		const customerId = getState().userReducer.user.customerId;
		return favoritesService.getFavoriteComposite(customerId, favoriteId).then((payload) => {
			dispatch(loadFavoriteCompositeSuccess({
				...payload,
				currentCustomerId: customerId,
			}));
		}).catch((error) => {
			dispatch(loadFavoriteCompositeFail(error));
			throw new Error(error);
		});
	};
}

const deleteFavoriteProductStart = createAction(DELETE_FAVORITE_PRODUCT);

function deleteFavoriteProduct(favoriteProduct, reloadFavorites = true) {
	return (dispatch, getState) => {
		dispatch(deleteFavoriteProductStart(favoriteProduct));
		const customerId = getState().userReducer.user.customerId;
		return favoritesService.deleteFavoriteProduct(customerId, favoriteProduct.favoriteProductId).then(() => {
			if (reloadFavorites) {
				dispatch(getCustomerFavorites());
			}
		}).catch(helpers.noop);
	};
}

function saveFavoriteProduct(favoriteId, productUniqueId, productCompositeId, finishes, reloadFavorites = true) {
	return (dispatch, getState) => {
		if (parseInt(favoriteId, 10) === 0) {
			return dispatch(saveNewFavorites(getState().favoritesReducer.favorites[0].name))
			.then((id) => dispatch(saveFavoriteProduct(id, productUniqueId, productCompositeId, reloadFavorites)));
		}
		dispatch({
			type: SAVE_FAVORITE_PRODUCT,
			product: {
				uniqueId: productUniqueId,
				favoriteId,
				productCompositeId,
				finishes,
			},
		});
		tracking.trackFavoriteItem();
		const customerId = getState().userReducer.user.customerId;
		return favoritesService.saveFavoriteProduct(customerId, favoriteId, productCompositeId, productUniqueId).then((payload) => {
			dispatch({
				type: SAVE_FAVORITE_PRODUCT_SUCCESS,
				payload,
			});
			if (reloadFavorites) {
				dispatch(getCustomerFavorites());
			}
		}).catch((error) => {
			dispatch({
				type: SAVE_FAVORITE_PRODUCT_FAIL,
				error: error.message,
			});
		});
	};
}

function updateFavoriteProduct({ favoriteId, compositeId, uniqueId, favoriteProductId }) {
	return (dispatch, getState) => {
		const { customerId } = getState().userReducer.user;
		favoritesService.saveFavoriteProduct(customerId, favoriteId, compositeId, uniqueId, favoriteProductId).then((payload) => {
			dispatch({
				type: SAVE_FAVORITE_PRODUCT_SUCCESS,
				payload,
			});
			dispatch(getCustomerFavorites());
		}).catch((error) => {
			dispatch({
				type: SAVE_FAVORITE_PRODUCT_FAIL,
				error: error.message,
			});
		});
	};
}

function applyFavoritesListSelections(initSelections, selections, compositeId, uniqueId, finishes) {
	return (dispatch, getState) => {
		const favorites = getState().favoritesReducer.favorites;
		const favoriteIds = Object.keys(favorites);
		const added = selections.filter((x) => initSelections.indexOf(x) < 0);
		const removed = initSelections.filter((x) => selections.indexOf(x) < 0);

		added.map((favIndex, mapIndex) => {
			const favoriteId = favoriteIds[favIndex-1];
			dispatch(saveFavoriteProduct(favoriteId, uniqueId, compositeId, finishes, mapIndex === added.length - 1));
		});

		removed.map((favIndex, mapIndex) => {
			const favoriteId = favoriteIds[favIndex-1];
			const favoriteProductId = favorites[favoriteId] ? favorites[favoriteId].productsMap[compositeId].favoriteProductId : undefined;
			dispatch(deleteFavoriteProduct({ favoriteId, favoriteProductId, productCompositeId: compositeId }, mapIndex === removed.length - 1));
		});
	};
}

function saveNewFavorites(name) {
	return (dispatch, getState) => {
		dispatch({
			type: SAVE_NEW_FAVORITES,
		});
		const customerId = getState().userReducer.user.customerId,
			favorite = {
				isPublic: true,
				siteId: 82,
				featured: false,
				favoriteId: null,
				name,
			};
		return favoritesService.saveFavorite(favorite, customerId).then((payload) => {
			const error = payload[0];
			if (hasValidationError(error)) {
				dispatch({
					type: SAVE_FAVORITES_FAIL,
					error: error.message,
				});
			} else if (payload.favoriteId) {
				dispatch({
					type: SAVE_NEW_FAVORITES_SUCCESS,
					favorite: payload,
				});
				return payload.favoriteId;
			} else {
				throw new Error();
			}
		}).catch(() => {
			dispatch({
				type: SAVE_FAVORITES_FAIL,
				error: 'Something went wrong',
			});
		});
	};
}

function updateFavorite({favoriteId, name}) {
	return (dispatch, getState) => {
		const customerId = getState().userReducer.user.customerId,
			favoritePayload = {
				siteId: 82,
				featured: false,
				isPublic: true,
				favoriteId,
				name,
			};
		return favoritesService.saveFavorite(favoritePayload, customerId).then((payload) => {
			const error = payload[0];
			if (hasValidationError(error)) {
				dispatch({
					type: SAVE_FAVORITES_FAIL,
					error: error.message,
				});
			} else if (payload.favoriteId) {
				dispatch({
					type: UPDATE_FAVORITES_SUCCESS,
					favorite: payload,
				});
				return true;
			} else {
				throw new Error();
			}
		}).catch(() => {
			dispatch({
				type: SAVE_FAVORITES_FAIL,
				error: 'Something went wrong',
			});
		});
	};
}

function deleteFavorites(favoriteId) {
	return (dispatch, getState) => {
		dispatch({
			type: DELETE_FAVORITES,
			favoriteId,
		});
		const customerId = getState().userReducer.user.customerId;
		return favoritesService.deleteFavorites(customerId, favoriteId).then((response) => {
			dispatch({
				type: DELETE_FAVORITES_SUCCESS,
				payload: response,
			});
		})
		.catch((error) => {
			dispatch({
				type: DELETE_FAVORITES_FAIL,
				payload: error,
			});
			throw new Error(error);
		});
	};
}

function clearFavoritesSaveError() {
	return (dispatch) => {
		dispatch({
			type: CLEAR_SAVE_ERROR,
		});
	};
}

const setShowModalPending = createAction(SET_SHOW_MODAL_PENDING);

module.exports = {
	loadCustomerFavorites,
	loadCustomerFavoritesSuccess,
	loadCustomerFavoritesFail,
	getCustomerFavorites,
	loadFavoriteCompositeSuccess,
	loadFavoriteCompositeFail,
	getFavoriteComposite,
	deleteFavoriteProductStart,
	deleteFavoriteProduct,
	saveFavoriteProduct,
	applyFavoritesListSelections,
	saveNewFavorites,
	updateFavorite,
	deleteFavorites,
	clearFavoritesSaveError,
	updateFavoriteProduct,
	setShowModalPending,
};
