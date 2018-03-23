import { REFERENCE_SET_REFERENCE } from '../actions/ReferenceActions';

export default function referenceReducer(state = {}, action = {}) {
	if (action.type === REFERENCE_SET_REFERENCE) {
		return {
			...state,
			[action.payload.component]: action.payload.reference,
		};
	}
	return state;
}
