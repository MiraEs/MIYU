import client from './httpClient';

const FavoritesService = {

	getFavoritesComposite(customerId) {
		const url = `/v1/customers/${customerId}/favorites/composites`;

		return client.get(url);
	},

	getFavoriteComposite(customerId, favoriteId) {
		const url = `/v1/customers/${customerId}/favorites/composite/${favoriteId}`;

		return client.get(url);
	},

	deleteFavoriteProduct(customerId, favoriteProductId) {
		const url = `/v1/customers/${customerId}/favorites/products/${favoriteProductId}`;

		return client.delete(url);
	},

	saveFavoriteProduct(customerId, favoriteId, compositeProductId, productUniqueId, favoriteProductId) {
		const url = `/v1/customers/${customerId}/favorites/products`;
		return client.post(url, {
			siteId: 82,
			favoriteId,
			compositeProductId,
			productUniqueId,
			favoriteProductId,
		});
	},

	saveFavorite(favorite, customerId) {
		const url = `/v1/customers/${customerId}/favorites/?userTypeId=2`;

		return client.post(url, favorite);
	},

	deleteFavorites(customerId, favoriteId) {
		const url = `/v1/customers/${customerId}/favorites/${favoriteId}`;

		return client.delete(url);
	},
};

export default FavoritesService;
