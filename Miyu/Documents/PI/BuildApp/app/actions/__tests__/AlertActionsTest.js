jest.mock('redux-actions');

jest.unmock('../../../app/actions/AlertActions');
import AlertActions from '../AlertActions';

describe('AlertActions', () => {

	describe('showAlertAction', () => {
		it('should be called', () => {
			const payload = {
				type: 'type',
				message: 'message',
				button: {},
				callback: jest.fn(),
				bannerVisibleTimeout: 100,
			};

			const alert = AlertActions.showAlert(payload.message,
				payload.type,
				payload.button,
				payload.callback,
				payload.bannerVisibleTimeout
			);
			expect(alert).toEqual({
				type: 'SHOW_ALERT_ACTION',
				payload: undefined,
			});
		});
	});

});
