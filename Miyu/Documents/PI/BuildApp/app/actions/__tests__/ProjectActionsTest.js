const dispatch = jest.fn();
const getState = jest.fn(() => ({
	userReducer: {
		user: {
			customerId: 7,
		},
	},
}));

jest.mock('redux-actions');
jest.mock('react-native-simple-store');
import store from 'react-native-simple-store';

jest.unmock('../../../app/actions/ProjectActions');
import projectActions from '../ProjectActions';

jest.mock('../../../app/services/projectsService', () => ({
	get: jest.fn(() => Promise.resolve({})),
	save: jest.fn(() => Promise.resolve({})),
	getShoppingLists: jest.fn(() => Promise.resolve({})),
	getShoppingListsForProject: jest.fn(() => Promise.resolve({})),
	saveShoppingList: jest.fn(() => Promise.resolve({})),
}));
jest.mock('../../../app/services/CartService', () => ({
	addSessionCartItems: jest.fn(() => Promise.resolve({})),
}));
import cartService from '../../services/CartService';
import projectsService from '../../services/projectsService';
import {
	UPDATE_PROJECTS_FILTER,
	PROJECTS_SEARCH_FILTER,
	ITEM_ADDED_TO_PROJECT,
} from '../../constants/ProjectConstants';
import {
	RECEIVE_PROJECTS_SUCCESS,
	RECEIVE_PROJECTS_FAIL,
	RECEIVE_SHOPPING_LISTS_SUCCESS,
	RECEIVE_SHOPPING_LISTS_FOR_PROJECT_SUCCESS,
	SAVE_PROJECT_FAIL,
	SAVE_PROJECT_SUCCESS,
	UPDATE_PROJECT_SUCCESS,
	PRE_AUTH_PROJECT_DATA,
	CHANGE_PROJECT_STATUS_SUCCESS,
	CHANGE_PROJECT_STATUS_FAIL,
} from '../../constants/constants';

