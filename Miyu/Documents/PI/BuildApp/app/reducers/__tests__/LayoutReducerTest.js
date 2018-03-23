'use strict';
import layoutReducer from '../layoutReducer';
import {
	SET_TUTORIAL_MODE,
	SET_COMPONENT_MEASUREMENTS,
} from '../../constants/LayoutConstants';

const previousState = {
	tutorialMode: false,
	TEST_COMPONENT: {},
};

describe('layoutReducer', () => {

	it('should return initialState', () => {
		expect(layoutReducer(undefined, {})).toMatchSnapshot();
	});

	it('should return the correct state for SET_TUTORIAL_MODE to true', () => {
		expect(layoutReducer(previousState, {
			type: SET_TUTORIAL_MODE,
			payload: true,
		})).toMatchSnapshot();
	});

	it('should update the state from SET_COMPONENT_MEASUREMENTS action', () => {
		expect(layoutReducer(previousState, {
			type: SET_COMPONENT_MEASUREMENTS,
			payload: {
				componentName: 'NEW_COMPONENT',
				measurements: {},
			},
		})).toMatchSnapshot();
	});

	it('should update an existing value from the SET_COMPONENT_MEASUREMENTS action', () => {
		expect(layoutReducer(previousState, {
			type: SET_COMPONENT_MEASUREMENTS,
			payload: {
				componentName: 'TEST_COMPONENT',
				measurements: 'MEASUREMENTS',
			},
		})).toMatchSnapshot();
	});

});
