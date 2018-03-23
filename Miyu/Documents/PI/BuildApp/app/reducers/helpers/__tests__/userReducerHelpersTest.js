import {
	getAvatarUrl,
	getFullName,
} from '../userReducerHelpers';

describe('userReducerHelpers', () => {
	describe('getAvatarUrl', () => {
		it('should return a string when avatar URL exists', () => {
			const url = '/path/to/avatar';
			const user = {
				apiUser: {
					avatar: url,
				},
			};
			const result = getAvatarUrl(user);
			expect(result).toEqual(url);
		});
		it('should return undefined if there is no avatar URL', () => {
			const user = {
				apiUser: {},
			};
			const result = getAvatarUrl(user);
			expect(result).toEqual();
		});
	});
	describe('getFullName', () => {
		it('should return a full name if first and last name is available', () => {
			const user = {
				firstName: 'Joe',
				lastName: 'Build',
			};
			const result = getFullName(user);
			expect(result).toEqual('Joe Build');
		});
		it('should return just first name if there is no last name', () => {
			const user = {
				firstName: 'Joe',
			};
			const result = getFullName(user);
			expect(result).toEqual('Joe');
		});
		it('should return undefined when there is no first name', () => {
			const user = {};
			const result = getFullName(user);
			expect(result).toEqual();
		});
	});
});
