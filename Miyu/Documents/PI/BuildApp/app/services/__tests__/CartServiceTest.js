import CartService from '../CartService';
import client from '../httpClient';

jest.unmock('../CartService');
jest.mock('../httpClient', () => {
	return {
		delete: jest.fn(() => Promise.resolve()),
		get: jest.fn(() => Promise.resolve()),
		post: jest.fn(() => Promise.resolve()),
		put: jest.fn(() => Promise.resolve()),
	};
});
jest.mock('react-native-simple-store', () => {
	return {
		save: jest.fn(() => Promise.resolve()),
		delete: jest.fn(() => Promise.resolve()),
	};
});

const errorResponse = {
	timestamp: 1497029446538,
	status: 500,
	error: 'Bad Error',
	message: 'No message available',
};

describe('CartService', () => {

	// ********
	describe('createSessionCart', () => {
		const options = {
			customerId: '0',
		};

		it('should call with the default params', () => {
			CartService.createSessionCart(options);

			expect(client.post).toBeCalledWith(
				'/v1/carts/sessionCarts/create?customerId=0',
				{customerId: '0'});
		});

		it('should return success response', () => {
			const successResponse = require('./__mocks__/createSessionCartResponse.json');
			client.post = () => Promise.resolve(successResponse);

			expect.assertions(1);
			return expect(CartService.createSessionCart(options)).resolves.toEqual(successResponse);
		});

		it('should return error response', () => {
			client.post = () => Promise.reject(errorResponse);

			expect.assertions(1);
			return expect(CartService.createSessionCart(options)).rejects.toEqual(errorResponse);
		});
	});
	// *******

	describe('getSessionCart', () => {
		const options = {
			recalculatePrice: '0',
			sessionCartId: '1234567890',
		};

		it('should call with the default params', () => {
			CartService.getSessionCart(options);

			expect(client.get).toBeCalledWith('/v1/carts/sessionCarts/actualTaxes/1234567890?storeId=248');
		});

		it('should return success response', () => {
			const successResponse = require('./__mocks__/createSessionCartResponse.json');
			client.get = () => Promise.resolve(successResponse);

			expect.assertions(1);
			return expect(CartService.getSessionCart(options)).resolves.toEqual(successResponse);
		});

		it('should return error response', () => {
			client.get = () => Promise.reject(errorResponse);

			expect.assertions(1);
			return expect(CartService.getSessionCart(options)).rejects.toEqual(errorResponse);
		});
	});

	describe('deleteSessionCart', () => {
		const options = { sessionCartId: '1234567890' };

		it('should call with the default params', () => {
			CartService.deleteSessionCart(options);

			expect(client.delete).toBeCalledWith('/v1/carts/sessionCarts/1234567890?storeId=248');
		});

		it('should return success response', () => {
			client.delete = () => Promise.resolve();

			expect.assertions(1);
			return expect(CartService.deleteSessionCart(options)).resolves.toEqual(undefined);
		});

		it('should return error response', () => {
			client.delete = () => Promise.reject(errorResponse);

			expect.assertions(1);
			return expect(CartService.deleteSessionCart(options)).rejects.toEqual(errorResponse);
		});
	});

	describe('updateSessionCart', () => {
		const options = {
			actualTaxes: true,
			sessionCartId: '1234567890',
			cart: { zipCode: '95973' },
		};

		it('should call with the default params', () => {
			CartService.updateSessionCart(options);

			expect(client.put).toBeCalledWith(
				'/v1/carts/sessionCarts/actualTaxes/1234567890',
				{ zipCode: '95973' });
		});

		it('should return success response', () => {
			const successResponse = require('./__mocks__/createSessionCartResponse.json');
			client.put = () => Promise.resolve(successResponse);

			expect.assertions(1);
			return expect(CartService.updateSessionCart(options)).resolves.toEqual(successResponse);
		});

		it('should return error response', () => {
			client.put = () => Promise.reject(errorResponse);

			expect.assertions(1);
			return expect(CartService.updateSessionCart(options)).rejects.toEqual(errorResponse);
		});
	});

	describe('addSessionCartItems', () => {
		const options = {
			sessionCartId: '1234567890',
			items: [
				{ productUniqueId: '214013', quantity: '1' },
				{ productUniqueId: '310412', quantity: '5' },
			],
		};

		it('should call addSessionCartItemsWithId with params', () => {
			const addSessionCartItemsWithIdSpy = jest.spyOn(CartService, 'addSessionCartItemsWithId');
			CartService.addSessionCartItems(options);

			expect(addSessionCartItemsWithIdSpy).toBeCalledWith(options);

			addSessionCartItemsWithIdSpy.mockReset();
			addSessionCartItemsWithIdSpy.mockRestore();
		});

		it('should call createSessionCart with params', () => {
			const createSessionCartSpy = jest.spyOn(CartService, 'createSessionCart');
			const results = Object.assign({}, { ...options.items });
			CartService.addSessionCartItems(results);

			expect(createSessionCartSpy).toBeCalledWith(results);

			createSessionCartSpy.mockReset();
			createSessionCartSpy.mockRestore();
		});
	});

	describe('addSessionCartItemsWithId', () => {
		const options = {
			sessionCartId: '1234567890',
			sessionCartItems: [
				{ productUniqueId: '214013', quantity: '1' },
				{ productUniqueId: '310412', quantity: '5' },
			],
		};

		it('should call with the default params', () => {
			client.post = jest.fn(() => Promise.resolve());
			CartService.addSessionCartItemsWithId(options);

			expect(client.post).toBeCalledWith('/v1/carts/sessionCarts/1234567890/items?storeId=248', options.sessionCartItems);
		});

		it('should return success response', () => {
			const successResponse = require('./__mocks__/createSessionCartResponse.json');
			client.post = () => Promise.resolve(successResponse.sessionCartItems);

			expect.assertions(1);
			return expect(CartService.addSessionCartItemsWithId(options)).resolves.toEqual({
				cartItems: successResponse.sessionCartItems,
				sessionCartId: options.sessionCartId,
			});
		});

		it('should return error response', () => {
			client.post = () => Promise.reject(errorResponse);

			expect.assertions(1);
			return expect(CartService.addSessionCartItemsWithId(options)).rejects.toEqual(errorResponse);
		});
	});

	describe('addSessionCartSubItem', () => {
		const options = {
			sessionCartId: '1234567890',
			uniqueId: '3495734957',
			quantity: '5',
			parentKey: '32423423',
		};

		it('should call with the default params', () => {
			client.post = jest.fn(() => Promise.resolve());
			CartService.addSessionCartSubItem(options);

			expect(client.post).toBeCalledWith('/v1/carts/sessionCarts/1234567890/subItem?storeId=248&uniqueId=3495734957&quantity=5&parentKey=32423423');
		});

		it('should return success response', () => {
			client.post = () => Promise.resolve();

			expect.assertions(1);
			return expect(CartService.addSessionCartSubItem(options)).resolves.toEqual(undefined);
		});

		it('should return error response', () => {
			client.post = () => Promise.reject(errorResponse);

			expect.assertions(1);
			return expect(CartService.addSessionCartSubItem(options)).rejects.toEqual(errorResponse);
		});
	});

	describe('updateSessionCartItem', () => {
		const successResponse = require('./__mocks__/createSessionCartResponse.json');
		const options = {
			sessionCartId: successResponse.sessionCartId,
			itemKey: successResponse.sessionCartItems[0].itemKey,
			cartItem: successResponse.sessionCartItems[0],
		};

		it('should call with the default params', () => {
			client.put = jest.fn(() => Promise.resolve());
			CartService.updateSessionCartItem(options);

			expect(client.put).toBeCalledWith('/v1/carts/sessionCarts/406801380/items/225016?storeId=248', successResponse.sessionCartItems[0]);
		});

		it('should return success response', () => {
			const successResponse = require('./__mocks__/createSessionCartResponse.json');
			client.put = () => Promise.resolve();

			expect.assertions(1);
			return expect(CartService.updateSessionCartItem(options)).resolves.toEqual(successResponse.sessionCartItems[0]);
		});

		it('should return error response', () => {
			client.put = () => Promise.reject(errorResponse);

			expect.assertions(1);
			return expect(CartService.updateSessionCartItem(options)).rejects.toEqual(errorResponse);
		});
	});

	describe('deleteSessionCartItem', () => {
		const successResponse = require('./__mocks__/createSessionCartResponse.json');
		const options = {
			sessionCartId: successResponse.sessionCartId,
			itemKey: successResponse.sessionCartItems[0].itemKey,
		};

		it('should call with the default params', () => {
			client.delete = jest.fn(() => Promise.resolve());
			CartService.deleteSessionCartItem(options);

			expect(client.delete).toBeCalledWith('/v1/carts/sessionCarts/406801380/items/225016?storeId=248');
		});

		it('should return success response', () => {
			const successResponse = require('./__mocks__/createSessionCartResponse.json');
			client.delete = () => Promise.resolve();

			expect.assertions(1);
			return expect(CartService.deleteSessionCartItem(options)).resolves.toEqual(successResponse.sessionCartItems[0].itemKey);
		});

		it('should return error response', () => {
			client.delete = () => Promise.reject(errorResponse);

			expect.assertions(1);
			return expect(CartService.deleteSessionCartItem(options)).rejects.toEqual(errorResponse);
		});
	});

	describe('getCustomerCarts', () => {
		const options = { customerId: '3984706'};

		it('should call with the default params', () => {
			client.get = jest.fn(() => Promise.resolve());
			CartService.getCustomerCarts(options);

			expect(client.get).toBeCalledWith('/v1/carts/templates/3984706?siteId=82');
		});

		it('should return success response', () => {
			client.get = () => Promise.resolve();

			expect.assertions(1);
			return expect(CartService.getCustomerCarts(options)).resolves.toEqual(undefined);
		});

		it('should return error response', () => {
			client.get = () => Promise.reject(errorResponse);

			expect.assertions(1);
			return expect(CartService.getCustomerCarts(options)).rejects.toEqual(errorResponse);
		});
	});

	describe('saveSessionCartTemplate', () => {
		const options = { customerId: '3984706'};

		it('should call with the default params', () => {
			client.post = jest.fn(() => Promise.resolve());
			CartService.saveSessionCartTemplate(options);

			expect(client.post).toBeCalledWith(
				'/v1/carts/templates/3984706/create',
				{ customerId: '3984706', siteId: '82' },
			);
		});

		it('should return success response', () => {
			client.post = () => Promise.resolve();

			expect.assertions(1);
			return expect(CartService.saveSessionCartTemplate(options)).resolves.toEqual(undefined);
		});

		it('should return error response', () => {
			client.post = () => Promise.reject(errorResponse);

			expect.assertions(1);
			return expect(CartService.saveSessionCartTemplate(options)).rejects.toEqual(errorResponse);
		});
	});

	describe('sendQuote', () => {
		const options = {
			emails: ['test1@build.com', 'test2@build.com'],
			message: 'Test Message',
			sessionCartId: '1234567890',
			subject: 'Test Subject',
			fromEmail: 'someone@build.com',
			fromName: 'Someone Build',
		};

		it('should call with the default params', () => {
			client.post = jest.fn(() => Promise.resolve());
			CartService.sendQuote(options);

			expect(client.post).toBeCalledWith(
				'/v1/carts/quotes/send',
				{
					fromEmail: 'someone@build.com',
					fromName: 'Someone Build',
					message: 'Test Message',
					sessionCartId: '1234567890',
					siteId: '82',
					subject: 'Test Subject',
					toEmail: 'test1@build.com',
					toName: 'test1@build.com',
				},
			);
		});

		it('should return success response', () => {
			client.post = () => Promise.resolve();

			expect.assertions(1);
			return expect(CartService.sendQuote(options)).resolves.toEqual(undefined);
		});

		it('should return error response', () => {
			const error = new Error(errorResponse.message);
			client.post = () => Promise.reject(errorResponse);

			expect.assertions(1);
			return expect(CartService.sendQuote(options)).rejects.toEqual(error);
		});
	});

	describe('loadQuote', () => {
		const options = {
			sessionCartId: '1234567890',
			quoteNumber: '0987654321',
		};

		it('should call loadQuoteWithId with params', () => {
			const loadQuoteWithIdSpy = jest.spyOn(CartService, 'loadQuoteWithId');
			CartService.loadQuote(options);

			expect(loadQuoteWithIdSpy).toBeCalledWith(options);

			loadQuoteWithIdSpy.mockReset();
			loadQuoteWithIdSpy.mockRestore();
		});

		it('should call createSessionCart with params', () => {
			const createSessionCartSpy = jest.spyOn(CartService, 'createSessionCart');

			CartService.loadQuote({ quoteNumber: options.quoteNumber });

			expect(createSessionCartSpy).toBeCalledWith({
				siteId: '82',
				quoteNumber: '0987654321',
			});

			createSessionCartSpy.mockReset();
			createSessionCartSpy.mockRestore();
		});
	});

	describe('loadQuoteWithId', () => {
		const successResponse = require('./__mocks__/loadQuoteResponse.json');
		const options = {
			sessionCartId: '400208986',
			quoteNumber: '3WSNZ9N5UH',
		};

		it('should call with the default params', () => {
			client.post = jest.fn(() => Promise.resolve());
			CartService.loadQuoteWithId(options);

			expect(client.post).toBeCalledWith(
				'/v1/carts/quotes/load',
				{
					sessionCartId: options.sessionCartId,
					quoteNumber: options.quoteNumber,
				},
			);
		});

		it('should return success response', () => {
			client.post = () => Promise.resolve(successResponse);

			expect.assertions(1);
			return expect(CartService.loadQuoteWithId(options)).resolves.toEqual({
				quote: { ...successResponse },
				sessionCartId: options.sessionCartId,
			});
		});

		it('should return error response', () => {
			client.post = () => Promise.reject(errorResponse);

			expect.assertions(1);
			return expect(CartService.loadQuoteWithId(options)).rejects.toEqual(errorResponse);
		});
	});

	describe('copySessionCart', () => {
		const successResponse = require('./__mocks__/createSessionCartResponse.json');
		const options = {
			sessionCartId: '1234567890',
			customerId: '0987654321',
		};

		it('should call with the default params', () => {
			client.post = jest.fn(() => Promise.resolve());
			CartService.copySessionCart(options);

			expect(client.post).toBeCalledWith(
				'/v1/carts/sessionCarts/1234567890/copy?customerId=0987654321',
				{
					sessionCartId: options.sessionCartId,
					customerId: options.customerId,
				},
			);
		});

		it('should return success response', () => {
			client.post = () => Promise.resolve(successResponse);

			expect.assertions(1);
			return expect(CartService.copySessionCart(options)).resolves.toEqual(successResponse);
		});

		it('should return error response', () => {
			client.post = () => Promise.reject(errorResponse);

			expect.assertions(1);
			return expect(CartService.copySessionCart(options)).rejects.toEqual(errorResponse);
		});
	});

	describe('mergeSessionCarts', () => {
		const options = {
			fromSessionCartId: '1234567890',
			toSessionCartId: '0987654321',
		};

		it('should call mergeSessionCartsWithId with params', () => {
			const mergeSessionCartsWithIdSpy = jest.spyOn(CartService, 'mergeSessionCartsWithId');
			CartService.mergeSessionCarts(options);

			expect(mergeSessionCartsWithIdSpy).toBeCalledWith(options);

			mergeSessionCartsWithIdSpy.mockReset();
			mergeSessionCartsWithIdSpy.mockRestore();
		});

		it('should call createSessionCart with params', () => {
			const createSessionCartSpy = jest.spyOn(CartService, 'createSessionCart');
			const successResponse = require('./__mocks__/createSessionCartResponse.json');
			client.post = () => Promise.resolve(successResponse);

			CartService.mergeSessionCarts({
				fromSessionCartId: options.fromSessionCartId,
			});

			expect(createSessionCartSpy).toBeCalledWith({
				fromSessionCartId: options.fromSessionCartId,
			});

			createSessionCartSpy.mockReset();
			createSessionCartSpy.mockRestore();
		});
	});

	describe('mergeSessionCartsWithId', () => {
		const successResponse = require('./__mocks__/createSessionCartResponse.json');
		const options = {
			fromSessionCartId: '1234567890',
			toSessionCartId: '0987654321',
		};

		it('should call with the default params', () => {
			client.post = jest.fn(() => Promise.resolve());
			CartService.mergeSessionCartsWithId(options);

			expect(client.post).toBeCalledWith(
				'/v1/carts/sessionCarts/1234567890/merge?mergeToSessionCartId=0987654321',
				{},
			);
		});

		it('should return success response', () => {
			client.post = () => Promise.resolve(successResponse);

			expect.assertions(1);
			return expect(CartService.mergeSessionCartsWithId(options)).resolves.toEqual(successResponse);
		});

		it('should return error response', () => {
			client.post = () => Promise.reject(errorResponse);

			expect.assertions(1);
			return expect(CartService.mergeSessionCartsWithId(options)).rejects.toEqual(errorResponse);
		});
	});

	describe('addCoupon', () => {
		const successResponse = require('./__mocks__/createSessionCartResponse.json');
		const options = {
			sessionCartId: '1234567890',
			couponCode: 'WOSFAMILY5OFF',
		};

		it('should call with the default params', () => {
			client.post = jest.fn(() => Promise.resolve());
			CartService.addCoupon(options);

			expect(client.post).toBeCalledWith(
				'/v1/coupon/add?sessionCartId=1234567890&code=WOSFAMILY5OFF',
				{
					sessionCartId: '1234567890',
					couponCode: 'WOSFAMILY5OFF',
				},
			);
		});

		it('should return success response', () => {
			client.post = () => Promise.resolve(successResponse);

			expect.assertions(1);
			return expect(CartService.addCoupon(options)).resolves.toEqual(successResponse);
		});

		it('should return error response', () => {
			client.post = () => Promise.reject(errorResponse);

			expect.assertions(1);
			return expect(CartService.addCoupon(options)).rejects.toEqual(errorResponse);
		});
	});

	describe('removeCoupon', () => {
		const successResponse = require('./__mocks__/createSessionCartResponse.json');
		const options = {
			sessionCartId: '1234567890',
			couponCode: 'WOSFAMILY5OFF',
		};

		it('should call with the default params', () => {
			client.delete = jest.fn(() => Promise.resolve());
			CartService.removeCoupon(options);

			expect(client.delete).toBeCalledWith(
				'/v1/coupon/remove?sessionCartId=1234567890&couponCode=WOSFAMILY5OFF',
				{
					sessionCartId: '1234567890',
					couponCode: 'WOSFAMILY5OFF',
				},
			);
		});

		it('should return success response', () => {
			client.delete = () => Promise.resolve(successResponse);

			expect.assertions(1);
			return expect(CartService.removeCoupon(options)).resolves.toEqual(successResponse);
		});

		it('should return error response', () => {
			client.delete = () => Promise.reject(errorResponse);

			expect.assertions(1);
			return expect(CartService.removeCoupon(options)).rejects.toEqual(errorResponse);
		});
	});

	describe('getDeliveryDates', () => {
		const successResponse = ['string'];
		const zipCode = '95973';

		it('should call with the default params', () => {
			client.get = jest.fn(() => Promise.resolve());
			CartService.getDeliveryDates(zipCode);

			expect(client.get).toBeCalledWith('/v1/ge/deliveryDates?zipCode=95973');
		});

		it('should return success response', () => {
			client.get = () => Promise.resolve(successResponse);

			expect.assertions(1);
			return expect(CartService.getDeliveryDates(zipCode)).resolves.toEqual(successResponse);
		});

		it('should return error response', () => {
			client.get = () => Promise.reject(errorResponse);

			expect.assertions(1);
			return expect(CartService.getDeliveryDates(zipCode)).rejects.toEqual(errorResponse);
		});
	});

	describe('getSessionCartErrors', () => {
		const successResponse = require('./__mocks__/getSessionCartErrors.json');
		const zipCode = '95973';
		const sessionCartId = '1234567890';

		it('should call with the default params', () => {
			client.get = jest.fn(() => Promise.resolve());
			CartService.getSessionCartErrors(sessionCartId, zipCode);

			expect(client.get).toBeCalledWith('/v1/ge/sessionCartErrors?sessionCartId=1234567890&zipCode=95973');
		});

		it('should return success response', () => {
			client.get = () => Promise.resolve(successResponse);

			expect.assertions(1);
			return expect(CartService.getSessionCartErrors(sessionCartId, zipCode)).resolves.toEqual(successResponse);
		});

		it('should return error response', () => {
			client.get = () => Promise.reject(errorResponse);

			expect.assertions(1);
			return expect(CartService.getSessionCartErrors(sessionCartId, zipCode)).rejects.toEqual(errorResponse);
		});
	});
});
