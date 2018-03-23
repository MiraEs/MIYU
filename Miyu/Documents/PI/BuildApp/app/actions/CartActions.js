'use strict';
import {
	GET_SESSION_CART_SUCCESS,
	GET_SESSION_CART_FAIL,
	LOADING_SESSION_CART,
	UPDATE_SESSION_CART_SUCCESS,
	UPDATE_SESSION_CART_FAIL,
	DELETE_SESSION_CART_SUCCESS,
	DELETE_SESSION_CART_FAIL,
	ADD_SESSION_CART_ITEMS_SUCCESS,
	ADD_SESSION_CART_ITEMS_FAIL,
	ADD_SESSION_CART_SUBITEM_SUCCESS,
	ADD_SESSION_CART_SUBITEM_FAIL,
	UPDATE_SESSION_CART_ITEM_FAIL,
	DELETE_SESSION_CART_ITEM_SUCCESS,
	DELETE_SESSION_CART_ITEM_FAIL,
	GET_CUSTOMER_CARTS_SUCCESS,
	GET_CUSTOMER_CARTS_FAIL,
	SET_SESSION_CART_ITEM_DELETE_STATUS,
	CLEAR_SESSION_CART_ITEM_DELETE_STATUS,
	SET_SESSION_CART_ITEM_PROPS,
	SET_SELECTED_SHIPPING_INDEX,
	SAVE_CART_TEMPLATE_SUCCESS,
	SAVE_CART_TEMPLATE_FAIL,
	SEND_QUOTE_SUCCESS,
	SEND_QUOTE_FAIL,
	LOAD_QUOTE_SUCCESS,
	LOAD_QUOTE_FAIL,
	MERGE_SESSION_CART_FAIL,
	ADD_COUPON_SUCCESS,
	ADD_COUPON_FAIL,
	REMOVE_COUPON_SUCCESS,
	REMOVE_COUPON_FAIL,
	CLEAR_SESSION_CART_SUCCESS,
	COPY_SESSION_CART_SUCCESS,
	COPY_SESSION_CART_FAIL,
	UPDATE_CART_ITEM_BOUNCE,
	GET_DELIVERY_DATES,
	GET_DELIVERY_DATES_SUCCESS,
	SET_DELIVERY_DATE,
	GET_SESSION_CART_ERRORS,
	SET_SESSION_CART_ERRORS,
} from '../constants/CartConstants';
import cartService from '../services/CartService';
import simpleStore from 'react-native-simple-store';
import { createAction } from 'redux-actions';
import SimpleStoreHelpers from '../lib/SimpleStoreHelpers';
import { findMessage } from '../locales/en';

const updateCartItemBounce = createAction(UPDATE_CART_ITEM_BOUNCE, (shouldBounce) => {
	SimpleStoreHelpers.setShouldNewCartBounce(shouldBounce).done();
	return { shouldBounce };
});

function loadingSessionCart() {
	return {
		type: LOADING_SESSION_CART,
	};
}

function getSessionCartSuccess(cart) {
	return {
		type: GET_SESSION_CART_SUCCESS,
		cart,
	};
}

function getSessionCartFail(error) {
	return {
		type: GET_SESSION_CART_FAIL,
		error,
	};
}

function getSessionCart(options) {
	return (dispatch) => {
		const request = {
			sessionCartId: options.sessionCartId,
			recalculatePrice: options.recalculatePrice,
		};

		if (options.setLoading) {
			dispatch(loadingSessionCart());
		}

		return cartService.getSessionCart(request)
			.then((data) => dispatch(getSessionCartSuccess(data)))
			.catch((error) => {
				dispatch(getSessionCartFail(error));
				throw new Error(error);
			});
	};
}

function updateSessionCartSuccess(cart) {
	return {
		type: UPDATE_SESSION_CART_SUCCESS,
		cart,
	};
}

function updateSessionCartFail(error) {
	return {
		type: UPDATE_SESSION_CART_FAIL,
		error,
	};
}

function updateSessionCart(request) {
	return (dispatch, getState) => {

		return cartService.updateSessionCart({
			...request,
			actualTaxes: getState().featuresReducer.features.actualTaxes ? request.actualTaxes : false,
		})
		.then((cart) => {
			return dispatch(getSessionCart({
				sessionCartId: cart.sessionCartId,
				recalculatePrice: true,
			}));
		})
		.catch((error) => {
			dispatch(updateSessionCartFail(error.message));
			throw error;
		});
	};
}

