import projectsService from '../services/projectsService';
import cartService from '../services/CartService';
import {
	RECEIVE_PROJECTS_SUCCESS,
	RECEIVE_PROJECTS_FAIL,
	RECEIVE_SHOPPING_LISTS_SUCCESS,
	RECEIVE_SHOPPING_LISTS_FOR_PROJECT_SUCCESS,
	RECEIVE_SHOPPING_LIST_AGGREGATE_DATA,
	SAVE_PROJECT_FAIL,
	SAVE_PROJECT_SUCCESS,
	UPDATE_PROJECT_SUCCESS,
	PRE_AUTH_PROJECT_DATA,
	CHANGE_PROJECT_STATUS_SUCCESS,
	CHANGE_PROJECT_STATUS_FAIL,
} from '../constants/constants';
import {
	UPDATE_PROJECTS_FILTER,
	PROJECTS_SEARCH_FILTER,
	ADD_ITEM_TO_SHOPPING_LIST_SUCCESS,
	ADD_ITEM_TO_SHOPPING_LIST_FAIL,
	SAVING_SHOPPING_LIST,
	SAVE_SHOPPING_LIST_SUCCESS,
	SAVE_SHOPPING_LIST_FAIL,
	CREATE_PROJECT_WITH_DEFAULT_GROUP_SUCCESS,
	CREATE_PROJECT_WITH_DEFAULT_GROUP_FAIL,
	ITEM_ADDED_TO_PROJECT,
	RESET_SHOPPING_LISTS_EDITING_FLAG,
	RESET_LOADING_FLAG,
	REMOVE_ITEM_FROM_SHOPPING_LIST_SUCCESS,
	REMOVE_ITEM_FROM_SHOPPING_LIST_FAIL,
	DELETE_GROUP_SUCCESS,
} from '../constants/ProjectConstants';
import store from 'react-native-simple-store';
import { createAction } from 'redux-actions';
import {
	findIndexOfSessionCartInShoppingList,
	getShoppingListsFromProject,
} from '../reducers/helpers/projectsReducerHelper';
import { getSessionCart } from './CartActions';

/**
 * Update project filters
 */
const updateProjectFilters = (filterText) => {
	return {
		type: UPDATE_PROJECTS_FILTER,
		filterText,
	};
};

const projectsSearchFilter = createAction(PROJECTS_SEARCH_FILTER);

const receiveProjects = createAction(RECEIVE_PROJECTS_SUCCESS);

const receiveProjectsFail = (error) => {
	return {
		type: RECEIVE_PROJECTS_FAIL,
		error,
	};
};

// Split up previous projectActionCreators into more discrete logic
const getProjects = () => {
	return (dispatch, getState) => {
		const { customerId } = getState().userReducer.user;

		return Promise.all([
			projectsService.get({
				customerId,
				includeInvited: true,
			}),
			projectsService.get({
				customerId,
				archived: true,
				includeInvited: true,
			}),
		])
			.then((response) => {
				dispatch(receiveProjects(response));
			})
			.catch((error) => {
				dispatch(receiveProjectsFail(error));
			});
	};
};

const projectStatusChange = createAction(CHANGE_PROJECT_STATUS_SUCCESS);

const projectStatusChangeFail = (payload) => {
	return {
		type: CHANGE_PROJECT_STATUS_FAIL,
		payload,
	};
};

const changeProjectStatus = (project) => {
	return (dispatch, getState) => {
		project.customerId = getState().userReducer.user.customerId;

		dispatch(projectStatusChangeFail(''));

		return projectsService.save(project).then((response) => {
			dispatch(projectStatusChange(response));
		})
		.catch((error) => {
			dispatch(projectStatusChangeFail(error.message));
			throw error;
		});
	};
};

const projectSaved = createAction(SAVE_PROJECT_SUCCESS);
const projectUpdated = createAction(UPDATE_PROJECT_SUCCESS);
const projectSavedFail = createAction(SAVE_PROJECT_FAIL);

const saveProject = (project) => {
	return (dispatch, getState) => {
		project.customerId = getState().userReducer.user.customerId;

		dispatch(projectSavedFail(''));

		return projectsService.save(project)
			.then((response) => {
				if (project.id) {
					dispatch(projectUpdated(response));
				} else {
					dispatch(projectSaved(response));
				}
				return response;
			})
			.catch((error) => {
				if (error instanceof Error) {
					dispatch(projectSavedFail(error.message));
					throw error;
				} else {
					dispatch(projectSavedFail(error));
					throw new Error(error);
				}
			});
	};
};

const savePreAuthProjectData = (project) => {
	return () => {
		store.save(PRE_AUTH_PROJECT_DATA, project);
	};
};

const savePreAuthProjectToUser = () => {
	return (dispatch) => {
		return store.get(PRE_AUTH_PROJECT_DATA)
			.then((project) => {
				if (project) {
					dispatch(saveProject(project))
						.then(() => {
							store.delete(PRE_AUTH_PROJECT_DATA);
						});
				}
			});
	};
};

