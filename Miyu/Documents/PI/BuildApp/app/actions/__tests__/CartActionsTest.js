
jest.mock('react-native-fbsdk');
jest.mock('react-native-simple-store', () => ({
	delete: jest.fn(() => ({ then: jest.fn() })),
}));
import simpleStore from 'react-native-simple-store';
jest.mock('../../../app/services/CartService', () => ({
	getSessionCart: jest.fn(() => Promise.resolve({})),
	updateSessionCart: jest.fn(() => Promise.resolve({})),
	deleteSessionCart: jest.fn(() => Promise.resolve({})),
	addSessionCartItems: jest.fn(() => Promise.resolve({})),
	addSessionCartSubItem: jest.fn(() => Promise.resolve({})),
	updateSessionCartItem: jest.fn(() => Promise.resolve({})),
	deleteSessionCartItem: jest.fn(() => Promise.resolve({})),
	copySessionCart: jest.fn(() => Promise.resolve({})),
	getCustomerCarts: jest.fn(() => Promise.resolve({})),
	saveSessionCartTemplate: jest.fn(() => Promise.resolve({})),
	sendQuote: jest.fn(() => Promise.resolve({})),
	loadQuote: jest.fn(() => Promise.resolve({})),
	addCoupon: jest.fn(() => Promise.resolve({})),
	removeCoupon: jest.fn(() => Promise.resolve({})),
	mergeSessionCarts: jest.fn(() => Promise.resolve()),
	getDeliveryDates: jest.fn(() => Promise.resolve()),
	getSessionCartErrors: jest.fn(() => Promise.resolve()),
	mergeSessionCartItemsAttachToProject: jest.fn(() => Promise.resolve()),
}));
import moment from 'moment';
import cartService from '../../services/CartService';
const dispatch = jest.fn();
const getState = jest.fn(() => ({
	userReducer: {
		user: {
			customerId: 1234,
		},
	},
	featuresReducer: {
		features: {},
	},
}));

jest.unmock('../../../app/actions/CartActions');

import cartActions from '../CartActions';