function deleteSessionCartSuccess() {
	return {
		type: DELETE_SESSION_CART_SUCCESS,
	};
}

function deleteSessionCartFail(error) {
	return {
		type: DELETE_SESSION_CART_FAIL,
		error,
	};
}

function deleteSessionCart(request) {
	return (dispatch) => {
		dispatch(loadingSessionCart());

		return cartService.deleteSessionCart(request)
			.then(() => {
				dispatch(deleteSessionCartSuccess());
				dispatch(updateCartItemBounce(true));
			})
			.catch((error) => {
				dispatch(deleteSessionCartFail(error));
				throw new Error(error);
			});
	};
}

function addSessionCartItemsSuccess() {
	return {
		type: ADD_SESSION_CART_ITEMS_SUCCESS,
	};
}

function addSessionCartItemsItemFail(error) {
	return {
		type: ADD_SESSION_CART_ITEMS_FAIL,
		error,
	};
}

function addSessionCartItems(request) {
	return (dispatch, getState) => {
		request.customerId = getState().userReducer.user.customerId;
		dispatch(loadingSessionCart());

		return cartService.addSessionCartItems(request)
			.then((results) => {
				dispatch(getSessionCart({ sessionCartId: results.sessionCartId }));
				dispatch(addSessionCartItemsSuccess());
				return results;
			})
			.catch((error) => {
				dispatch(addSessionCartItemsItemFail(error));
				throw new Error(error);
			});
	};
}

function addSessionCartSubItemSuccess() {
	return {
		type: ADD_SESSION_CART_SUBITEM_SUCCESS,
	};
}

function addSessionCartSubItemFail(error) {
	return {
		type: ADD_SESSION_CART_SUBITEM_FAIL,
		error,
	};
}

function addSessionCartSubItem(request) {
	return (dispatch, getState) => {
		request.customerId = getState().userReducer.user.customerId;
		dispatch(loadingSessionCart());

		return cartService.addSessionCartSubItem(request)
			.then(() => {
				dispatch(getSessionCart({ sessionCartId: request.sessionCartId }));
				dispatch(addSessionCartSubItemSuccess());
			})
			.catch((error) => {
				dispatch(addSessionCartSubItemFail(error));
				throw new Error(error);
			});
	};
}

function updateSessionCartItemFail(error) {
	return {
		type: UPDATE_SESSION_CART_ITEM_FAIL,
		error,
	};
}

function updateSessionCartItem(request) {
	return (dispatch) => {

		return cartService.updateSessionCartItem(request)
			.then(() => {
				dispatch(getSessionCart({
					sessionCartId: request.sessionCartId,
					setLoading: false,
				}));
			})
			.catch((error) => {
				dispatch(updateSessionCartItemFail(error));
				throw new Error(error);
			});
	};
}

function deleteSessionCartItemSuccess(itemKey) {
	return {
		type: DELETE_SESSION_CART_ITEM_SUCCESS,
		payload: { itemKey },
	};
}

function deleteSessionCartItemFail(error) {
	return {
		type: DELETE_SESSION_CART_ITEM_FAIL,
		error,
	};
}

function deleteSessionCartItem(request) {
	return (dispatch) => {

		return cartService.deleteSessionCartItem(request)
			.then((data) => {
				dispatch(deleteSessionCartItemSuccess(data));
				dispatch(getSessionCart({ sessionCartId: request.sessionCartId }));
			})
			.catch((error) => {
				dispatch(deleteSessionCartItemFail(error));
				throw new Error(error);
			});
	};
}

const copySessionCartSuccess = createAction(COPY_SESSION_CART_SUCCESS);
const copySessionCartFail = createAction(COPY_SESSION_CART_FAIL);

function copySessionCart(request) {
	return (dispatch) => {
		return cartService.copySessionCart(request)
			.then((cart) => {
				dispatch(copySessionCartSuccess(cart));
				return cart;
			})
			.catch((error) => {
				dispatch(copySessionCartFail(error));
				throw new Error(error);
			});
	};

}

function getCustomerCartsSuccess(carts) {
	return {
		type: GET_CUSTOMER_CARTS_SUCCESS,
		carts,
	};
}

function getCustomerCartsFail(error) {
	return {
		type: GET_CUSTOMER_CARTS_FAIL,
		error,
	};
}