const receiveShoppingLists = createAction(RECEIVE_SHOPPING_LISTS_SUCCESS);
const getShoppingLists = () => {
	return (dispatch, getState) => {
		const { customerId } = getState().userReducer.user;
		return projectsService.getShoppingLists({
			customerId,
		})
			.then((response) => {
				dispatch(receiveShoppingLists(response));
			})
			.catch((error) => {
				dispatch(receiveProjectsFail(error));
			});
	};
};

const receiveShoppingListsForProject = createAction(RECEIVE_SHOPPING_LISTS_FOR_PROJECT_SUCCESS);
const receiveShoppingListAggregateData = createAction(RECEIVE_SHOPPING_LIST_AGGREGATE_DATA);
const getShoppingListsForProject = ({ projectId }) => {
	return (dispatch) => {
		return projectsService.getShoppingListsForProject({ projectId })
			.then(({ aggregateData, shoppingLists }) => {
				dispatch(receiveShoppingListsForProject({
					shoppingLists,
					projectId,
				}));
				dispatch(receiveShoppingListAggregateData(aggregateData));
			})
			.catch((error) => {
				dispatch(receiveProjectsFail(error.message));
			})
			.done();
	};
};

const addItemToShoppingListSuccess = createAction(ADD_ITEM_TO_SHOPPING_LIST_SUCCESS);
const addItemToShoppingListFail = createAction(ADD_ITEM_TO_SHOPPING_LIST_FAIL);
const addItemToShoppingList = (request) => {
	return (dispatch, getState) => {
		request = {
			...request,
			customerId: getState().userReducer.user.customerId,
		};

		return cartService.addSessionCartItems(request)
			.then(() => {
				dispatch(addItemToShoppingListSuccess());
			})
			.catch((error) => {
				dispatch(addItemToShoppingListFail(error));
			});
	};
};

const addSubItemToShoppingList = (request) => {
	return (dispatch) => {
		return cartService.addSessionCartSubItem(request)
			.then(() => {
				dispatch(addItemToShoppingListSuccess());
			})
			.catch((error) => {
				dispatch(addItemToShoppingListFail(error));
			});
	};
};

const removeItemFromShoppingListSuccess = createAction(REMOVE_ITEM_FROM_SHOPPING_LIST_SUCCESS);
const removeItemFromShoppingListFail = createAction(REMOVE_ITEM_FROM_SHOPPING_LIST_FAIL);
const removeItemFromShoppingList = (sessionCartId, itemKey, projectId) => {
	return (dispatch) => {
		return cartService.deleteSessionCartItem({ sessionCartId, itemKey })
			.then(() => {
				dispatch(removeItemFromShoppingListSuccess());
				dispatch(getShoppingListsForProject({ projectId }));
				return data;
			})
			.catch((error) => {
				dispatch(removeItemFromShoppingListFail(error));
				return error;
			});
	};
};

const savingShoppingList = createAction(SAVING_SHOPPING_LIST);
const saveShoppingListSuccess = createAction(SAVE_SHOPPING_LIST_SUCCESS);
const saveShoppingListFail = createAction(SAVE_SHOPPING_LIST_FAIL);

/**
 * This action creates or updates the ShoppingList AKA Group.
 *
 * To create a new ShoppingList/Group, see example below:
 * @example
 * {
 *    name: "mygroup",
 *    projectId: 0,
 * }
 *
 * @param shoppingList see example above
 */
const saveShoppingList = (shoppingList) => {
	return (dispatch) => {
		dispatch(savingShoppingList());
		return projectsService.saveShoppingList({ shoppingList })
			.then((response) => {
				dispatch(saveShoppingListSuccess(response));
				return response;
			})
			.catch((error) => {
				dispatch(saveShoppingListFail(error));
			});
	};
};

const createProjectSuccess = createAction(CREATE_PROJECT_WITH_DEFAULT_GROUP_SUCCESS);
const createProjectFail = createAction(CREATE_PROJECT_WITH_DEFAULT_GROUP_FAIL);

const createProjectWithDefaultGroup = (options) => {
	return (dispatch, getState) => {
		const request = {
			customerId: getState().userReducer.user.customerId,
			...options,
		};
		let newProject = null;
		return projectsService.save(request)
			.then((project) => {
				newProject = project;
				return projectsService.saveShoppingList({
					shoppingList: {
						name: null,
						projectId: project.id,
					},
				});
			})
			.then((shoppingList) => {
				const project = {
					project: newProject,
					shoppingLists: [shoppingList],
				};
				dispatch(createProjectSuccess(project));
				return project;
			})
			.catch((error) => {
				dispatch(createProjectFail(error));
			});
	};
};

const itemAddedToProject = createAction(ITEM_ADDED_TO_PROJECT);

