import { handleActions } from 'redux-actions';


export default handleActions({
	['VALIDATE']: (state, action) => ({
		...action.payload,
	}),
}, {});
