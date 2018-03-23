
import { createAction } from 'redux-actions';
import lookbackConstants from '../constants/LookbackConstants';

const startLookbackRecording = createAction(lookbackConstants.START_LOOKBACK_RECORDING);
const stopLookbackRecording = createAction(lookbackConstants.STOP_LOOKBACK_RECORDING);

export default {
	startLookbackRecording,
	stopLookbackRecording,
};
