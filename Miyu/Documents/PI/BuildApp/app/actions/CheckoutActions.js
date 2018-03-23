'use strict';
import { createAction } from 'redux-actions';
import {
	DELETE_CREDIT_CARD_SUCCESS,
	DELETE_CREDIT_CARD_FAIL,
	UPDATE_CREDIT_CARD,
	UPDATE_SHIPPING_ADDRESS_ID,
	ADD_CREDIT_CARD,
	GET_CREDIT_CARDS,
	USE_CREDIT_CARD,
	UPDATE_BILLING_ADDRESS_ID,
	CHECKOUT_SUCCESS,
	CREATE_PAYPAL_PAYMENT_SUCCESS,
	CREATE_PAYPAL_PAYMENT_FAIL,
	AUTHORIZE_PAYPAL_PAYMENT_SUCCESS,
	AUTHORIZE_PAYPAL_PAYMENT_FAIL,
	AUTHORIZE_APPLEPAY_SUCCESS,
	AUTHORIZE_APPLEPAY_FAIL,
	CREDIT_CARD,
	PAYPAL,
	APPLE_PAY,
	CLEAR_CREDIT_CARD,
	CLEAR_PAYPAL,
	LOADING_CHECKOUT,
	STORE_CREDIT,
} from '../constants/CheckoutConstants';
import { STORE_ID } from '../constants/constants';
import customerService from '../services/customerService';
import CheckoutService from '../services/CheckoutService';
import PayPalService from '../services/PayPalService';
import ApplePayService from '../services/ApplePayService';
import {
	getCustomerShippingAddresses,
	guestLogin,
} from './UserActions';
import { updateSessionCart } from './CartActions';
import { loadOrders } from './OrderActions';
import environment from '../lib/environment';
import helpers from '../lib/helpers';
import { Device } from 'BuildNative';

function loadingCheckout() {
	return {
		type: LOADING_CHECKOUT,
	};
}

function clearCreditCard() {
	return {
		type: CLEAR_CREDIT_CARD,
	};
}

function clearPayPal() {
	return {
		type: CLEAR_PAYPAL,
	};
}

const updateCreditCard = (creditCard = {}) => {
	return (dispatch) => {
		return dispatch({
			type: UPDATE_CREDIT_CARD,
			creditCard,
		});
	};
};

const updateShippingAddress = (shippingAddressId) => {
	return {
		type: UPDATE_SHIPPING_ADDRESS_ID,
		shippingAddressId,
	};
};

const updateBillingAddress = (billingAddressId) => {
	return {
		type: UPDATE_BILLING_ADDRESS_ID,
		billingAddressId,
	};
};

function useCreditCard(creditCardId) {
	return {
		type: USE_CREDIT_CARD,
		creditCardId,
	};
}

function getCreditCardsSuccess(creditCards) {
	return {
		type: GET_CREDIT_CARDS,
		creditCards,
	};
}

const getCreditCards = () => {
	return (dispatch, getState) => {
		const customerId = getState().userReducer.user.customerId;

		return customerService.getCreditCards(customerId)
			.then((creditCards) => {
				dispatch(getCreditCardsSuccess(creditCards));
				return creditCards;
			});
	};
};

const getDefaultCard = () => {
	return (dispatch, getState) => {
		const customerId = getState().userReducer.user.customerId;
		return customerService.getDefaultCreditCards(customerId)
			.then((defaultCard) => {
				dispatch(getCreditCards())
					.then(() => {
						if (defaultCard && defaultCard.creditCardId) {
							dispatch(useCreditCard(defaultCard.creditCardId));
						}
					});
			})
			.catch((error) => {
				throw new Error(error);
			});
	};
};

function addCreditCardSuccess() {
	return {
		type: ADD_CREDIT_CARD,
	};
}

const addCreditCard = (request = {}) => {
	return (dispatch) => {
		return customerService.addCreditCard(request)
			.then(() => dispatch(getDefaultCard()));
	};
};

function checkout(storeCredit) {
	return (dispatch, getState) => {
		const state = getState();
		const { customerId } = state.userReducer.user;
		const request = {
			billingAddressId: state.checkoutReducer.billingAddressId,
			orderCriteria: {
				orderContext: {
					device: Device.isMobile() ? 'MOBILE' : 'TABLET',
					experience: Device.isMobile() ? 'MOBILE' : 'TABLET',
					framework: helpers.isIOS() ? 'IOS' : 'ANDROID',
				},
				shippingOptionId: state.cartReducer.cart.shippingOptions[state.cartReducer.selectedShippingIndex || 0].shippingOptionId,
				storeId: STORE_ID,
				quoteId: state.cartReducer.quoteId,
			},
			deliveryDates: state.cartReducer.cart.deliveryDates,
			paymentType: state.checkoutReducer.paymentType,
			sessionCartId: state.cartReducer.cart.sessionCartId,
			shippingAddressId: state.checkoutReducer.shippingAddressId,
			customerId,
		};

		if (storeCredit > 0) {
			request.additionalPaymentCriteria = [{
				amount: `${storeCredit}`,
				paymentType: STORE_CREDIT,
			}];
		}

		if (state.checkoutReducer.paymentType === CREDIT_CARD) {
			request.paymentReferenceId = state.checkoutReducer.creditCardId;
		}

		if (state.checkoutReducer.paymentType === PAYPAL) {
			request.paymentReferenceId = state.checkoutReducer.paypal.paymentReferenceId;
		}

		if (state.checkoutReducer.paymentType === APPLE_PAY) {
			request.paymentReferenceId = state.checkoutReducer.applePay.requestId;
		}

		return CheckoutService.checkout(request)
			.then((result) => {
				return dispatch(loadOrders(customerId))
					.then(() => {
						dispatch({ type: CHECKOUT_SUCCESS });
						return result;
					});
			})
			.catch((error) => {
				if (error instanceof Error) {
					throw error;
				}
				throw new Error(error);
			});
	};
}

