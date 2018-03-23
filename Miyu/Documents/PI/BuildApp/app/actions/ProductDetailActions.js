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
	GET_AR_PRODUCTS_SUCCESS,
} from '../constants/productDetailConstants';
import {
	GALLERY_GO_TO_INDEX,
} from '../constants/constants';
import productService from '../services/productService';
import helpers from '../lib/helpers';
import { createAction } from 'redux-actions';

const updateSquareFootage = createAction(UPDATE_SQUARE_FOOTAGE);

const saveLastViewedProductCompositeId = createAction(SAVE_LAST_VIEWED_PRODUCT_COMPOSITE_ID);

const receiveProductRootCategory = createAction(RECEIVE_PRODUCT_ROOT_CATEGORY, (data) => {
	return { ...data };
});

function getProductRootCategory(compositeId) {
	return (dispatch) => {
		return productService.getProductRootCategory(compositeId)
		.then((payload) => {
			helpers.serviceErrorCheck(payload);
			dispatch(receiveProductRootCategory({
				compositeId,
				rootCategory: payload,
			}));
			return payload;
		}).catch((error) => {
			throw new Error(error);
		});
	};
}

function setProductQAndAFilter(term) {
	return {
		type: SET_QUESTION_AND_ANSWER_FILTER,
		term,
	};
}

function setProductSpecFilter(text) {
	return {
		type: SET_PRODUCT_SPEC_FILTER,
		text,
	};
}

function getProductReviews(options) {
	return (dispatch) => {
		dispatch({
			type: REVIEWS_RESET_FAILURE,
		});
		return productService.getReviews(options)
		.then((payload) => {
			dispatch({
				type: RECEIVE_PRODUCT_REVIEWS_SUCCESS,
				payload,
			});
		}).catch((error) => {
			dispatch({
				type: RECEIVE_PRODUCT_REVIEWS_FAILURE,
				error,
			});
		});
	};
}

function clearReviews() {
	return (dispatch) => {
		return dispatch({
			type: CLEAR_REVIEWS,
		});
	};
}

function getProductSpecs(compositeId) {
	return (dispatch) => {
		return productService.getProductSpecs(compositeId)
		.then((payload) => {
			dispatch({
				type: GET_PRODUCT_SPECS_SUCCESS,
				payload,
				compositeId,
			});
		})
		.catch((error) => {
			dispatch({
				type: GET_PRODUCT_SPECS_FAIL,
				error: error.message,
			});
		});
	};
}

const goToGalleryIndex = createAction(GALLERY_GO_TO_INDEX);

function getArProducts() {
	return (dispatch) => {
		return productService.getArProducts()
		.then((products) => {
			dispatch({
				type: GET_AR_PRODUCTS_SUCCESS,
				products,
			});
		});
	};
}

module.exports = {
	clearReviews,
	getProductReviews,
	getProductRootCategory,
	getProductSpecs,
	goToGalleryIndex,
	receiveProductRootCategory,
	saveLastViewedProductCompositeId,
	setProductQAndAFilter,
	setProductSpecFilter,
	updateSquareFootage,
	getArProducts,
};