describe('ProjectActions', () => {

	describe('updateProjectFilters', () => {
		it('should return an object', () => {
			const filterText = 'filter text';
			const result = projectActions.updateProjectFilters(filterText);
			expect(result).toEqual({
				type: UPDATE_PROJECTS_FILTER,
				filterText,
			});
		});
	});

	describe('receiveProjects', () => {
		it('should return an object', () => {
			const payload = {
				test: true,
			};
			const result = projectActions.receiveProjects(payload);
			expect(result).toEqual({
				type: RECEIVE_PROJECTS_SUCCESS,
				payload,
			});
		});
	});

	describe('receiveProjectsFail', () => {
		it('should return an object', () => {
			const error = new Error('test');
			const result = projectActions.receiveProjectsFail(error);
			expect(result).toEqual({
				type: RECEIVE_PROJECTS_FAIL,
				error,
			});
		});
	});

	describe('getProjects', () => {
		it('should return a function', () => {
			projectActions.getProjects()(dispatch, getState);
			expect(projectsService.get).toBeCalledWith({
				customerId: 7,
				includeInvited: true,
			});
			expect(projectsService.get).toBeCalledWith({
				customerId: 7,
				archived: true,
				includeInvited: true,
			});
		});
	});

	describe('projectStatusChange', () => {
		it('should return an object', () => {
			const payload = { test: true };
			const result = projectActions.projectStatusChange(payload);
			expect(result).toEqual({
				type: CHANGE_PROJECT_STATUS_SUCCESS,
				payload,
			});
		});
	});

	describe('projectStatusChangeFail', () => {
		it('should return an object', () => {
			const payload = new Error('test');
			const result = projectActions.projectStatusChangeFail(payload);
			expect(result).toEqual({
				type: CHANGE_PROJECT_STATUS_FAIL,
				payload,
			});
		});
	});

	describe('changeProjectStatus', () => {
		it('should return a function', () => {
			projectActions.changeProjectStatus({})(dispatch, getState);
			expect(projectsService.save).toBeCalledWith({
				customerId: 7,
			});
		});
	});

	describe('projectSaved', () => {
		it('should return an object', () => {
			const payload = {};
			const result = projectActions.projectSaved(payload);
			expect(result).toEqual({
				type: SAVE_PROJECT_SUCCESS,
				payload,
			});
		});
	});

	describe('projectUpdated', () => {
		it('should return an object', () => {
			const payload = {};
			const result = projectActions.projectUpdated(payload);
			expect(result).toEqual({
				type: UPDATE_PROJECT_SUCCESS,
				payload,
			});
		});
	});

	describe('projectSavedFail', () => {
		it('should return an object', () => {
			const error = new Error('test');
			const result = projectActions.projectSavedFail(error);
			expect(result).toEqual({
				type: SAVE_PROJECT_FAIL,
				payload: error,
				error: true,
			});
		});
	});

	describe('saveProject', () => {
		it('should return an object', () => {
			projectActions.saveProject({})(dispatch, getState);
			expect(projectsService.save).toBeCalledWith({
				customerId: 7,
			});
		});
	});

	describe('savePreAuthProjectData', () => {
		it('should return a function', () => {
			projectActions.savePreAuthProjectData({})();
			expect(store.save).toBeCalledWith(PRE_AUTH_PROJECT_DATA, {});
		});
	});

	describe('savePreAuthProjectToUser', () => {
		it('should return a function', () => {
			projectActions.savePreAuthProjectToUser()(dispatch);
			expect(store.get).toBeCalledWith(PRE_AUTH_PROJECT_DATA);
		});
	});

	describe('receiveShoppingLists', () => {
		it('should return a function', () => {
			const payload = { test: true };
			const result = projectActions.receiveShoppingLists(payload);
			expect(result).toEqual({
				type: RECEIVE_SHOPPING_LISTS_SUCCESS,
				payload,
			});
		});
	});

	describe('getShoppingLists', () => {
		it('should return a function', () => {
			projectActions.getShoppingLists()(dispatch, getState);
			expect(projectsService.getShoppingLists).toBeCalledWith({
				customerId: 7,
			});
		});
	});

	describe('receiveShoppingListsForProject', () => {
		it('should return a function', () => {
			const payload = { test: true };
			const result = projectActions.receiveShoppingListsForProject(payload);
			expect(result).toEqual({
				type: RECEIVE_SHOPPING_LISTS_FOR_PROJECT_SUCCESS,
				payload,
			});
		});
	});

	describe('getShoppingListsForProject', () => {
		it('should return a function', () => {
			projectActions.getShoppingListsForProject({ projectId: 1 })(dispatch);
			expect(projectsService.getShoppingListsForProject).toBeCalledWith({
				projectId: 1,
			});
		});
	});

	describe('updateShoppingList', () => {
		it('should return a function', () => {
			projectActions.updateShoppingList({ projectId: 1, shoppingList: {} })(dispatch);
			expect(projectsService.saveShoppingList).toBeCalledWith({ shoppingList: {} });
		});
	});

	describe('setAddToProjectModalFilter', () => {
		it('should return an object', () => {
			const payload = 'test';
			const result = projectActions.projectsSearchFilter(payload);
			expect(result).toEqual({
				type: PROJECTS_SEARCH_FILTER,
				payload,
			});
		});
	});

	describe('addItemToShoppingList', () => {
		it('should return a function', () => {
			const sessionCartItems = [{
				productUniqueId: 123,
				quantity: 1,
				pricedOptions: [],
			}];
			const request = {
				sessionCartItems,
				sessionCartId: 1234,
			};
			projectActions.addItemToShoppingList(request)(dispatch, getState);
			expect(cartService.addSessionCartItems).toBeCalledWith({
				...request,
				customerId: getState().userReducer.user.customerId,
			});
		});
	});

	describe('saveShoppingList', () => {
		it('should return a function', () => {
			const payload = {
				name: 'test group',
				projectId: 0,
			};
			projectActions.saveShoppingList(payload)(dispatch);
			expect(projectsService.saveShoppingList).toHaveBeenCalledWith({ shoppingList: payload });
		});
	});

	describe('createProjectWithDefaultGroup', () => {
		it('should return a function', () => {
			const request = {
				name: 'test',
				customerId: getState().userReducer.user.customerId,
			};
			it('should return an object', () => {
				projectActions.createProjectWithDefaultGroup({ name: 'test' })(dispatch, getState);
				expect(projectsService.save).toBeCalledWith(request);
			});
		});
	});

	describe('itemAddedToProject', () => {
		it('should return an object', () => {
			const payload = {
				added: true,
				projectId: 0,
			};
			const result = projectActions.itemAddedToProject(payload);
			expect(result).toEqual({
				type: ITEM_ADDED_TO_PROJECT,
				payload,
			});
		});
	});

});
