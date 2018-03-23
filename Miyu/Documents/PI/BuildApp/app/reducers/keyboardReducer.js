import { handleActions } from 'redux-actions';
import {
	KEYBOARD_HIDE_ACCESSORY,
	KEYBOARD_SHOW_ACCESSORY,
} from '../constants/KeyboardConstants';

const initialState = {
	isAccessoryHidden: false,
};

export default handleActions({
	[KEYBOARD_HIDE_ACCESSORY]: (state) => ({
		...state,
		isAccessoryHidden: true,
	}),
	[KEYBOARD_SHOW_ACCESSORY]: (state) => ({
		...state,
		isAccessoryHidden: false,
	}),
}, initialState);
