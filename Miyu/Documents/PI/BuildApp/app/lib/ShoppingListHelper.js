const processItemsForList = (shoppingListSessionCartItems = []) => {
	const unpurchasedItems = [];
	shoppingListSessionCartItems.forEach((item) => {
		const {
			quantityPurchased,
			quantityUnpurchased,
		} = item;

		if (quantityPurchased) {
			item.isPurchased = true;
			if (quantityUnpurchased) {
				unpurchasedItems.push({
					...item,
					isPurchased: false,
				});
			}
		}
	});
	return [...shoppingListSessionCartItems, ...unpurchasedItems];
};

module.exports = {
	processItemsForList,
};
