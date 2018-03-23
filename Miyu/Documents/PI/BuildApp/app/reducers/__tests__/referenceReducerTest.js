import referenceReducer from '../referenceReducer';
import {
	REFERENCE_SET_REFERENCE,
	REFERENCE_MODAL,
} from '../../actions/ReferenceActions';

describe('referenceReducer', () => {
	it('should return initialState', () => {
		expect(referenceReducer(undefined, {})).toMatchSnapshot();
	});

	it('should return the state for REFERENCE_SET_REFERENCE', () => {
		expect(referenceReducer(undefined, {
			type: REFERENCE_SET_REFERENCE,
			payload: {
				component: REFERENCE_MODAL,
				reference: {},
			},
		})).toMatchSnapshot();
	});
});
