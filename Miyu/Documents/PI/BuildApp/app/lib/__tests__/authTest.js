'use strict';

jest.unmock('../../../app/lib/auth');

import keychain from 'react-native-keychain';
import auth from '../auth';


describe('app/lib/auth.js', () => {
	describe('resetCredentialsForDomain function', () => {
		it('should call keychain.resetInternetCredentials with domain', () => {
			const DOMAIN = 'test.build.com';
			auth.resetCredentialsForDomain(DOMAIN);

			expect(keychain.resetInternetCredentials).toBeCalled();
		});
	});

	describe('getCredentialsForDomain function', () => {
		it('should call keychain.getInternetCredentials with domain', () => {
			const DOMAIN = 'test.build.com';
			auth.getCredentialsForDomain(DOMAIN);
			expect(keychain.getInternetCredentials).toBeCalled();
		});
	});

	describe('setCredentialsForDomain function', () => {
		it('should call keychain.setInternetCredentials with domain', () => {
			const DOMAIN = 'test.build.com';
			auth.setCredentialsForDomain(DOMAIN);
			expect(keychain.setInternetCredentials).toBeCalled();
		});
	});
});
