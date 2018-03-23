import { createAction } from 'redux-actions';
import {
	SET_COMPONENT_MEASUREMENTS,
	SET_TUTORIAL_MODE,
} from '../constants/LayoutConstants';

const setComponentMeasurements = createAction(SET_COMPONENT_MEASUREMENTS);

const setTutorialMode = createAction(SET_TUTORIAL_MODE);

module.exports = {
	setComponentMeasurements,
	setTutorialMode,
};
