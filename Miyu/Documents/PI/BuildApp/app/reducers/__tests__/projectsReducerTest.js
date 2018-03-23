'use strict';

jest.unmock('../../../app/reducers/projectsReducer');

import projectsReducer from '../projectsReducer';

import {
	CHANGE_PROJECT_STATUS_SUCCESS,
	CHANGE_PROJECT_STATUS_FAIL,
	DELETE_PROJECT_TEAM_MEMBER_SUCCESS,
	LOADING_PROJECTS,
	LOADING_SHOPPING_LISTS,
	RECEIVE_PROJECTS_FAIL,
	RECEIVE_PROJECTS_SUCCESS,
	SAVE_PROJECT_FAIL,
	SAVE_PROJECT_SUCCESS,
	SIGN_USER_OUT,
	UPDATE_PROJECT_SUCCESS,
} from '../../constants/constants' ;
import {
	UPDATE_PROJECTS_FILTER,
	PROJECTS_SEARCH_FILTER,
	SAVING_SHOPPING_LIST,
	SAVE_SHOPPING_LIST_SUCCESS,
	SAVE_SHOPPING_LIST_FAIL,
	CREATE_PROJECT_WITH_DEFAULT_GROUP_SUCCESS,
	ITEM_ADDED_TO_PROJECT,
	RESET_SHOPPING_LISTS_EDITING_FLAG,
	RESET_LOADING_FLAG,
} from '../../constants/ProjectConstants';

const initialState = {
	projects: {
		active: {
			myProjects: [],
			sharedProjects: [],
		},
		archived: {
			myProjects: [],
			sharedProjects: [],
		},
		preAuthProjects: [],
	},
	filteredProjects: {},
	isFiltering: false,
	error: '',
	isLoading: true,
	shoppingLists: [{
		project: {
			id: 0,
		},
		shoppingLists: [],
	}],
	filteredShoppingLists: [],
	itemAddedToProject: {
		added: false,
		projectId: null,
	},
};

