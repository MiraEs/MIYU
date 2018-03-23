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
	ADD_COUPON_SUCCESS,
	REMOVE_COUPON_SUCCESS,
	CLEAR_SESSION_CART_SUCCESS,
	LOADING_SESSION_CART,
	UNDO_STATUS,
	COPY_SESSION_CART_SUCCESS,
	LOAD_QUOTE_SUCCESS,
	UPDATE_CART_ITEM_BOUNCE,
	GET_DELIVERY_DATES,
	GET_DELIVERY_DATES_SUCCESS,
	SET_DELIVERY_DATE,
	GET_SESSION_CART_ERRORS,
	SET_SESSION_CART_ERRORS,
} from '../constants/CartConstants';
export const initialState = {
	cart: {
		sessionCartItems: [],
		sessionCartErrors: [],
		checkingErrors: false,
	},
	carts: [],
	selectedShippingIndex: 0,
	sessionCartItemDeleteQueue: [],
	quoteId: null,
	isLoading: false,
	bounceFirstRowOnMount: false,
};

export function updateCartItem(cartItem, cartItems) {

	return cartItems.map((currentItem) => {
		let item = { ...currentItem };

		if (item.itemKey === cartItem.itemKey) {
			item = Object.assign({}, item, cartItem);
			item.hasChanged = true;
		}

		if (item.hasSubItems) {
			item.subItems = item.subItems.map((subItem) => {
				if (subItem.itemKey === cartItem.itemKey) {
					subItem = Object.assign({}, subItem, cartItem);
					item.hasChanged = true;
				}
				return subItem;
			});
		}
		return item;
	});
}

function cartReducer(state = initialState, action = {}) {
	const { cartItem, deleteId, itemKey } = action.payload || {};
	let cart, sessionCartItems;

	switch (action.type) {
		case COPY_SESSION_CART_SUCCESS:
			cart = {
				...action.payload,
				sessionCartItems: action.payload.sessionCartItems || [],
			};
			return {
				...state,
				isLoading: false,
				cart,
			};
		case GET_SESSION_CART_SUCCESS:
			sessionCartItems = action.cart.sessionCartItems || [];

			state.sessionCartItemDeleteQueue.forEach((queueItem) => {
				sessionCartItems.forEach((cartItem) => {
					if (cartItem.hasSubItems) {
						cartItem.subItems.forEach((subItem) => {
							if (subItem.itemKey === queueItem.itemKey) {
								subItem.deleteStatus = UNDO_STATUS;
							}
						});
					}

					if (cartItem.itemKey === queueItem.itemKey) {
						cartItem.deleteStatus = UNDO_STATUS;
					}
				});
			});

			cart = {
				...action.cart,
				sessionCartItems,
			};

			return {
				...state,
				isLoading: false,
				cart,
			};
		case UPDATE_SESSION_CART_SUCCESS:
			cart = {
				...action.cart,
				sessionCartItems: action.cart.sessionCartItems || [],
			};

			return {
				...state,
				isLoading: false,
				selectedShippingIndex: !action.zipCode ? 0 : state.selectedShippingIndex,
				cart,
			};
		case DELETE_SESSION_CART_SUCCESS:
			return {
				...state,
				isLoading: false,
				cart: {
					sessionCartItems: [],
				},
			};
		case DELETE_SESSION_CART_ITEM_SUCCESS:
			return {
				...state,
				isLoading: false,
				sessionCartItemDeleteQueue: state.sessionCartItemDeleteQueue.filter((item) => item.itemKey !== itemKey),
			};
		case GET_CUSTOMER_CARTS_SUCCESS:
			return {
				...state,
				isLoading: false,
				carts: action.carts.sort((a, b) => {
					if (a.created < b.created) {
						return 1;
					}
					return -1;
				}),
			};
		case SET_SESSION_CART_ITEM_DELETE_STATUS:
			cartItem.deleteStatus = UNDO_STATUS;
			cart = {
				...state.cart,
				sessionCartItems: updateCartItem(cartItem, state.cart.sessionCartItems),
			};

			return {
				...state,
				isLoading: false,
				sessionCartItemDeleteQueue: state.sessionCartItemDeleteQueue.concat({
					itemKey: cartItem.itemKey,
					status: UNDO_STATUS,
					deleteId,
				}),
				cart,
			};
		case CLEAR_SESSION_CART_ITEM_DELETE_STATUS:
			delete cartItem.deleteStatus;
			cart = {
				...state.cart,
				sessionCartItems: updateCartItem(cartItem, state.cart.sessionCartItems),
			};

			return {
				...state,
				isLoading: false,
				sessionCartItemDeleteQueue: state.sessionCartItemDeleteQueue.filter((item) => {
					if (item.itemKey === cartItem.itemKey) {
						clearTimeout(item.deleteId);
						return false;
					}
					return true;
				}),
				cart,
			};
		case SET_SESSION_CART_ITEM_PROPS:
			cart = {
				...state.cart,
				sessionCartItems: state.cart.sessionCartItems.map((item) => {
					if (item.itemKey === action.cartItem.itemKey) {
						item = Object.assign({}, item, action.props);
					}
					return item;
				}),
			};

			return {
				...state,
				isLoading: false,
				cart,
			};
		case SET_SELECTED_SHIPPING_INDEX:
			return {
				...state,
				isLoading: false,
				selectedShippingIndex: action.selectedShippingIndex > -1 ? action.selectedShippingIndex : 0,
			};
		case ADD_COUPON_SUCCESS:
			return {
				...state,
				isLoading: false,
				cart: action.cart,
			};
		case REMOVE_COUPON_SUCCESS:
			return {
				...state,
				isLoading: false,
				cart: action.payload,
			};
		case CLEAR_SESSION_CART_SUCCESS:
			return {
				...initialState,
			};
		case LOADING_SESSION_CART:
			return {
				...state,
				isLoading: true,
			};
		case LOAD_QUOTE_SUCCESS:
			return {
				...state,
				quoteId: action.quoteId,
			};
		case UPDATE_CART_ITEM_BOUNCE:
			return {
				...state,
				bounceFirstRowOnMount: action.payload.shouldBounce,
			};
		case GET_DELIVERY_DATES:
			delete state.cart.availableDeliveryDates;
			return { ...state };
		case GET_DELIVERY_DATES_SUCCESS:
			return {
				...state,
				cart: {
					...state.cart,
					availableDeliveryDates: action.payload,
				},
			};
		case SET_DELIVERY_DATE:
			return {
				...state,
				cart: {
					...state.cart,
					...action.payload,
				},
			};
		case GET_SESSION_CART_ERRORS: {
			return {
				...state,
				cart: {
					...state.cart,
					checkingErrors: true,
				},
			};
		}
		case SET_SESSION_CART_ERRORS: {
			return {
				...state,
				cart: {
					...state.cart,
					sessionCartErrors: action.payload,
					checkingErrors: false,
				},
			};
		}
		default:
			return {
				...state,
				isLoading: false,
			};
	}
}

export default cartReducer;
