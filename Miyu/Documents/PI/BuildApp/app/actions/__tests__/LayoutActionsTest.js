
jest.mock('redux-actions');

jest.unmock('../../../app/actions/LayoutActions');
import layoutActions from '../LayoutActions';

describe('LayoutActions', () => {

	describe('setComponentMeasurements', () => {
		it('should return an object', () => {
			const result = layoutActions.setComponentMeasurements({});
			expect(result).toEqual({
				type: 'SET_COMPONENT_MEASUREMENTS',
				payload: {},
			});
		});
	});

	describe('setTutorialMode', () => {
		it('should return an object', () => {
			const result = layoutActions.setTutorialMode({});
			expect(result).toEqual({
				type: 'SET_TUTORIAL_MODE',
				payload: {},
			});
		});
	});

});
