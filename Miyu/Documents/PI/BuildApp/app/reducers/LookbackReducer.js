
import { handleActions } from 'redux-actions';
import lookbackConstants from '../constants/LookbackConstants';

const initialState = {
	status: lookbackConstants.RECORDING_STATUS_INACTIVE,
};

const LookbackReducer = handleActions({
	[lookbackConstants.START_LOOKBACK_RECORDING]: (state) => {
		return {
			...state,
			status: lookbackConstants.RECORDING_STATUS_RECORDING,
		};
	},
	[lookbackConstants.STOP_LOOKBACK_RECORDING]: (state) => {
		return {
			...state,
			status: lookbackConstants.RECORDING_STATUS_STOPPED,
		};
	},
}, initialState);

export default LookbackReducer;
