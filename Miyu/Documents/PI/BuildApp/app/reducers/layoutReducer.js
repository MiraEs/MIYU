'use strict';

import {
	SET_TUTORIAL_MODE,
	SET_COMPONENT_MEASUREMENTS,
} from '../constants/LayoutConstants';
import { HOME } from '../constants/constants';

const initialState = {
	tutorialMode: false,
	selectedTab: HOME,
};

export default function (state = initialState, action = {}) {
	switch (action.type) {
		case SET_COMPONENT_MEASUREMENTS:
			return {
				...state,
				[action.payload.componentName]: {
					...action.payload.measurements,
				},
			};
		case SET_TUTORIAL_MODE: {
			return {
				...state,
				tutorialMode: action.payload,
			};
		}
		case 'EX_NAVIGATION.JUMP_TO_TAB':
			return {
				...state,
				selectedTab: action.tab.key,
			};
		default:
			return state;
	}
}
