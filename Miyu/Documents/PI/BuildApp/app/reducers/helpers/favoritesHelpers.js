'use strict';
import EventEmitter from '../../lib/eventEmitter';

const favoritesHelpers = {
	productInFavorites(compositeId, favorites) {
		const favoriteIds = [];
		Object.keys(favorites).forEach((favoriteId) => {
			const productMap = favorites[favoriteId].productsMap;
			Object.keys(productMap).forEach((currentCompositeId) => {
				if (parseInt(currentCompositeId, 10) === compositeId) {
					favoriteIds.push(favoriteId);
				}
			});
		});
		return favoriteIds;
	},

	isProductFavorite(compositeId, favorites) {
		return favoritesHelpers.productInFavorites(compositeId, favorites).length > 0;
	},
	showFavoritesListSelector(favorites, compositeId, onDonePress, onCreateListPress) {
		const favoriteIds = Object.keys(favorites);
		const options = favoriteIds.map((key) => {
			return {
				text: favorites[key].name,
			};
		});
		const selections = favoritesHelpers.productInFavorites(compositeId, favorites).map((favoriteId) => favoriteIds.indexOf(favoriteId) + 1);
		EventEmitter.emit('showActionSheet', {
			optionsTextStyle: { textAlign: 'left' },
			title: 'Select Favorites',
			multiSelect: true,
			createNewOption: {
				text: 'Create new favorites...',
				onPress: onCreateListPress,
			},
			onDonePress,
			options,
			selections,
		});
	},
};

module.exports = favoritesHelpers;
