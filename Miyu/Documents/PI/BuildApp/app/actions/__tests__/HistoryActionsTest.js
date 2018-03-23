
jest.mock('redux-actions');

jest.unmock('../../../app/actions/HistoryActions');
import historyActions from '../HistoryActions';

describe('HistoryActions', () => {

	describe('historyClear', () => {
		it('should return an object', () => {
			const result = historyActions.historyClear({});
			expect(result).toEqual({
				type: 'HISTORY_CLEAR',
				payload: {},
			});
		});
	});

	describe('historyUpsert', () => {
		it('should return an object', () => {
			const result = historyActions.historyUpsert({});
			expect(result).toEqual({
				type: 'HISTORY_UPSERT',
				payload: {},
			});
		});
	});

});
