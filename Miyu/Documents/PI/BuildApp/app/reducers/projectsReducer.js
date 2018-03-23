'use strict';

import messages from '../lib/messages';
import {
	CHANGE_PROJECT_STATUS_SUCCESS,
	CHANGE_PROJECT_STATUS_FAIL,
	DELETE_PROJECT_TEAM_MEMBER_SUCCESS,
	RECEIVE_PROJECTS_FAIL,
	RECEIVE_PROJECTS_SUCCESS,
	RECEIVE_SHOPPING_LISTS_SUCCESS,
	RECEIVE_SHOPPING_LISTS_FOR_PROJECT_SUCCESS,
	SAVE_PROJECT_FAIL,
	SAVE_PROJECT_SUCCESS,
	UPDATE_PROJECT_SUCCESS,
	RECEIVE_SHOPPING_LIST_AGGREGATE_DATA,
} from '../constants/constants';
import { SIGN_USER_OUT } from '../constants/Auth';
import {
	UPDATE_PROJECTS_FILTER,
	PROJECTS_SEARCH_FILTER,
	SAVING_SHOPPING_LIST,
	SAVE_SHOPPING_LIST_SUCCESS,
	SAVE_SHOPPING_LIST_FAIL,
	CREATE_PROJECT_WITH_DEFAULT_GROUP_SUCCESS,
	ITEM_ADDED_TO_PROJECT,
	ADD_ITEM_TO_SHOPPING_LIST_FAIL,
	CREATE_PROJECT_WITH_DEFAULT_GROUP_FAIL,
	RESET_SHOPPING_LISTS_EDITING_FLAG,
	RESET_LOADING_FLAG,
	DELETE_GROUP_SUCCESS,
} from '../constants/ProjectConstants';
import { findIndexOfShoppingListsInProject } from './helpers/projectsReducerHelper';
import { handleActions } from 'redux-actions';
import cloneDeep from 'lodash.clonedeep';

const initialState = {
	aggregateData: {},
	projects: {
		active: {
			myProjects: [],
			sharedProjects: [],
			invitedProjects: [],
		},
		archived: {
			myProjects: [],
			sharedProjects: [],
			invitedProjects: [],
		},
		preAuthProjects: [],
	},
	error: '',
	filteredProjects: {},
	isFiltering: false,
	isLoading: true,
	loadingShoppingLists: true,
	shoppingLists: [],
	filteredShoppingLists: [],
	itemAddedToProject: {
		added: false,
		projectId: null,
	},
};

function moveProject (projectId, source, target) {
	source.forEach((project) => {
		if (project.id === projectId) {
			source.splice(source.indexOf(project), 1);
			project.archived = !project.archived;
			target.push(project);
		}
	});
}

function setArchivedStatus(group, status) {
	group.map((item) => {
		item.archived = status;
	});
}

function setOwnerStatus(group, status) {
	group.map((item) => {
		item.isOwnedByUser = status;
	});
}

