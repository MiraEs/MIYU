
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
import productConfigurationsActions from '../actions/ProductConfigurationsActions';
import { getRelativeDate } from '../lib/helpers';
import { handleActions } from 'redux-actions';
import tracking from '../lib/analytics/tracking';
import CustomDimensions from '../lib/analytics/CustomDimensions';

const initialState = {
	screenViews: {},
	productsSpecs: {},
	rootCategories: {},
	lastViewedProductCompositeId: 0,
	questionAndAnswerFilter: '',
	reviews: [],
	totalReviews: 0,
	reviewsLoadError: false,
	isLoading: false,
	error: '',
	arProducts: [],
};

function receiveProductReviewsSuccess(state, action) {
	let reviews = [];
	if (action.payload.TotalResults <= 0) {
		return {
			...state,
			isNoReviews: true,
		};
	}
	if (action.payload && action.payload.Results) {
		reviews = action.payload.Results.map((review) => {
			let syndicationSource;
			if (review.IsSyndicated) {
				const { SyndicationSource } = review;
				syndicationSource = {
					name: SyndicationSource.Name,
					imageUrl: SyndicationSource.LogoImageUrl,
				};
			}
			return {
				reviewText: review.ReviewText,
				rating: review.Rating,
				ratingRange: review.RatingRange,
				title: review.Title,
				nickName: review.UserNickname,
				date: getRelativeDate(review.SubmissionTime),
				syndicationSource,
			};
		});
	}

	if (action.payload.Offset > 0) {
		return {
			...state,
			reviews: state.reviews.concat(reviews),
			totalReviews: action.payload.TotalResults,
		};
	}
	return {
		...state,
		totalReviews: action.payload.TotalResults,
		reviews,
	};
}

function receiveProductReviewsFailure(state) {
	return {
		...state,
		totalReviews: 0,
		reviewsLoadError: true,
	};
}

function reviewsResetFailure(state) {
	return {
		...state,
		reviewsLoadError: false,
		isNoReviews: false,
	};
}

function clearReviews(state) {
	return {
		...state,
		reviews: [],
		reviewsLoadError: false,
		isNoReviews: false,
		totalReviews: 0,
	};
}

function setQAndAFilter(state, action) {
	return {
		...state,
		questionAndAnswerFilter: action.term,
	};
}

function setProductSpecFilter(state, action) {
	return {
		...state,
		productSpecFilter: action.text || '',
	};
}

function updateSquareFootage(state, { payload }) {
	return {
		...state,
		screenViews: {
			...state.screenViews,
			[payload.productConfigurationId]: {
				...(state.screenViews[payload.productConfigurationId] || {}),
				squareFootage: payload.squareFootage,
			},
		},
	};
}

function getProductSpecsSuccess(state, action) {
	const productsSpecs = { ...state.productsSpecs };
	productsSpecs[action.compositeId] = action.payload;
	return {
		...state,
		productsSpecs,
	};
}

function getProductSpecsFail(state, action) {
	return {
		...state,
		error: action.error,
	};
}

function saveLastViewedProductCompositeId(state, action) {
	tracking.setCustomDimension(CustomDimensions.COMPOSITE_ID, action.payload);
	return {
		...state,
		lastViewedProductCompositeId: action.payload,
	};
}

function goToImageGalleryIndex(state, { payload }) {
	const {
		productConfigurationId,
		index,
	} = payload;
	return {
		...state,
		screenViews: {
			...state.screenViews,
			[productConfigurationId]: {
				...(state.screenViews[productConfigurationId] || {}),
				imageGalleryIndex: index,
			},
		},
	};
}

function receiveProductRootCategory(state, action) {
	return {
		...state,
		rootCategories: {
			...state.rootCategories,
			[action.payload.compositeId]: { ...action.payload.rootCategory },
		},
	};
}

function updateImageGallerySelectedIndex(state, action) {
	const {
		productComposite,
		uniqueId,
		productConfigurationId,
	} = action.payload;
	let imageGalleryIndex = 0;
	if (uniqueId && productComposite && Array.isArray(productComposite.finishes)) {
		productComposite.finishes.forEach((finish, index) => {
			if (finish && finish.uniqueId === uniqueId) {
				imageGalleryIndex = index;
			}
		});
	}
	return {
		...state,
		screenViews: {
			...state.screenViews,
			[productConfigurationId]: {
				...(state.screenViews[productConfigurationId] || {}),
				imageGalleryIndex,
			},
		},
	};
}

function getArProductsSuccess(state, action) {
	return {
		...state,
		arProducts: action.products,
	};

}

export default handleActions({
	[productConfigurationsActions.createConfiguration]: updateImageGallerySelectedIndex,
	[productConfigurationsActions.setProductConfigurationFinish]: updateImageGallerySelectedIndex,
	[SET_QUESTION_AND_ANSWER_FILTER]: (state, action) => setQAndAFilter(state, action),
	[SET_PRODUCT_SPEC_FILTER]: (state, action) => setProductSpecFilter(state, action),
	[RECEIVE_PRODUCT_REVIEWS_SUCCESS]: (state, action) => receiveProductReviewsSuccess(state, action),
	[RECEIVE_PRODUCT_REVIEWS_FAILURE]: (state) => receiveProductReviewsFailure(state),
	[REVIEWS_RESET_FAILURE]: (state) => reviewsResetFailure(state),
	[UPDATE_SQUARE_FOOTAGE]: (state, action) => updateSquareFootage(state, action),
	[GET_PRODUCT_SPECS_SUCCESS]: (state, action) => getProductSpecsSuccess(state, action),
	[GET_PRODUCT_SPECS_FAIL]: (state, action) => getProductSpecsFail(state, action),
	[GALLERY_GO_TO_INDEX]: (state, action) => goToImageGalleryIndex(state, action),
	[CLEAR_REVIEWS]: (state) => clearReviews(state),
	[SAVE_LAST_VIEWED_PRODUCT_COMPOSITE_ID]: (state, action) => saveLastViewedProductCompositeId(state, action),
	[RECEIVE_PRODUCT_ROOT_CATEGORY]: (state, action) => receiveProductRootCategory(state, action),
	[GET_AR_PRODUCTS_SUCCESS]: getArProductsSuccess,
}, initialState);
