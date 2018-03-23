
const dispatch = jest.fn();

jest.mock('redux-actions');

jest.unmock('../../../app/actions/FeatureSwitchActions');
import favoritesActions from '../FeatureSwitchActions';

describe('FavoritesActions', () => {

	describe('setFeatureState', () => {
		it('should return a function', () => {
			favoritesActions.setFeatureState('feature', true)(dispatch);
			expect(dispatch).toBeCalledWith({
				type: 'SET_FEATURE_STATE',
				feature: 'feature',
				enabled: true,
			});
		});
	});

});
