'use strict';

import {
	ADD_FAIL,
	GLOBAL_SAVE_COMMENT_SUCCESS,
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
import messages from '../lib/messages';
import {
	UPDATE_SHOW_PROJECT_EVENTS,
	UPDATE_ACTIVE_PROJECT_EVENTS_FILTER,
	UPDATE_IS_FETCHING_PROJECT_DATA,
	PROJECT_UPDATE_IS_REFRESHING,
} from '../constants/projectEventsConstants';

const initialState = {
	events: [],
	hasNextPage: false,
	error: '',
	isFetchingNextPage: false,
	pageNumber: 1,
	isRefreshing: false,
	showEvents: true,
	isFiltering: false,
	activeFilter: 'ALL',
	isFetchingData: true,
};

function hasNextPage(paging) {
	return paging && paging.page !== paging.pages;
}

export default function projectEventsReducer(state = initialState, action = {}) {
	let events;
	switch (action.type) {

		case UPDATE_IS_FETCHING_PROJECT_DATA:
			return {
				...state,
				isFetchingData: action.isFetchingData,
			};

		case UPDATE_ACTIVE_PROJECT_EVENTS_FILTER:
			return {
				...state,
				activeFilter: action.activeFilter,
			};

		case UPDATE_SHOW_PROJECT_EVENTS:
			return {
				...state,
				showEvents: action.showEvents,
			};

		case PROJECT_LOAD_EVENTS_SUCCESS:
			return {
				...state,
				hasNextPage: hasNextPage(action.paging),
				events: action.data,
				showEvents: true,
				error: '',
				isFetchingData: false,
			};

		case PROJECT_LOAD_EVENTS_ERROR:
			return {
				...state,
				showEvents: true,
				error: messages.errors.retrieveFeed,
				isFetchingData: false,
			};

		case PROJECT_LOAD_NEXT_EVENTS_SUCCESS:
			return {
				...state,
				hasNextPage: hasNextPage(action.paging),
				events: [
					...state.events,
					...action.data,
				],
				showEvents: true,
				isFetchingData: false,
			};

		case PROJECT_ADD_EVENT:
			let hasMatch = false;
			events = state.events.map((event) => {
				if (event._id === action.data._id) {
					hasMatch = true;
					return action.data;
				}
				return event;
			});

			// no match means user is not retrying to post (default case)
			if (!hasMatch) {
				events = [action.data, ...events];
			}
			return {
				...state,
				events,
			};

		case PROJECT_ADD_EVENT_SUCCESS:
			events = state.events.map((event) => {
				return event._id === action.data._id ? action.data : event;
			});
			return {
				...state,
				events,
			};

		case PROJECT_ADD_EVENT_ERROR:
			events = state.events;
			events = events.map((event) => {
				return event._id === action.data._id ? action.data : event;
			});
			return {
				...state,
				events,
			};

		case PROJECT_SAVE_COMMENT:
			events = state.events.map((event) => {
				if (event.eventId === action.data.eventId) {
					const match = event.comments.filter((comment, index, comments) => {
						if (comment._id === action.data._id) {
							comments[index] = Object.assign({}, action.data);
							return comment;
						}
					});
					if (match.length === 0) {
						event.comments = [...event.comments, Object.assign(action.data)];
					}
				}
				return event;
			});
			return {
				...state,
				events,
			};


		case PROJECT_SAVE_COMMENT_SUCCESS:
			events = state.events.map((event) => {
				if (event.eventId === action.data.eventId) {
					event.comments = event.comments.map((comment) => {
						if (comment._id === action.data._id) {
							return action.data;
						}
						return comment;
					});
				}
				return event;
			});
			return {
				...state,
				events,
			};

		case PROJECT_SAVE_COMMENT_ERROR:
			events = state.events.map((event) => {
				if (event.eventId === action.data.eventId) {
					event.comments.map((comment) => {
						if (comment._id === action.data._id) {
							comment._status = ADD_FAIL;
						}
					});
				}
				return event;
			});
			return {
				...state,
				events,
			};

		case GLOBAL_SAVE_COMMENT_SUCCESS:
			events = state.events;
			const newComment = action.data;
			delete newComment._status;
			events.map((event) => {
				if (event.eventId === newComment.eventId) {
					event.comments.push(Object.assign({}, newComment));
				}
			});
			return {
				...state,
				events,
			};

		case PROJECT_UPDATE_IS_REFRESHING:
			return {
				...state,
				isRefreshing: action.isRefreshing,
			};

		default:
			return state;
	}
}
