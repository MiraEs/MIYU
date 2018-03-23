'use strict';

import simpleStore from 'react-native-simple-store';
import client from './httpClient';
import {
	STORE_ID,
	SITE_ID,
} from '../constants/constants';
import helpers from '../lib/helpers';
import { CONSUMER_PRICEBOOK_ID } from '../constants/productDetailConstants';

const cartService = {

	createSessionCart(options) {
		const customerId = options.customerId ? `?customerId=${options.customerId}` : '';
		const url = `/v1/carts/sessionCarts/create${customerId}`;

		return client.post(url, options)
			.then((cart) => {
				helpers.serviceErrorCheck(cart);
				return simpleStore.save('SESSION_CART_ID', cart.sessionCartId).then(() => cart);
			})
			.catch((error) => { throw error; });
	},

	getSessionCart(options) {
		const recalculate = options.recalculatePrice ? 'actualTaxes/' : '';
		const url = `/v1/carts/sessionCarts/${recalculate}${options.sessionCartId}?storeId=${STORE_ID}`;
		return client.get(url)
			.then((cart) => {
				helpers.serviceErrorCheck(cart);
				return simpleStore.save('SESSION_CART_ID', cart.sessionCartId).then(() => cart);
			})
			.catch((error) => { throw error; });
	},

	deleteSessionCart(options) {
		const url = `/v1/carts/sessionCarts/${options.sessionCartId}?storeId=${STORE_ID}`;

		return client.delete(url)
			.then((data) => {
				helpers.serviceErrorCheck(data);
				return simpleStore.delete('SESSION_CART_ID');
			})
			.catch((error) => { throw error; });
	},

	updateSessionCart(options) {
		const actualTaxes = options.actualTaxes ? 'actualTaxes/' : '';
		const url = `/v1/carts/sessionCarts/${actualTaxes}${options.sessionCartId}`;
		return client.put(url, options.cart)
			.then((data) => {
				helpers.serviceErrorCheck(data);
				return data;
			})
			.catch((error) => { throw error; });
	},

	addSessionCartItems(options) {
		if (options.sessionCartId) {
			return this.addSessionCartItemsWithId(options);
		}
		else {
			return this.createSessionCart(options)
				.then((cart) => {
					helpers.serviceErrorCheck(cart);

					options.sessionCartId = cart.sessionCartId;
					return this.addSessionCartItemsWithId(options);
				})
				.catch((error) => { throw error; });
		}
	},

	addSessionCartItemsWithId(options) {
		const url = `/v1/carts/sessionCarts/${options.sessionCartId}/items?storeId=${STORE_ID}${options.postalCode ? `&postalCode=${options.postalCode}&postalCodeSource=${options.postalCodeSource}` : ''}`;
		return client.post(url, options.sessionCartItems)
			.then((cartItems) => {
				helpers.serviceErrorCheck(cartItems);
				return {
					sessionCartId: options.sessionCartId,
					cartItems,
				};
			})
			.catch((error) => {
				throw error;
			});
	},

	addSessionCartSubItem(options) {
		const url = `/v1/carts/sessionCarts/${options.sessionCartId}/subItem?storeId=${STORE_ID}&uniqueId=${options.uniqueId}&quantity=${options.quantity}&parentKey=${options.parentKey}`;

		return client.post(url)
			.then((results) => helpers.serviceErrorCheck(results))
			.catch((error) => { throw error; });
	},

	updateSessionCartItem(options) {
		const url = `/v1/carts/sessionCarts/${options.sessionCartId}/items/${options.itemKey}?storeId=${STORE_ID}`;

		return client.put(url, options.cartItem)
			.then((data) => {
				helpers.serviceErrorCheck(data);

				options.cartItem.itemKey = options.itemKey;
				return options.cartItem;
			})
			.catch((error) => { throw error; });
	},

	deleteSessionCartItem(options) {
		const url = `/v1/carts/sessionCarts/${options.sessionCartId}/items/${options.itemKey}?storeId=${STORE_ID}`;

		return client.delete(url)
			.then((data) => {
				helpers.serviceErrorCheck(data);
				return options.itemKey;
			})
			.catch((error) => { throw error; });
	},

	getCustomerCarts(options) {
		const url = `/v1/carts/templates/${options.customerId}?siteId=${SITE_ID}`;

		return client.get(url)
			.then((carts) => {
				helpers.serviceErrorCheck(carts);
				return carts;
			})
			.catch((error) => { throw error; });
	},

	saveSessionCartTemplate(options) {
		const url = `/v1/carts/templates/${options.customerId}/create`;
		options.siteId = SITE_ID;

		return client.post(url, options)
			.then((data) => {
				helpers.serviceErrorCheck(data);
			})
			.catch((error) => { throw error; });
	},

	sendQuote(options) {
		const url = '/v1/carts/quotes/send';
		const quotes = options.emails.map((email) => {
			return new Promise((resolve, reject) => {
				const { message, sessionCartId, subject, fromEmail, fromName } = options;

				client.post(url, {
					siteId: SITE_ID,
					toEmail: email,
					toName: email,
					fromName,
					fromEmail,
					message,
					sessionCartId,
					subject,
				})
					.then((data) => {
						if (data && data.code) {
							reject(data.code);
						}
						resolve();
					})
					.catch((error) => reject(error));
			});
		});

		return Promise.all(quotes)
			.then((result) => {
				helpers.serviceErrorCheck(result);
			})
			.catch((error) => {
				throw new Error(error.message);
			});
	},

	loadQuote(options) {
		options.siteId = SITE_ID;

		if (options.sessionCartId) {
			return this.loadQuoteWithId(options);
		}
		else {
			return this.createSessionCart(options)
				.then((cart) => {
					helpers.serviceErrorCheck(cart);

					options.sessionCartId = cart.sessionCartId;
					return this.loadQuoteWithId(options);
				})
				.catch((error) => { throw error; });
		}
	},

	loadQuoteWithId(options) {
		const url = '/v1/carts/quotes/load';

		return client.post(url, options)
			.then((quote) => {
				helpers.serviceErrorCheck(quote);
				return { quote, sessionCartId: options.sessionCartId };
			})
			.catch((error) => { throw error; });
	},

	copySessionCart(options) {
		const customerId = options.customerId ? `?customerId=${options.customerId}` : '';
		const url = `/v1/carts/sessionCarts/${options.sessionCartId}/copy${customerId}`;

		return client.post(url, options)
			.then((cart) => {
				helpers.serviceErrorCheck(cart);
				return simpleStore.save('SESSION_CART_ID', cart.sessionCartId).then(() => cart);
			})
			.catch((error) => { throw error; });
	},

	mergeSessionCarts(options) {
		if (options.toSessionCartId) {
			return this.mergeSessionCartsWithId(options);
		}
		else {
			return this.createSessionCart(options)
				.then((cart) => {
					helpers.serviceErrorCheck(cart);

					options.toSessionCartId = cart.sessionCartId;
					return this.mergeSessionCartsWithId(options);
				})
				.catch((error) => { throw error; });
		}
	},

	mergeSessionCartsWithId(options) {
		const url = `/v1/carts/sessionCarts/${options.fromSessionCartId}/merge?mergeToSessionCartId=${options.toSessionCartId}`;

		return client.post(url, {})
			.then((results) => {
				helpers.serviceErrorCheck(results);
				return results;
			})
			.catch((error) => { throw error; });
	},

	addCoupon(options) {
		const url = `/v1/coupon/add?sessionCartId=${options.sessionCartId}&code=${options.couponCode}`;

		return client.post(url, options)
			.then((data) => {
				helpers.serviceErrorCheck(data);
				return data;
			})
			.catch((error) => { throw error; });
	},

	removeCoupon(options) {
		const recalculate = options.recalculatePrice ? '&recalculatePrice=true' : '';
		const url = `/v1/coupon/remove?sessionCartId=${options.sessionCartId}&couponCode=${options.couponCode}${recalculate}`;

		return client.delete(url, options)
			.then((data) => {
				helpers.serviceErrorCheck(data);
				return data;
			})
			.catch((error) => { throw error; });
	},

	getDeliveryDates(zipCode) {
		const url = `/v1/ge/deliveryDates?zipCode=${zipCode}`;

		return client.get(url);
	},

	getSessionCartErrors(sessionCartId, zipCode) {
		const url = `/v1/ge/sessionCartErrors?sessionCartId=${sessionCartId}&zipCode=${zipCode}`;

		return client.get(url);
	},

	mergeSessionCartItemsAttachToProject(options) {
		const { fromSessionCartId, toSessionCartId, projectId } = options;
		const queryParams = `?toSessionCartId=${toSessionCartId}&projectSessionCartId=${toSessionCartId}&projectId=${projectId}&pricebookId=${CONSUMER_PRICEBOOK_ID}`;
		const url = `/v1/carts/sessionCarts/${fromSessionCartId}/mergeSessionCartItemsAttachToProject/${queryParams}`;
		return client.post(url);
	},
};

module.exports = cartService;
