'use strict';

import {
	LOAD_SINGLE_EVENT_SUCCESS,
	LOAD_SINGLE_EVENT_FAIL,
	RESET_SINGLE_EVENT_DATA,
} from '../constants/singleEventConstants';
import {
	ADD_PENDING,
	ADD_FAIL,
	SINGLE_EVENT_SAVE_COMMENT,
	SINGLE_EVENT_SAVE_COMMENT_SUCCESS,
	SINGLE_EVENT_SAVE_COMMENT_FAIL,
} from '../constants/constants';
import { getFullName, getAvatarUrl } from '../reducers/helpers/userReducerHelpers';
import { uploadUserPhoto } from '../actions/UserActions';
import customersService from '../services/customerService';
import uniqueId from 'lodash.uniqueid';

function resetSingleEventData() {
	return {
		type: RESET_SINGLE_EVENT_DATA,
	};
}

function loadSingleEventSuccess(payload) {
	return {
		type: LOAD_SINGLE_EVENT_SUCCESS,
		payload,
	};
}

function loadSingleEventFail(error) {
	return {
		type: LOAD_SINGLE_EVENT_FAIL,
		error,
	};
}

function getEvent(options) {
	return (dispatch) => {
		return customersService.getEvent({
			customerId: options.customerId,
			eventId: options.eventId,
		}).then((response) => {
			if (!response.hasOwnProperty('eventId')) {
				dispatch(loadSingleEventFail(`No event found with id ${options.eventId}`));
			} else {
				dispatch(loadSingleEventSuccess(response));
			}
			return response;
		}).catch((error) => {
			dispatch(loadSingleEventFail(error));
		});
	};
}

function singleEventSaveComment(optimistic, eventId) {
	return {
		type: SINGLE_EVENT_SAVE_COMMENT,
		data: {
			...optimistic,
			eventId,
		},
	};
}

function saveCommentSuccess(optimistic, commentId, eventId) {
	return {
		type: SINGLE_EVENT_SAVE_COMMENT_SUCCESS,
		data: {
			...optimistic,
			commentId,
			eventId,
		},
	};
}

function saveCommentFail(error, optimistic, eventId) {
	return {
		type: SINGLE_EVENT_SAVE_COMMENT_FAIL,
		data: {
			...optimistic,
			eventId,
		},
		error,
	};
}

function saveComment(options) {
	return (dispatch, getState) => {

		const { user } = getState().userReducer,
			request = {
				customerId: user.customerId,
				eventId: options.eventId,
				message: options.message,
			},
			id = options._id ? options._id : uniqueId(),
			optimistic = {
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
			},
			photoUploads = [];

		dispatch(singleEventSaveComment(optimistic, options.eventId));

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

			customersService.saveEventComment(request, (data) => {

				// we remove photos here to give the image resizer time to resize images
				// just rely on the optimistic images
				delete data.photos;
				delete optimistic._status;

				dispatch(saveCommentSuccess(optimistic, options.commentId, options.eventId));
			}, (error) => {
				optimistic._status = ADD_FAIL;
				dispatch(saveCommentFail(error, optimistic, options.eventId));
			});

		}, (error) => {
			optimistic._status = ADD_FAIL;
			dispatch(saveCommentFail(error, optimistic, options.eventId));
		});
	};
}

module.exports = {
	resetSingleEventData,
	getEvent,
	saveComment,
};
