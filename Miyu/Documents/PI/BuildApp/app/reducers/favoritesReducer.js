
import uuid from 'uuid';
import {
	LOAD_CUSTOMER_FAVORITES_SUCCESS,
	LOAD_CUSTOMER_FAVORITES_FAIL,
	LOAD_FAVORITE_COMPOSITE_SUCCESS,
	PROJECT_SAVE_FAVORITE_SUCCESS,
	DELETE_FAVORITE_PRODUCT,
	SAVE_FAVORITE_PRODUCT,
	SAVE_NEW_FAVORITES_SUCCESS,
	SAVE_FAVORITES_FAIL,
	UPDATE_FAVORITES_SUCCESS,
	CLEAR_SAVE_ERROR,
	DELETE_FAVORITES,
	SET_SHOW_MODAL_PENDING,
} from '../constants/FavoritesConstants';
import { SIGN_USER_OUT } from '../constants/Auth';
import tracking from '../lib/analytics/tracking';

export const initialState = {
	error: null,
	saveListError: '',
	showModalPending: 0,
	favorites: {},
};

function getProductConfigurationId({ favorite, compositeId }) {
	let productConfigurationId;
	if (favorite && favorite.productsMap && favorite.productsMap[compositeId]) {
		productConfigurationId = favorite.productsMap[compositeId].productConfigurationId;
	}
	return productConfigurationId || uuid.v4();
}

function formatFavoriteComposite({ favoriteComposite, currentCustomerId, state }) {
	const { favoriteProductList, favoriteUserRole } = favoriteComposite;
	const { name, favoriteId } = favoriteComposite.favorite;
	let itemCount = 0;
	const productsMap = {};
	if (favoriteProductList) {
		itemCount = favoriteProductList.length;
		favoriteProductList.map((product, i) => {
			if (product.productDrops && product.productDrops.length) {
				const item = product.productDrops[0];
				const compositeId = item.productCompositeId;
				let uniqueId;
				if (product.productUniqueId) {
					uniqueId = product.productUniqueId;
				} else if (item.finishes && item.finishes[0]) {
					uniqueId = item.finishes[0].uniqueId;
				}
				if (uniqueId) {
					productsMap[compositeId] = {
						availableByLocation: item.availableByLocation,
						productCompositeId: compositeId,
						favoriteProductId: product.favoriteProductId,
						manufacturer: item.manufacturer,
						productConfigurationId: getProductConfigurationId({
							favorite: state.favorites[favoriteId],
							compositeId,
						}),
						productId: item.productId,
						title: item.title,
						id: i,
						finishes: item.finishes,
						squareFootageBased: item.squareFootageBased || false,
						type: item.type,
						uniqueId,
					};
				} else {
					tracking.trackAction('favoriteProductWithoutFinish', product);
					itemCount--;
				}
			}
		});
	}
	return {
		id: favoriteId,
		isOwner: !!favoriteUserRole && favoriteUserRole.userId === currentCustomerId,
		name,
		itemCount,
		productsMap,
	};
}

function favoritesReducer(state = initialState, action = {}) {
	switch (action.type) {
		case LOAD_CUSTOMER_FAVORITES_SUCCESS:
			const newFavorites = {};
			action.payload.favorites.forEach(({ favoriteComposite }) => {
				newFavorites[favoriteComposite.favorite.favoriteId] = formatFavoriteComposite({
					currentCustomerId: action.payload.currentCustomerId,
					favoriteComposite,
					state,
				});
			});
			return {
				...state,
				error: null,
				favorites: {
					...newFavorites,
				},
			};
		case LOAD_CUSTOMER_FAVORITES_FAIL:
			return {
				...state,
				error: action.payload.message,
			};
		case LOAD_FAVORITE_COMPOSITE_SUCCESS:
			return {
				...state,
				favorites: {
					...state.favorites,
					[action.payload.favorite.favoriteId]: formatFavoriteComposite({
						favoriteComposite: action.payload,
						currentCustomerId: action.payload.currentCustomerId,
						state,
					}),
				},
			};
		case DELETE_FAVORITE_PRODUCT:
			const newProducts = state.favorites[action.payload.favoriteId].productsMap;
			delete newProducts[action.payload.productCompositeId];
			return {
				...state,
				favorites: {
					...state.favorites,
					[action.payload.favoriteId]: {
						...state.favorites[action.payload.favoriteId],
						itemCount: state.favorites[action.payload.favoriteId].itemCount - 1,
						productsMap: newProducts,
					},
				},
			};
		case SAVE_FAVORITE_PRODUCT:
			const favoriteList = state.favorites[action.product.favoriteId];
			let productsMap = {
				[action.product.productCompositeId]: action.product,
			};
			let itemCount = 1;
			if (favoriteList) {
				itemCount = state.favorites[action.product.favoriteId].itemCount + 1;
				productsMap = {
					...state.favorites[action.product.favoriteId].productsMap,
					[action.product.productCompositeId]: action.product,
				};
			}
			return {
				...state,
				favorites: {
					...state.favorites,
					[action.product.favoriteId]: {
						...state.favorites[action.product.favoriteId],
						productsMap,
						itemCount,
					},
				},
			};
		case PROJECT_SAVE_FAVORITE_SUCCESS:
			return {
				...state,
				favorites: {
					...state.favorites,
					[action.data.favoriteId]: {
						...state.favorites[action.data.favoriteId],
						selected: true,
					},
				},
			};
		case SAVE_NEW_FAVORITES_SUCCESS:
			return {
				...state,
				favorites: {
					...state.favorites,
					[action.favorite.favoriteId]: {
						...action.favorite,
						productsMap: {},
					},
				},
				saveListError: '',
			};
		case CLEAR_SAVE_ERROR:
			return {
				...state,
				saveListError: '',
			};
		case SAVE_FAVORITES_FAIL:
			return {
				...state,
				saveListError: action.error,
			};
		case UPDATE_FAVORITES_SUCCESS:
			return {
				...state,
				favorites: {
					...state.favorites,
					[action.favorite.favoriteId]: {
						...state.favorites[action.favorite.favoriteId],
						name: action.favorite.name,
					},
				},
				saveListError: '',
			};
		case DELETE_FAVORITES:
			const nextFavorites = state.favorites;
			delete nextFavorites[action.favoriteId];
			return {
				...state,
				favorites: { ...nextFavorites },
			};
		case SET_SHOW_MODAL_PENDING:
			return {
				...state,
				showModalPending: action.payload,
			};
		case SIGN_USER_OUT:
			return {
				...initialState,
			};
		default:
			return state;
	}
}

export default favoritesReducer;
