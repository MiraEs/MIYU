'use strict';

jest.unmock('../../../app/reducers/projectEventsReducer');

import projectEventsReducer from '../projectEventsReducer';

import {
	ADD_FAIL,
	GLOBAL_SAVE_COMMENT_SUCCESS,
	PROJECT_ADD_EVENT,
	PROJECT_ADD_EVENT_ERROR,
	PROJECT_ADD_EVENT_SUCCESS,
	PROJECT_LOAD_EVENTS_ERROR,
	PROJECT_LOAD_EVENTS_SUCCESS,
	PROJECT_LOAD_NEXT_EVENTS_SUCCESS,
	PROJECT_SAVE_COMMENT,
	PROJECT_SAVE_COMMENT_ERROR,
	PROJECT_SAVE_COMMENT_SUCCESS,
} from '../../constants/constants';

import {
	UPDATE_SHOW_PROJECT_EVENTS,
	UPDATE_ACTIVE_PROJECT_EVENTS_FILTER,
	UPDATE_IS_FETCHING_PROJECT_DATA,
	PROJECT_UPDATE_IS_REFRESHING,
} from '../../constants/projectEventsConstants';


describe('projectEventsReducer reducer', () => {

	it('should return initialState', () => {
		expect(projectEventsReducer(undefined, {})).toMatchSnapshot();
	});


	it('should ADD_FAIL', () => {
		const action = {
			type: ADD_FAIL,
		};
		const state = projectEventsReducer(undefined, action);
		expect(
			state
		).toMatchSnapshot();
	});

	it('should GLOBAL_SAVE_COMMENT_SUCCESS', () => {
		const action = {
			type: GLOBAL_SAVE_COMMENT_SUCCESS,
			data: {},
		};
		const state = projectEventsReducer(undefined, action);
		expect(
			state
		).toMatchSnapshot();
	});

	it('should PROJECT_ADD_EVENT', () => {
		const action = {
			type: PROJECT_ADD_EVENT,
		};
		const state = projectEventsReducer(undefined, action);
		expect(
			state
		).toMatchSnapshot();
	});

	it('should PROJECT_ADD_EVENT_ERROR', () => {
		const action = {
			type: PROJECT_ADD_EVENT_ERROR,
		};
		const state = projectEventsReducer(undefined, action);
		expect(
			state
		).toMatchSnapshot();
	});

	it('should PROJECT_ADD_EVENT_SUCCESS', () => {
		const action = {
			type: PROJECT_ADD_EVENT_SUCCESS,
		};
		const state = projectEventsReducer(undefined, action);
		expect(
			state
		).toMatchSnapshot();
	});

	it('should PROJECT_LOAD_EVENTS_ERROR', () => {
		const action = {
			type: PROJECT_LOAD_EVENTS_ERROR,
		};
		const state = projectEventsReducer(undefined, action);
		expect(
			state
		).toMatchSnapshot();
	});

	it('should PROJECT_LOAD_EVENTS_SUCCESS', () => {
		const action = {
			type: PROJECT_LOAD_EVENTS_SUCCESS,
		};
		const state = projectEventsReducer(undefined, action);
		expect(
			state
		).toMatchSnapshot();
	});

	it('should PROJECT_LOAD_NEXT_EVENTS_SUCCESS', () => {
		const action = {
			type: PROJECT_LOAD_NEXT_EVENTS_SUCCESS,
			data: {},
		};
		const state = projectEventsReducer(undefined, action);
		expect(
			state
		).toMatchSnapshot();
	});

	it('should PROJECT_SAVE_COMMENT', () => {
		const action = {
			type: PROJECT_SAVE_COMMENT,
		};
		const state = projectEventsReducer(undefined, action);
		expect(
			state
		).toMatchSnapshot();
	});

	it('should PROJECT_SAVE_COMMENT_ERROR', () => {
		const action = {
			type: PROJECT_SAVE_COMMENT_ERROR,
		};
		const state = projectEventsReducer(undefined, action);
		expect(
			state
		).toMatchSnapshot();
	});

	it('should PROJECT_SAVE_COMMENT_SUCCESS', () => {
		const action = {
			type: PROJECT_SAVE_COMMENT_SUCCESS,
		};
		const state = projectEventsReducer(undefined, action);
		expect(
			state
		).toMatchSnapshot();
	});

	it('should UPDATE_SHOW_PROJECT_EVENTS', () => {
		const action = {
			type: UPDATE_SHOW_PROJECT_EVENTS,
		};
		const state = projectEventsReducer(undefined, action);
		expect(
			state
		).toMatchSnapshot();
	});

	it('should UPDATE_ACTIVE_PROJECT_EVENTS_FILTER', () => {
		const action = {
			type: UPDATE_ACTIVE_PROJECT_EVENTS_FILTER,
		};
		const state = projectEventsReducer(undefined, action);
		expect(
			state
		).toMatchSnapshot();
	});

	it('should UPDATE_IS_FETCHING_PROJECT_DATA', () => {
		const action = {
			type: UPDATE_IS_FETCHING_PROJECT_DATA,
		};
		const state = projectEventsReducer(undefined, action);
		expect(
			state
		).toMatchSnapshot();
	});

	it('should PROJECT_UPDATE_IS_REFRESHING', () => {
		const action = {
			type: PROJECT_UPDATE_IS_REFRESHING,
		};
		const state = projectEventsReducer(undefined, action);
		expect(
			state
		).toMatchSnapshot();
	});

});
