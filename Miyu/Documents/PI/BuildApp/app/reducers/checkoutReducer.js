'use strict';
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
	APPLE_PAY,
	CREATE_PAYPAL_PAYMENT_SUCCESS,
	AUTHORIZE_PAYPAL_PAYMENT_SUCCESS,
	AUTHORIZE_APPLEPAY_SUCCESS,
	AUTHORIZE_APPLEPAY_FAIL,
	CLEAR_CREDIT_CARD,
	CLEAR_PAYPAL,
	LOADING_CHECKOUT,
} from '../constants/CheckoutConstants';
import { SIGN_USER_OUT } from '../constants/Auth';
import helpers from '../lib/helpers';

const initialState = {
	creditCard: {},
	paypal: null,
	applePay: null,
	billingAddressId: null,
	creditCardId: null,
	shippingAddressId: null,
	creditCards: [],
	paymentType: null,
	error: '',
	isLoading: false,
};

function checkoutReducer(state = initialState, action = {}) {
	let creditCard;

	switch (action.type) {
		case UPDATE_CREDIT_CARD:
			const {cardNumber, cvv, expDate, nameOnCard} = action.creditCard;
			const newCard = {
				cardNumber: cardNumber || state.creditCard.cardNumber,
				cvv: cvv || state.creditCard.cvv,
				expDate: expDate || state.creditCard.expDate,
				nameOnCard: nameOnCard || state.creditCard.nameOnCard,
			};
			return {
				...state,
				creditCard: newCard,
			};
		case UPDATE_SHIPPING_ADDRESS_ID:
			return {
				...state,
				shippingAddressId: action.shippingAddressId,
			};
		case UPDATE_BILLING_ADDRESS_ID:
			return {
				...state,
				billingAddressId: action.billingAddressId,
			};
		case GET_CREDIT_CARDS:
			const creditCards = action.creditCards.map((card) => {
				return {
					billingAddressId: card.billingAddressId,
					creditCardId: card.creditCardId,
					cardType: card.type,
					lastFour: card.lastFour,
					expDate: helpers.getDateStrictFormat(card.expiration),
					name: card.name.trim(),
				};
			});
			creditCard = creditCards.find((card) => card.creditCardId === state.creditCardId) || {};
			return {
				...state,
				creditCard,
				creditCards,
			};
		case USE_CREDIT_CARD:
			creditCard = state.creditCards.find((card) => card.creditCardId === action.creditCardId) || {};
			return {
				...state,
				creditCard,
				creditCardId: creditCard.creditCardId,
				billingAddressId: creditCard.billingAddressId,
				paypal: initialState.paypal,
				paymentType: CREDIT_CARD,
			};
		case SIGN_USER_OUT:
			return {
				...initialState,
			};
		case CHECKOUT_SUCCESS:
			return {
				...state,
				/* The currently used addresses get deleted and re-added during checkout the current id's are useless */
				shippingAddressId: null,
				billingAddressId: null,
			};
		case DELETE_CREDIT_CARD_SUCCESS:
			return {
				...state,
				creditCard: action.payload === state.creditCardId ? initialState.creditCard : state.creditCard,
				creditCardId: action.payload === state.creditCardId ? initialState.creditCardId : state.creditCardId,
				paymentType: action.payload === state.creditCardId ? initialState.paymentType : state.paymentType,
			};
		case DELETE_CREDIT_CARD_FAIL:
			return {
				...state,
				error: action.error,
			};
		case CREATE_PAYPAL_PAYMENT_SUCCESS:
			return {
				...state,
				paypal: {
					...state.paypal,
					...action.payload,
				},
				shippingAddressId: null,
				billingAddressId: null,
				paymentType: PAYPAL,
				isLoading: false,
			};
		case AUTHORIZE_PAYPAL_PAYMENT_SUCCESS:
			return {
				...state,
				paypal: {
					...state.paypal,
					...action.payload,
				},
				shippingAddressId: action.payload.shippingAddressId,
				billingAddressId: action.payload.billingAddressId,
				isLoading: false,
			};

		case AUTHORIZE_APPLEPAY_SUCCESS:
			return {
				...state,
				applePay: {
					...action.payload,
				},
				paymentType: APPLE_PAY,
				shippingAddressId: null,
				billingAddressId: null,
				isLoading: false,
			};
		case AUTHORIZE_APPLEPAY_FAIL:
			return {
				...state,
				applePay: { error: action.error },
				paymentType: APPLE_PAY,
				isLoading: false,
			};
		case CLEAR_CREDIT_CARD:
			return {
				...state,
				creditCard: {},
				paymentType: null,
			};
		case CLEAR_PAYPAL:
			return {
				...state,
				paypal: null,
				paymentType: null,
			};
		case LOADING_CHECKOUT:
			return {
				...state,
				isLoading: true,
			};
		default:
			return state;
	}
}

export default checkoutReducer;
