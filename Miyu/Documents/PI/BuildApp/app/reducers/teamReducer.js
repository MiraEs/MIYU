'use strict';

import {
	DELETE_PROJECT_TEAM_MEMBER_SUCCESS,
	IS_RESENDING_INVITES,
	LOAD_INVITEES_FAIL,
	LOAD_INVITEES_SUCCESS,
	LOAD_TEAM_FAIL,
	LOAD_TEAM_SUCCESS,
	RESEND_INVITE_BEGIN,
	REJECT_PROJECT_INVITE_FAIL,
	REJECT_PROJECT_INVITE_SUCCESS,
	RESEND_INVITE,
	RESEND_ALL_INVITES_SUCCESS,
	RESEND_ALL_INVITES_FAIL,
	SEND_PROJECT_INVITES_ERROR,
	SEND_PROJECT_INVITES_SUCCESS,
} from '../constants/constants';
import messages from '../lib/messages';

const initialState = {
	team: {
		members: [],
		invitees: [],
	},
	message: '',
	isLoading: false,
	resendError: '',
	isResendingInvites: false,
};

const teamReducer = (state = initialState, action = {}) => {

	switch (action.type) {
		case LOAD_TEAM_SUCCESS:
			return {
				...state,
				team: {
					members: [action.payload[0], ...action.payload[1]],
					invitees: state.team.invitees,
				},
			};

		case LOAD_TEAM_FAIL:
			return {
				...state,
				message: messages.errors.retrieveTeam,
			};

		case LOAD_INVITEES_SUCCESS:
			const _invitees = action.payload.filter((invitee) =>
				invitee.status === 'PENDING'
			);
			return {
				...state,
				team: {
					members: state.team.members,
					invitees: _invitees,
				},
			};

		case LOAD_INVITEES_FAIL:
			return {
				...state,
				message: messages.errors.retrieveTeam,
			};

		case DELETE_PROJECT_TEAM_MEMBER_SUCCESS:
			const _team = state.team.members.filter((member) => member.id !== action.teamMemberId);
			return {
				...state,
				team: {
					members: _team,
					invitees: state.team.invitees,
				},
				message: 'Delete Completed',
			};

		case REJECT_PROJECT_INVITE_SUCCESS:
			const pendingInvitees = state.team.invitees.filter((invitee) =>
				invitee.id !== action.inviteId
			);
			return {
				...state,
				team: {
					members: state.team.members,
					invitees: pendingInvitees,
				},
			};
		case REJECT_PROJECT_INVITE_FAIL:
			return {
				...state,
				team: {
					members: state.team.members,
					invitees: state.team.invitees,
					inviteeError: action.error,
				},
			};

		case SEND_PROJECT_INVITES_SUCCESS:
			return {
				...state,
				team: {
					members: state.team.members,
					invitees: state.team.invitees.concat(action.payload),
				},
			};

		case RESEND_INVITE:
			return {
				...state,
			};

		case SEND_PROJECT_INVITES_ERROR:
			return {
				...state,
				inviteeError:'Something went wrong ):',
			};
		case RESEND_ALL_INVITES_SUCCESS:
			return {
				...state,
				isResendingInvites: false,
				resendError: '',
			};
		case RESEND_ALL_INVITES_FAIL:
			return {
				...state,
				isResendingInvites: false,
				resendError: action.payload.error,
			};
		case IS_RESENDING_INVITES:
			return {
				...state,
				isResendingInvites: action.payload.isResendingInvites,
				resendError: '',
			};
		case RESEND_INVITE_BEGIN:
			return {
				...state,
				isResendingInvites: true,
				resendError: '',
			};
		default:
			return state;
	}

};

export default teamReducer;
