
import { createAction } from 'redux-actions';


export const toggleEventOn = createAction('TOGGLE_EVENT_ON');
export const toggleEventOff = createAction('TOGGLE_EVENT_OFF');

function triggerEvent(eventName) {
	return (dispatch) => {
		dispatch(toggleEventOn(eventName));
		setImmediate(() => {
			dispatch(toggleEventOff(eventName));
		});
	};
}

export default {
	triggerEvent,
};
