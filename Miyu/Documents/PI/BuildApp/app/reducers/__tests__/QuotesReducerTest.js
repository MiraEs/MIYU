'use strict';

import quotesReducer from '../quotesReducer';
import {
	LOAD_QUOTE_COMPOSITE_SUCCESS,
	LOAD_QUOTE_COMPOSITE_FAIL,
} from '../../constants/QuotesConstants';

const previousState = {
	composites: {},
	error: '',
};

describe('quotesReducer', () => {

	it('should return initial state', () => {
		expect(quotesReducer(undefined, {})).toMatchSnapshot();
	});

	it('should return the state for LOAD_QUOTE_COMPOSITE_SUCCESS', () => {
		expect(quotesReducer(previousState, {
			type: LOAD_QUOTE_COMPOSITE_SUCCESS,
			payload: {
				quoteNumber: 1234,
				composite: {},
			},
		})).toMatchSnapshot();
	});

	it('should return the state for LOAD_QUOTE_COMPOSITE_FAIL', () => {
		expect(quotesReducer(previousState, {
			type: LOAD_QUOTE_COMPOSITE_FAIL,
			payload: new Error('Test error'),
		})).toMatchSnapshot();
	});

});


