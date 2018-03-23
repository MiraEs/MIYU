jest.mock('react-native');
import { NativeModules } from 'react-native';
import ApplePay from '../index';

const paymentDetails = {
	items: [
		{amount: '351.19', label: 'Delta 9159-DST'},
		{amount: '129', label: 'Moen GX50C'},
		{amount: '279.95', label: 'Kraus KHU100-32'},
		{amount: '0', label: 'Shipping'},
		{amount: '55.11', label: 'Tax'},
		{amount: '815.25', label: 'Build.com'},
	],
	options: [
		{
			amount: '0',
			detail: 'Standard Delivery (5 - 7 Business Days)',
			label: 'Standard Delivery',
		},
		{
			amount: '58.53',
			detail: 'Two Day Delivery (2 Business Days)',
			label: 'Two Day Delivery',
		},
		{
			amount: '97.77',
			detail: 'One Day Delivery (1 Business Day)',
			label: 'One Day Delivery',
		},
	],
};

describe('ApplePay Native Module', () => {

	describe('canMakePayments function', () => {

		it('should call RNApplePayManager.canMakePayments()', () => {
			const spy = jest.spyOn(NativeModules.RNApplePayManager, 'canMakePayments');

			ApplePay.canMakePayments().then(() => {
				expect(spy).toHaveBeenCalled();
			});
		});

		it('should call RNApplePayManager.canMakePaymentsUsingNetworks()', () => {
			const spy = jest.spyOn(NativeModules.RNApplePayManager, 'canMakePaymentsUsingNetworks');

			ApplePay.canMakePayments().then(() => {
				expect(spy).toHaveBeenCalled();
			});
		});

		it('should result in error', () => {
			NativeModules.RNApplePayManager.canMakePaymentsUsingNetworks = jest.fn(() => Promise.reject());

			return ApplePay.canMakePayments().catch((error) => {
				expect(error).toEqual({
					canMakePayments: false,
					canMakePaymentsUsingNetworks: false,
				});
			});
		});
	});

	it('paymentRequest function should call RNApplePayManager.paymentRequest()', () => {
		const spy = jest.spyOn(NativeModules.RNApplePayManager, 'paymentRequest');
		ApplePay.paymentRequest(paymentDetails);

		expect(spy).toHaveBeenCalled();
	});

	it('updateShippingMethods function should call RNApplePayManager.updateShippingMethods()', () => {
		const spy = jest.spyOn(NativeModules.RNApplePayManager, 'updateShippingMethods');
		ApplePay.updateShippingMethods(paymentDetails);

		expect(spy).toHaveBeenCalled();
	});

	it('selectShippingMethod function should call RNApplePayManager.selectShippingMethod()', () => {
		const spy = jest.spyOn(NativeModules.RNApplePayManager, 'selectShippingMethod');
		ApplePay.selectShippingMethod(paymentDetails);

		expect(spy).toHaveBeenCalled();
	});

	it('authorizedPayment function should call RNApplePayManager.authorizedPayment()', () => {
		const spy = jest.spyOn(NativeModules.RNApplePayManager, 'authorizedPayment');
		ApplePay.authorizedPayment();

		expect(spy).toHaveBeenCalled();
	});


	it('didSelectShippingAddress function should return expected results', () => {
		const results = ApplePay.didSelectShippingAddress();

		expect(results).toEqual(null);
	});


	it('didSelectShippingMethod function should return expected results', () => {
		const results = ApplePay.didSelectShippingMethod();

		expect(results).toEqual(null);
	});


	it('didAuthorizePayment function should return expected results', () => {
		const results = ApplePay.didAuthorizePayment();

		expect(results).toEqual(null);
	});

	describe('RNApplePayManager Events', () => {

		it('DidFinish should call paymentRequestDidFinish', () => {
			const spy = jest.spyOn(ApplePay, 'paymentRequestDidFinish');

			NativeModules.RNApplePayManager.DidFinish = jest.fn(() => {
				ApplePay.paymentRequestDidFinish();
			});

			NativeModules.RNApplePayManager.DidFinish();
			expect(spy).toHaveBeenCalled();
		});

		it('DidSelectShippingAddress should call didSelectShippingAddress', () => {
			const spy = jest.spyOn(ApplePay, 'didSelectShippingAddress');

			NativeModules.RNApplePayManager.DidSelectShippingAddress = jest.fn(() => {
				ApplePay.didSelectShippingAddress();
			});

			NativeModules.RNApplePayManager.DidSelectShippingAddress();
			expect(spy).toHaveBeenCalled();
		});

		it('DidSelectShippingMethod should call didSelectShippingMethod', () => {
			const spy = jest.spyOn(ApplePay, 'didSelectShippingMethod');

			NativeModules.RNApplePayManager.DidSelectShippingMethod = jest.fn(() => {
				ApplePay.didSelectShippingMethod();
			});

			NativeModules.RNApplePayManager.DidSelectShippingMethod();
			expect(spy).toHaveBeenCalled();
		});

		it('DidAuthorizePayment should call DidAuthorizePayment', () => {
			const spy = jest.spyOn(ApplePay, 'didAuthorizePayment');

			NativeModules.RNApplePayManager.DidAuthorizePayment = jest.fn(() => {
				ApplePay.didAuthorizePayment();
			});

			NativeModules.RNApplePayManager.DidAuthorizePayment();
			expect(spy).toHaveBeenCalled();
		});
	});
});
