'use strict';

import customerService from '../services/customerService';

import {
	LOAD_ORDERS,
	LOAD_ORDERS_SUCCESS,
	LOAD_ORDERS_FAIL,
	LOAD_ORDER_DETAILS_SUCCESS,
	LOAD_ORDER_DETAILS_FAIL,
	LOAD_RETURNS,
	LOAD_RETURNS_SUCCESS,
	LOAD_RETURNS_FAIL,
	LOAD_RETURN_DETAILS_SUCCESS,
	LOAD_RETURN_DETAILS_FAIL,
	LOAD_SHIPPING_INFO_SUCCESS,
	LOAD_SHIPPING_INFO_FAIL,
} from '../constants/constants';

function loadOrders(customerId) {
	return (dispatch) => {
		dispatch({ type: LOAD_ORDERS });
		return customerService.getOrders(customerId)
		.then((response) => {
			if (response.error || response.code) {
				throw new Error(response.message);
			}
			dispatch({
				type: LOAD_ORDERS_SUCCESS,
				orders: response,
			});
		})
		.catch((error) => {
			dispatch({
				type: LOAD_ORDERS_FAIL,
				error: error.message,
			});
			return error;
		});
	};
}

function loadOrderDetails(customerId, orderId) {
	return (dispatch) => {
		return customerService.getOrder(customerId, orderId)
		.then((response) => {
			if (response.error || response.code) {
				throw new Error(response.message);
			}
			dispatch({
				type: LOAD_ORDER_DETAILS_SUCCESS,
				order: response,
			});
		})
		.catch((error) => {
			dispatch({
				type: LOAD_ORDER_DETAILS_FAIL,
				error: error.message,
			});
			return error;
		});
	};
}

function loadReturns(customerId) {
	return (dispatch) => {
		dispatch({ type: LOAD_RETURNS });
		return customerService.getReturns(customerId)
		.then((response) => {
			if (response.error || response.code) {
				throw new Error(response.message);
			}
			dispatch({
				type: LOAD_RETURNS_SUCCESS,
				returns: response,
			});
		})
		.catch((error) => {
			dispatch({
				type: LOAD_RETURNS_FAIL,
				error: error.message,
			});
			return error;
		});
	};
}

function loadReturnDetails(customerId, returnId) {
	return (dispatch) => {
		return customerService.getReturn(customerId, returnId)
		.then((response) => {
			if (response.error || response.code) {
				throw new Error(response.message);
			}
			dispatch({
				type: LOAD_RETURN_DETAILS_SUCCESS,
				returnOrder: response,
			});
		})
		.catch((error) => {
			dispatch({
				type: LOAD_RETURN_DETAILS_FAIL,
				error: error.message,
			});
			return error;
		});
	};
}

function getShippingInfo(customerId, orderNumber) {
	return (dispatch) => {
		return customerService.getShippingInfo(customerId, orderNumber).then((response) => {
			dispatch({
				type: LOAD_SHIPPING_INFO_SUCCESS,
				shippingInfo: response,
			});
		})
		.catch((error) => {
			dispatch({
				type: LOAD_SHIPPING_INFO_FAIL,
				error: error.message,
			});
			return error;
		});
	};
}

module.exports = {
	loadOrders,
	loadOrderDetails,
	loadReturns,
	loadReturnDetails,
	getShippingInfo,
};