describe('CartActions', () => {

	describe('loadingSessionCart', () => {
		it('should return LOADING_SESSION_CART type', () => {
			const result = cartActions.loadingSessionCart();
			expect(result.type).toEqual('LOADING_SESSION_CART');
		});
	});

	describe('getSessionCartSuccess', () => {
		const cart = {};
		it('should return object with matching props', () => {
			const result = cartActions.getSessionCartSuccess(cart);
			expect(result.type).toEqual('GET_SESSION_CART_SUCCESS');
			expect(result.cart).toEqual(cart);
		});
	});

	describe('getSessionCartFail', () => {
		const error = new Error('Test error');
		it('should return object with matching props', () => {
			const result = cartActions.getSessionCartFail(error);
			expect(result.type).toEqual('GET_SESSION_CART_FAIL');
			expect(result.error).toEqual(error);
		});
	});

	describe('getSessionCart', () => {
		const options = {
			sessionCartId: 1234,
			recalculatePrice: true,
		};
		it('should return a function', () => {
			cartActions.getSessionCart(options)(dispatch);
			expect(cartService.getSessionCart).toBeCalledWith(options);
		});

		it('should dispatch loadingSessionCart', () => {
			const moreOptions = {
				...options,
				setLoading: true,
			};
			cartActions.getSessionCart(moreOptions)(dispatch);
			expect(cartService.getSessionCart).toHaveBeenCalledWith(options);
			expect(dispatch).toHaveBeenCalledWith(cartActions.loadingSessionCart());
		});
	});

	describe('updateSessionCartSuccess', () => {
		const cart = {};
		it('should return an object with matching props', () => {
			const result = cartActions.updateSessionCartSuccess(cart);
			expect(result.type).toEqual('UPDATE_SESSION_CART_SUCCESS');
			expect(result.cart).toEqual(cart);
		});
	});

	describe('updateSessionCartFail', () => {
		const error = new Error('test error');
		it('should return an object with matching props', () => {
			const result = cartActions.updateSessionCartFail(error);
			expect(result.type).toEqual('UPDATE_SESSION_CART_FAIL');
			expect(result.error).toEqual(error);
		});
	});

	describe('updateSessionCart', () => {
		const request = {};
		it('should return a function and call cartService.updateSessionCart', () => {
			cartActions.updateSessionCart(request)(dispatch, getState);
			expect(cartService.updateSessionCart).toBeCalled();
		});
	});

	describe('deleteSessionCartSuccess', () => {
		it('should return an object with type DELETE_SESSION_CART_SUCCESS', () => {
			const result = cartActions.deleteSessionCartSuccess();
			expect(result.type).toEqual('DELETE_SESSION_CART_SUCCESS');
		});
	});

	describe('deleteSessionCartFail', () => {
		const error = new Error('test error');
		it('should return an object with matching props', () => {
			const result = cartActions.deleteSessionCartFail(error);
			expect(result.type).toEqual('DELETE_SESSION_CART_FAIL');
			expect(result.error).toEqual(error);
		});
	});

	describe('deleteSessionCart', () => {
		it('should return a function and call cartService.deleteSessionCart', () => {
			cartActions.deleteSessionCart({})(dispatch);
			expect(cartService.deleteSessionCart).toBeCalledWith({});
		});
	});

	describe('addSessionCartItemsSuccess', () => {
		it('should return an object with type ADD_SESSION_CART_ITEMS_SUCCESS', () => {
			const result = cartActions.addSessionCartItemsSuccess();
			expect(result.type).toEqual('ADD_SESSION_CART_ITEMS_SUCCESS');
		});
	});

	describe('addSessionCartItemsItemFail', () => {
		const error = new Error('test');
		it('should return an object with matching props', () => {
			const result = cartActions.addSessionCartItemsItemFail(error);
			expect(result.type).toEqual('ADD_SESSION_CART_ITEMS_FAIL');
			expect(result.error).toEqual(error);
		});
	});

	describe('addSessionCartItems', () => {
		it('should call cartService.addSessionCartItems', () => {
			cartActions.addSessionCartItems({})(dispatch, getState);
			expect(cartService.addSessionCartItems).toBeCalledWith({
				customerId: 1234,
			});
		});
	});

	describe('addSessionCartSubItemSuccess', () => {
		it('should return an object with type ADD_SESSION_CART_SUBITEM_SUCCESS', () => {
			const result = cartActions.addSessionCartSubItemSuccess();
			expect(result.type).toEqual('ADD_SESSION_CART_SUBITEM_SUCCESS');
		});
	});

	describe('addSessionCartSubItemFail', () => {
		it('should return an object with matching props', () => {
			const error = new Error('test');
			const result = cartActions.addSessionCartSubItemFail(error);
			expect(result.type).toEqual('ADD_SESSION_CART_SUBITEM_FAIL');
			expect(result.error).toEqual(error);
		});
	});

	describe('addSessionCartSubItem', () => {
		it('should call cartService.addSessionCartSubItem', () => {
			cartActions.addSessionCartSubItem({})(dispatch, getState);
			expect(cartService.addSessionCartSubItem).toBeCalledWith({
				customerId: 1234,
			});
		});
	});

	describe('updateSessionCartItemFail', () => {
		it('should return an object with matching props', () => {
			const error = new Error('test');
			const result = cartActions.updateSessionCartItemFail(error);
			expect(result.type).toEqual('UPDATE_SESSION_CART_ITEM_FAIL');
			expect(result.error).toEqual(error);
		});
	});

	describe('updateSessionCartItem', () => {
		it('should call cartService.updateSessionCartItem', () => {
			cartActions.updateSessionCartItem({})(dispatch, getState);
			expect(cartService.updateSessionCartItem).toBeCalledWith({});
		});
	});

	describe('deleteSessionCartItemSuccess', () => {
		it('should return object with matching props', () => {
			const result = cartActions.deleteSessionCartItemSuccess(1234);
			expect(result.type).toEqual('DELETE_SESSION_CART_ITEM_SUCCESS');
			expect(result.payload).toEqual({
				itemKey: 1234,
			});
		});
	});

	describe('deleteSessionCartItemFail', () => {
		it('should return object with matching props', () => {
			const error = new Error('test');
			const result = cartActions.deleteSessionCartItemFail(error);
			expect(result.type).toEqual('DELETE_SESSION_CART_ITEM_FAIL');
			expect(result.error).toEqual(error);
		});
	});

	describe('deleteSessionCartItem', () => {
		it('should call cartService.deleteSessionCartItem', () => {
			cartActions.deleteSessionCartItem({})(dispatch);
			expect(cartService.deleteSessionCartItem).toBeCalledWith({});
		});
	});

	describe('copySessionCartSuccess', () => {
		it('should return an object with matching props', () => {
			const result = cartActions.copySessionCartSuccess({});
			expect(result.type).toEqual('COPY_SESSION_CART_SUCCESS');
			expect(result.payload).toEqual({});
		});
	});

	describe('copySessionCartFail', () => {
		it('should return an object with matching props', () => {
			const error = new Error('test');
			const result = cartActions.copySessionCartFail(error);
			expect(result.type).toEqual('COPY_SESSION_CART_FAIL');
			expect(result.payload).toEqual(error);
		});
	});

	describe('copySessionCart', () => {
		it('should call cartService.copySessionCart', () => {
			cartActions.copySessionCart({})(dispatch);
			expect(cartService.copySessionCart).toBeCalledWith({});
		});
	});

	describe('getCustomerCartsSuccess', () => {
		it('should return an object with matching props', () => {
			const result = cartActions.getCustomerCartsSuccess({});
			expect(result.type).toEqual('GET_CUSTOMER_CARTS_SUCCESS');
			expect(result.carts).toEqual({});
		});
	});

	describe('getCustomerCartsFail', () => {
		it('should return an object with matching props', () => {
			const error = new Error('test');
			const result = cartActions.getCustomerCartsFail(error);
			expect(result.type).toEqual('GET_CUSTOMER_CARTS_FAIL');
			expect(result.error).toEqual(error);
		});
	});

	describe('getCustomerCarts', () => {
		it('should call cartService.getCustomerCarts', () => {
			cartActions.getCustomerCarts()(dispatch, getState);
			expect(cartService.getCustomerCarts).toBeCalledWith({
				customerId: 1234,
			});
		});
	});

	describe('setSessionCartItemDeleteStatus', () => {
		it('should return an object with matching props', () => {
			const result = cartActions.setSessionCartItemDeleteStatus(123, 321);
			expect(result.type).toEqual('SET_SESSION_CART_ITEM_DELETE_STATUS');
			expect(result.payload).toEqual({
				cartItem: 123,
				deleteId: 321,
			});
		});
	});

	describe('clearSessionCartItemDeleteStatus', () => {
		it('should return an object with matching props', () => {
			const result = cartActions.clearSessionCartItemDeleteStatus(123);
			expect(result.type).toEqual('CLEAR_SESSION_CART_ITEM_DELETE_STATUS');
			expect(result.payload).toEqual({
				cartItem: 123,
			});
		});
	});

	describe('setSessionCartItemProps', () => {
		it('should return an object with matching props', () => {
			const result = cartActions.setSessionCartItemProps(654, {});
			expect(result.type).toEqual('SET_SESSION_CART_ITEM_PROPS');
			expect(result.cartItem).toEqual(654);
			expect(result.props).toEqual({});
		});
	});

	describe('setSelectedShippingIndex', () => {
		it('should return an object with matching props', () => {
			const result = cartActions.setSelectedShippingIndex(1);
			expect(result.type).toEqual('SET_SELECTED_SHIPPING_INDEX');
			expect(result.selectedShippingIndex).toEqual(1);
		});
	});

	describe('saveCartTemplateSuccess', () => {
		it('should return an object with type SAVE_CART_TEMPLATE_SUCCESS', () => {
			const result = cartActions.saveCartTemplateSuccess();
			expect(result.type).toEqual('SAVE_CART_TEMPLATE_SUCCESS');
		});
	});

	describe('saveCartTemplateFail', () => {
		it('should return an object with matching props', () => {
			const error = new Error('test');
			const result = cartActions.saveCartTemplateFail(error);
			expect(result.type).toEqual('SAVE_CART_TEMPLATE_FAIL');
			expect(result.error).toEqual(error);
		});
	});

	describe('saveCartTemplate', () => {
		it('should call cartService.saveSessionCartTemplate', () => {
			cartActions.saveCartTemplate({})(dispatch, getState);
			expect(cartService.saveSessionCartTemplate).toBeCalledWith({
				customerId: 1234,
			});
		});
	});

	describe('sendQuoteSuccess', () => {
		it('should return an object with type SEND_QUOTE_SUCCESS', () => {
			const result = cartActions.sendQuoteSuccess();
			expect(result.type).toEqual('SEND_QUOTE_SUCCESS');
		});
	});

	describe('sendQuoteFail', () => {
		it('should return an object with matching props', () => {
			const error = new Error('test');
			const result = cartActions.sendQuoteFail(error);
			expect(result.type).toEqual('SEND_QUOTE_FAIL');
			expect(result.error).toEqual(error);
		});
	});

	describe('sendQuote', () => {
		it('should call cartService.sendQuote', () => {
			cartActions.sendQuote({})(dispatch);
			expect(cartService.sendQuote).toBeCalledWith({});
		});
	});

	describe('loadQuoteSuccess', () => {
		it('should return an object with matching props', () => {
			const result = cartActions.loadQuoteSuccess(576);
			expect(result.type).toEqual('LOAD_QUOTE_SUCCESS');
			expect(result.quoteId).toEqual(576);
		});
	});

	describe('loadQuoteFail', () => {
		it('should return an object with matching props', () => {
			const error = new Error('test');
			const result = cartActions.loadQuoteFail(error);
			expect(result.type).toEqual('LOAD_QUOTE_FAIL');
			expect(result.error).toEqual(error);
		});
	});

	describe('loadQuote', () => {
		beforeEach(() => {
			cartService.loadQuote.mockClear();
		});

		it('should call cartService.loadQuote', () => {
			cartActions.loadQuote({})(dispatch);
			expect(cartService.loadQuote).toBeCalledWith({});
		});

		it('should dispatch loadQuoteSuccess and getSessionCart', () => {
			cartService.loadQuote = jest.fn(() => Promise.resolve({
				quote: {
					isValid: true,
					quoteId: 123,
				},
				sessionCartId: 1234,
			}));
			return cartActions.loadQuote({})(dispatch)
				.then(() => {
					expect(dispatch).toHaveBeenCalledWith(cartActions.loadQuoteSuccess(123));
				}).done();
		});
	});

	describe('mergeSessionCartsFail', () => {
		it('should return an object with matching props', () => {
			const error = new Error('test');
			const result = cartActions.mergeSessionCartsFail(error);
			expect(result.type).toEqual('MERGE_SESSION_CART_FAIL');
			expect(result.error).toEqual(error);
		});
	});

	describe('mergeSessionCarts', () => {
		it('should call cartService.mergeSessionCarts', () => {
			cartActions.mergeSessionCarts({}, false)(dispatch);
			expect(cartService.mergeSessionCarts).toBeCalledWith({});
		});
	});

	describe('addCouponSuccess', () => {
		it('should return an object with matching props', () => {
			const result = cartActions.addCouponSuccess({});
			expect(result.type).toEqual('ADD_COUPON_SUCCESS');
			expect(result.cart).toEqual({});
		});
	});

	describe('addCouponFail', () => {
		it('should return an object with matching props', () => {
			const error = new Error('test');
			const result = cartActions.addCouponFail(error);
			expect(result.type).toEqual('ADD_COUPON_FAIL');
			expect(result.error).toEqual(error);
		});
	});

	describe('addCoupon', () => {
		it('should call cartService.addCoupon', () => {
			cartActions.addCoupon({})(dispatch);
			expect(cartService.addCoupon).toBeCalledWith({});
		});
	});

	describe('removeCouponSuccess', () => {
		it('should return an object with matching props', () => {
			const result = cartActions.removeCouponSuccess({});
			expect(result.type).toEqual('REMOVE_COUPON_SUCCESS');
			expect(result.payload).toEqual({});
		});
	});

	describe('removeCouponFail', () => {
		it('should return an object with matching props', () => {
			const payload = new Error('test');
			const result = cartActions.removeCouponFail(payload);
			expect(result).toEqual({
				error: true,
				type: 'REMOVE_COUPON_FAIL',
				payload,
			});
		});
	});

	describe('removeCoupon', () => {
		it('should call cartService.removeCoupon', () => {
			cartActions.removeCoupon({})(dispatch);
			expect(cartService.removeCoupon).toBeCalledWith({});
		});
	});

	describe('clearCartDataSuccess', () => {
		it('should return a matching object', () => {
			const result = cartActions.clearCartDataSuccess();
			expect(result).toEqual({
				type: 'CLEAR_SESSION_CART_SUCCESS',
			});
		});
	});

	describe('clearSessionCart', () => {
		it('should call simpleStore.delete', () => {
			cartActions.clearSessionCart()(dispatch);
			expect(simpleStore.delete).toHaveBeenCalledWith('SESSION_CART_ID');
		});
	});

	describe('getDeliveryDates', () => {
		const zip = 12345;
		it('should call cartService.getDeliveryDates', () => {
			cartActions.getDeliveryDates(zip)(dispatch);
			expect(cartService.getDeliveryDates).toBeCalledWith(zip);
		});
	});

	describe('setDeliveryDate', () => {
		it('should return a matching object', () => {
			const result = cartActions.setDeliveryDate(moment.utc('2017-01-01', 'YYYY-MM-DD'));
			expect(result).toMatchSnapshot();
		});
	});

	describe('getSessionCartErrors', () => {
		it('should call cartService.getSessionCartErrors', () => {
			const sessionCartId = 0;
			const zipCode = 12345;
			cartActions.getSessionCartErrors(sessionCartId, zipCode)(dispatch);
			expect(cartService.getSessionCartErrors).toBeCalledWith(sessionCartId, zipCode);
		});
	});

	describe('mergeSessionCartItemsAttachToProject', () => {
		it('should call cartService.mergeSessionCartItemsAttachToProject', () => {
			const fromSessionCartId = 123;
			const toSessionCartId = 456;
			const projectId = 789;
			cartActions.mergeSessionCartItemsAttachToProject(fromSessionCartId, toSessionCartId, projectId)(dispatch);
			expect(cartService.mergeSessionCartItemsAttachToProject).toBeCalledWith({
				fromSessionCartId,
				toSessionCartId,
				projectId,
			});
		});
	});

	describe('mergeSessionCartItemsAttachToMultipleProjects', () => {
		it('should call Promise.all', () => {
			const spy = spyOn(Promise, 'all');
			const fromSessionCartId = 123;
			const projectIds = [789];
			const toSessionCartIds = { [projectIds[0]]: [456] };
			cartActions.mergeSessionCartItemsAttachToMultipleProjects(fromSessionCartId, toSessionCartIds, projectIds)(dispatch);
			expect(spy).toBeCalledWith([
				dispatch(cartActions.mergeSessionCartItemsAttachToProject(fromSessionCartId, toSessionCartIds[projectIds[0]], projectIds[0])),
			]);
		});
	});
});
