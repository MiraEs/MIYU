'use strict';
import tracking from '../lib/analytics/tracking';
import TrackingActions from '../lib/analytics/TrackingActions';
import { createAction } from 'redux-actions';

function trackStateHelper(state, data) {
	tracking.trackState(state, data);
	return {
		state,
		data,
	};
}

const trackState = createAction('ANALYTICS_TRACK_STATE', trackStateHelper);

function trackActionHelper(action, data) {
	switch (action) {
		case TrackingActions.FAVORITE_ADD_TO_CART:
		case TrackingActions.PDP_ADDITEM:
		case TrackingActions.CART_ITEM_ADD:
		case TrackingActions.RELATED_PRODUCT_REQUIRED_ADD_TO_CART:
		case TrackingActions.RELATED_PRODUCT_RECOMMENDED_ADD_TO_CART:
		case TrackingActions.RELATED_PRODUCT_MAY_WE_SUGGEST_ADD_TO_CART:
			tracking.trackAddToCart(action, data);
			break;
		case TrackingActions.CUSTOMER_SIGNUP_COMPLETE:
			tracking.trackCustomerRegistered(data.user, data.cart, data.methodName);
			break;
		default:
			tracking.trackAction(action, data);
			break;
	}
	return {
		action,
		data,
	};
}

const trackAction = createAction('ANALYTICS_TRACK_ACTION', trackActionHelper);

module.exports = {
	trackStateHelper,
	trackState,
	trackActionHelper,
	trackAction,
};
