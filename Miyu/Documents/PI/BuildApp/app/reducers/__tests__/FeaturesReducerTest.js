import featuresReducer from '../featuresReducer';
import {
	SET_FEATURE_STATE,
	SET_FEATURE_WITH_EXPIRATION,
} from '../../constants/constants';
import { REHYDRATE } from 'redux-persist/constants';

const previousState = {
	features: {
		feature1: false,
		feature2: true,
	},
};

// This test will break 100 years from now.
// If this code base and function still exists then...
// Well, that will be someone else's problem.
const futureDate = new Date(2117, 3, 21);

describe('featuresReducer', () => {

	it('should return initialState', () => {
		expect(featuresReducer(undefined, {})).toMatchSnapshot();
	});

	it('should return the correct state for SET_FEATURE_STATE to true', () => {
		expect(featuresReducer(previousState, {
			type: SET_FEATURE_STATE,
			feature: 'feature1',
			enabled: true,
		})).toMatchSnapshot();
	});

	it('should return the correct state for SET_FEATURE_STATE to false', () => {
		expect(featuresReducer(previousState, {
			type: SET_FEATURE_STATE,
			feature: 'feature2',
			enabled: false,
		})).toMatchSnapshot();
	});

	it('should expire features if needed', () => {
		const reducer = {
			...previousState,
			features: {
				...previousState.features,
				expiredFeature: {
					enabled: true,
					default: false,
					expireAfter: new Date('2017-03-21T16:41:46.275Z'),
				},
				notExpiredFeature: {
					enabled: true,
					default: false,
					expireAfter: futureDate,
				},
			},
		};
		expect(featuresReducer(reducer, {
			type: REHYDRATE,
			payload: {
				featuresReducer: reducer,
			},
		})).toMatchSnapshot();
	});

	it('should return state if no features reducer is found', () => {
		expect(featuresReducer({}, {
			type: REHYDRATE,
			payload: {},
		})).toMatchSnapshot();
	});

	it('should set a new feature with expiration', () => {
		expect(featuresReducer(previousState, {
			type: SET_FEATURE_WITH_EXPIRATION,
			payload: {
				testFeature: {
					enabled: true,
					default: false,
					expireAfter: futureDate,
				},
			},
		})).toMatchSnapshot();
	});

});
