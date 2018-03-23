
const dispatch = jest.fn();
const getState = jest.fn(() => ({
	userReducer: {
		user: {
			customerId: 777,
		},
	},
	favoritesReducer: {
		favorites: {
			3: {
				productsMap: {
					1: {
						favoriteProductId: 2,
					},
				},
			},
		},
	},
}));

jest.mock('redux-actions');
jest.mock('../../../app/lib/analytics/tracking', () => ({
	trackFavoriteItem: jest.fn(),
}));

jest.unmock('../../../app/actions/FavoritesActions');
import favoritesActions from '../FavoritesActions';

jest.mock('../../../app/services/FavoritesService', () => ({
	getFavoritesComposite: jest.fn(() => Promise.resolve({})),
	getFavoriteComposite: jest.fn(() => Promise.resolve({})),
	deleteFavoriteProduct: jest.fn(() => Promise.resolve({})),
	saveFavoriteProduct: jest.fn(() => Promise.resolve({})),
	saveFavorite: jest.fn(() => Promise.resolve({})),
	deleteFavorites: jest.fn(() => Promise.resolve({})),
}));
import favoritesService from '../../services/FavoritesService';

describe('FavoritesActions', () => {

	afterEach(() => {
		dispatch.mockClear();
		favoritesService.getFavoritesComposite.mockClear();
		favoritesService.getFavoriteComposite.mockClear();
		favoritesService.deleteFavoriteProduct.mockClear();
		favoritesService.saveFavoriteProduct.mockClear();
		favoritesService.saveFavorite.mockClear();
		favoritesService.deleteFavorites.mockClear();
	});

	describe('loadCustomerFavorites', () => {
		it('should return an object', () => {
			const result = favoritesActions.loadCustomerFavorites({});
			expect(result).toEqual({
				type: 'LOAD_CUSTOMER_FAVORITES',
				payload: {},
			});
		});
	});

	describe('loadCustomerFavoritesSuccess', () => {
		it('should return an object', () => {
			const result = favoritesActions.loadCustomerFavoritesSuccess({});
			expect(result).toEqual({
				type: 'LOAD_CUSTOMER_FAVORITES_SUCCESS',
				payload: {},
			});
		});
	});

	describe('loadCustomerFavoritesFail', () => {
		it('should return an object', () => {
			const error = new Error('test');
			const result = favoritesActions.loadCustomerFavoritesFail(error);
			expect(result).toEqual({
				type: 'LOAD_CUSTOMER_FAVORITES_FAIL',
				payload: error,
				error: true,
			});
		});
	});

	describe('getCustomerFavorites', () => {
		it('should return a function and call favoritesService.getFavoritesComposite', () => {
			favoritesActions.getCustomerFavorites()(dispatch, getState);
			expect(favoritesService.getFavoritesComposite).toBeCalledWith(777);
		});
	});

	describe('loadFavoriteCompositeSuccess', () => {
		it('should return an object', () => {
			const result = favoritesActions.loadFavoriteCompositeSuccess({});
			expect(result).toEqual({
				type: 'LOAD_FAVORITE_COMPOSITE_SUCCESS',
				payload: {},
			});
		});
	});

	describe('loadFavoriteCompositeFail', () => {
		it('should return an object', () => {
			const error = new Error('test');
			const result = favoritesActions.loadFavoriteCompositeFail(error);
			expect(result).toEqual({
				type: 'LOAD_FAVORITE_COMPOSITE_FAIL',
				payload: error,
				error: true,
			});
		});
	});

	describe('getFavoriteComposite', () => {
		it('should return a function and call favoritesService.getFavoriteComposite', () => {
			favoritesActions.getFavoriteComposite(3)(dispatch, getState);
			expect(favoritesService.getFavoriteComposite).toBeCalledWith(777, 3);
		});
	});

	describe('deleteFavoriteProductStart', () => {
		it('should return an object', () => {
			const result = favoritesActions.deleteFavoriteProductStart({});
			expect(result).toEqual({
				type: 'DELETE_FAVORITE_PRODUCT',
				payload: {},
			});
		});
	});

	describe('deleteFavoriteProduct', () => {
		it('should return a function and call favoritesService.deleteFavoriteProduct', () => {
			const favoriteProduct = {
				favoriteProductId: 6,
			};
			favoritesActions.deleteFavoriteProduct(favoriteProduct)(dispatch, getState);
			expect(favoritesService.deleteFavoriteProduct).toBeCalledWith(777, 6);
		});
	});

	describe('saveFavoriteProduct', () => {
		it('should return a function and call favoritesService.saveFavoriteProduct', () => {
			favoritesActions.saveFavoriteProduct(1, 2, 3)(dispatch, getState);
			expect(favoritesService.saveFavoriteProduct).toBeCalledWith(777, 1, 3, 2);
		});
	});

	describe('applyFavoritesListSelections', () => {

		beforeEach(() => {
			dispatch.mockClear();
		});

		it('should return a function and not call dispatch', () => {
			favoritesActions.applyFavoritesListSelections([], [], 2, 3, [])(dispatch, getState);
			expect(dispatch).not.toBeCalled();
		});

		it('should call saveFavoriteProductSpy and deleteFavoriteProductSpy', () => {
			const initSelections = [];
			const selections = [3];
			const finishes = [];
			favoritesActions.applyFavoritesListSelections(initSelections, selections, 2, 3, finishes)(dispatch, getState);
			expect(dispatch).toBeCalled();
		});
	});

	describe('saveNewFavorites', () => {
		it('should return a function', () => {
			favoritesActions.saveNewFavorites('name')(dispatch, getState);
			expect(favoritesService.saveFavorite).toBeCalledWith({
				favoriteId: null,
				isPublic: true,
				siteId: 82,
				name: 'name',
				featured: false,
			}, 777);
		});
	});

	describe('updateFavorite', () => {
		it('should return a function', () => {
			favoritesActions.updateFavorite({
				favoriteId: 2,
				name: 'name',
			})(dispatch, getState);
			expect(favoritesService.saveFavorite).toBeCalledWith({
				siteId: 82,
				featured: false,
				isPublic: true,
				favoriteId: 2,
				name: 'name',
			}, 777);
		});
	});

	describe('deleteFavorites', () => {
		it('should return a function', () => {
			favoritesActions.deleteFavorites(1)(dispatch, getState);
			expect(favoritesService.deleteFavorites).toBeCalledWith(777, 1);
		});
	});

	describe('clearFavoritesSaveError', () => {
		it('should return a function', () => {
			favoritesActions.clearFavoritesSaveError()(dispatch);
			expect(dispatch).toBeCalledWith({
				type: 'CLEAR_SAVE_ERROR',
			});
		});
	});

});
