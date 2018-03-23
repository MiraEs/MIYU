import {
	GET_SESSION,
	GET_SESSION_ERROR,
	SAVE_SESSION,
	SAVE_SESSION_ERROR,
} from '../constants/SessionConstants';

const initialState = {
	session: {},
	sessionError: {},
};

function sessionReducer(state = initialState, action = {}) {
	switch (action.type) {
		case GET_SESSION:
			return {
				...state,
				session: {...action.payload},
			};
		case GET_SESSION_ERROR:
			return {
				...state,
				sessionError: {...action.payload},
			};
		case SAVE_SESSION:
			return {
				...state,
				session: {...action.payload},
			};
		case SAVE_SESSION_ERROR:
			return {
				...state,
				sessionError: {...action.payload},
			};
		default:
			return state;
	}
}

export default sessionReducer;
