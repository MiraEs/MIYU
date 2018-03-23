
const dispatch = jest.fn((action) => Promise.resolve(action));
const getState = jest.fn(() => ({
	userReducer: {
		user: {
			customerId: 777,
			shippingAddresses: [],
		},
	},
	cartReducer: {
		cart: {
			sessionCartId: 888,
			shippingOptions: [{
				shippingOptionId: 777,
			}],
		},
	},
	checkoutReducer: {
		billingAddressId: 123,
	},
}));
jest.mock('redux-actions');
jest.mock('BuildNative');
jest.mock('../../../app/services/httpClient', () => ({}));

jest.unmock('../../../app/actions/CheckoutActions');
import checkoutActions from '../CheckoutActions';

jest.mock('../../../app/services/CheckoutService', () => ({
	checkout: jest.fn(() => Promise.resolve({})),
}));
import checkoutService from '../../services/CheckoutService';

jest.mock('../../../app/lib/environment', () => ({
	paypalDomain: 'sandbox.build.com',
}));

jest.mock('../../../app/services/PayPalService', () => ({
	startExpressCheckout: jest.fn(() => Promise.resolve({})),
	processExpressCheckout: jest.fn(() => Promise.resolve({})),
}));
import PayPalService from '../../services/PayPalService';

jest.mock('../../../app/services/customerService', () => ({
	getCreditCards: jest.fn(() => Promise.resolve({})),
	getDefaultCreditCards: jest.fn(() => Promise.resolve({})),
	addCreditCard: jest.fn(() => Promise.resolve({})),
	deleteCreditCard: jest.fn(() => Promise.resolve({})),
}));
import customerService from '../../services/customerService';

