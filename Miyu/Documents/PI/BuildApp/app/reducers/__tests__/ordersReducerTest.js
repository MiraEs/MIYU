'use strict';

jest.unmock('../../../app/reducers/ordersReducer');

import ordersReducer from '../ordersReducer';

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
} from '../../constants/constants' ;


import {
	SIGN_USER_OUT,
} from '../../constants/Auth' ;

describe('ordersReducer reducer', () => {

	it('should return initialState', () => {
		expect(ordersReducer(undefined, {})).toMatchSnapshot();
	});


	it('should LOAD_ORDERS', () => {
		const action = {
			type: LOAD_ORDERS,
		};
		const state = ordersReducer(undefined, action);
		expect(
			state
		).toMatchSnapshot();
	});

	it('should LOAD_ORDERS_SUCCESS', () => {
		const action = {
			type: LOAD_ORDERS_SUCCESS,
		};
		const state = ordersReducer(undefined, action);
		expect(
			state
		).toMatchSnapshot();
	});

	it('should LOAD_ORDERS_FAIL', () => {
		const action = {
			type: LOAD_ORDERS_FAIL,
		};
		const state = ordersReducer(undefined, action);
		expect(
			state
		).toMatchSnapshot();
	});

	it('should LOAD_ORDER_DETAILS_SUCCESS', () => {
		const action = {
			type: LOAD_ORDER_DETAILS_SUCCESS,
			order: {
				ordernumber: '1234',
			},
		};
		const state = ordersReducer(undefined, action);
		expect(
			state
		).toMatchSnapshot();
	});

	it('should LOAD_ORDER_DETAILS_FAIL', () => {
		const action = {
			type: LOAD_ORDER_DETAILS_FAIL,
		};
		const state = ordersReducer(undefined, action);
		expect(
			state
		).toMatchSnapshot();
	});

	it('should ADD_PROJECT_ORDER', () => {
		const action = {
			type: ADD_PROJECT_ORDER,
		};
		const state = ordersReducer(undefined, action);
		expect(
			state
		).toMatchSnapshot();
	});

	it('should LOAD_RETURNS', () => {
		const action = {
			type: LOAD_RETURNS,
		};
		const state = ordersReducer(undefined, action);
		expect(
			state
		).toMatchSnapshot();
	});

	it('should LOAD_RETURNS_SUCCESS', () => {
		const action = {
			type: LOAD_RETURNS_SUCCESS,
		};
		const state = ordersReducer(undefined, action);
		expect(
			state
		).toMatchSnapshot();
	});

	it('should LOAD_RETURNS_FAIL', () => {
		const action = {
			type: LOAD_RETURNS_FAIL,
		};
		const state = ordersReducer(undefined, action);
		expect(
			state
		).toMatchSnapshot();
	});

	it('should LOAD_RETURN_DETAILS_SUCCESS', () => {
		const action = {
			type: LOAD_RETURN_DETAILS_SUCCESS,
			returnOrder: {
				returnId: 2,
			},
		};
		const state = ordersReducer(undefined, action);
		expect(
			state
		).toMatchSnapshot();
	});

	it('should LOAD_RETURN_DETAILS_FAIL', () => {
		const action = {
			type: LOAD_RETURN_DETAILS_FAIL,
		};
		const state = ordersReducer(undefined, action);
		expect(
			state
		).toMatchSnapshot();
	});

	it('should LOAD_SHIPPING_INFO_SUCCESS', () => {
		const action = {
			type: LOAD_SHIPPING_INFO_SUCCESS,
			shippingInfo: {
				orderNumber: '1234',
			},
		};
		const state = ordersReducer(undefined, action);
		expect(
			state
		).toMatchSnapshot();
	});

	it('should LOAD_SHIPPING_INFO_FAIL', () => {
		const action = {
			type: LOAD_SHIPPING_INFO_FAIL,
		};
		const state = ordersReducer(undefined, action);
		expect(
			state
		).toMatchSnapshot();
	});

	it('should SIGN_USER_OUT', () => {
		const action = {
			type: SIGN_USER_OUT,
		};
		const state = ordersReducer(undefined, action);
		expect(
			state,
		).toMatchSnapshot();
	});

});
