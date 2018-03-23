
import { createAction } from 'redux-actions';
import productService from '../services/productService';

export const SET_AVAILABILITY = 'SET_AVAILABILITY';
export const GET_AVAILABILITY = 'GET_AVAILABILITY';
export const GET_AVAILABILITY_SUCCESS = 'GET_AVAILABILITY_SUCCESS';
export const GET_AVAILABILITY_FAIL = 'GET_AVAILABILITY_FAIL';
export const AVAILABILITY = {
	UNKNOWN: 'UNKNOWN',
	OUT_OF_STOCK: 'OUT_OF_STOCK',
	IN_STOCK: 'IN_STOCK',
	INSUFFICIANT_QUANTITY: 'INSUFFICIENT_QUANTITY',
	BACKORDERED: 'BACKORDERED',
};

const getProductCompositeSuccess = createAction('GET_PRODUCT_COMPOSITE_SUCCESS');

function getProductComposite({ compositeId, uniqueId }) {
	return async function(dispatch) {
		let getProductComposite;
		if (compositeId) {
			getProductComposite = productService.getProductCompositeById.bind(this, { compositeId });
		} else if (uniqueId) {
			getProductComposite = productService.getProductCompositeByUniqueId.bind(this, { uniqueId });
		} else {
			return;
		}
		const productComposite = await getProductComposite();
		dispatch(getProductCompositeSuccess(productComposite));
	};
}

const getProductAttachmentsSuccess = createAction('GET_PRODUCT_ATTACHMENTS_SUCCESS');

function getProductAttachments(compositeId) {
	return async function(dispatch) {
		const attachments = await productService.getProductAttachments({ compositeId });
		dispatch(getProductAttachmentsSuccess({
			compositeId,
			attachments,
		}));
	};
}

const getProductCompositeDescriptionSuccess = createAction('GET_PRODUCT_COMPOSITE_DESCRIPTION_SUCCESS');
const getProductCompositeDescriptionError = createAction('GET_PRODUCT_COMPOSITE_DESCRIPTION_ERROR');

function getProductCompositeDescription({ compositeId }) {
	return (dispatch) => {
		productService.getProductCompositeDescription({ compositeId }).then((payload) => {
			dispatch(getProductCompositeDescriptionSuccess({
				...payload,
				compositeId,
			}));
		}).catch((error) => {
			dispatch(getProductCompositeDescriptionError({
				error,
				compositeId,
			}));
		});
	};
}

const availabilityAction = createAction('AVAILABILITY_ACTION');

function setAvailability(compositeId, availability) {
	return availabilityAction({
		event: SET_AVAILABILITY,
		compositeId,
		availability,
	});
}

function getAvailability(compositeId, uniqueId, zipCode, quantity) {
	return (dispatch) => {
		dispatch(availabilityAction({
			event: GET_AVAILABILITY,
			compositeId,
		}));
		return productService.getAvailability(uniqueId, zipCode, quantity)
		.then((availability) => {
			availability.zipCode = zipCode;
			const { quantityAvailable, inTransitQuantity } = availability;
			if (quantityAvailable === 0 && inTransitQuantity === 0) {
				availability.status = AVAILABILITY.OUT_OF_STOCK;
			} else if (quantityAvailable >= quantity) {
				availability.status = AVAILABILITY.IN_STOCK;
			} else if (Math.max(quantityAvailable, inTransitQuantity) < quantity) {
				availability.status = AVAILABILITY.INSUFFICIANT_QUANTITY;
			} else if (quantityAvailable < quantity && inTransitQuantity >= quantity) {
				availability.status = AVAILABILITY.BACKORDERED;
			}
			dispatch(setAvailability(compositeId, availability));
		});
	};
}

const clearProductCache = createAction('CLEAR_PRODUCT_CACHE');

export default {
	getProductCompositeSuccess,
	getProductAttachmentsSuccess,
	getProductComposite,
	getProductAttachments,
	getProductCompositeDescription,
	getProductCompositeDescriptionSuccess,
	getProductCompositeDescriptionError,
	availabilityAction,
	setAvailability,
	getAvailability,
	clearProductCache,
};
