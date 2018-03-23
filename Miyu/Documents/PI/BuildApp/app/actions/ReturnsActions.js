'use strict';

import {
	ORDER_TO_RETURN,
	UPDATE_ITEM_IN_RETURN,
	UPDATE_SHIPPING_METHODS,
} from '../constants/constants';
import { createAction } from 'redux-actions';

const setOrderToReturn = createAction(ORDER_TO_RETURN);

const submitReturn = () => {
	return (dispatch) => {
		dispatch({
			type: 'test',
		});
	};
};

const updateItemInReturn = createAction(UPDATE_ITEM_IN_RETURN);
const updateShippingMethods = createAction(UPDATE_SHIPPING_METHODS);

module.exports = {
	setOrderToReturn,
	submitReturn,
	updateItemInReturn,
	updateShippingMethods,
};
