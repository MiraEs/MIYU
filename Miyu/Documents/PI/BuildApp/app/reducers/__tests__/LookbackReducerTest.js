
import lookbackReducer from '../LookbackReducer';
import lookbackConstants from '../../constants/LookbackConstants';
jest.mock('redux-actions');

const initialState = {
	status: lookbackConstants.RECORDING_STATUS_INACTIVE,
};

describe('lookbackReducer', () => {

	it('should return initialState', () => {
		expect(lookbackReducer(undefined, {})).toMatchSnapshot();
	});

	it('should handle start recording', () => {
		expect(lookbackReducer(initialState, {
			type: lookbackConstants.START_LOOKBACK_RECORDING,
		})).toMatchSnapshot();
	});

	it('should handle stop recording', () => {
		expect(lookbackReducer(initialState, {
			type: lookbackConstants.STOP_LOOKBACK_RECORDING,
		})).toMatchSnapshot();
	});

});
