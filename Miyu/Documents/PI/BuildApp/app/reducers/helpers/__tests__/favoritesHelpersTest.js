jest.mock('../../../lib/eventEmitter', () => ({
	emit: jest.fn(),
}));
import EventEmitter from '../../../lib/eventEmitter';

import favoritesHelpers from '../favoritesHelpers';

const favorites = {
	0: {
		id: 0,
		isOwner: false,
		itemCount: 0,
		name: 'My Favorites',
		productsMap: {
			1: {
				compositeId: 1,
			},
		},
	},
};
describe('favoritesHelpers tests', () => {
	describe('productInFavorites', () => {
		it('should find a favorite', () => {
			const compositeId = 1;
			const result = favoritesHelpers.productInFavorites(compositeId, favorites);
			expect(result.length).toEqual(1);
		});

		it('should not find a favorite', () => {
			const compositeId = 2;
			const result = favoritesHelpers.productInFavorites(compositeId, favorites);
			expect(result.length).toEqual(0);
		});
	});

	describe('isProductFavorite', () => {
		it('should find a favorite', () => {
			const compositeId = 1;
			const result = favoritesHelpers.isProductFavorite(compositeId, favorites);
			expect(result).toEqual(true);
		});

		it('should not find a favorite', () => {
			const compositeId = 2;
			const result = favoritesHelpers.isProductFavorite(compositeId, favorites);
			expect(result).toEqual(false);
		});
	});

	describe('showFavoritesListSelector', () => {
		it('should show the action sheet', () => {
			const compositeId = 1;
			favoritesHelpers.showFavoritesListSelector(favorites, compositeId);
			expect(EventEmitter.emit).toBeCalled();
		});
	});
});