function getCustomerCarts() {
	return (dispatch, getState) => {
		const request = {
			customerId: getState().userReducer.user.customerId,
		};

		return cartService.getCustomerCarts(request)
			.then((data) => dispatch(getCustomerCartsSuccess(data)))
			.catch((error) => {
				dispatch(getCustomerCartsFail(error));
				throw new Error(error);
			});
	};
}

function setSessionCartItemDeleteStatus(cartItem, deleteId) {
	return {
		type: SET_SESSION_CART_ITEM_DELETE_STATUS,
		payload: { cartItem, deleteId },
	};
}

function clearSessionCartItemDeleteStatus(cartItem) {
	return {
		type: CLEAR_SESSION_CART_ITEM_DELETE_STATUS,
		payload: { cartItem },
	};
}

function setSessionCartItemProps(cartItem, props) {
	return {
		type: SET_SESSION_CART_ITEM_PROPS,
		cartItem,
		props,
	};
}

function setSelectedShippingIndex(selectedShippingIndex) {
	return {
		type: SET_SELECTED_SHIPPING_INDEX,
		selectedShippingIndex,
	};
}

function saveCartTemplateSuccess() {
	return {
		type: SAVE_CART_TEMPLATE_SUCCESS,
	};
}

function saveCartTemplateFail(error) {
	return {
		type: SAVE_CART_TEMPLATE_FAIL,
		error,
	};
}

function saveCartTemplate(request) {
	return (dispatch, getState) => {
		request.customerId = getState().userReducer.user.customerId;

		return cartService.saveSessionCartTemplate(request)
			.then(() => dispatch(saveCartTemplateSuccess()))
			.catch((error) => {
				dispatch(saveCartTemplateFail(error));
				throw new Error(error);
			});
	};
}

function sendQuoteSuccess() {
	return {
		type: SEND_QUOTE_SUCCESS,
	};
}

function sendQuoteFail(error) {
	return {
		type: SEND_QUOTE_FAIL,
		error,
	};
}

function sendQuote(request) {
	return (dispatch) => {
		return cartService.sendQuote(request)
			.then(() => dispatch(sendQuoteSuccess()))
			.catch((error) => {
				dispatch(sendQuoteFail(error));
				throw new Error(error);
			});
	};
}

function loadQuoteSuccess(quoteId) {
	return {
		type: LOAD_QUOTE_SUCCESS,
		quoteId,
	};
}

function loadQuoteFail(error) {
	return {
		type: LOAD_QUOTE_FAIL,
		error,
	};
}

function loadQuote(request) {
	return (dispatch) => {
		dispatch(loadingSessionCart());

		return cartService.loadQuote(request)
			.then((results) => {
				const { quote: { isValid, quoteId, validationStatus }, sessionCartId } = results;
				const message = findMessage(validationStatus);
				if (isValid) {
					dispatch(loadQuoteSuccess(quoteId));
					dispatch(getSessionCart({sessionCartId}));
				} else {
					throw new Error(message);
				}
			})
			.catch((error) => {
				dispatch(loadQuoteFail(error));
				throw new Error(error);
			});
	};
}

function mergeSessionCartsFail(error) {
	return {
		type: MERGE_SESSION_CART_FAIL,
		error,
	};
}

function mergeSessionCarts(request, shouldBounce = false) {
	return (dispatch) => {
		dispatch(loadingSessionCart());

		return cartService.mergeSessionCarts(request)
			.then((results) => {
				dispatch(getSessionCart({ sessionCartId: results.sessionCartId }));
			})
			.then(() => {
				dispatch(updateCartItemBounce(shouldBounce));
			})
			.catch((error) => {
				dispatch(mergeSessionCartsFail(error));
				throw new Error(error);
			});
	};
}

function addCouponSuccess(cart) {
	return {
		type: ADD_COUPON_SUCCESS,
		cart,
	};
}

function addCouponFail(error) {
	return {
		type: ADD_COUPON_FAIL,
		error,
	};
}

function addCoupon(request) {
	return (dispatch) => {

		return cartService.addCoupon(request)
			.then((cart) => {
				dispatch(addCouponSuccess(cart));
			})
			.catch((error) => {
				dispatch(addCouponFail(error));
				throw new Error(error);
			});
	};
}

const removeCouponSuccess = createAction(REMOVE_COUPON_SUCCESS);
const removeCouponFail = createAction(REMOVE_COUPON_FAIL);

function removeCoupon(request) {
	return (dispatch) => {
		return cartService.removeCoupon(request)
			.then((cart) => {
				dispatch(removeCouponSuccess(cart));
			})
			.catch((error) => {
				dispatch(removeCouponFail(error));
				throw new Error(error);
			});
	};
}

