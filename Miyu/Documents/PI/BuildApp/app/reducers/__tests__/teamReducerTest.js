'use strict';

jest.unmock('../../../app/reducers/teamReducer');

import teamReducer from '../teamReducer';

import {
	DELETE_PROJECT_TEAM_MEMBER_SUCCESS,
	LOAD_INVITEES_FAIL,
	LOAD_INVITEES_SUCCESS,
	LOAD_TEAM_FAIL,
	LOAD_TEAM_SUCCESS,
	REJECT_PROJECT_INVITE_FAIL,
	REJECT_PROJECT_INVITE_SUCCESS,
	RESEND_INVITE,
	SEND_PROJECT_INVITES_ERROR,
	SEND_PROJECT_INVITES_SUCCESS,
} from '../../constants/constants' ;

const defaultState = {
	team: {
		members: [],
		invitees: [],
	},
	message: '',
	isLoading: false,
};

describe('teamReducer reducer', () => {

	it('should return initialState', () => {
		expect(teamReducer(undefined, {})).toMatchSnapshot();
	});


	it('should DELETE_PROJECT_TEAM_MEMBER_SUCCESS', () => {
		const action = {
			type: DELETE_PROJECT_TEAM_MEMBER_SUCCESS,
		};
		const state = teamReducer(defaultState, action);
		expect(
			state
		).toMatchSnapshot();
	});

	it('should LOAD_INVITEES_FAIL', () => {
		const action = {
			type: LOAD_INVITEES_FAIL,
		};
		const state = teamReducer(defaultState, action);
		expect(
			state
		).toMatchSnapshot();
	});

	it('should LOAD_INVITEES_SUCCESS', () => {
		const action = {
			type: LOAD_INVITEES_SUCCESS,
			payload: [],
		};
		const state = teamReducer(defaultState, action);
		expect(
			state
		).toMatchSnapshot();
	});

	it('should LOAD_TEAM_FAIL', () => {
		const action = {
			type: LOAD_TEAM_FAIL,
		};
		const state = teamReducer(defaultState, action);
		expect(
			state
		).toMatchSnapshot();
	});

	it('should LOAD_TEAM_SUCCESS', () => {
		const action = {
			type: LOAD_TEAM_SUCCESS,
			payload: [{}, {}],
		};
		const state = teamReducer(defaultState, action);
		expect(
			state
		).toMatchSnapshot();
	});

	it('should REJECT_PROJECT_INVITE_FAIL', () => {
		const action = {
			type: REJECT_PROJECT_INVITE_FAIL,
		};
		const state = teamReducer(defaultState, action);
		expect(
			state
		).toMatchSnapshot();
	});

	it('should REJECT_PROJECT_INVITE_SUCCESS', () => {
		const action = {
			type: REJECT_PROJECT_INVITE_SUCCESS,
		};
		const state = teamReducer(defaultState, action);
		expect(
			state
		).toMatchSnapshot();
	});

	it('should RESEND_INVITE', () => {
		const action = {
			type: RESEND_INVITE,
		};
		const state = teamReducer(defaultState, action);
		expect(
			state
		).toMatchSnapshot();
	});

	it('should SEND_PROJECT_INVITES_ERROR', () => {
		const action = {
			type: SEND_PROJECT_INVITES_ERROR,
		};
		const state = teamReducer(defaultState, action);
		expect(
			state
		).toMatchSnapshot();
	});

	it('should SEND_PROJECT_INVITES_SUCCESS', () => {
		const action = {
			type: SEND_PROJECT_INVITES_SUCCESS,
		};
		const state = teamReducer(defaultState, action);
		expect(
			state
		).toMatchSnapshot();
	});

});
