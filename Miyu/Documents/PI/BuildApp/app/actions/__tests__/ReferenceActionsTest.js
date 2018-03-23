jest.mock('redux-actions');

jest.unmock('../../../app/actions/ReferenceActions');
import {
	REFERENCE_MODAL,
	setReference,
} from '../ReferenceActions';

describe('ReferenceActions', () => {

	describe('setReference', () => {
		it('should return an object with matching props', () => {
			const result = setReference(REFERENCE_MODAL, {});

			expect(result).toEqual({
				type: 'REFERENCE_SET_REFERENCE',
				payload: { component: 'modal', reference: {} },
			});
		});
	});
});
