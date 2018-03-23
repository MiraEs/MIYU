import {
	VISA,
	AMERICAN_EXPRESS,
	MASTERCARD,
	DISCOVER,
	AMEX,
} from '../constants/CheckoutConstants';
import mastercard from '../images/mastercard.png';
import visa from '../images/visa.png';
import discover from '../images/discover.png';
import amex from '../images/amex.png';

export const getCardImage = function (cardType) {
	switch (cardType) {
		case VISA:
			return visa;
		case AMERICAN_EXPRESS:
			return amex;
		case MASTERCARD:
			return mastercard;
		case DISCOVER:
			return discover;
		default:
			return null;
	}
};

export const getCardType = function (number) {
	if (!number) {
		return;
	}
	let re = new RegExp('^4');
	if (number.match(re)) {
		return VISA;
	}

	re = new RegExp('^(34|37)');
	if (number.match(re)) {
		return AMERICAN_EXPRESS;
	}

	re = new RegExp('^(5[1-5]|2)');
	if (number.match(re)) {
		return MASTERCARD;
	}

	re = new RegExp('^6011');
	if (number.match(re)) {
		return DISCOVER;
	}
	return;
};

export const parseCardTypeName = (cardType) => {
	if (!cardType) {
		return;
	}
	const card = cardType.replace(/\s|[^a-zA-Z]/g, '').toUpperCase();
	if (card === VISA) {
		return VISA;
	}
	if (card === MASTERCARD) {
		return MASTERCARD;
	}
	if (card === AMERICAN_EXPRESS || card === AMEX) {
		return AMERICAN_EXPRESS;
	}
	if (card === DISCOVER) {
		return DISCOVER;
	}
	return;
};
