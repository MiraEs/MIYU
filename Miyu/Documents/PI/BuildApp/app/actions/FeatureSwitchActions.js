'use strict';

import {
	SET_FEATURE_STATE,
	SET_FEATURE_WITH_EXPIRATION,
} from '../constants/constants';
import { createAction } from 'redux-actions';

function setFeatureState(feature, enabled) {
	return (dispatch) => {
		dispatch({
			type:SET_FEATURE_STATE,
			feature,
			enabled,
		});
	};
}


const setFeatureWithExpiration = createAction(SET_FEATURE_WITH_EXPIRATION);

module.exports = {
	setFeatureState,
	setFeatureWithExpiration,
};
