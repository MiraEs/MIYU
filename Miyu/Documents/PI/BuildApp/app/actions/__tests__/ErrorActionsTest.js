
jest.mock('redux-actions');

jest.unmock('../../../app/actions/ErrorActions');
import errorActions from '../ErrorActions';

describe('ErrorActions', () => {

	describe('refreshCurrentScreen', () => {
		it('should return an object with matching props', () => {
			const result = errorActions.refreshCurrentScreen();
			expect(result).toEqual({
				type: 'REFRESH_CURRENT_SCREEN',
				payload: {
					refresh: true,
				},
			});
		});
	});

});
