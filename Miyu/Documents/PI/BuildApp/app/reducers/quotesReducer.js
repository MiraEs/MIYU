'use strict';
import {
	LOAD_QUOTE_COMPOSITE_SUCCESS,
	LOAD_QUOTE_COMPOSITE_FAIL,
} from '../constants/QuotesConstants';

const initialState = {
	composites: {},
	error: '',
};

const quotesReducer = (state = initialState, action = {}) => {
	switch (action.type) {
		case LOAD_QUOTE_COMPOSITE_SUCCESS:
			return {
				...state,
				composites: {
					...state.composites,
					[action.payload.quoteNumber]: action.payload.composite,
				},
				error: '',
			};
		case LOAD_QUOTE_COMPOSITE_FAIL:
			return {
				...state,
				error: action.payload.message,
			};
		default:
			return state;
	}
};

export default quotesReducer;