const updateShoppingList = ({ projectId, shoppingList }) => {
	return (dispatch, getState) => {
		return projectsService.saveShoppingList({ shoppingList })
			.then((data) => {
				const shoppingListsInProject = getShoppingListsFromProject(getState().projectsReducer.shoppingLists, projectId);
				const index = findIndexOfSessionCartInShoppingList(shoppingListsInProject, shoppingList.projectShoppingListGroupId);
				let updatedShoppingListsInProject = [];
				if (index >= 0) {
					updatedShoppingListsInProject = [...shoppingListsInProject];
					updatedShoppingListsInProject[index] = {...data};
				} else {
					// adding a new group
					updatedShoppingListsInProject = [{...data}, ...shoppingListsInProject];
				}

				dispatch(receiveShoppingListsForProject({
					shoppingLists: updatedShoppingListsInProject,
					projectId,
				}));
			})
			.catch((error) => {
				dispatch(receiveProjectsFail(error.message));
				throw error;
			});
	};
};

const createEmptyShoppingList = ({ projectId }) => {
	return (dispatch, getState) => {
		const shoppingListsInProject = getShoppingListsFromProject(getState().projectsReducer.shoppingLists, projectId);
		const newShoppingList = {
			isEditing: true,
			name: '',
			projectId,
		};
		const shoppingLists = [
			newShoppingList,
			...shoppingListsInProject,
		];
		dispatch(receiveShoppingListsForProject({
			shoppingLists,
			projectId,
		}));
	};
};

const resetShoppingListsEditingFlag = createAction(RESET_SHOPPING_LISTS_EDITING_FLAG);

const addItemsToCartFromProjectSuccess = createAction('ADD_ITEMS_TO_CART_FROM_PROJECT_SUCCESS');
const addItemsToCartFromProjectFail = createAction('ADD_ITEMS_TO_CART_FROM_PROJECT_FAIL');

const addItemsToCartFromProject = (projectId, items) => {
	return (dispatch, getState) => {
		const sessionCartItems = [];
		items.forEach((item) => {
			const {
				quantityUnpurchased,
				product: { uniqueId },
				pricedOptions: selectedPricedOptions,
			} = item;

			const pricedOptions = [];
			selectedPricedOptions.map((option) => {
				pricedOptions.push({
					keyCode: option.keyCode,
					pricedOptionId: option.pricedOptionId,
				});
			});

			const sessionCartItem = {
				productUniqueId: uniqueId,
				quantity: quantityUnpurchased,
				pricedOptions,
			};
			if (item.parentKey) {
				sessionCartItem.parentKey = item.parentKey;
				sessionCartItem.parentUniqueId = item.parentUniqueId;
			}
			sessionCartItems.push(sessionCartItem);
		});

		const options = {
			sessionCartItems,
			sessionCartId: getState().cartReducer.cart.sessionCartId,
			customerId: getState().userReducer.user.customerId,
		};
		return cartService.addSessionCartItems(options)
			.then((results) => {
				const { cartItems, sessionCartId } = results;
				dispatch(addItemsToCartFromProjectSuccess(results));
				dispatch(getSessionCart({ sessionCartId }));
				const attachItemCalls = [];
				items.forEach((item) => {
					const matchedItem = cartItems.find((cartItem) => item.itemKey === cartItem.itemKey);
					if (matchedItem) {
						attachItemCalls.push(projectsService.attachCartItemToProject(projectId, item.id, matchedItem.id));
					}
				});
				return Promise.all(attachItemCalls);
			})
			.catch((error) => {
				dispatch(addItemsToCartFromProjectFail(error));
				return error;
			});
	};
};

const resetLoadingFlag = createAction(RESET_LOADING_FLAG);

const deleteGroupSuccess = createAction(DELETE_GROUP_SUCCESS);
const deleteGroup = (projectShoppingListGroupId, projectId) => {
	return (dispatch) => {
		return projectsService.deleteGroup(projectShoppingListGroupId)
			.then(() => {
				dispatch(deleteGroupSuccess({ projectShoppingListGroupId, projectId }));
			});
	};
};

module.exports = {
	addItemsToCartFromProject,
	addItemToShoppingList,
	addSubItemToShoppingList,
	changeProjectStatus,
	createProjectWithDefaultGroup,
	createEmptyShoppingList,
	deleteGroup,
	getProjects,
	getShoppingLists,
	getShoppingListsForProject,
	itemAddedToProject,
	projectSaved,
	projectStatusChange,
	projectStatusChangeFail,
	projectUpdated,
	projectSavedFail,
	projectsSearchFilter,
	receiveProjects,
	receiveProjectsFail,
	receiveShoppingLists,
	receiveShoppingListsForProject,
	removeItemFromShoppingList,
	resetShoppingListsEditingFlag,
	resetLoadingFlag,
	saveProject,
	savePreAuthProjectData,
	savePreAuthProjectToUser,
	saveShoppingList,
	updateProjectFilters,
	updateShoppingList,
};
