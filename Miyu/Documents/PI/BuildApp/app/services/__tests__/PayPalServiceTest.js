jest.mock('../httpClient', () => {
	return {
		get: jest.fn(() => Promise.resolve()),
	};
});

jest.unmock('../PayPalService');
import PayPalService from '../PayPalService';
import client from '../httpClient';

const errorResponse = {
	code: 500,
	message: 'Bad Error, No message available',
};

describe('PayPalService', () => {
	describe('startExpressCheckout', () => {
		const options = {
			sessionCartId: '1234567890',
			domain: 'build.com',
		};
		const successResponse = {
			redirectUrl: 'https://www.sandbox.paypal.com/checkoutnow?token=EC-7RB756124X423314J',
		};

		it('should call with the default params', () => {
			PayPalService.startExpressCheckout(options);

			expect(client.get).toBeCalledWith(
					'/v1/paypal/startExpressCheckout?sessionCartId=1234567890&siteId=82&domain=build.com',
				);
		});

		it('should return success response', () => {
			client.get = () => Promise.resolve(successResponse);
			expect.assertions(1);

			return expect(PayPalService.startExpressCheckout(options)).resolves.toEqual(successResponse);
		});

		it('should return error response from api', () => {
			const error = new Error(errorResponse.message);
			client.get = () => Promise.resolve(errorResponse);
			expect.assertions(1);

			return expect(PayPalService.startExpressCheckout(options)).rejects.toEqual(error);
		});
	});

	describe('processExpressCheckout', () => {
		const options = {
			token: 'EC-7RB756124X423314J',
			payerId: 'PAYPAL',
		};
		const successResponse = {
			billingAddressId: '30230395',
			customerId: '3984706',
			paymentReferenceId: 'EC-7RB756124X423314J',
			paymentType: 'PAYPAL',
			redirectUrl: 'https://www.sandbox.paypal.com/checkoutnow?token=EC-7RB756124X423314J',
			shippingAddressId: '30230396',
			transactionDate: 'Mon Jun 12 2017 11:31:20 GMT-0700 (PDT)',
			userName: 'JeffWithG',
		};

		it('should call with the default params', () => {
			client.get = jest.fn(() => Promise.resolve());
			PayPalService.processExpressCheckout(options);

			expect(client.get).toBeCalledWith(
				'/v1/paypal/processExpressCheckout?paypalToken=EC-7RB756124X423314J&payerId=PAYPAL',
			);
		});

		it('should return success response', () => {
			client.get = () => Promise.resolve(successResponse);
			expect.assertions(1);

			return expect(PayPalService.processExpressCheckout(options)).resolves.toEqual(successResponse);
		});

		it('should return error response from api', () => {
			const error = new Error(errorResponse.message);
			client.get = () => Promise.resolve(errorResponse);
			expect.assertions(1);

			return expect(PayPalService.processExpressCheckout(options)).rejects.toEqual(error);
		});
	});
});
