'use strict';

import { createAction } from 'redux-actions';
import {
	HISTORY_CLEAR,
	HISTORY_UPSERT,
} from '../constants/HistoryConstants';

const historyClear = createAction(HISTORY_CLEAR);
const historyUpsert = createAction(HISTORY_UPSERT);

module.exports = {
	historyClear,
	historyUpsert,
};
