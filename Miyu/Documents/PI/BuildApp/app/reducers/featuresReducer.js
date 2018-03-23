'use strict';

import {
	SET_FEATURE_STATE,
	SET_FEATURE_WITH_EXPIRATION,
} from '../constants/constants';
import { handleActions } from 'redux-actions';
import { REHYDRATE } from 'redux-persist/constants';

const initialState = {
	features: {
		facebookLoginIOS: true,
		facebookLoginAndroid: true,
		paypal: true,
		applePay: true,
		projects: false,
		typeAhead: true,
		geCheckout: true,
		onboarding: true,
		recentSearches: true,
		useBranchLinksForShare: true,
		contentHomeScreen: true,
		lookback: {
			enabled: false,
			default: false,
			expireAfter: null,
		},
		shoppingLists: true,
		actualTaxes: true,
		returns: false,
		whyDidYouUpdate: false,
	},
};

export function expireFeatures(features) {

	Object.keys(features || {}).forEach((key) => {
		const feature = features[key];
		const featureIsObject = feature && feature.hasOwnProperty('default');
		const featureHasExpireTime = feature && feature.expireAfter && typeof feature.expireAfter.getTime === 'function';
		const featureIsExpired = featureHasExpireTime && feature.expireAfter.getTime() < Date.now();
		if (featureIsObject && featureIsExpired) {
			features[key] = {
				enabled: feature.default,
				default: feature.default,
				expireAfter: null,
			};
		}
	});

	return features;

}

const featuresReducer = handleActions({
	[SET_FEATURE_STATE]: (state, action) => {
		return {
			features: {
				...state.features,
				[action.feature]: action.enabled,
			},
		};
	},
	[SET_FEATURE_WITH_EXPIRATION]: (state, action) => {
		return {
			...state,
			features: {
				...state.features,
				...action.payload,
			},
		};
	},
	[REHYDRATE]: (state, action) => {
		const { featuresReducer } = action.payload;
		if (featuresReducer) {
			return {
				...state,
				...featuresReducer,
				features: {
					...state.features,
					...featuresReducer.features,
					...expireFeatures(featuresReducer.features),
				},
			};
		}
		return state;
	},
}, initialState);

export default featuresReducer;
