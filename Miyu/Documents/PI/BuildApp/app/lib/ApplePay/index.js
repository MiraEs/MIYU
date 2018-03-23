import {
	NativeEventEmitter,
	NativeModules,
	Platform,
} from 'react-native';
const { RNApplePayManager } = NativeModules;
const ApplePayEmitter = new NativeEventEmitter(RNApplePayManager);

class ApplePay {

	constructor() {
		this.didSelectShippingAddress = () => null;
		this.didSelectShippingMethod = () => null;
		this.didAuthorizePayment = () => null;
		this.paymentRequestDidFinish = () => null;

		if (Platform.OS === 'ios') {
			this.invalidShippingAddress = RNApplePayManager.invalidShippingAddress;
			this.invalidPayment = RNApplePayManager.invalidPayment;

			this.didFinishSubscription = ApplePayEmitter.addListener('DidFinish', () => {
				this.paymentRequestDidFinish();
			});

			this.didSelectShippingAddressSubscription = ApplePayEmitter.addListener('DidSelectShippingAddress', ({ postalCode }) => {
				this.didSelectShippingAddress(postalCode);
			});

			this.didSelectShippingMethodSubscription = ApplePayEmitter.addListener('DidSelectShippingMethod', (method) => {
				this.didSelectShippingMethod(method);
			});

			this.didAuthorizePaymentSubscription = ApplePayEmitter.addListener('DidAuthorizePayment', (authorization) => {
				const {billingAddress, emailAddress, paymentData, phoneNumber, shippingAddress} = authorization;

				this.didAuthorizePayment({
					billingAddress,
					emailAddress,
					paymentData,
					phoneNumber,
					shippingAddress,
				});
			});
		}
	}

	async canMakePayments() {
		try {
			const canMakePayments = await RNApplePayManager.canMakePayments();
			const canMakePaymentsUsingNetworks = await RNApplePayManager.canMakePaymentsUsingNetworks();

			return { canMakePayments, canMakePaymentsUsingNetworks };
		} catch (error) {
			return { canMakePayments: !!error, canMakePaymentsUsingNetworks: !!error };
		}
	}

	paymentRequest = ({ items }, merchantIdentifier) => {
		RNApplePayManager.paymentRequest(items, merchantIdentifier);
	};

	updateShippingMethods = ({ items, options: shippingOptions }) => {
		RNApplePayManager.updateShippingMethods(items, shippingOptions);
	};

	selectShippingMethod = ({ items }) => {
		RNApplePayManager.selectShippingMethod(items);
	};

	authorizedPayment = () => {
		RNApplePayManager.authorizedPayment();
	};
}

export default new ApplePay();