describe('CheckoutActions', () => {

	afterEach(() => {
		customerService.getCreditCards.mockClear();
		customerService.getDefaultCreditCards.mockClear();
		customerService.addCreditCard.mockClear();
		customerService.deleteCreditCard.mockClear();
		PayPalService.startExpressCheckout.mockClear();
		PayPalService.processExpressCheckout.mockClear();
		checkoutService.checkout.mockClear();
	});

	describe('loadingCheckout', () => {
		it('should return an object with matching props', () => {
			const result = checkoutActions.loadingCheckout();
			expect(result).toEqual({
				type: 'LOADING_CHECKOUT',
			});
		});
	});

	describe('clearCreditCard', () => {
		it('should return an object with matching props', () => {
			const result = checkoutActions.clearCreditCard();
			expect(result).toEqual({
				type: 'CLEAR_CREDIT_CARD',
			});
		});
	});

	describe('clearPayPal', () => {
		it('should return an object with matching props', () => {
			const result = checkoutActions.clearPayPal();
			expect(result).toEqual({
				type: 'CLEAR_PAYPAL',
			});
		});
	});

	describe('updateCreditCard', () => {
		it('should return a function', () => {
			return checkoutActions.updateCreditCard()(dispatch).then((result) => {
				expect(result).toEqual({
					type: 'UPDATE_CREDIT_CARD',
					creditCard: {},
				});
			});
		});
	});

	describe('updateShippingAddress', () => {
		it('should return an object with matching props', () => {
			const result = checkoutActions.updateShippingAddress(123);
			expect(result).toEqual({
				type: 'UPDATE_SHIPPING_ADDRESS_ID',
				shippingAddressId: 123,
			});
		});
	});

	describe('updateBillingAddress', () => {
		it('should return an object with matching props', () => {
			const result = checkoutActions.updateBillingAddress(123);
			expect(result).toEqual({
				type: 'UPDATE_BILLING_ADDRESS_ID',
				billingAddressId: 123,
			});
		});
	});

	describe('useCreditCard', () => {
		it('should return an object with matching props', () => {
			const result = checkoutActions.useCreditCard(32146);
			expect(result).toEqual({
				type: 'USE_CREDIT_CARD',
				creditCardId: 32146,
			});
		});
	});

	describe('getCreditCardsSuccess', () => {
		it('should return an object with matching props', () => {
			const result = checkoutActions.getCreditCardsSuccess([]);
			expect(result).toEqual({
				type: 'GET_CREDIT_CARDS',
				creditCards: [],
			});
		});
	});

	describe('getCreditCards', () => {
		it('should return a function and call customerService.getCreditCards', () => {
			checkoutActions.getCreditCards()(dispatch, getState);
			expect(customerService.getCreditCards).toBeCalledWith(777);
		});
	});

	describe('getDefaultCard', () => {
		it('should return a function and call customerService.getDefaultCreditCards', () => {
			checkoutActions.getDefaultCard()(dispatch, getState);
			expect(customerService.getDefaultCreditCards).toBeCalledWith(777);
		});
	});

	describe('addCreditCardSuccess', () => {
		it('should return an object with matching props', () => {
			const result = checkoutActions.addCreditCardSuccess();
			expect(result).toEqual({
				type:'ADD_CREDIT_CARD',
			});
		});
	});

	describe('addCreditCard', () => {
		it('should return a function and call customerService.addCreditCard', () => {
			checkoutActions.addCreditCard()(dispatch);
			expect(customerService.addCreditCard).toBeCalledWith({});
		});
		it('should return a function and call customerService.addCreditCard with a defined request', () => {
			const request = { test: true };
			checkoutActions.addCreditCard(request)(dispatch);
			expect(customerService.addCreditCard).toBeCalledWith(request);
		});
	});

	describe('checkout', () => {
		it('should return a function and call checkoutService.checkout', () => {
			checkoutActions.checkout()(dispatch, getState);
			expect(checkoutService.checkout).toBeCalled();
		});
	});

	describe('deleteCreditCardSuccess', () => {
		it('should return an object with matching props', () => {
			const result = checkoutActions.deleteCreditCardSuccess({});
			expect(result).toEqual({
				type: 'DELETE_CREDIT_CARD_SUCCESS',
				payload: {},
			});
		});
	});

	describe('deleteCreditCardFail', () => {
		it('should return an object with matching props', () => {
			const error = new Error('test');
			const result = checkoutActions.deleteCreditCardFail(error);
			expect(result).toEqual({
				type: 'DELETE_CREDIT_CARD_FAIL',
				error,
			});
		});
	});

	describe('deleteCreditCard', () => {
		it('should return a function and call customerService.deleteCreditCard', () => {
			checkoutActions.deleteCreditCard(7)(dispatch, getState);
			expect(customerService.deleteCreditCard).toBeCalledWith(777, 7);
		});
	});

	describe('createPayPalPaymentSuccess', () => {
		it('should return an object with matching props', () => {
			const result = checkoutActions.createPayPalPaymentSuccess({});
			expect(result).toEqual({
				type: 'CREATE_PAYPAL_PAYMENT_SUCCESS',
				payload: {},
			});
		});
	});

	describe('createPayPalPaymentFail', () => {
		it('should return an object with matching props', () => {
			const error = new Error('test');
			const result = checkoutActions.createPayPalPaymentFail(error);
			expect(result).toEqual({
				type: 'CREATE_PAYPAL_PAYMENT_FAIL',
				error,
			});
		});
	});

	describe('createPayPalPayment', () => {
		it('should return a function and call PayPalService.startExpressCheckout', () => {
			checkoutActions.createPayPalPayment()(dispatch, getState);
			expect(PayPalService.startExpressCheckout).toBeCalledWith({
				sessionCartId: 888,
				domain: 'sandbox.build.com',
			});
		});
	});

	describe('authorizePayPalPaymentSuccess', () => {
		it('should return an object with matching props', () => {
			const result = checkoutActions.authorizePayPalPaymentSuccess({});
			expect(result).toEqual({
				type: 'AUTHORIZE_PAYPAL_PAYMENT_SUCCESS',
				payload: {},
			});
		});
	});

	describe('authorizePayPalPaymentFail', () => {
		it('should return an object with matching props', () => {
			const error = new Error('test');
			const result = checkoutActions.authorizePayPalPaymentFail(error);
			expect(result).toEqual({
				type: 'AUTHORIZE_PAYPAL_PAYMENT_FAIL',
				error,
			});
		});
	});

	describe('authorizePayPalPayment', () => {
		it('should return a function that calls PayPalService.processExpressCheckout', () => {
			const request = {};
			checkoutActions.authorizePayPalPayment(request)(dispatch, getState);
			expect(PayPalService.processExpressCheckout).toBeCalledWith(request);
		});
	});

});
