'use strict';

jest.unmock('../../../app/reducers/cartReducer');

import cartReducer, {
	updateCartItem,
} from '../cartReducer';

import {
	GET_SESSION_CART_SUCCESS,
	UPDATE_SESSION_CART_SUCCESS,
	DELETE_SESSION_CART_SUCCESS,
	DELETE_SESSION_CART_ITEM_SUCCESS,
	GET_CUSTOMER_CARTS_SUCCESS,
	SET_SESSION_CART_ITEM_DELETE_STATUS,
	CLEAR_SESSION_CART_ITEM_DELETE_STATUS,
	SET_SESSION_CART_ITEM_PROPS,
	SET_SELECTED_SHIPPING_INDEX,
	UNDO_STATUS,
	GET_DELIVERY_DATES,
	GET_DELIVERY_DATES_SUCCESS,
	SET_DELIVERY_DATE,
	GET_SESSION_CART_ERRORS,
	SET_SESSION_CART_ERRORS,
} from '../../constants/CartConstants';

const key = 'key';

describe('app/reducers/cartReducer.js', () => {

	describe('updateCartItem function', () => {
		const cartItem = {
			itemKey: key,
		};
		const cartItems = [
			cartItem,
		];
		const updateItem = {
			itemKey: key,
			updated: true,
			hasChanged: true,
		};
		it('should set cart item with key matching \'cartItem.itemKey\' to \'cartItem\'', () => {
			const updatedItems = updateCartItem(updateItem, cartItems);
			expect(updatedItems[0]).toEqual(updateItem);
		});
	});

	describe('cartReducer function', () => {
		const item1 = {
			itemKey: key,
			hasSubItems: true,
			subItems: [{}],
		};
		const item2 = {
			hasSubItems: false,
		};
		const items = [
			item1,
			item2,
		];

		const _testIsLoading = (state, loading=false) => {
			it('should set isLoading to false', () => {
				expect(state.isLoading).toBe(loading);
			});
		};

		describe('GET_SESSION_CART_SUCCESS action', () => {
			const action = {
				type: GET_SESSION_CART_SUCCESS,
				cart: {
					sessionCartItems: items,
				},
			};
			const state = cartReducer(undefined, action);
			_testIsLoading(state);

			it('should set \'cart\' property to action.payload', () => {
				expect(state.cart).toEqual(action.cart);
			});
		});

		describe('UPDATE_SESSION_CART_SUCCESS action', () => {
			const action = {
				type: UPDATE_SESSION_CART_SUCCESS,
				cart: {
					sessionCartItems: items,
				},
			};
			const state = cartReducer(undefined, action);
			_testIsLoading(state);

			it('should update cart property to action.cart', () => {
				expect(state.cart).toEqual(action.cart);
			});
		});

		describe('DELETE_SESSION_CART_SUCCESS action', () => {
			const action = {
				type: DELETE_SESSION_CART_SUCCESS,
			};
			const newState = {
				cart: { sessionCartItems: items },
			};
			const state = cartReducer(newState, action);
			_testIsLoading(state);

			it('should clear the cart', () => {
				expect(state.cart).toEqual({ sessionCartItems: [] });
			});
		});

		describe('SET_SESSION_CART_ITEM_DELETE_STATUS action', () => {
			const action = {
				type: SET_SESSION_CART_ITEM_DELETE_STATUS,
				payload: { cartItem: { itemKey: key }, deleteId: 123 },
			};
			const newState = {
				sessionCartItemDeleteQueue: [],
				cart: {
					sessionCartItems: items,
				},
			};
			const state = cartReducer(newState, action);
			_testIsLoading(state);

			it('should set sessionCartItemDeleteQueue as one item with undo status', () => {
				expect(state.sessionCartItemDeleteQueue[0].itemKey).toEqual(action.payload.cartItem.itemKey);
			});
		});

		describe('CLEAR_SESSION_CART_ITEM_DELETE_STATUS action', () => {
			const action = {
				type: CLEAR_SESSION_CART_ITEM_DELETE_STATUS,
				payload: { cartItem: { itemKey: key }},
			};
			const newState = {
				sessionCartItemDeleteQueue: [
					{
						itemKey: key,
						status: UNDO_STATUS,
					},
					{
						itemKey: 'key2',
						status: UNDO_STATUS,
					},
				],
				cart: {
					sessionCartItems: items,
				},
			};
			const state = cartReducer(newState, action);
			_testIsLoading(state);

			it('should clear sessionCartItemDeleteQueue of item with requested itemKey', () => {
				expect(state.sessionCartItemDeleteQueue.length).toEqual(1);
				expect(state.sessionCartItemDeleteQueue[0].itemKey).toEqual('key2');
			});
		});

		describe('DELETE_SESSION_CART_ITEM_SUCCESS action', () => {
			const action = {
				type: DELETE_SESSION_CART_ITEM_SUCCESS,
			};
			const state = cartReducer(undefined, action);
			_testIsLoading(state);
		});

		describe('GET_CUSTOMER_CARTS_SUCCESS action', () => {
			const action = {
				type: GET_CUSTOMER_CARTS_SUCCESS,
				carts: [{
					created: 1,
					name: 'TEST 1',
					sessionCartId: 1,
				}, {
					created: 2,
					name: 'TEST 2',
					sessionCartId: 2,
				}],
			};
			const state = cartReducer(undefined, action);
			_testIsLoading(state);

			it('should set carts to action.carts', () => {
				expect(state.carts).toEqual(action.carts);
			});
		});

		describe('SET_SESSION_CART_ITEM_PROPS', () => {
			const action = {
				type: SET_SESSION_CART_ITEM_PROPS,
				cartItem: {
					itemKey: key,
					updated: true,
				},
				props: {
					prop: 'prop',
				},
			};
			const newState = {
				cart: {
					sessionCartItems: [
						{
							itemKey: key,
						},
					],
				},
			};
			const state = cartReducer(newState, action);
			_testIsLoading(state);
			it('should add props from action to cart item with key to action.cartItem.key', () => {
				expect(state.cart.sessionCartItems[0].prop).toBe(action.props.prop);
			});
		});

		describe('SET_SELECTED_SHIPPING_INDEX action', () => {
			const action = {
				type: SET_SELECTED_SHIPPING_INDEX,
				selectedShippingIndex: 0,
			};
			const state = cartReducer(undefined, action);
			_testIsLoading(state);

			it('should set selectedShippingIndex to action.selectedShippingIndex', () => {
				expect(state.selectedShippingIndex).toBe(action.selectedShippingIndex);
			});
		});

		describe('GET_DELIVERY_DATES action', () => {
			const action = { type: GET_DELIVERY_DATES };
			const initialState = {
				cart: {
					availableDeliveryDates: [],
				},
			};
			const state = cartReducer(initialState, action);
			it('should cause delivery dates from initial state to be undefined', () => {
				expect(state.cart.availableDeliveryDates).toBeUndefined();
			});
		});

		describe('GET_DELIVERY_DATES_SUCCESS action', () => {
			const payload = [ 'date' ];
			const action = {
				type: GET_DELIVERY_DATES_SUCCESS,
				payload,
			};
			const state = cartReducer(undefined, action);
			it('should set the available delivery dates to the cart', () => {
				expect(state.cart.availableDeliveryDates).toBe(payload);
			});
		});

		describe('SET_DELIVERY_DATE actions', () => {
			const payload = 'date';
			const action = {
				type: SET_DELIVERY_DATE,
				payload,
			};
			const state = cartReducer(undefined, action);
			it('should set the requested delivery date to the cart', () => {
				expect(state.cart.requestedDeliveryDate).toBe(payload.requestedDeliveryDate);
			});
			it('should set the deliveryDates object', () => {
				expect(state.cart.deliveryDates).toBe(payload.deliveryDates);
			});
		});

		describe('GET_SESSION_CART_ERRORS actions', () => {
			const action = { type: GET_SESSION_CART_ERRORS };
			const state = cartReducer(undefined, action);
			it('should set checkingErrors to true', () => {
				expect(state.cart.checkingErrors).toBeTruthy();
			});
		});

		describe('SET_SESSION_CART_ERRORS action', () => {
			const payload = [ 'error' ];
			const action = {
				type: SET_SESSION_CART_ERRORS,
				payload,
			};
			const state = cartReducer(undefined, action);
			it('should set the session cart errors to the cart', () => {
				expect(state.cart.sessionCartErrors).toBe(payload);
			});
			it('should set checkingErrors to false', () => {
				expect(state.cart.checkingErrors).not.toBeTruthy();
			});
		});

	});
});
