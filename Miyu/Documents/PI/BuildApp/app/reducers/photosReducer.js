'use strict';
import { handleActions } from 'redux-actions';
import {
	LOAD_PHOTOS_FAIL,
	LOAD_PHOTOS_SUCCESS,
	LOADING_PHOTOS,
} from '../constants/constants';

const initialState = {
	error: '',
	loading: false,
	photos: [],
};

const photoReducer = handleActions({
	[LOAD_PHOTOS_FAIL]: (state, { payload: error }) => {
		return {
			...state,
			error,
		};
	},
	[LOAD_PHOTOS_SUCCESS]: (state, { payload }) => {
		return {
			...state,
			photos: [...payload],
		};
	},
	[LOADING_PHOTOS]: (state, { payload: loading }) => {
		return {
			...state,
			loading,
		};
	},
}, initialState);


export default photoReducer;
