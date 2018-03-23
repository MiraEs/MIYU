import { handleActions } from 'redux-actions';
import {
	toggleEventOn,
	toggleEventOff,
} from '../actions/EventsActions';

const initialState = {
};

export default handleActions({
	[toggleEventOn]: (state, action) => ({
		...state,
		[action.payload]: true,
	}),
	[toggleEventOff]: (state, action) => ({
		...state,
		[action.payload]: false,
	}),
}, initialState);
