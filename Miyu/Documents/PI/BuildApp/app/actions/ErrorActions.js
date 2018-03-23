'use strict';

import { createAction } from 'redux-actions';
import {
	REFRESH_CURRENT_SCREEN,
	UNAUTHORIZED_ERROR,
} from '../constants/constants';

const refreshCurrentScreen = createAction(REFRESH_CURRENT_SCREEN, () => {
	return { refresh: true };
});

const unauthorizedError = createAction(UNAUTHORIZED_ERROR);

module.exports = {
	refreshCurrentScreen,
	unauthorizedError,
};
