jest.unmock('../../../app/actions/ProjectEventActions');

jest.mock('../../../app/services/eventsService', () => ({
	get: jest.fn(() => Promise.resolve({})),
}));
jest.mock('../../../app/services/customerService', () => ({
	saveProjectFavorite: jest.fn(() => Promise.resolve({})),
	getProjectPhotoGalleryViews: jest.fn(() => Promise.resolve({})),
	saveProjectOrder: jest.fn(() => Promise.resolve({})),
}));
jest.mock('../../../app/reducers/helpers/projectsReducerHelper', () => ({
	getProject: jest.fn(() => ({})),
}));
jest.mock('../../../app/services/httpClient', () => ({}));

import ProjectEventActions from '../ProjectEventActions';
import customerService from '../../services/customerService';
import {
	UPDATE_SHOW_PROJECT_EVENTS,
	PROJECT_UPDATE_IS_REFRESHING,
	UPDATE_IS_FETCHING_PROJECT_DATA,
} from '../../constants/projectEventsConstants';

const dispatch = jest.fn();
const getState = jest.fn(() => ({
	userReducer: {
		user: {
			customerId: 1,
		},
	},
	projectsReducer: {
		projects: [],
	},
}));

describe('ProjectEventActions', () => {
	describe('updateIsRefreshing', () => {
		it('should match type PROJECT_UPDATE_IS_REFRESHING', () => {
			const result = ProjectEventActions.updateIsRefreshing(true);
			expect(result.type).toEqual(PROJECT_UPDATE_IS_REFRESHING);
			expect(result.isRefreshing).toEqual(true);
		});
	});

	describe('updateShowProjectEvents', () => {
		it('should match type UPDATE_SHOW_PROJECT_EVENTS', () => {
			const result = ProjectEventActions.updateShowProjectEvents(true);
			expect(result.type).toEqual(UPDATE_SHOW_PROJECT_EVENTS);
			expect(result.showEvents).toEqual(true);
		});
	});

	describe('updateIsFetchingProjectData', () => {
		it('should match type UPDATE_IS_FETCHING_PROJECT_DATA', () => {
			const result = ProjectEventActions.updateIsFetchingProjectData(true);
			expect(result.type).toEqual(UPDATE_IS_FETCHING_PROJECT_DATA);
			expect(result.isFetchingData).toEqual(true);
		});
	});

	describe('saveProjectFavorite', () => {
		it('should call customerService.saveProjectFavorite', () => {
			const data = {
				favoriteId: 1,
				projectId: 1,
			};
			const request = {
				...data,
				customerId: getState().userReducer.user.customerId,
			};
			ProjectEventActions.saveProjectFavorite(data)(dispatch, getState);
			expect(customerService.saveProjectFavorite).toHaveBeenCalledWith(request);
		});
	});

	describe('getPhotos', () => {
		it('should call customerService.saveProjectFavorite', () => {
			const data = {
				favoriteId: 1,
				projectId: 1,
			};
			const request = {
				projectId: data.projectId,
				customerId: getState().userReducer.user.customerId,
			};
			ProjectEventActions.getPhotos(data)(dispatch, getState);
			expect(customerService.getProjectPhotoGalleryViews).toHaveBeenCalledWith(request);
		});
	});

	describe('saveComment', () => {
		let promiseAllSpy;

		beforeEach(() => {
			promiseAllSpy = spyOn(Promise, 'all').and.returnValue({ then: jest.fn() });
		});

		it('should upload all photos', () => {
			const options = {
				eventId: 1,
				message: 'test message',
				photos: [],
			};
			ProjectEventActions.saveComment(options)(dispatch, getState);
			expect(promiseAllSpy).toHaveBeenCalledWith([]);
		});
	});

	describe('createEvent', () => {
		let promiseAllSpy;

		beforeEach(() => {
			promiseAllSpy = spyOn(Promise, 'all').and.returnValue({
				then: jest.fn(() => ({
					catch: jest.fn(),
				})),
			});
		});

		it('should upload all photos', () => {
			const options = {
				eventId: 1,
				message: 'test message',
				photos: [],
			};
			ProjectEventActions.createEvent(options)(dispatch, getState);
			expect(promiseAllSpy).toHaveBeenCalledWith([]);
		});
	});

	describe('addOrderToProject', () => {
		beforeEach(() => {
			customerService.saveProjectOrder.mockClear();
		});

		it('should call customerService.saveProjectOrder with empty request object', () => {
			ProjectEventActions.addOrderToProject()(dispatch);
			expect(customerService.saveProjectOrder).toHaveBeenCalledWith({});
		});

		it('should call customerService.saveProjectOrder with request object', () => {
			const request = {
				order: {},
				projectId: 1,
			};
			ProjectEventActions.addOrderToProject(request)(dispatch);
			expect(customerService.saveProjectOrder).toHaveBeenCalledWith(request);
		});
	});
});