describe('projectsReducer reducer', () => {

	it('should return initialState', () => {
		expect(projectsReducer(undefined, {})).toMatchSnapshot();
	});


	it('should CHANGE_PROJECT_STATUS_SUCCESS', () => {
		const action = {
			type: CHANGE_PROJECT_STATUS_SUCCESS,
			payload: [
				{
					myProjects: [],
					sharedProjects: [],
				},
				{
					myProjects: [],
					sharedProjects: [],
				},
			],
		};
		const state = projectsReducer(initialState, action);
		expect(
			state
		).toMatchSnapshot();
	});

	it('should DELETE_PROJECT_TEAM_MEMBER_SUCCESS', () => {
		const action = {
			type: DELETE_PROJECT_TEAM_MEMBER_SUCCESS,
		};
		const state = projectsReducer(initialState, action);
		expect(
			state
		).toMatchSnapshot();
	});

	it('should RECEIVE_PROJECTS_FAIL', () => {
		const action = {
			type: RECEIVE_PROJECTS_FAIL,
		};
		const state = projectsReducer(initialState, action);
		expect(
			state
		).toMatchSnapshot();
	});

	it('should RECEIVE_PROJECTS_SUCCESS', () => {
		const action = {
			type: RECEIVE_PROJECTS_SUCCESS,
			payload: [
				{
					myProjects: [],
					sharedProjects: [],
				},
				{
					myProjects: [],
					sharedProjects: [],
				},
			],
		};
		const state = projectsReducer(initialState, action);
		expect(
			state
		).toMatchSnapshot();
	});

	it('should SAVE_PROJECT_FAIL', () => {
		const action = {
			type: SAVE_PROJECT_FAIL,
		};
		const state = projectsReducer(initialState, action);
		expect(
			state
		).toMatchSnapshot();
	});

	it('should SAVE_PROJECT_SUCCESS', () => {
		const action = {
			type: SAVE_PROJECT_SUCCESS,
			payload: [],
		};
		const state = projectsReducer(initialState, action);
		expect(
			state
		).toMatchSnapshot();
	});

	it('should UPDATE_PROJECT_SUCCESS', () => {
		const action = {
			type: UPDATE_PROJECT_SUCCESS,
			payload: [],
		};
		const state = projectsReducer(initialState, action);
		expect(
			state
		).toMatchSnapshot();
	});

	it('should UPDATE_PROJECTS_FILTER', () => {
		const action = {
			type: UPDATE_PROJECTS_FILTER,
			payload: [],
		};
		const state = projectsReducer(initialState, action);
		expect(
			state
		).toMatchSnapshot();
	});

	it('should CHANGE_PROJECT_STATUS_FAIL', () => {
		const action = {
			type: CHANGE_PROJECT_STATUS_FAIL,
			payload: 'test',
		};
		const state = projectsReducer(initialState, action);
		expect(
			state
		).toMatchSnapshot();
	});

	it('should SIGN_USER_OUT', () => {
		const action = {
			type: SIGN_USER_OUT,
		};
		const state = projectsReducer(initialState, action);
		expect(
			state
		).toMatchSnapshot();
	});

	it('should LOADING_PROJECTS', () => {
		const action = {
			type: LOADING_PROJECTS,
			payload: true,
		};
		const state = projectsReducer(initialState, action);
		expect(
			state
		).toMatchSnapshot();
	});

	it('should LOADING_SHOPPING_LISTS', () => {
		const action = {
			type: LOADING_SHOPPING_LISTS,
			payload: true,
		};
		const state = projectsReducer(initialState, action);
		expect(
			state
		).toMatchSnapshot();
	});

	it('should PROJECTS_SEARCH_FILTER', () => {
		const action = {
			type: PROJECTS_SEARCH_FILTER,
			term: '',
		};
		const state = projectsReducer(initialState, action);
		expect(state).toMatchSnapshot();
	});

	it('should SAVING_SHOPPING_LIST', () => {
		const action = {
			type: SAVING_SHOPPING_LIST,
		};
		const state = projectsReducer(initialState, action);
		expect(state).toMatchSnapshot();
	});

	it('should SAVE_SHOPPING_LIST_SUCCESS', () => {
		const action = {
			type: SAVE_SHOPPING_LIST_SUCCESS,
			payload: {
				projectId: 0,
			},
		};
		const state = projectsReducer(initialState, action);
		expect(state).toMatchSnapshot();
	});

	it('should SAVE_SHOPPING_LIST_FAIL', () => {
		const action = {
			type: SAVE_SHOPPING_LIST_FAIL,
			payload: {},
		};
		const state = projectsReducer(initialState, action);
		expect(state).toMatchSnapshot();
	});

	it('should CREATE_PROJECT_WITH_DEFAULT_GROUP_SUCCESS', () => {
		const action = {
			type: CREATE_PROJECT_WITH_DEFAULT_GROUP_SUCCESS,
			payload: {},
		};
		const state = projectsReducer(initialState, action);
		expect(state).toMatchSnapshot();
	});

	it('should ITEM_ADDED_TO_PROJECT', () => {
		const action = {
			type: ITEM_ADDED_TO_PROJECT,
			payload: {
				added: true,
				projectId: 0,
			},
		};
		const state = projectsReducer(initialState, action);
		expect(state).toMatchSnapshot();
	});

	it('should RESET_SHOPPING_LISTS_EDITING_FLAG', () => {
		const action = {
			type: RESET_SHOPPING_LISTS_EDITING_FLAG,
			payload: {
				projectId: 0,
			},
		};
		const state = projectsReducer(initialState, action);
		expect(state).toMatchSnapshot();
	});

	it('should RESET_LOADING_FLAG', () => {
		const action = {
			type: RESET_LOADING_FLAG,
			payload: {
				isLoading: true,
			},
		};
		const state = projectsReducer(initialState, action);
		expect(state).toMatchSnapshot();
	});
});
