jest.unmock('../../../app/actions/TeamActions');

jest.mock('../../../app/services/customerService', () => ({
	getProjectOwner: jest.fn(() => Promise.resolve({})),
	getProjectTeam: jest.fn(() => Promise.resolve({})),
	getProjectInviteViews: jest.fn(() => Promise.resolve({})),
	resendProjectInvite: jest.fn(() => Promise.resolve({})),
	rejectProjectInvite: jest.fn(() => Promise.resolve({})),
}));
jest.mock('../../../app/services/projectsService', () => ({
	sendProjectInvites: jest.fn(() => Promise.resolve({})),
	deleteProjectTeamMember: jest.fn(() => Promise.resolve({})),
}));

import TeamActions from '../TeamActions';
import customerService from '../../services/customerService';
import projectsService from '../../services/projectsService';

const dispatch = jest.fn();
const getState = jest.fn(() => ({
	userReducer: {
		user: {
			customerId: 1,
		},
	},
}));

describe('TeamActions', () => {
	const projectId = 1234;

	describe('getTeam', () => {
		const request = {
			projectId,
			customerId: getState().userReducer.user.customerId,
		};
		let promiseAllSpy;

		beforeEach(() => {
			promiseAllSpy = spyOn(Promise, 'all').and.returnValue({ then: jest.fn(() => ({ catch: jest.fn() }))});
		});

		it('should return a function', () => {
			TeamActions.getTeam(projectId)(dispatch, getState);
			expect(promiseAllSpy).toBeCalledWith([
				customerService.getProjectOwner(request),
				customerService.getProjectTeam(request),
			]);
		});
	});

	describe('getInvitees', () => {

		// To do: We need to use toHaveBeenCalledWith and provide the appropriate values but it fails if we try to do that
		// Make this test great again...maybe??
		it('should expect to call customerService.getProjectInviteViews', () => {
			TeamActions.getInvitees(projectId)(dispatch, getState);
			expect(customerService.getProjectInviteViews).toHaveBeenCalled();
		});
	});

	describe('sendProjectInvites', () => {
		it('should call projectsService.sendProjectInvites', () => {
			const data = {
				emailAddresses: [ 'test@test.com' ],
			};
			TeamActions.sendProjectInvites(data)(dispatch, getState);
			expect(projectsService.sendProjectInvites).toHaveBeenCalledWith({
				...data,
				customerId: getState().userReducer.user.customerId,
			});
		});
	});

	describe('resendProjectInvite', () => {
		it('should call customersService.resendProjectInvite', () => {
			const options = {
				projectId,
				inviteId: 2,
			};
			const request = {
				customerId: getState().userReducer.user.customerId,
				projectId: options.projectId,
				inviteId: options.inviteId,
			};
			TeamActions.resendProjectInvite(options)(dispatch, getState);
			expect(customerService.resendProjectInvite).toHaveBeenCalledWith(request);
		});
	});

	describe('rejectProjectInvite', () => {
		it('should call customersService.rejectProjectInvite', () => {
			const options = {
				projectId,
				inviteId: 2,
			};
			TeamActions.rejectProjectInvite(options)(dispatch, getState);
			expect(customerService.rejectProjectInvite).toHaveBeenCalled();
		});
	});

	describe('deleteProjectTeamMember', () => {
		it('should call projectsService.deleteProjectTeamMember', () => {
			const options = {
				projectId,
				inviteId: 2,
			};
			const request = {
				customerId: getState().userReducer.user.customerId,
				projectId: options.projectId,
				teamMemberId: options.teamMemberId,
			};
			TeamActions.deleteProjectTeamMember(options)(dispatch, getState);
			expect(projectsService.deleteProjectTeamMember).toHaveBeenCalledWith(request);
		});
	});

	describe('resendAllInvitesForProject', () => {
		it('should call customersService.resendProjectInvite', () => {
			const spy = spyOn(Promise, 'all').and.returnValue(Promise.resolve());
			TeamActions.resendAllInvitesForProject(projectId, [1, 2])(dispatch, getState);
			expect(spy).toHaveBeenCalled();
		});
	});
});
