'use strict';

jest.unmock('../../../app/reducers/keyboardReducer');

import keyboardReducer from '../keyboardReducer';

import {
	KEYBOARD_HIDE_ACCESSORY,
	KEYBOARD_SHOW_ACCESSORY,
} from '../../constants/KeyboardConstants';


describe('keyboardReducer reducer', () => {

	it('should return initialState', () => {
		expect(keyboardReducer(undefined, {})).toMatchSnapshot();
	});


	it('should KEYBOARD_HIDE_ACCESSORY', () => {
		const action = {
			type: KEYBOARD_HIDE_ACCESSORY,
		};
		const state = keyboardReducer(undefined, action);
		expect(
			state
		).toMatchSnapshot();
	});

	it('should KEYBOARD_SHOW_ACCESSORY', () => {
		const action = {
			type: KEYBOARD_SHOW_ACCESSORY,
		};
		const state = keyboardReducer(undefined, action);
		expect(
			state
		).toMatchSnapshot();
	});

});
