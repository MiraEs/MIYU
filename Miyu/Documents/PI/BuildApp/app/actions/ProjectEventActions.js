'use strict';

import { createAction } from 'redux-actions';
import eventsService from '../services/eventsService';
import customerService from '../services/customerService';
import {
	ADD_FAIL,
	ADD_PENDING,
	ADD_PROJECT_ORDER,
	ADD_PROJECT_ORDER_ERROR,
	ADD_PROJECT_ORDER_SUCCESS,
	FEED_PAGE_LENGTH,
	LOAD_PHOTOS_FAIL,
	LOAD_PHOTOS_SUCCESS,
	LOADING_PHOTOS,
	PROJECT_ADD_EVENT,
	PROJECT_ADD_EVENT_ERROR,
	PROJECT_ADD_EVENT_SUCCESS,
	PROJECT_LOAD_EVENTS_ERROR,
	PROJECT_LOAD_EVENTS_SUCCESS,
	PROJECT_LOAD_NEXT_EVENTS_SUCCESS,
	PROJECT_SAVE_COMMENT,
	PROJECT_SAVE_COMMENT_ERROR,
	PROJECT_SAVE_COMMENT_SUCCESS,
} from '../constants/constants';
import {
	PROJECT_SAVE_FAVORITE_FAIL,
	PROJECT_SAVE_FAVORITE_SUCCESS,
} from '../constants/FavoritesConstants';
import {
	UPDATE_SHOW_PROJECT_EVENTS,
	UPDATE_ACTIVE_PROJECT_EVENTS_FILTER,
	PROJECT_UPDATE_IS_REFRESHING,
	UPDATE_IS_FETCHING_PROJECT_DATA,
} from '../constants/projectEventsConstants';
import uniqueId from 'lodash.uniqueid';
import {
	getAvatarUrl,
	getFullName,
} from '../reducers/helpers/userReducerHelpers';
import { getProject } from '../reducers/helpers/projectsReducerHelper';
import {
	uploadUserPhoto,
} from '../actions/UserActions';
import { loadOrders } from '../actions/OrderActions';

function updateIsRefreshing(isRefreshing) {
	return {
		type: PROJECT_UPDATE_IS_REFRESHING,
		isRefreshing,
	};
}

function updateFilters(activeFilter) {
	return {
		type: UPDATE_ACTIVE_PROJECT_EVENTS_FILTER,
		activeFilter,
	};
}

function updateShowProjectEvents(showEvents) {
	return {
		type: UPDATE_SHOW_PROJECT_EVENTS,
		showEvents,
	};
}

function updateIsFetchingProjectData(isFetchingData) {
	return {
		type: UPDATE_IS_FETCHING_PROJECT_DATA,
		isFetchingData,
	};
}

/**
 * Get Project Events
 */
function projectLoadEventsSuccess(response) {
	return {
		type: PROJECT_LOAD_EVENTS_SUCCESS,
		data: response.data,
		paging: response.paging,
	};
}

function projectLoadNextEventsSuccess(response) {
	return {
		type: PROJECT_LOAD_NEXT_EVENTS_SUCCESS,
		data: response.data,
		paging: response.paging,
	};
}

function projectLoadEventsError(error) {
	return {
		type: PROJECT_LOAD_EVENTS_ERROR,
		error,
	};
}

function getEvents(options = {}) {
	return (dispatch, getState) => {

		options.filters = options.filters || {};

		if (options.projectId) {
			options.filters.projectId = options.projectId;
		}
		if (options.eventType) {
			options.filters.eventType = options.eventType;
			dispatch(updateFilters(options.eventType));
		} else {
			dispatch(updateFilters('ALL'));
		}

		const filters = options.filters;

		const request = {
			/* Might need to change this depending on where the
			 customerId is nested within the state tree */
			customerId: getState().userReducer.user.customerId,
			filters: {
				pageSize: FEED_PAGE_LENGTH,
				page: 1,
				...filters,
			},
		};

		return eventsService.get(request, (response) => {
			if (request.filters.page === 1) {
				dispatch(projectLoadEventsSuccess(response));
			} else {
				dispatch(projectLoadNextEventsSuccess(response));
			}
			dispatch(loadOrders(request.customerId));
			dispatch(updateIsRefreshing(false));
		}, (error) => {
			dispatch(projectLoadEventsError(error));
			dispatch(updateIsRefreshing(false));
		});
	};
}

