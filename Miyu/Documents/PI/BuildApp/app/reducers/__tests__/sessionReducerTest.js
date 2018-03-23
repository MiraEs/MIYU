'use strict';

jest.unmock('../../../app/reducers/sessionReducer');

import sessionReducer from '../sessionReducer';

import {
	GET_SESSION,
	GET_SESSION_ERROR,
	SAVE_SESSION,
	SAVE_SESSION_ERROR,
} from '../../constants/SessionConstants' ;


describe('sessionReducer reducer', () => {

	it('should return initialState', () => {
		expect(sessionReducer(undefined, {})).toMatchSnapshot();
	});


	it('should GET_SESSION', () => {
		const action = {
			type: GET_SESSION,
		};
		const state = sessionReducer(undefined, action);
		expect(
			state
		).toMatchSnapshot();
	});

	it('should GET_SESSION_ERROR', () => {
		const action = {
			type: GET_SESSION_ERROR,
		};
		const state = sessionReducer(undefined, action);
		expect(
			state
		).toMatchSnapshot();
	});

	it('should SAVE_SESSION', () => {
		const action = {
			type: SAVE_SESSION,
		};
		const state = sessionReducer(undefined, action);
		expect(
			state
		).toMatchSnapshot();
	});

	it('should SAVE_SESSION_ERROR', () => {
		const action = {
			type: SAVE_SESSION_ERROR,
		};
		const state = sessionReducer(undefined, action);
		expect(
			state
		).toMatchSnapshot();
	});

});
