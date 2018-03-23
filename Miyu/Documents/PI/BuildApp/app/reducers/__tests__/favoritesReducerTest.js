import favoritesReducer from '../favoritesReducer';
import {
	LOAD_CUSTOMER_FAVORITES,
	LOAD_CUSTOMER_FAVORITES_SUCCESS,
	LOAD_CUSTOMER_FAVORITES_FAIL,
	PROJECT_SAVE_FAVORITE_SUCCESS,
	DELETE_FAVORITE_PRODUCT,
	SAVE_FAVORITE_PRODUCT,
	SAVE_NEW_FAVORITES_SUCCESS,
	SAVE_FAVORITES_FAIL,
	UPDATE_FAVORITES_SUCCESS,
	CLEAR_SAVE_ERROR,
	DELETE_FAVORITES,
} from '../../constants/FavoritesConstants';

const previousState = {
	favorites: {
		1234: {
			productsMap: {
				4321: {},
			},
			itemCount: 2,
		},
	},
};

describe('favoritesReducer', () => {

	it('should returns initial state', () => {
		expect(favoritesReducer(undefined, {})).toMatchSnapshot();
	});

	it('should return the state for LOAD_CUSTOMER_FAVORITES', () => {
		expect(favoritesReducer(undefined, {
			type: LOAD_CUSTOMER_FAVORITES,
		})).toMatchSnapshot();
	});

	it('should return the state for LOAD_CUSTOMER_FAVORITES_SUCCESS', () => {
		expect(favoritesReducer(undefined, {
			type: LOAD_CUSTOMER_FAVORITES_SUCCESS,
			payload: {
				favorites: [{
					favoriteComposite: {
						favorite: {
							name: 'Test Favorites',
							favoriteId: 1234,
						},
						favoriteProductList: [{
							favoriteProductId: 777,
							productDrops: [{
								finishes: [{
									uniqueId: 2345,
								}],
								productCompositeId: 3456,
								manufacturer: 'TST MFG',
								productId: 456,
								title: 'Test title',
								squareFootageBased: true,
							}],
						}],
					},
				}],
				currentCustomerId: 132,
			},
		})).toMatchSnapshot();
	});

	it('should return the state for LOAD_CUSTOMER_FAVORITES_FAIL', () => {
		expect(favoritesReducer(undefined, {
			type: LOAD_CUSTOMER_FAVORITES_FAIL,
			payload: new Error('Test error'),
			error: true,
		})).toMatchSnapshot();
	});

	it('should return the state for DELETE_FAVORITE_PRODUCT', () => {
		expect(favoritesReducer(previousState, {
			type: DELETE_FAVORITE_PRODUCT,
			payload: {
				favoriteId: 1234,
				productCompositeId: 4321,
			},
		})).toMatchSnapshot();
	});

	it('should return the state for SAVE_FAVORITE_PRODUCT', () => {
		expect(favoritesReducer(previousState, {
			type: SAVE_FAVORITE_PRODUCT,
			product: {
				favoriteId: 1234,
				productCompositeId: 4321,
			},
		})).toMatchSnapshot();
	});

	it('should return the state for PROJECT_SAVE_FAVORITE_SUCCESS', () => {
		expect(favoritesReducer(previousState, {
			type: PROJECT_SAVE_FAVORITE_SUCCESS,
			data: {
				favoriteId: 1234,
			},
		})).toMatchSnapshot();
	});

	it('should return the state for SAVE_NEW_FAVORITES_SUCCESS', () => {
		expect(favoritesReducer(undefined, {
			type: SAVE_NEW_FAVORITES_SUCCESS,
			favorite: {
				favoriteId: 1234,
			},
		})).toMatchSnapshot();
	});

	it('should return the state for CLEAR_SAVE_ERROR', () => {
		expect(favoritesReducer({
			...previousState,
			saveListError: 'HALP!',
		}, {
			type: CLEAR_SAVE_ERROR,
		})).toMatchSnapshot();
	});

	it('should return the state for SAVE_FAVORITES_FAIL', () => {
		expect(favoritesReducer(undefined, {
			type: SAVE_FAVORITES_FAIL,
			error: 'Test error',
		})).toMatchSnapshot();
	});

	it('should return the state for UPDATE_FAVORITES_SUCCESS', () => {
		expect(favoritesReducer(previousState, {
			type: UPDATE_FAVORITES_SUCCESS,
			favorite: {
				favoriteId: 1234,
				name: 'test name',
			},
		})).toMatchSnapshot();
	});

	it('should return the state for DELETE_FAVORITES', () => {
		expect(favoritesReducer(previousState, {
			type: DELETE_FAVORITES,
			favoriteId: 1234,
		})).toMatchSnapshot();
	});

});
