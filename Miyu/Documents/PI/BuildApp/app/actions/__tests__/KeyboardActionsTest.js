
const dispatch = jest.fn();

jest.mock('redux-actions');

jest.unmock('../../../app/actions/KeyboardActions');
import keyboardActions from '../KeyboardActions';

describe('KeyboardActions', () => {

	beforeEach(() => {
		dispatch.mockClear();
	});

	describe('hideKeyboardAccessory', () => {
		it('should call dispatch with an object', () => {
			keyboardActions.hideAccessories()(dispatch);
			expect(dispatch).toBeCalledWith({
				type: 'KEYBOARD_HIDE_ACCESSORY',
				payload: undefined,
			});
		});
	});

	describe('showAccessories', () => {
		it('should call dispatch with an object', () => {
			keyboardActions.showAccessories()(dispatch);
			expect(dispatch).toBeCalledWith({
				type: 'KEYBOARD_SHOW_ACCESSORY',
				payload: undefined,
			});
		});
	});

});
