'use strict';

import {
	REFRESH_CURRENT_SCREEN,
	UNAUTHORIZED_ERROR,
} from '../constants/constants';
import { handleActions } from 'redux-actions';

export const initialState = {
	refresh: false,
	unauthorized: false,
};

export default handleActions({
	[REFRESH_CURRENT_SCREEN]: (state, action) => {
		return {
			...state,
			refresh: action.payload.refresh,
		};
	},
	[UNAUTHORIZED_ERROR]: (state, action) => {
		return {
			...state,
			unauthorized: action.payload,
		};
	},
}, initialState);
