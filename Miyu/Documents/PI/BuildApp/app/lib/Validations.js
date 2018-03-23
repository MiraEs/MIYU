'use strict';
import {
	AMERICAN_EXPRESS,
} from '../constants/CheckoutConstants';
import { TEST_CARDS } from '../constants/CreditCard';
import { getCardType } from '../lib/CreditCard';
import helpers from './helpers';
import Joi from 'rn-joi';

export const isValidUSZipcode = function(zipCode) {
	// based on https://github.com/buildcom/BuildStore/blob/master/assets/scripts/checkout/payment.js
	return (/^\d{5}(-\d{4})?$/i).test(zipCode);
};

export const isValidCanadianZipcode = function(zipCode) {
	// based on https://github.com/buildcom/BuildStore/blob/master/assets/scripts/checkout/payment.js
	return (/^[ABCEGHJKLMNPRSTVXY]\d[A-Z] *\d[A-Z]\d$/i).test(zipCode);
};

export const isValidZipcode = function(zipCode) {
	return isValidUSZipcode(zipCode) || isValidCanadianZipcode(zipCode);
};

// returns false if the address is a PO Box.  Returns true, if it doesn't.
export const isValidAddress = function(streetAddress) {
	// regex based on https://github.com/buildcom/build-cloud/blob/master/src/app/custom_validation_rules.js
	const isPOBox = (/^ *((#\d+)|((box|bin)[-. \/\\]?\d+)|(.*p[ \.]? ?(o|0)[-. \/\\]? *-?((box|bin)|b|(#|num)?\d+))|(p(ost)? *(o(ff(ice)?)?)? *((box|bin)|b)? *\d+)|(p *-?\/?(o)? *-?box)|post office box|((box|bin)|b) *(number|num|#)? *\d+|(num|number|#) *\d+)/i).test(streetAddress);
	return !isPOBox;
};

export const isValidEmail = function(email) {
	// regex based on https://github.com/buildcom/build-cloud/blob/master/src/app/custom_validation_rules.js
	return (/(^[-!#$%&'*+/=?^_`{}|~0-9A-Z]+(\.[-!#$%&'*+/=?^_`{}|~0-9A-Z]+)*|^"([\001-\010\013\014\016-\037!#-\[\]-\177]|\\[\001-\011\013\014\016-\177])*")@((?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+(?:[A-Z]{2,6}\.?|[A-Z0-9-]{2,}\.?)$)|\[(25[0-5]|2[0-4]\d|[0-1]?\d?\d)(\.(25[0-5]|2[0-4]\d|[0-1]?\d?\d)){3}\]$/i).test(email);
};

export const isValidPhoneNumber = function(phoneNumber) {
	if (!phoneNumber) {
		return false;
	}

	phoneNumber = phoneNumber.replace(/\s+/g, '');
	return (/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/).test(phoneNumber);
};

export const splitName = function(name) {
	if (!name) {
		return;
	}
	name = name.trim().split(/ (.+)/);
	return {
		firstName: name[0],
		lastName: name[1],
	};
};

export const isValidName = function(name) {
	const result = splitName(name);
	return !!result && !!result.firstName && !!result.lastName;
};

export const isValidPassword = function(pass) {
	return !!pass && pass.length >= 6;
};

export const isValidPasswordConf = function(pass, passwordConfirm) {
	return !!pass && !!passwordConfirm && pass === passwordConfirm;
};

export function isValidCardNumber(value) {

	if (!value) {
		return false;
	}

	const number = value.replace(/[^\d.]/g, '');

	try {
		const testCards = TEST_CARDS.map((card) => card.number);

		Joi.assert(number, Joi.string().allow(testCards).min(15).max(16).creditCard());
		return true;
	} catch (error) {
		return !error;
	}
}

export function isValidCardExpiration(value) {

	if (!value) {
		return false;
	}

	const datePieces = value.split('/'),
		lastTwoOfCurrentYear = Number(helpers.getFormattedDate(new Date(), 'YY'));
	return (datePieces.length === 2) && (0 < Number(datePieces[0]) && Number(datePieces[0]) < 13) && (Number(datePieces[1]) >= lastTwoOfCurrentYear);
}

export function isValidCardCvv(value, cardType) {
	if (!value) {
		return false;
	}
	if (!cardType) {
		return value.length === 3 || value.length === 4;
	} else if (cardType === AMERICAN_EXPRESS) {
		return value.length === 4;
	} else {
		return value.length === 3;
	}
}

export function formatPhoneNumber(phone) {
	if (!phone) {
		return;
	}
	phone = String(phone).replace(/[^\d]/g, '');

	if (phone.length === 7) {
		phone = phone.replace(/([0-9]{3})([0-9]{4})/g, '$1-$2');
	} else if (phone.length === 10) {
		phone = phone.replace(/([0-9]{3})([0-9]{3})([0-9]{4})/g, '($1) $2-$3');
	} else if (phone.length === 11) {
		phone = phone.replace(/([0-9]{3})([0-9]{3})([0-9]{4})/g, '($1) $2-$3');
	}
	return phone;
}

export function formatCreditCardNumber(value) {
	if (!value) {
		return;
	}
	const number = value.replace(/[^\d.]/g, ''),
		type = getCardType(number),
		maxDigits = type === AMERICAN_EXPRESS ? 15 : 16;
	let formattedNumber = '';
	// format numbers with spaces
	for (let i = 1; i <= number.length && i <= maxDigits; i++) {
		formattedNumber += number[i - 1];

		if (maxDigits === i) {
			break;
		}
		else if (type === AMERICAN_EXPRESS && number[i]) {
			if (i === 4 || i === 10) {
				formattedNumber += ' ';
			}
		} else {
			if (i % 4 === 0 && number[i]) {
				formattedNumber += ' ';
			}
		}
	}
	return formattedNumber;
}

export function formatCreditCardExp(value) {
	if (!value) {
		return;
	}
	const keyPressed = value[value.length - 1],
		FORWARD_SLASH = '/',
		HYPHEN = '-',
		maxDigits = 4;
	let number = value.replace(/[^\d]/g, ''),
		formattedNumber = '';

	if ((keyPressed === FORWARD_SLASH || keyPressed === HYPHEN) && number.length === 1) {
		number = `0${number[0]}`;
	}

	for (let i = 1; i <= number.length && i <= maxDigits; i++) {
		formattedNumber += number[i - 1];

		if (maxDigits === i) {
			break;
		}
		else if (i % 2 === 0 && number[i]) {
			formattedNumber += '/';
		}
	}
	return formattedNumber;
}

export function isFloat(number) {
	return /^\d*(\.\d*)?$/.test(number);
}

export function isInteger(number) {
	return /^\d+$/.test(number);
}