/**
 * Save project favorite
 */

function saveProjectFavoriteSuccess(response) {
	return {
		type: PROJECT_SAVE_FAVORITE_SUCCESS,
		data: response,
	};
}

function saveProjectFavoriteFail(error) {
	return {
		type: PROJECT_SAVE_FAVORITE_FAIL,
		error,
	};
}

function saveProjectFavorite(data) {
	return (dispatch, getState) => {
		const request = {
			customerId: getState().userReducer.user.customerId,
			favoriteId: data.favoriteId,
			projectId: data.projectId,
		};

		return customerService.saveProjectFavorite(request).then(() => {
			const eventOptions = {
				projectId: data.projectId,
				eventType: 'FAVORITE_LIST',
			};
			dispatch(getEvents(eventOptions));
			dispatch(saveProjectFavoriteSuccess(data));
		}).catch((error) => {
			dispatch(saveProjectFavoriteFail(error));
		});
	};
}

/**
 * Get photos
 */
function loadPhotosSuccess(payload) {
	return {
		type: LOAD_PHOTOS_SUCCESS,
		payload,
	};
}

function loadPhotosFail(payload) {
	return {
		type: LOAD_PHOTOS_FAIL,
		payload,
	};
}

const loadingPhotos = createAction(LOADING_PHOTOS);

function getPhotos(options) {
	return (dispatch, getState) => {
		const request = {
			customerId: getState().userReducer.user.customerId,
			projectId: options.projectId,
		};

		// continue to maintain the reducers for the single events (old projects) for now
		dispatch(updateFilters('PHOTOS'));
		dispatch(updateShowProjectEvents(false));

		dispatch(loadingPhotos(true));

		return customerService.getProjectPhotoGalleryViews(request)
			.then((response) => dispatch(loadPhotosSuccess(response)))
			.catch((error) => dispatch(loadPhotosFail(error)))
			.done(() => {
				dispatch(updateIsRefreshing(false));
				dispatch(loadingPhotos(false));
			});
	};
}

/*
 * Save Comment
 */
function projectSaveComment(optimistic, eventId) {
	return {
		type: PROJECT_SAVE_COMMENT,
		data: {
			...optimistic,
			eventId,
		},
	};
}

function saveCommentSuccess(optimistic, commentId, eventId) {
	return {
		type: PROJECT_SAVE_COMMENT_SUCCESS,
		data: {
			...optimistic,
			commentId,
			eventId,
		},
	};
}

function saveCommentError(error, optimistic, eventId) {
	return {
		type: PROJECT_SAVE_COMMENT_ERROR,
		data: {
			...optimistic,
			eventId,
		},
		error,
	};
}

function saveComment(options = {}) {
	return (dispatch, getState) => {
		const { user } = getState().userReducer;

		const request = {
			customerId: user.customerId,
			eventId: options.eventId,
			message: options.message,
		};

		const id = options._id ? options._id : uniqueId();

		const optimistic = {
			commentId: id,
			user: {
				userType: 'CUSTOMER',
				name: getFullName(user),
				firstName: user.firstName,
				lastName: user.lastName,
				title: '',
				avatar: getAvatarUrl(user),
			},
			createdDate: (new Date()).getTime(),
			message: options.message,
			photos: options.photos,
			_id: id,
			_status: ADD_PENDING,
		};

		dispatch(projectSaveComment(optimistic, options.eventId));

		const photoUploads = [];

		options.photos.map((photo) => {
			photoUploads.push(dispatch(uploadUserPhoto(user.customerId, {
				uri: photo,
			})));
		});

		Promise.all(photoUploads).then((response) => {
			request.photoIds = [];

			if (Array.isArray(response)) {
				response.forEach((photo) => {
					request.photoIds.push(photo.userPhotoId);
				});
			}

			customerService.saveEventComment(request, (data) => {
				// we remove photos here to give the image resizer time to resize images
				// just rely on the optimistic images
				delete data.photos;
				delete optimistic._status;
				dispatch(saveCommentSuccess(optimistic, data.commentId, options.eventId));
			}, (error) => {
				optimistic._status = ADD_FAIL;
				dispatch(saveCommentError(error, optimistic, options.eventId));
			});
		}, (error) => {
			optimistic._status = ADD_FAIL;
			dispatch(saveCommentError(error, optimistic, options.eventId));
		});
	};
}

