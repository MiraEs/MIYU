'use strict';
import {
	LOAD_QUOTE_COMPOSITE_SUCCESS,
	LOAD_QUOTE_COMPOSITE_FAIL,
} from '../constants/QuotesConstants';
import quotesService from '../services/quotesService';
import { createAction } from 'redux-actions';

const loadQuoteCompositeSuccess = createAction(LOAD_QUOTE_COMPOSITE_SUCCESS);
const loadQuoteCompositeFail = createAction(LOAD_QUOTE_COMPOSITE_FAIL);

function getQuoteComposite(quoteNumber) {
	return (dispatch) => {
		quotesService.getQuoteComposite(quoteNumber)
		.then((composite) => {
			dispatch(loadQuoteCompositeSuccess({ quoteNumber, composite }));
		})
		.catch((error) => {
			dispatch(loadQuoteCompositeFail(error));
		});
	};
}

module.exports = {
	getQuoteComposite,
};

