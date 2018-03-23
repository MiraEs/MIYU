jest.unmock('../../../app/lib/PhoneHelper');

jest.mock('../../../app/lib/environment', () => ({
	phone: '1231231234',
	proSupportPhone: '0001112222',
}));

import PhoneHelper from '../PhoneHelper';

describe('app/lib/PhoneHelper.js', () => {

	describe('formatPhoneNumber function', () => {
		it('should format a phone number', () => {
			expect(
				PhoneHelper.formatPhoneNumber({
					phoneNumber: '8005554433',
				})
			).toEqual('(800) 555-4433');
		});

		it('should format a phone number with an extension', () => {
			expect(
				PhoneHelper.formatPhoneNumber({
					phoneNumber: '8005554433',
					extension: '1234',
				})
			).toEqual('(800) 555-4433 x1234');
		});

		it('should format numbers properly', () => {
			expect(
				PhoneHelper.formatPhoneNumber({
					phoneNumber: 8005554433,
				})
			).toEqual('(800) 555-4433');
		});

		it('should return an empty string if no phone number is passed in', () => {
			const result = PhoneHelper.formatPhoneNumber({});
			expect(result).toEqual('');
		});
	});

	describe('getGeneralPhoneNumber', () => {
		it('should return object with phone and empty extension', () => {
			expect(PhoneHelper.getGeneralPhoneNumber()).toEqual({
				phoneNumber: '1231231234',
				extension: '',
			});
		});
	});

	describe('getPhoneNumberByUserType', () => {
		it('should return non-pro phonenumber object', () => {
			expect(PhoneHelper.getPhoneNumberByUserType({
				isPro: false,
				rep: {},
			})).toEqual({
				phoneNumber: '1231231234',
				extension: '',
			});
		});

		it('should return regular phone with rep extension', () => {
			expect(PhoneHelper.getPhoneNumberByUserType({
				isPro: true,
				rep: {
					repWorkPhone: '123',
				},
			})).toEqual({
				phoneNumber: '1231231234',
				extension: '123',
			});
		});

		it('should return pro support number without rep extension', () => {
			expect(PhoneHelper.getPhoneNumberByUserType({
				isPro: true,
				rep: {},
			})).toEqual({
				phoneNumber: '0001112222',
				extension: '',
			});
		});
	});
});
