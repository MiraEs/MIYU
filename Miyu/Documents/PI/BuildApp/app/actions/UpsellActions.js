'use strict';
import { createAction } from 'redux-actions';
import {
	GET_RELATED_UPSELL_PRODUCTS,
	SET_SELECTED_UPSELL_FINISH,
	SET_SELECTED_UPSELL_MODEL,
} from '../constants/UpsellConstants';

const setSelectedFinish = createAction(SET_SELECTED_UPSELL_FINISH);
const getSelectedModel = createAction(SET_SELECTED_UPSELL_MODEL);

function getRelatedUpsellProducts(compositeId, selectedFinish, productConfigurationId) {
	return (dispatch, getState) => {
		const product = getState().productsReducer[compositeId];
		const { finish } = getState().productConfigurationsReducer[productConfigurationId].selectedFinish;
		const { recommendedOptions, accessories } = product;
		return dispatch({
			type: GET_RELATED_UPSELL_PRODUCTS,
			payload: {
				recommendedOptions,
				accessories,
				finish,
			},
		});
	};
}

module.exports = {
	setSelectedFinish,
	getSelectedModel,
	getRelatedUpsellProducts,
};