function deleteCreditCardSuccess(payload) {
	return {
		type: DELETE_CREDIT_CARD_SUCCESS,
		payload,
	};
}

function deleteCreditCardFail(error) {
	return {
		type: DELETE_CREDIT_CARD_FAIL,
		error,
	};
}

function deleteCreditCard(creditCardId) {
	return (dispatch, getState) => {
		return customerService.deleteCreditCard(getState().userReducer.user.customerId, creditCardId)
			.then(() => {
				dispatch(getCreditCards())
					.then(() => dispatch(deleteCreditCardSuccess(creditCardId)));
			})
			.catch((error) => {
				dispatch(deleteCreditCardFail(error));
				throw new Error(error);
			});
	};
}

function createPayPalPaymentSuccess(payload) {
	return {
		type: CREATE_PAYPAL_PAYMENT_SUCCESS,
		payload,
	};
}

function createPayPalPaymentFail(error) {
	return {
		type: CREATE_PAYPAL_PAYMENT_FAIL,
		error,
	};
}

function createPayPalPayment() {
	return (dispatch, getState) => {
		const { sessionCartId } = getState().cartReducer.cart;
		const domain = environment.paypalDomain;

		dispatch(loadingCheckout());

		return PayPalService.startExpressCheckout({ sessionCartId, domain })
			.then((payload) => {
				dispatch(createPayPalPaymentSuccess(payload));
			})
			.catch((error) => {
				dispatch(createPayPalPaymentFail(error));
			});
	};
}

function authorizePayPalPaymentSuccess(payload) {
	return {
		type: AUTHORIZE_PAYPAL_PAYMENT_SUCCESS,
		payload,
	};
}

function authorizePayPalPaymentFail(error) {
	return {
		type: AUTHORIZE_PAYPAL_PAYMENT_FAIL,
		error,
	};
}

function authorizePayPalPayment(request) {
	return (dispatch, getState) => {
		let zipCodeChanged = false;

		dispatch(loadingCheckout());

		return PayPalService.processExpressCheckout(request)
			.then((payload) => {
				const { isGuest } = getState().userReducer.user;
				const { customerId, userName } = payload;

				if (isGuest) {
					return dispatch(guestLogin(customerId, userName)).then(() => payload);
				}

				return payload;
			})
			.then((payload) => dispatch(getCustomerShippingAddresses()).then(() => payload))
			.then((payload) => {
				const { sessionCartId, zipCode } = getState().cartReducer.cart;
				const { shippingAddresses } = getState().userReducer.user;
				const { shippingAddressId } = payload;
				const address = shippingAddresses.find((address) => address.addressId === shippingAddressId);

				zipCodeChanged = address && address.zip !== zipCode;

				if (zipCodeChanged) {
					return dispatch(updateSessionCart({
						cart: {zipCode: address.zip},
						actualTaxes: false,
						sessionCartId,
					}))
						.then(() => payload);
				}

				return payload;
			})
			.then((payload) => dispatch(authorizePayPalPaymentSuccess(payload)))
			.then(() => zipCodeChanged)
			.catch((error) => {
				dispatch(authorizePayPalPaymentFail(error));
				throw new Error(error);
			});
	};
}

const authorizeApplePaySuccess = createAction(AUTHORIZE_APPLEPAY_SUCCESS);
const authorizeApplePayFail = createAction(AUTHORIZE_APPLEPAY_FAIL);

const authorizeApplePay = (request) => {
	return (dispatch) => {
		return ApplePayService.authorizations(request)
			.then((results) => {
				dispatch(authorizeApplePaySuccess(results));
				return results;
			})
			.catch((error) => {
				dispatch(authorizeApplePayFail(error));
				throw new Error(error);
			});
	};
};

module.exports = {
	loadingCheckout,
	clearCreditCard,
	clearPayPal,
	updateCreditCard,
	updateShippingAddress,
	updateBillingAddress,
	useCreditCard,
	getCreditCardsSuccess,
	getCreditCards,
	getDefaultCard,
	addCreditCardSuccess,
	addCreditCard,
	checkout,
	deleteCreditCardSuccess,
	deleteCreditCardFail,
	deleteCreditCard,
	createPayPalPaymentSuccess,
	createPayPalPaymentFail,
	createPayPalPayment,
	authorizePayPalPaymentSuccess,
	authorizePayPalPaymentFail,
	authorizePayPalPayment,
	authorizeApplePay,
};
