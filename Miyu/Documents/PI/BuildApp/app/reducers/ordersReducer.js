'use strict';

import {
	LOAD_ORDERS,
	LOAD_ORDERS_SUCCESS,
	LOAD_ORDERS_FAIL,

	LOAD_ORDER_DETAILS_SUCCESS,
	LOAD_ORDER_DETAILS_FAIL,

	ADD_PROJECT_ORDER,

	LOAD_RETURNS,
	LOAD_RETURNS_SUCCESS,
	LOAD_RETURNS_FAIL,

	LOAD_RETURN_DETAILS_SUCCESS,
	LOAD_RETURN_DETAILS_FAIL,

	LOAD_SHIPPING_INFO_SUCCESS,
	LOAD_SHIPPING_INFO_FAIL,

} from '../constants/constants';
import { SIGN_USER_OUT } from '../constants/Auth';

const initialState = {
	orders: [],
	loadingOrders: true,
	orderDetails: {},
	returns: [],
	loadingReturns: true,
	returnDetails: {},
	shippingInfo: {},
	errors: {
		loadOrders: null,
		loadOrderDetails: null,
		loadReturns: null,
		loadReturnDetails: null,
		loadShippingInfo: null,
	},
};

const ordersReducer = (state = initialState, action = {}) => {
	switch (action.type) {
		case LOAD_ORDERS:
			return {
				...state,
				loadingOrders: true,
			};
		case LOAD_ORDERS_SUCCESS:
			return {
				...state,
				loadingOrders: false,
				orders: action.orders,
				errors: {
					...state.errors,
					loadOrders: null,
				},
			};
		case LOAD_ORDERS_FAIL:
			return {
				...state,
				loadingOrders: false,
				errors: {
					...state.errors,
					loadOrders: action.error,
				},
			};
		case LOAD_ORDER_DETAILS_SUCCESS:
			return {
				...state,
				orderDetails: {
					...state.orderDetails,
					[action.order.orderNumber]: action.order,
				},
				errors: {
					...state.errors,
					loadOrderDetails: null,
				},
			};
		case LOAD_ORDER_DETAILS_FAIL:
			return {
				...state,
				errors: {
					...state.errors,
					loadOrderDetails: action.error,
				},
			};
		case LOAD_RETURNS:
			return {
				...state,
				loadingReturns: true,
			};
		case LOAD_RETURNS_SUCCESS:
			return {
				...state,
				loadingReturns: false,
				returns: action.returns,
				errors: {
					...state.errors,
					loadReturns: null,
				},
			};
		case LOAD_RETURNS_FAIL:
			return {
				...state,
				loadingReturns: false,
				errors: {
					...state.errors,
					loadReturns: action.error,
				},
			};
		case LOAD_RETURN_DETAILS_SUCCESS:
			return {
				...state,
				returnDetails: {
					...state.returnDetails,
					[action.returnOrder.returnId]: action.returnOrder,
				},
				errors: {
					...state.errors,
					loadReturnDetails: null,
				},
			};
		case LOAD_RETURN_DETAILS_FAIL:
			return {
				...state,
				errors: {
					...state.errors,
					loadReturnDetails: action.error,
				},
			};
		case LOAD_SHIPPING_INFO_SUCCESS:
			return {
				...state,
				shippingInfo: {
					...state.shippingInfo,
					[action.shippingInfo.orderNumber]: action.shippingInfo,
				},
				errors: {
					...state.errors,
					loadShippingInfo: null,
				},
			};
		case LOAD_SHIPPING_INFO_FAIL:
			return {
				...state,
				errors: {
					...state.errors,
					loadShippingInfo: action.error,
				},
			};
		case ADD_PROJECT_ORDER:
			const orders = state.orders.map((order) => {
				if (action.order.orderNumber === order.orderNumber) {
					order.selected = true;
				}
				return order;
			});
			return {
				...state,
				orders,
			};
		case SIGN_USER_OUT:
			return initialState;
		default:
			return state;
	}
};

export default ordersReducer;
