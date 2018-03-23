'use strict';

jest.unmock('../../../app/reducers/HistoryReducer');

import HistoryReducer, {
	historyObjectIsEqual,
	historyIndexOf,
} from '../HistoryReducer';

import {
	HISTORY_CLEAR,
	HISTORY_UPSERT,
} from '../../constants/HistoryConstants' ;


describe('HistoryReducer reducer', () => {

	it('should return initialState', () => {
		expect(HistoryReducer(undefined, {})).toMatchSnapshot();
	});


	it('should HISTORY_CLEAR', () => {
		const action = {
			type: HISTORY_CLEAR,
		};
		const state = HistoryReducer(undefined, action);
		expect(
			state
		).toMatchSnapshot();
	});

	it('should HISTORY_UPSERT', () => {
		const action = {
			type: HISTORY_UPSERT,
			payload: {
				compositeId: 1,
			},
		};
		const state = HistoryReducer({products: []}, action);
		expect(state.products[0].compositeId).toEqual(1);

	});
	it('should HISTORY_UPSERT', () => {
		const action = {
			type: HISTORY_UPSERT,
			payload: {
				categoryId: 2,
			},
		};
		const state = HistoryReducer({categories: []}, action);
		expect(state.categories[0].categoryId).toEqual(2);
	});

	describe('historyObjectIsEqual', () => {
		it('should return true for matching objects', () => {
			const compare = {
				test: true,
			};
			const result = historyObjectIsEqual(compare, compare, 'test');
			expect(result).toEqual(true);
		});

		it('should return false for non matching objects', () => {
			const one = {
				test: true,
			};
			const two = {
				test: false,
			};
			const result = historyObjectIsEqual(one, two, 'test');
			expect(result).toEqual(false);
		});
	});

	describe('historyIndexOf', () => {
		let histories = [];

		beforeEach(() => {
			histories = [{
				test: true,
			}, {
				test: 'meh',
			}, {
				test: false,
			}];
		});
		it('should return the index of matching history object', () => {
			const result = historyIndexOf(histories, {
				test: 'meh',
			}, 'test');
			expect(result).toEqual(1);
		});
	});
});
