import customersService from '../services/customerService';
import projectsService from '../services/projectsService';
import {
	ADD_FAIL,
	ADD_PENDING,
	DELETE_PROJECT_TEAM_MEMBER_FAIL,
	DELETE_PROJECT_TEAM_MEMBER_SUCCESS,
	IS_RESENDING_INVITES,
	LOAD_INVITEES_FAIL,
	LOAD_INVITEES_SUCCESS,
	LOAD_TEAM_FAIL,
	LOAD_TEAM_SUCCESS,
	REJECT_PROJECT_INVITE_FAIL,
	REJECT_PROJECT_INVITE_SUCCESS,
	RESEND_INVITE_BEGIN,
	RESEND_INVITE_FAIL,
	RESEND_INVITE_SUCCESS,
	RESEND_ALL_INVITES_SUCCESS,
	RESEND_ALL_INVITES_FAIL,
	SEND_PROJECT_INVITES_ERROR,
	SEND_PROJECT_INVITES_SUCCESS,
} from '../constants/constants';
import { createAction } from 'redux-actions';

function getTeamSuccess(data) {
	return {
		type: LOAD_TEAM_SUCCESS,
		payload: data,
	};
}

function getTeamFail(error) {
	return {
		type: LOAD_TEAM_FAIL,
		error,
	};
}

function getTeam(projectId) {
	return (dispatch, getState) => {
		const { user } = getState().userReducer;
		const request = {
			customerId: user.customerId,
			projectId,
		};
		return Promise.all([
			customersService.getProjectOwner(request),
			customersService.getProjectTeam(request),
		])
		.then((response) => {
			const users = [...response];
			users[0].isOwner = true;
			dispatch(getTeamSuccess(users));
		})
		.catch((error) => {
			dispatch(getTeamFail(error));
		});
	};
}

function getInviteesSuccess(data) {
	return {
		type: LOAD_INVITEES_SUCCESS,
		payload: data,
	};
}

function getInviteesFail(error) {
	return {
		type: LOAD_INVITEES_FAIL,
		error,
	};
}

function getInvitees(projectId) {
	return (dispatch, getState) => {
		const request = {
			customerId: getState().userReducer.user.customerId,
			projectId,
		};
		return customersService.getProjectInviteViews(request, (data) => {
			dispatch(getInviteesSuccess(data));
		}, (error) => {
			dispatch(getInviteesFail(error));
		});
	};
}

function projectInvitesSuccess(data) {
	return {
		type: SEND_PROJECT_INVITES_SUCCESS,
		payload: data,
	};
}

function projectInvitesFail(error) {
	return {
		type: SEND_PROJECT_INVITES_ERROR,
		error,
	};
}

function sendProjectInvites(data) {
	const invitee = {
		email: data.emailAddresses[0],
		ID: 1,
		status: 'PENDING',
		addStatus: ADD_PENDING,
	};
	return (dispatch, getState) => {
		const request = {
			...data,
			customerId: getState().userReducer.user.customerId,
		};
		return projectsService.sendProjectInvites(request).then(() => {
			dispatch(projectInvitesSuccess(invitee));
			dispatch(getInvitees(data.projectId));
		}, (error) => {
			invitee.addStatus = ADD_FAIL;
			dispatch(projectInvitesFail(error));
		});
	};
}

function updateProjectInvites() {
		// To be added.
}

const resendInviteBegin = createAction(RESEND_INVITE_BEGIN);

function resendInviteSuccess(data) {
	return {
		type: RESEND_INVITE_SUCCESS,
		payload: data,
	};
}

function resendInviteFail(error) {
	return {
		type: RESEND_INVITE_FAIL,
		error,
	};
}

function resendProjectInvite(options) {

	return (dispatch, getState) => {

		const request = {
			customerId: getState().userReducer.user.customerId,
			projectId: options.projectId,
			inviteId: options.inviteId,
		};

		const resendStatus = {
			inviteId: options.inviteId,
			isReinvited: true,
			inviteStatus: 'PENDING',
		};

		/* Maybe for future animation? Previous actions file had this
		in a cumbersome way. */
		dispatch(resendInviteBegin());

		customersService.resendProjectInvite(request).then(() => {
			dispatch(resendInviteSuccess(resendStatus));
		}, (error) => {
			dispatch(resendInviteFail(error));
		});
	};
}

const resendAllInvitesForProjectSuccess = createAction(RESEND_ALL_INVITES_SUCCESS);
const resendAllInvitesForProjectFail = createAction(RESEND_ALL_INVITES_FAIL);

function resendAllInvitesForProject(projectId, inviteIds) {
	return (dispatch, getState) => {
		dispatch(resendInviteBegin());
		const { customerId } = getState().userReducer.user;
		const requests = inviteIds.map((inviteId) => {
			return customersService.resendProjectInvite({ customerId, projectId, inviteId });
		});
		return Promise.all(requests)
			.then(() => {
				dispatch(resendAllInvitesForProjectSuccess());
			}).catch((error) => {
				dispatch(resendAllInvitesForProjectFail({ error: error.message }));
			});
	};
}

const isResendingInvites = createAction(IS_RESENDING_INVITES);

function rejectProjectInviteSuccess(inviteId) {
	return {
		type: REJECT_PROJECT_INVITE_SUCCESS,
		inviteId,
	};
}

function rejectProjectInviteFail(error) {
	return {
		type: REJECT_PROJECT_INVITE_FAIL,
		error,
	};
}

function rejectProjectInvite(options) {

	return (dispatch, getState) => {

		const request = {
			customerId: getState().userReducer.user.customerId,
			projectId: options.projectId,
			inviteId: options.inviteId,
		};

		customersService.rejectProjectInvite(request, () => {
			dispatch(rejectProjectInviteSuccess(options.inviteId));
		}, (error) => {
			dispatch(rejectProjectInviteFail(error));
		});
	};
}

function deleteTeamMemberSuccess(teamMemberId, projectId, deleteFromSharedProjects) {
	return {
		type: DELETE_PROJECT_TEAM_MEMBER_SUCCESS,
		teamMemberId,
		projectId,
		deleteFromSharedProjects,
	};
}

function deleteTeamMemberFail(error) {
	return {
		type: DELETE_PROJECT_TEAM_MEMBER_FAIL,
		error,
	};
}

function deleteProjectTeamMember(options) {
	return (dispatch, getState) => {
		const request = {
			customerId: getState().userReducer.user.customerId,
			projectId: options.projectId,
			teamMemberId: options.teamMemberId,
		};
		projectsService.deleteProjectTeamMember(request).then(() => {
			dispatch(deleteTeamMemberSuccess(options.teamMemberId, options.projectId, options.deleteFromSharedProjects));
		}, (error) => {
			dispatch(deleteTeamMemberFail(error));
		});
	};
}

module.exports = {
	getTeam,
	getInvitees,
	isResendingInvites,
	sendProjectInvites,
	updateProjectInvites,
	resendProjectInvite,
	resendAllInvitesForProject,
	rejectProjectInvite,
	deleteProjectTeamMember,
};
