
jest.mock('../../../app/actions/ProductConfigurationsActions', () => ({}));
jest.mock('../../../app/lib/analytics/tracking', () => ({setCustomDimension : jest.fn() }));
jest.mock('../../../app/lib/analytics/CustomDimensions', () => ({}));

jest.unmock('../../../app/reducers/productDetailReducer');
import productDetailReducer from '../productDetailReducer';

import {
	SET_PRODUCT_SPEC_FILTER,
	SET_QUESTION_AND_ANSWER_FILTER,
	RECEIVE_PRODUCT_REVIEWS_SUCCESS,
	RECEIVE_PRODUCT_REVIEWS_FAILURE,
	REVIEWS_RESET_FAILURE,
	CLEAR_REVIEWS,
	UPDATE_SQUARE_FOOTAGE,
	GET_PRODUCT_SPECS_SUCCESS,
	GET_PRODUCT_SPECS_FAIL,
	SAVE_LAST_VIEWED_PRODUCT_COMPOSITE_ID,
	RECEIVE_PRODUCT_ROOT_CATEGORY,
} from '../../constants/productDetailConstants' ;

import {
	SEARCH_SUCCESS,
} from '../../constants/searchConstants' ;

import {
	GALLERY_GO_TO_INDEX,
} from '../../constants/constants' ;



const initialState = {
	productsSpecs: {},
	rootCategories: {},
	lastViewedProductCompositeId: 0,
	questionAndAnswerFilter: '',
	reviews: [],
	totalReviews: 0,
	reviewsLoadError: false,
	isLoading: false,
	screenViews: {},
	error: '',
};


describe('productDetailReducer reducer', () => {

	it('should return initialState', () => {
		expect(productDetailReducer(undefined, {})).toMatchSnapshot();
	});

	it('should SET_PRODUCT_SPEC_FILTER', () => {
		const action = {
			type: SET_PRODUCT_SPEC_FILTER,
		};
		const state = productDetailReducer(initialState, action);
		expect(
			state
		).toMatchSnapshot();
	});

	it('should SET_QUESTION_AND_ANSWER_FILTER', () => {
		const action = {
			type: SET_QUESTION_AND_ANSWER_FILTER,
		};
		const state = productDetailReducer(initialState, action);
		expect(
			state
		).toMatchSnapshot();
	});

	it('should RECEIVE_PRODUCT_REVIEWS_SUCCESS', () => {
		const action = {
			type: RECEIVE_PRODUCT_REVIEWS_SUCCESS,
			compositeId: '1234',
			payload: {
				TotalResults: 0,
			},
		};
		const state = productDetailReducer(initialState, action);
		expect(
			state
		).toMatchSnapshot();
	});

	it('should RECEIVE_PRODUCT_REVIEWS_FAILURE', () => {
		const action = {
			type: RECEIVE_PRODUCT_REVIEWS_FAILURE,
		};
		const state = productDetailReducer(initialState, action);
		expect(
			state
		).toMatchSnapshot();
	});

	it('should REVIEWS_RESET_FAILURE', () => {
		const action = {
			type: REVIEWS_RESET_FAILURE,
		};
		const state = productDetailReducer(initialState, action);
		expect(
			state
		).toMatchSnapshot();
	});

	it('should CLEAR_REVIEWS', () => {
		const action = {
			type: CLEAR_REVIEWS,
		};
		const state = productDetailReducer(initialState, action);
		expect(
			state
		).toMatchSnapshot();
	});

	it('should UPDATE_SQUARE_FOOTAGE', () => {
		const action = {
			type: UPDATE_SQUARE_FOOTAGE,
			payload: {
				compositeId: '1234',
				squareFootage: 100,
				productConfigurationId: 'u-u-i-d',
			},
		};
		const state = productDetailReducer(initialState, action);
		expect(
			state
		).toMatchSnapshot();
	});

	it('should GET_PRODUCT_SPECS_SUCCESS', () => {
		const action = {
			type: GET_PRODUCT_SPECS_SUCCESS,
		};
		const state = productDetailReducer(initialState, action);
		expect(
			state
		).toMatchSnapshot();
	});

	it('should GET_PRODUCT_SPECS_FAIL', () => {
		const action = {
			type: GET_PRODUCT_SPECS_FAIL,
		};
		const state = productDetailReducer(initialState, action);
		expect(
			state
		).toMatchSnapshot();
	});

	it('should SAVE_LAST_VIEWED_PRODUCT_COMPOSITE_ID', () => {
		const action = {
			type: SAVE_LAST_VIEWED_PRODUCT_COMPOSITE_ID,
		};
		const state = productDetailReducer(initialState, action);
		expect(
			state
		).toMatchSnapshot();
	});

	it('should RECEIVE_PRODUCT_ROOT_CATEGORY', () => {
		const action = {
			type: RECEIVE_PRODUCT_ROOT_CATEGORY,
			payload: {
				compositeId: '1234',
				rootCategory: '1',
			},

		};
		const state = productDetailReducer(initialState, action);
		expect(
			state
		).toMatchSnapshot();
	});

	it('should SEARCH_SUCCESS', () => {
		const action = {
			type: SEARCH_SUCCESS,
		};
		const state = productDetailReducer(initialState, action);
		expect(
			state
		).toMatchSnapshot();
	});

	it('should GALLERY_GO_TO_INDEX', () => {
		const action = {
			type: GALLERY_GO_TO_INDEX,
			payload: {
				productConfigurationId: 'u-u-i-d',
				index: 7,
			},
		};
		const state = productDetailReducer(initialState, action);
		expect(
			state
		).toMatchSnapshot();
	});

});
