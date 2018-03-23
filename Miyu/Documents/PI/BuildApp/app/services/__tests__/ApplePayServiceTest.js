jest.unmock('../ApplePayService');
jest.mock('react-native');
jest.mock('../httpClient', () => {
	return {
		post: jest.fn(() => Promise.resolve()),
	};
});

import client from '../httpClient';
import ApplePayService from '../ApplePayService';

const request = { encryptedPaymentData: 'data from PayKit'};

describe('ApplePayService', () => {
	describe('authorizations', () => {
		it('should call with the default params', () => {
			ApplePayService.authorizations(request);

			expect(client.post)
				.toBeCalledWith(
					'/v1/applepay/authorizations',
					{ encryptedPaymentData: 'data from PayKit'},
				);
		});

		it('should return success response', () => {
			const successResponse = {
				providerCode: 0,
				providerMessage: 'providerMessage',
				requestId: 'requestId',
				statusCode: 200,
				statusMessage: 'statusMessage',
				validationMessages: [
					'validationMessages0',
					'validationMessages1',
				],
			};

			client.post = () => Promise.resolve(successResponse);
			expect.assertions(1);

			return expect(ApplePayService.authorizations(request)).resolves.toEqual(successResponse);
		});

		it('should return error response', () => {
			const errorResponse = {
				statusCode: 999,
				statusMessage: 'PROVIDER_EXCEPTION',
				providerCode: 150,
				providerMessage: 'Error - General system failure. [See the documentation for your CyberSource client (SDK) for information about how to handle retries in the case of system errors.]',
				validationMessages: null,
				requestId: '4968769301716939603010',
			};
			const error = new Error(errorResponse.providerMessage);

			client.post = () => Promise.resolve(errorResponse);
			expect.assertions(1);

			return expect(ApplePayService.authorizations(request)).rejects.toEqual(error);
		});
	});
});