function clearCartDataSuccess() {
	return {
		type: CLEAR_SESSION_CART_SUCCESS,
	};
}

function clearSessionCart() {
	return (dispatch) => {
		return simpleStore.delete('SESSION_CART_ID')
			.then(() => {
				dispatch(clearCartDataSuccess());
				dispatch(updateCartItemBounce(true));
			});
	};
}

function getDeliveryDates(zipCode) {
	return (dispatch) => {
		dispatch(createAction(GET_DELIVERY_DATES)());
		cartService.getDeliveryDates(zipCode)
		.then((dates) => {
			dispatch(createAction(GET_DELIVERY_DATES_SUCCESS)(dates));
			return dates;
		});
	};
}

const setDeliveryDate = createAction(SET_DELIVERY_DATE, (requestedDeliveryDate, cartItemIds = []) => {
	const deliveryDates = {};
	cartItemIds.forEach((item) => deliveryDates[item] = requestedDeliveryDate.toISOString());
	return {
		deliveryDates,
		requestedDeliveryDate,
	};
});

function getSessionCartErrors(sessionCartId, zipCode) {
	return (dispatch) => {
		dispatch(createAction(GET_SESSION_CART_ERRORS)());
		return cartService.getSessionCartErrors(sessionCartId, zipCode)
		.then((errors) => {
			dispatch(createAction(SET_SESSION_CART_ERRORS)(errors));
			return errors;
		});
	};
}

function mergeSessionCartItemsAttachToProject(fromSessionCartId, toSessionCartId, projectId) {
	return (dispatch) => {
		return cartService.mergeSessionCartItemsAttachToProject({ fromSessionCartId, toSessionCartId, projectId })
			.then((response) => {
				dispatch(createAction('MERGE_SESSION_CART_ITEMS_ATTACH_TO_PROJECT_SUCCESS')(response));
			})
			.catch((error) => dispatch(createAction('MERGE_SESSION_CART_ITEMS_ATTACH_TO_PROJECT_SUCCESS')(error)));
	};
}

function mergeSessionCartItemsAttachToMultipleProjects(fromSessionCartId, toSessionCartIds, projectIds) {
	return (dispatch) => {
		const mergeSessionsCalls = [];
		projectIds.forEach((projectId) => {
			toSessionCartIds[projectId].forEach((toSessionCartId) => {
				mergeSessionsCalls.push(
					dispatch(mergeSessionCartItemsAttachToProject(fromSessionCartId, toSessionCartId, projectId))
				);
			});
		});
		return Promise.all(mergeSessionsCalls);
	};
}

module.exports = {
	updateCartItemBounce,
	loadingSessionCart,
	getSessionCartSuccess,
	getSessionCartFail,
	getSessionCart,
	updateSessionCartSuccess,
	updateSessionCartFail,
	updateSessionCart,
	deleteSessionCartSuccess,
	deleteSessionCartFail,
	deleteSessionCart,
	addSessionCartItemsSuccess,
	addSessionCartItemsItemFail,
	addSessionCartItems,
	addSessionCartSubItemSuccess,
	addSessionCartSubItemFail,
	addSessionCartSubItem,
	updateSessionCartItemFail,
	updateSessionCartItem,
	deleteSessionCartItemSuccess,
	deleteSessionCartItemFail,
	deleteSessionCartItem,
	copySessionCartSuccess,
	copySessionCartFail,
	copySessionCart,
	getCustomerCartsSuccess,
	getCustomerCartsFail,
	getCustomerCarts,
	setSessionCartItemDeleteStatus,
	clearSessionCartItemDeleteStatus,
	setSessionCartItemProps,
	setSelectedShippingIndex,
	saveCartTemplateSuccess,
	saveCartTemplateFail,
	saveCartTemplate,
	sendQuoteSuccess,
	sendQuoteFail,
	sendQuote,
	loadQuoteSuccess,
	loadQuoteFail,
	loadQuote,
	mergeSessionCartsFail,
	mergeSessionCarts,
	addCouponSuccess,
	addCouponFail,
	addCoupon,
	removeCouponSuccess,
	removeCouponFail,
	removeCoupon,
	clearCartDataSuccess,
	clearSessionCart,
	getDeliveryDates,
	setDeliveryDate,
	getSessionCartErrors,
	mergeSessionCartItemsAttachToProject,
	mergeSessionCartItemsAttachToMultipleProjects,
};
