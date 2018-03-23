import { createAction } from 'redux-actions';
import {
	KEYBOARD_HIDE_ACCESSORY,
	KEYBOARD_SHOW_ACCESSORY,
} from '../constants/KeyboardConstants';

const hideKeyboardAccessory = createAction(KEYBOARD_HIDE_ACCESSORY);
const showKeyboardAccessory = createAction(KEYBOARD_SHOW_ACCESSORY);

const hideAccessories = () => {
	return (dispatch) => {
		dispatch(hideKeyboardAccessory());
	};
};

const showAccessories = () => {
	return (dispatch) => {
		dispatch(showKeyboardAccessory());
	};
};

module.exports = {
	hideAccessories,
	showAccessories,
};
