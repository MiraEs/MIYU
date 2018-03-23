import { handleActions } from 'redux-actions';
import HistoryConstants, {
	HISTORY_CLEAR,
	HISTORY_UPSERT,
} from '../constants/HistoryConstants';

// the history arrays are tightly coupled with the names of the variables in the
// HistoryConstants files.  They must be kept in sync
const initialState = {
	categories: [],
	products: [],
	searches: [],
};

const undefinedStr = 'undefined';

export function historyObjectIsEqual(object1, object2, key) {
	const value1 = object1[key];
	const value2 = object2[key];
	return typeof value1 !== undefinedStr &&
		typeof value2 !== undefinedStr &&
		value1 === value2;
}

export function historyIndexOf(array, item, key) {
	const { length } = array;
	let index = 0;
	for (; index < length; index++) {
		if (historyObjectIsEqual(array[index], item, key)) {
			break;
		}
	}
	return index === length ? -1 : index;
}

function upsertState(state, payload, key, type) {
	const index = historyIndexOf(state[type], payload, key);
	const newArray = [...state[type]];

	let existing = {};
	if (index > -1) {
		// remove the existing item but save it so we can merge
		existing = newArray.splice(index, 1)[0];
	}

	const { data: existingData = {} } = existing;
	const { data = {} } = payload;
	return {
		...state,
		[type]: [{
			...existing,
			...payload,
			dateTime: new Date(),
			data: {
				...existingData,
				...data,
			},
		},
			...newArray.slice(0, HistoryConstants[`${type.toUpperCase()}_MAX_SAVE_ROWS`] - 1),
		],
	};
}

export default handleActions({
	[HISTORY_CLEAR]: () => ({
		...initialState,
	}),
	[HISTORY_UPSERT]: (state, { payload }) => {
		// figure out what kind of history we are saving
		let key = 'keyword';
		let type = 'searches';
		if (payload.compositeId) {
			key = 'compositeId';
			type = 'products';
		} else if (payload.categoryId) {
			key = 'categoryId';
			type = 'categories';
		}

		return upsertState(state, payload, key, type);
	},
}, initialState);
