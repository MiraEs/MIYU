
const _locales = {
	cart: {
		quotes: {
			load: {
				'VALID': 'Valid Quote.',
				'VALID_WITHOUT_OWNERSHIP': 'Valid Quote.',
				'INVALID_NOT_FOUND': 'Quote not found.',
				'INVALID_SITE_ID_DOESNT_MATCH': 'This Quote is not for Build.com',
				'INVALID_SESSION_CART_CANT_BE_LOADED': 'Quote can not be loaded.',
				'INVALID_NOT_LOCAL_USER_OR_EXPIRED_AND_NOT_QUANTITY_GREATERTHAN_0': 'Expired Quote.',
				'INVALID_NON_ONLINE_ORDER_AND_USER_IS_NOT_LOCAL': 'Invalid Quote.',
				'INVALID_ORDER_ALREADY_CREATED_FOR_QUOTE': 'Order already created for this Quote.',
			},
		},
	},
};

const _getLocaleMessage = (searchKey, localeObject) => {
	let foundKey;

	for (const key in localeObject) {
		if (key === searchKey) {
			foundKey = localeObject[key];
		} else {
			if (typeof localeObject[key] === 'object') {
				foundKey = _getLocaleMessage(searchKey, localeObject[key]);
			}
		}
		if (foundKey) {
			break;
		}
	}

	return foundKey;
};

export const findMessage = (searchKey) => {
	const message = _getLocaleMessage(searchKey, _locales);

	return message || 'Unknown message.';
};
