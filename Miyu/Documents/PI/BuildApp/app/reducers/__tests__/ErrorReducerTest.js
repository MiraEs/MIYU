import errorReducer from '../errorReducer';
import {
	REFRESH_CURRENT_SCREEN,
} from '../../constants/constants';

describe('errorReducer', () => {
	it('should return initialState', () => {
		expect(errorReducer(undefined, {})).toMatchSnapshot();
	});


	it('should return the state for REFRESH_CURRENT_SCREEN', () => {
		expect(errorReducer(undefined, {
			type: REFRESH_CURRENT_SCREEN,
			payload: { refresh: true },
		})).toMatchSnapshot();
	});

});
