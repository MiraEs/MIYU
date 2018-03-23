'use strict';

import messages from '../lib/messages';
import {
	LOAD_SINGLE_EVENT_SUCCESS,
	LOAD_SINGLE_EVENT_FAIL,
	SINGLE_EVENT_SAVE_COMMENT,
	SINGLE_EVENT_SAVE_COMMENT_SUCCESS,
	SINGLE_EVENT_SAVE_COMMENT_FAIL,
	RESET_SINGLE_EVENT_DATA,
} from '../constants/singleEventConstants';

const initialState = {
	event: {
		comments: [],
	},
	error: '',
	isLoading: true,
};

function singleEventReducer(state = initialState, action = {}) {
	let event;
	switch (action.type) {

		case RESET_SINGLE_EVENT_DATA:
			return { ...initialState };

		case LOAD_SINGLE_EVENT_SUCCESS:
			return {
				...state,
				error: '',
				event: action.payload,
				isLoading: false,
			};

		case LOAD_SINGLE_EVENT_FAIL:
			return {
				...state,
				error: messages.errors.loadEvent,
				isLoading: false,
			};

		case SINGLE_EVENT_SAVE_COMMENT:
			event = { ...state.event };
			const match = event.comments.filter((comment, index, comments) => {
				if (comment._id === action.data._id) {
					comments[index] = {
						...action.data,
					};
					return comment;
				}
			});
			if (match.length === 0) {
				event.comments = event.comments.slice().concat(action.data);
			}
			return {
				...state,
				event,
			};

		case SINGLE_EVENT_SAVE_COMMENT_SUCCESS:
			event = { ...state.event };
			event.comments.map((comment, index) => {
				if (comment._id === action.data._id) {
					event.comments.splice(index, 1, action.data);
				}
			});
			return {
				...state,
				event,
			};

		case SINGLE_EVENT_SAVE_COMMENT_FAIL:
			event = { ...state.event };
			event.comments.map((comment, index) => {
				if (comment._id === action.data._id) {
					event.comments.splice(index, 1, action.data);
				}
			});
			return {
				...state,
				event,
			};

		default:
			return state;

	}
}

export default singleEventReducer;
