'use strict';

// the names of the `_MAX_SAVE_ROWS` variables are linked with the functions
// in the reducer.  They must be kept in sync
const HistoryConstants = {
	CATEGORIES_MAX_SAVE_ROWS: 50,
	HISTORY_CLEAR: 'HISTORY_CLEAR',
	HISTORY_UPSERT: 'HISTORY_UPSERT',
	PRODUCTS_MAX_SAVE_ROWS: 500,
	SEARCHES_MAX_SAVE_ROWS: 50,
	RECENT_SEARCHES_MAX_DISPLAY: 5,
	RECENT_SEARCHES_DISPLAY_WITH_TYPEAHEAD: 2,
};

module.exports = HistoryConstants;
