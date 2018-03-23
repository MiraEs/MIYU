'use strict';

jest.unmock('../en');

import { findMessage } from '../en';

describe('locales/en', () => {
	describe('findMessage', () => {
		it('VALID', () => {
			const message = findMessage('VALID');
			expect(message).toMatchSnapshot();
		});

		it('VALID_WITHOUT_OWNERSHIP', () => {
			const message = findMessage('VALID_WITHOUT_OWNERSHIP');
			expect(message).toMatchSnapshot();
		});

		it('INVALID_NOT_FOUND', () => {
			const message = findMessage('INVALID_NOT_FOUND');
			expect(message).toMatchSnapshot();
		});

		it('INVALID_SITE_ID_DOESNT_MATCH', () => {
			const message = findMessage('INVALID_SITE_ID_DOESNT_MATCH');
			expect(message).toMatchSnapshot();
		});

		it('INVALID_SESSION_CART_CANT_BE_LOADED', () => {
			const message = findMessage('INVALID_SESSION_CART_CANT_BE_LOADED');
			expect(message).toMatchSnapshot();
		});

		it('INVALID_NOT_LOCAL_USER_OR_EXPIRED_AND_NOT_QUANTITY_GREATERTHAN_0', () => {
			const message = findMessage('INVALID_NOT_LOCAL_USER_OR_EXPIRED_AND_NOT_QUANTITY_GREATERTHAN_0');
			expect(message).toMatchSnapshot();
		});

		it('INVALID_NON_ONLINE_ORDER_AND_USER_IS_NOT_LOCAL', () => {
			const message = findMessage('INVALID_NON_ONLINE_ORDER_AND_USER_IS_NOT_LOCAL');
			expect(message).toMatchSnapshot();
		});

		it('INVALID_ORDER_ALREADY_CREATED_FOR_QUOTE', () => {
			const message = findMessage('INVALID_ORDER_ALREADY_CREATED_FOR_QUOTE');
			expect(message).toMatchSnapshot();
		});

		it('UNKNOWN', () => {
			const message = findMessage('UNKNOWN');
			expect(message).toMatchSnapshot();
		});

	});

});
