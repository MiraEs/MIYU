'use strict';

jest.unmock('../../../app/reducers/checkoutReducer');

import checkoutReducer from '../checkoutReducer';

import {
	UPDATE_CREDIT_CARD,
	UPDATE_SHIPPING_ADDRESS_ID,
	GET_CREDIT_CARDS,
	USE_CREDIT_CARD,
	UPDATE_BILLING_ADDRESS_ID,
	CHECKOUT_SUCCESS,
	DELETE_CREDIT_CARD_SUCCESS,
	DELETE_CREDIT_CARD_FAIL,
	CREDIT_CARD,
	PAYPAL,
	CREATE_PAYPAL_PAYMENT_SUCCESS,
	AUTHORIZE_PAYPAL_PAYMENT_SUCCESS,
	CLEAR_CREDIT_CARD,
	CLEAR_PAYPAL,
	LOADING_CHECKOUT,
} from '../../constants/CheckoutConstants' ;

import {
	SIGN_USER_OUT,
} from '../../constants/Auth';


describe('checkoutReducer reducer', () => {

	it('should return initialState', () => {
		expect(checkoutReducer(undefined, {})).toMatchSnapshot();
	});


	it('should UPDATE_CREDIT_CARD', () => {
		const action = {
			type: UPDATE_CREDIT_CARD,
			creditCard: {
				cardNumber: '4111111111111111',
				cvv: '123',
				expDate: '12/33',
				nameOnCard: 'Testy McTesty',
			},
		};
		const state = checkoutReducer(undefined, action);
		expect(
			state
		).toMatchSnapshot();
	});

	it('should UPDATE_SHIPPING_ADDRESS_ID', () => {
		const action = {
			type: UPDATE_SHIPPING_ADDRESS_ID,
		};
		const state = checkoutReducer(undefined, action);
		expect(
			state
		).toMatchSnapshot();
	});

	it('should GET_CREDIT_CARDS', () => {
		const action = {
			type: GET_CREDIT_CARDS,
			creditCards: [],
		};
		const state = checkoutReducer(undefined, action);
		expect(
			state
		).toMatchSnapshot();
	});

	it('should USE_CREDIT_CARD', () => {
		const action = {
			type: USE_CREDIT_CARD,
		};
		const state = checkoutReducer(undefined, action);
		expect(
			state
		).toMatchSnapshot();
	});

	it('should UPDATE_BILLING_ADDRESS_ID', () => {
		const action = {
			type: UPDATE_BILLING_ADDRESS_ID,
		};
		const state = checkoutReducer(undefined, action);
		expect(
			state
		).toMatchSnapshot();
	});

	it('should CHECKOUT_SUCCESS', () => {
		const action = {
			type: CHECKOUT_SUCCESS,
		};
		const state = checkoutReducer(undefined, action);
		expect(
			state
		).toMatchSnapshot();
	});

	it('should DELETE_CREDIT_CARD_SUCCESS', () => {
		const action = {
			type: DELETE_CREDIT_CARD_SUCCESS,
		};
		const state = checkoutReducer(undefined, action);
		expect(
			state
		).toMatchSnapshot();
	});

	it('should DELETE_CREDIT_CARD_FAIL', () => {
		const action = {
			type: DELETE_CREDIT_CARD_FAIL,
		};
		const state = checkoutReducer(undefined, action);
		expect(
			state
		).toMatchSnapshot();
	});

	it('should CREDIT_CARD', () => {
		const action = {
			type: CREDIT_CARD,
		};
		const state = checkoutReducer(undefined, action);
		expect(
			state
		).toMatchSnapshot();
	});

	it('should PAYPAL', () => {
		const action = {
			type: PAYPAL,
		};
		const state = checkoutReducer(undefined, action);
		expect(
			state
		).toMatchSnapshot();
	});

	it('should CREATE_PAYPAL_PAYMENT_SUCCESS', () => {
		const action = {
			type: CREATE_PAYPAL_PAYMENT_SUCCESS,
		};
		const state = checkoutReducer(undefined, action);
		expect(
			state
		).toMatchSnapshot();
	});

	it('should AUTHORIZE_PAYPAL_PAYMENT_SUCCESS', () => {
		const action = {
			type: AUTHORIZE_PAYPAL_PAYMENT_SUCCESS,
			payload: {
				shippingAddressId: 0,
				billingAddressId: 1,
			},
		};
		const state = checkoutReducer(undefined, action);
		expect(
			state
		).toMatchSnapshot();
	});

	it('should CLEAR_CREDIT_CARD', () => {
		const action = {
			type: CLEAR_CREDIT_CARD,
		};
		const state = checkoutReducer(undefined, action);
		expect(
			state
		).toMatchSnapshot();
	});

	it('should CLEAR_PAYPAL', () => {
		const action = {
			type: CLEAR_PAYPAL,
		};
		const state = checkoutReducer(undefined, action);
		expect(
			state
		).toMatchSnapshot();
	});

	it('should LOADING_CHECKOUT', () => {
		const action = {
			type: LOADING_CHECKOUT,
		};
		const state = checkoutReducer(undefined, action);
		expect(
			state
		).toMatchSnapshot();
	});

	it('should SIGN_USER_OUT', () => {
		const action = {
			type: SIGN_USER_OUT,
		};
		const state = checkoutReducer(undefined, action);
		expect(
			state
		).toMatchSnapshot();
	});

});
