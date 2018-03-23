import {
	AMERICAN_EXPRESS,
} from '../../constants/CheckoutConstants';
import {
	isValidUSZipcode,
	isValidCanadianZipcode,
	isValidZipcode,
	isValidAddress,
	isValidEmail,
	isValidPhoneNumber,
	splitName,
	isValidName,
	isValidPassword,
	isValidPasswordConf,
	isValidCardNumber,
	isValidCardExpiration,
	isValidCardCvv,
	formatPhoneNumber,
	formatCreditCardNumber,
	formatCreditCardExp,
	isFloat,
	isInteger,
} from '../Validations';

describe('app/lib/Validations.js', () => {

	describe('isValidUSZipcode function', () => {

		it('95926 is a valid zipcode isValidUSZipcode', () => {
			const isValid = isValidUSZipcode('95926');
			expect(isValid).toBe(true);
		});

		it('A1A 1A1 is an inValid zipcode isValidUSZipcode', () => {
			const isValid = isValidUSZipcode('A1A 1A1');
			expect(isValid).toBe(false);
		});

		it('undefined is an inValid zipcode isValidUSZipcode', () => {
			const isValid = isValidUSZipcode(undefined);
			expect(isValid).toBe(false);
		});

		it('null is an inValid zipcode isValidUSZipcode', () => {
			const isValid = isValidUSZipcode(null);
			expect(isValid).toBe(false);
		});

	});


	describe('isValidCanadianZipcode function', () => {

		it('95926 is a valid zipcode isValidCanadianZipcode', () => {
			const isValid = isValidCanadianZipcode('95926');
			expect(isValid).toBe(false);
		});

		it('A1A 1A1 is an Valid zipcode ', () => {
			const isValid = isValidCanadianZipcode('A1A 1A1');
			expect(isValid).toBe(true);
		});

		it('undefined is an inValid zipcode ', () => {
			const isValid = isValidCanadianZipcode(undefined);
			expect(isValid).toBe(false);
		});

		it('null is an inValid zipcode ', () => {
			const isValid = isValidCanadianZipcode(null);
			expect(isValid).toBe(false);
		});

	});

	describe('isValidZipcode function', () => {

		it('95926 is a valid zipcode ', () => {
			const isValid = isValidZipcode('95926');
			expect(isValid).toBe(true);
		});

		it('A1A 1A1 is an inValid zipcode ', () => {
			const isValid = isValidZipcode('A1A 1A1');
			expect(isValid).toBe(true);
		});

		it('undefined is an Valid zipcode ', () => {
			const isValid = isValidZipcode(undefined);
			expect(isValid).toBe(false);
		});

		it('null is an inValid zipcode ', () => {
			const isValid = isValidZipcode(null);
			expect(isValid).toBe(false);
		});

	});

	describe('isValidAddress function', () => {

		it('402 otterson dr, #100 is a valid Address ', () => {
			const isValid = isValidAddress('402 otterson dr, #100');
			expect(isValid).toBe(true);
		});

		it('P.O. BOX 11122 is an inValid Address ', () => {
			const isValid = isValidAddress('P.O. BOX 11122');
			expect(isValid).toBe(false);
		});

		it('PO BOX 11122 is an inValid Address ', () => {
			const isValid = isValidAddress('PO. BOX 11122');
			expect(isValid).toBe(false);
		});

		it('PO. BOX 11122 is an inValid Address ', () => {
			const isValid = isValidAddress('PO. BOX 11122');
			expect(isValid).toBe(false);
		});


		it('undefined is a Valid Address ', () => {
			const isValid = isValidAddress(undefined);
			expect(isValid).toBe(true);
		});

		it('null is a valid Address ', () => {
			const isValid = isValidAddress(null);
			expect(isValid).toBe(true);
		});

	});


	describe('isValidEmail function', () => {

		it('test@test.com is a valid email Address ', () => {
			const isValid = isValidEmail('test@test.com');
			expect(isValid).toBe(true);
		});

		it('test@test.com is an inValid email Address ', () => {
			const isValid = isValidEmail('test@test');
			expect(isValid).toBe(false);
		});


		it('undefined is an inValid email Address ', () => {
			const isValid = isValidEmail(undefined);
			expect(isValid).toBe(false);
		});

		it('null is an inValid email Address ', () => {
			const isValid = isValidEmail(null);
			expect(isValid).toBe(false);
		});

	});

	describe('isValidPhoneNumber function', () => {

		it('5551112222 is a valid phone number ', () => {
			const isValid = isValidPhoneNumber('5551112222');
			expect(isValid).toBe(true);
		});

		it('112222 is an inValid phone number ', () => {
			const isValid = isValidPhoneNumber('112222');
			expect(isValid).toBe(false);
		});


		it('undefined is a Valid phone number ', () => {
			const isValid = isValidPhoneNumber(undefined);
			expect(isValid).toBe(false);
		});

		it('null is a valid phone number ', () => {
			const isValid = isValidPhoneNumber(null);
			expect(isValid).toBe(false);
		});

	});

	describe('splitName function', () => {

		it('Split name should return a FirstName and last Name ', () => {
			const names = splitName('Testy McTestor');
			expect(names.firstName).toBe('Testy');
			expect(names.lastName).toBe('McTestor');
		});

		it('Split should return a FirstName and last Name ', () => {
			const names = splitName(undefined);
			expect(names).toBe(undefined);
		});

		it('Split name should return a FirstName and last Name ', () => {
			const names = splitName(null);
			expect(names).toBe(undefined);
		});

	});

	describe('isValidName function', () => {

		it('Testy McTestor is a valid name ', () => {
			const isValid = isValidName('Testy McTestor');
			expect(isValid).toBe(true);
		});

		it('Testy_McTestor is an inValid name ', () => {
			const isValid = isValidName('Testy_McTestor');
			expect(isValid).toBe(false);
		});


		it('undefined is an inValid Name ', () => {
			const isValid = isValidName(undefined);
			expect(isValid).toBe(false);
		});

		it('null is an inValid Name ', () => {
			const isValid = isValidName(null);
			expect(isValid).toBe(false);
		});

	});

	describe('isValidPassword function', () => {

		it('Testy McTestor is a valid password ', () => {
			const isValid = isValidPassword('Testy McTestor');
			expect(isValid).toBe(true);
		});

		it('Testy_McTestor is an inValid password ', () => {
			const isValid = isValidPassword('Testy');
			expect(isValid).toBe(false);
		});


		it('undefined is an inValid password ', () => {
			const isValid = isValidPassword(undefined);
			expect(isValid).toBe(false);
		});

		it('null is an inValid password ', () => {
			const isValid = isValidPassword(null);
			expect(isValid).toBe(false);
		});

	});

	describe('isValidPasswordConf function', () => {

		it('Testy McTestor is a valid password confirm ', () => {
			const isValid = isValidPasswordConf('Testy McTestor', 'Testy McTestor');
			expect(isValid).toBe(true);
		});

		it('Testy_McTestor is an inValid password confirm ', () => {
			const isValid = isValidPasswordConf('Testy', 'Testy McTestor');
			expect(isValid).toBe(false);
		});


		it('undefined is an inValid password confirm ', () => {
			const isValid = isValidPasswordConf(undefined, undefined);
			expect(isValid).toBe(false);
		});

		it('null is an inValid password confirm ', () => {
			const isValid = isValidPasswordConf(null, null);
			expect(isValid).toBe(false);
		});

	});


	describe('isValidCardNumber function', () => {

		it('378282246310005 is a valid Amex CC ', () => {
			const isValid = isValidCardNumber('378282246310005');
			expect(isValid).toBe(true);
		});

		it('371449635398431 is a valid Amex CC ', () => {
			const isValid = isValidCardNumber('371449635398431');
			expect(isValid).toBe(true);
		});
		it('378734493671000 is a valid Amex CC ', () => {
			const isValid = isValidCardNumber('378734493671000');
			expect(isValid).toBe(true);
		});
		it('5555555555554444 is a valid MasterCard CC ', () => {
			const isValid = isValidCardNumber('5555555555554444');
			expect(isValid).toBe(true);
		});

		it('5105105105105100 is a valid MasterCard CC ', () => {
			const isValid = isValidCardNumber('5105105105105100');
			expect(isValid).toBe(true);
		});

		it('4111111111111111 is a valid Visa CC ', () => {
			const isValid = isValidCardNumber('4111111111111111');
			expect(isValid).toBe(true);
		});

		it('6011111111111117 is a valid Discover CC ', () => {
			const isValid = isValidCardNumber('6011111111111117');
			expect(isValid).toBe(true);
		});

		it('6011000990139424 is a valid Discover CC ', () => {
			const isValid = isValidCardNumber('6011000990139424');
			expect(isValid).toBe(true);
		});

		it('undefined is an invalid CC ', () => {
			const isValid = isValidCardNumber(undefined);
			expect(isValid).toBe(false);
		});

		it('null is an invalid CC ', () => {
			const isValid = isValidCardNumber(null);
			expect(isValid).toBe(false);
		});

	});

	describe('isValidCardExpiration function', () => {

		it('12/60 is a valid card expiration ', () => {
			const isValid = isValidCardExpiration('12/60');
			expect(isValid).toBe(true);
		});

		it('12/12 is an inValid card expiration ', () => {
			const isValid = isValidCardExpiration('12/12');
			expect(isValid).toBe(false);
		});


		it('undefined is an invalid card expiration ', () => {
			const isValid = isValidCardExpiration(undefined);
			expect(isValid).toBe(false);
		});

		it('null is an invalid card expiration ', () => {
			const isValid = isValidCardExpiration(null);
			expect(isValid).toBe(false);
		});

	});

	describe('isValidCardCvv function', () => {

		it('123 is a valid Master Card cvv ', () => {
			const isValid = isValidCardCvv('123', 'MASTERCARD');
			expect(isValid).toBe(true);
		});

		it('1234 is an invalid Master Card  cvv ', () => {
			const isValid = isValidCardCvv('1234', 'MASTERCARD');
			expect(isValid).toBe(false);
		});
		it('12/12 is an inValid Amex cvv ', () => {
			const isValid = isValidCardCvv('123', AMERICAN_EXPRESS);
			expect(isValid).toBe(false);
		});

		it('12/12 is an inValid Amex cvv ', () => {
			const isValid = isValidCardCvv('5555', AMERICAN_EXPRESS);
			expect(isValid).toBe(true);
		});


		it('undefined is an invalid card cvv ', () => {
			const isValid = isValidCardCvv(undefined);
			expect(isValid).toBe(false);
		});

		it('null is an invalid card cvv ', () => {
			const isValid = isValidCardCvv(null);
			expect(isValid).toBe(false);
		});

	});

	describe('formatCreditCardNumber function', () => {

		it('378282246310005 is a valid Amex CC ', () => {
			const formattedCC = formatCreditCardNumber('378282246310005');
			expect(formattedCC).toBe('3782 822463 10005');
		});

		it('371449635398431 is a valid Amex CC ', () => {
			const formattedCC = formatCreditCardNumber('371449635398431');
			expect(formattedCC).toBe('3714 496353 98431');
		});
		it('378734493671000 is a valid Amex CC ', () => {
			const formattedCC = formatCreditCardNumber('378734493671000');
			expect(formattedCC).toBe('3787 344936 71000');
		});
		it('5555555555554444 is a valid MasterCard CC ', () => {
			const formattedCC = formatCreditCardNumber('5555555555554444');
			expect(formattedCC).toBe('5555 5555 5555 4444');
		});

		it('5105105105105100 is a valid MasterCard CC ', () => {
			const formattedCC = formatCreditCardNumber('5105105105105100');
			expect(formattedCC).toBe('5105 1051 0510 5100');
		});

		it('4111111111111111 is a valid Visa CC ', () => {
			const formattedCC = formatCreditCardNumber('4111111111111111');
			expect(formattedCC).toBe('4111 1111 1111 1111');
		});

		it('6011111111111117 is a valid Discover CC ', () => {
			const formattedCC = formatCreditCardNumber('6011111111111117');
			expect(formattedCC).toBe('6011 1111 1111 1117');
		});

		it('6011000990139424 is a valid Discover CC ', () => {
			const formattedCC = formatCreditCardNumber('6011000990139424');
			expect(formattedCC).toBe('6011 0009 9013 9424');
		});

		it('undefined is an invalid CC ', () => {
			const formattedCC = formatCreditCardNumber(undefined);
			expect(formattedCC).toBe(undefined);
		});

		it('null is an invalid CC ', () => {
			const formattedCC = formatCreditCardNumber(null);
			expect(formattedCC).toBe(undefined);
		});

	});

	describe('formatPhoneNumber function', () => {

		it('1112223333 should be a formated phone number ', () => {
			const formattedCC = formatPhoneNumber('1112223333');
			expect(formattedCC).toBe('(111) 222-3333');
		});

		it('2223333 should be a formated phone number', () => {
			const formattedCC = formatPhoneNumber('2223333');
			expect(formattedCC).toBe('222-3333');
		});

		it('11112223333 should be a formated phone number', () => {
			const formattedCC = formatPhoneNumber('11112223333');
			expect(formattedCC).toBe('(111) 122-23333');
		});


		it('undefined should be undefined ', () => {
			const formattedCC = formatPhoneNumber(undefined);
			expect(formattedCC).toBe(undefined);
		});

		it('null should be undefined', () => {
			const formattedCC = formatPhoneNumber(null);
			expect(formattedCC).toBe(undefined);
		});

	});

	describe('formatCreditCardExp function', () => {

		it('11/20 should be a formated phone number ', () => {
			const formattedCC = formatCreditCardExp('11/20');
			expect(formattedCC).toBe('11/20');
		});

		it('12-20 should be a formated phone number', () => {
			const formattedCC = formatCreditCardExp('12/20');
			expect(formattedCC).toBe('12/20');
		});

		it('12 20 should be a formated phone number', () => {
			const formattedCC = formatCreditCardExp('12 20');
			expect(formattedCC).toBe('12/20');
		});


		it('undefined is an invalid CC ', () => {
			const formattedCC = formatCreditCardExp(undefined);
			expect(formattedCC).toBe(undefined);
		});

		it('null is an invalid CC ', () => {
			const formattedCC = formatCreditCardExp(null);
			expect(formattedCC).toBe(undefined);
		});

	});


	describe('isFloat function', () => {

		it('12.3333 is a valid float ', () => {
			const isValid = isFloat(12.333);
			expect(isValid).toBe(true);
		});

		it('12 is a Valid float ', () => {
			const isValid = isFloat('12');
			expect(isValid).toBe(true);
		});


		it('undefined is an invalid float ', () => {
			const isValid = isFloat(undefined);
			expect(isValid).toBe(false);
		});

		it('null is an invalid float ', () => {
			const isValid = isFloat(null);
			expect(isValid).toBe(false);
		});

	});

	describe('isInteger function', () => {

		it('12 is a valid float ', () => {
			const isValid = isInteger(12);
			expect(isValid).toBe(true);
		});

		it('12.2222 is an in Valid float ', () => {
			const isValid = isInteger('12.2222');
			expect(isValid).toBe(false);
		});

		it('undefined is an invalid float ', () => {
			const isValid = isInteger(undefined);
			expect(isValid).toBe(false);
		});

		it('null is an invalid float ', () => {
			const isValid = isInteger(null);
			expect(isValid).toBe(false);
		});

	});

});