/**
 * create event
 */
function addEvent(data) {
	return {
		type: PROJECT_ADD_EVENT,
		data,
	};
}

function projectAddEventSuccess(data) {
	return {
		type: PROJECT_ADD_EVENT_SUCCESS,
		data,
	};
}

function projectAddEventError(error, data) {
	return {
		type: PROJECT_ADD_EVENT_ERROR,
		error,
		data,
	};
}

function createEvent(options = {}) {
	return (dispatch, getState) => {
		const id = options._id ? options._id : parseInt(uniqueId(), 10);
		const { user } = getState().userReducer;
		const { projects } = getState().projectsReducer;

		const optimistic = {
			eventId: id,
			eventType: options.eventType,
			user: {
				userType: 'CUSTOMER',
				firstName: user.firstName,
				lastName: user.lastName,
				name: getFullName(user),
				title: null,
				avatar: getAvatarUrl(user),
			},
			comments: [],
			createdDate: (new Date()).getTime(),
			message: options.message,
			photos: options.photos,
			projectName: getProject(projects, options.projectId).name,
			projectId: options.projectId,
			_id: id,
			_status: ADD_PENDING,
		};

		dispatch(addEvent(optimistic));
		if (options.photos && options.photos.length) {
			dispatch(loadingPhotos(true));
		}

		const request = {
			projectId: options.projectId,
			customerId: user.customerId,
			message: options.message,
			photoIds: options.photoIds,
		};

		const photoUploads = [];

		options.photos.map((photo) => {
			photoUploads.push(dispatch(uploadUserPhoto(user.customerId, {
				uri: photo,
			})));
		});

		return Promise.all(photoUploads)
			.then((response) => {
				dispatch(loadingPhotos(false));
				request.photoIds = [];

				if (Array.isArray(response)) {
					response.forEach((photo) => {
						request.photoIds.push(photo.userPhotoId);
					});
				}

				return eventsService.savePostEvent(request)
					.then((response) => {
						// we remove photos here to give the image resizer time to resize images
						// plus the flash is annoying, so we just rely on the optimistic images
						delete response.photos;
						const data = Object.assign({}, optimistic, response);
						delete data._status;

						// dispatch that the post succeeded
						dispatch(projectAddEventSuccess(data));
					})
					.catch((error) => {
						optimistic._status = ADD_FAIL;
						dispatch(projectAddEventError(error, optimistic));
					});
			})
			.catch((error) => {
				dispatch(loadingPhotos(false));

				optimistic._status = ADD_FAIL;
				dispatch(projectAddEventError(error, optimistic));
			});
	};

}


function projectAddOrderSuccess(data) {
	return {
		type: ADD_PROJECT_ORDER_SUCCESS,
		data,
	};
}

function projectAddOrderError(error) {
	return {
		type: ADD_PROJECT_ORDER_ERROR,
		error,
	};
}

function projectAddOrder(order) {
	return {
		type: ADD_PROJECT_ORDER,
		order,
	};
}

function addOrderToProject(request = {}) {
	return (dispatch) => {
		dispatch(projectAddOrder(request.order));

		return customerService.saveProjectOrder(request).then(() => {
			const options = {
				projectId: request.projectId,
				eventType: 'ORDER',
			};
			dispatch(getEvents(options));
			dispatch(projectAddOrderSuccess(request.order));
		}, (error) => {
			dispatch(projectAddOrderError(error.order));
		});
	};
}

module.exports = {
	updateIsRefreshing,
	updateShowProjectEvents,
	updateIsFetchingProjectData,
	getEvents,
	saveProjectFavorite,
	getPhotos,
	saveComment,
	createEvent,
	addOrderToProject,
};
