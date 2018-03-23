'use strict';

jest.unmock('../../../app/reducers/singleEventReducer');

import singleEventReducer from '../singleEventReducer';

import {
	LOAD_SINGLE_EVENT_SUCCESS,
	LOAD_SINGLE_EVENT_FAIL,
	SINGLE_EVENT_SAVE_COMMENT,
	SINGLE_EVENT_SAVE_COMMENT_SUCCESS,
	SINGLE_EVENT_SAVE_COMMENT_FAIL,
	RESET_SINGLE_EVENT_DATA,
} from '../../constants/singleEventConstants' ;

const initialState = {
	event: {
		comments: [],
	},
	error: '',
	isLoading: true,
};

describe('singleEventReducer reducer', () => {

	it('should return initialState', () => {
		expect(singleEventReducer(undefined, {})).toMatchSnapshot();
	});


	it('should LOAD_SINGLE_EVENT_SUCCESS', () => {
		const action = {
			type: LOAD_SINGLE_EVENT_SUCCESS,
		};
		const state = singleEventReducer(initialState, action);
		expect(
			state
		).toMatchSnapshot();
	});

	it('should LOAD_SINGLE_EVENT_FAIL', () => {
		const action = {
			type: LOAD_SINGLE_EVENT_FAIL,
		};
		const state = singleEventReducer(initialState, action);
		expect(
			state
		).toMatchSnapshot();
	});

	it('should SINGLE_EVENT_SAVE_COMMENT', () => {
		const action = {
			type: SINGLE_EVENT_SAVE_COMMENT,
		};
		const state = singleEventReducer(initialState, action);
		expect(
			state
		).toMatchSnapshot();
	});

	it('should SINGLE_EVENT_SAVE_COMMENT_SUCCESS', () => {
		const action = {
			type: SINGLE_EVENT_SAVE_COMMENT_SUCCESS,
		};
		const state = singleEventReducer(initialState, action);
		expect(
			state
		).toMatchSnapshot();
	});

	it('should SINGLE_EVENT_SAVE_COMMENT_FAIL', () => {
		const action = {
			type: SINGLE_EVENT_SAVE_COMMENT_FAIL,
		};
		const state = singleEventReducer(initialState, action);
		expect(
			state
		).toMatchSnapshot();
	});

	it('should RESET_SINGLE_EVENT_DATA', () => {
		const action = {
			type: RESET_SINGLE_EVENT_DATA,
		};
		const state = singleEventReducer(initialState, action);
		expect(
			state
		).toMatchSnapshot();
	});

});