export default handleActions({
	[RECEIVE_PROJECTS_SUCCESS]: (state, action) => {
		setArchivedStatus(action.payload[0].myProjects, false);
		setArchivedStatus(action.payload[0].sharedProjects, false);
		setArchivedStatus(action.payload[1].myProjects, true);
		setArchivedStatus(action.payload[1].sharedProjects, true);

		setOwnerStatus(action.payload[0].myProjects, true);
		setOwnerStatus(action.payload[0].sharedProjects, false);
		setOwnerStatus(action.payload[1].myProjects, true);
		setOwnerStatus(action.payload[1].sharedProjects, false);

		return {
			...state,
			projects: {
				...state.projects,
				active: action.payload[0],
				archived: action.payload[1],
			},
			error: '',
			isLoading: false,
		};
	},
	[RECEIVE_PROJECTS_FAIL]: (state) => ({
		...state,
		error: messages.errors.retrieveProjects,
		isLoading: false,
	}),
	[RECEIVE_SHOPPING_LISTS_SUCCESS]: (state, action) => ({
		...state,
		shoppingLists: action.payload,
		loadingShoppingLists: false,
	}),
	[RECEIVE_SHOPPING_LISTS_FOR_PROJECT_SUCCESS]: (state, action) => {
		const shoppingLists = [...state.shoppingLists];
		const {
			projectId,
			shoppingLists: shoppingListsForProject,
		} = action.payload;
		const projectIndex = findIndexOfShoppingListsInProject(shoppingLists, projectId);
		if (projectIndex > -1) {
			shoppingLists[projectIndex].shoppingLists = [...shoppingListsForProject];
		}
		return {
			...state,
			shoppingLists,
		};
	},
	[RECEIVE_SHOPPING_LIST_AGGREGATE_DATA]: (state, { payload }) => {
		return {
			...state,
			aggregateData: {
				...state.aggregateData,
				...payload,
			},
		};
	},
	[UPDATE_PROJECTS_FILTER]: (state, action) => {
		let isFiltering = false;
		const filteredProjects = {
			active: {
				...state.projects.active,
			},
			archived: {
				...state.projects.archived,
			},
		};
		if (action.filterText) {
			const statuses = Object.keys(filteredProjects);
			statuses.forEach((projectStatus) => {
				const projectTypes = Object.keys(filteredProjects[projectStatus]);
				projectTypes.forEach((projectType) => {
					const projects = filteredProjects[projectStatus][projectType];
					filteredProjects[projectStatus][projectType] = projects.filter((project) => {
						return project.name.toLowerCase().indexOf(action.filterText.toLowerCase()) !== -1;
					});
				});
			});
			isFiltering = true;
		}

		return {
			...state,
			filteredProjects,
			isFiltering,
		};
	},
	[SAVE_PROJECT_SUCCESS]: (state, action) => {
		setOwnerStatus([action.payload], true);
		setArchivedStatus([action.payload], false);
		action.payload.teamMemberCount = 0;
		action.payload.orderCount = 0;
		action.payload.photoGalleryCount = 0;
		action.payload.favoriteListCount = 0;
		return {
			...state,
			projects: {
				...state.projects,
				active: {
					...state.projects.active,
					myProjects: [action.payload, ...state.projects.active.myProjects],
				},
			},
		};
	},
	[CHANGE_PROJECT_STATUS_FAIL]: (state, action) => ({
		...state,
		error: action.payload,
	}),
	[SAVE_PROJECT_FAIL]: (state, action) => ({
		...state,
		error: action.payload,
	}),
	[UPDATE_PROJECT_SUCCESS]: (state, action) => {
		const status = action.payload.archived ? 'archived' : 'active';
		let projectIndex = 0;
		state.projects[status].myProjects.map((project, idx) => {
			if (project.id === action.payload.id) {
				projectIndex = idx;
			}
		});
		const originalProject = state.projects[status].myProjects[projectIndex];
		state.projects[status].myProjects[projectIndex] = {...originalProject, ...action.payload};
		return {
			...state,
			projects: {
				...state.projects,
				active: {
					...state.projects.active,
					myProjects: [...state.projects.active.myProjects],
				},
				archived: {
					...state.projects.archived,
					myProjects: [...state.projects.archived.myProjects],
				},
			},
		};
	},
	[CHANGE_PROJECT_STATUS_SUCCESS]: (state, action) => {
		const newActiveProjects = [...state.projects.active.myProjects];
		const newArchivedProjects = [...state.projects.archived.myProjects];
		if (action.payload.archived) {
			moveProject(action.payload.id, newActiveProjects, newArchivedProjects);
		} else {
			moveProject(action.payload.id, newArchivedProjects, newActiveProjects);
		}

		return {
			...state,
			projects: {
				...state.projects,
				active: {
					...state.projects.active,
					myProjects: newActiveProjects,
				},
				archived: {
					...state.projects.archived,
					myProjects: newArchivedProjects,
				},
			},
		};
	},
	[DELETE_PROJECT_TEAM_MEMBER_SUCCESS]: (state, action) => {
		const projects = {
			...state.projects,
		};
		if (action.deleteFromSharedProjects) {
			projects.active.sharedProjects = state.projects.active.sharedProjects.filter((project) => project.id !== action.projectId);
		} else {
			projects.active.myProjects.map((project) => {
				if (project.id === action.projectId) {
					project.teamMemberCount = project.teamMemberCount - 1;
				}
			});
		}
		return {
			...state,
			projects: {
				...projects,
			},
		};
	},
	[SIGN_USER_OUT]: () => ({
		...initialState,
	}),
	[PROJECTS_SEARCH_FILTER]: (state, action) => {
		let filteredShoppingLists = [...state.shoppingLists];
		const { payload: searchTerm } = action;
		if (searchTerm) {
			filteredShoppingLists = filteredShoppingLists.filter((project) => {
				const { name } = project.project;
				return name && name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1;
			});
		}
		return {
			...state,
			filteredShoppingLists,
			isFiltering: !!searchTerm,
		};
	},
	[SAVING_SHOPPING_LIST]: (state) => {
		return {
			...state,
			isSavingShoppingList: true,
		};
	},
	[SAVE_SHOPPING_LIST_SUCCESS]: (state, action) => {
		const projects = cloneDeep(state.shoppingLists);
		const { projectId } = action.payload;
		const projectIndex = projects.findIndex((project) => project.project.id === projectId);
		projects[projectIndex].shoppingLists = [action.payload, ...projects[projectIndex].shoppingLists];
		return {
			...state,
			shoppingLists: projects,
			isSavingShoppingList: false,
		};
	},
	[SAVE_SHOPPING_LIST_FAIL]: (state, action) => {
		return {
			...state,
			isSavingShoppingList: false,
			error: action.payload.message || 'Failed to save the group',
		};
	},
	[CREATE_PROJECT_WITH_DEFAULT_GROUP_SUCCESS]: (state, action) => {
		return {
			...state,
			shoppingLists: [action.payload, ...state.shoppingLists],
		};
	},
	[ITEM_ADDED_TO_PROJECT]: (state, action) => {
		return {
			...state,
			itemAddedToProject: action.payload,
		};
	},
	[ADD_ITEM_TO_SHOPPING_LIST_FAIL]: (state, action) => {
		return {
			...state,
			error: action.payload.message || 'Failed to add item. Try again.',
		};
	},
	[CREATE_PROJECT_WITH_DEFAULT_GROUP_FAIL]: (state, action) => {
		return {
			...state,
			error: action.payload.message || 'Failed to create a project.',
		};
	},
	[RESET_SHOPPING_LISTS_EDITING_FLAG]: (state, action) => {
		const { shoppingLists: projects } = state;
		const projectIndex = projects.findIndex((project) => project.project.id === action.payload.projectId);
		if (projectIndex >= 0) {
			projects[projectIndex].shoppingLists = projects[projectIndex].shoppingLists.map((shoppingList) => {
				shoppingList.isEditing = false;
				return shoppingList;
			});
		}
		return {
			...state,
			shoppingLists: projects,
		};
	},
	[RESET_LOADING_FLAG]: (state, action) => {
		return {
			...state,
			isLoading: action.payload.isLoading,
		};
	},
	[DELETE_GROUP_SUCCESS]: (state, action) => {
		const { projectShoppingListGroupId, projectId } = action.payload;
		const { shoppingLists: projects } = state;
		const projectIndex = projects.findIndex((project) => project.project.id === projectId);
		projects[projectIndex].shoppingLists = projects[projectIndex].shoppingLists.filter((shoppingList) => {
			return shoppingList.projectShoppingListGroupId !== projectShoppingListGroupId;
		});
		return {
			...state,
			shoppingLists: projects,
		};
	},
}, initialState);
