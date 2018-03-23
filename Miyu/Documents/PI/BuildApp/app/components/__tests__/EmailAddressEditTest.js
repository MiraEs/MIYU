import { create } from 'react-test-renderer';
import React from 'react';
import 'react-native';
import EmailAddressEdit from '../EmailAddressEdit';
import { isValidEmail } from '../../lib/Validations';

const mockEmailAddress = 'c@b.c';

jest.mock('../../components/FormInput', () => 'FormInput');
jest.mock('../../lib/Validations', () => ({
	isValidEmail: jest.fn(email => {
		if (email === mockEmailAddress) {
			return true;
		}
		return false;
	}),
}));

const props = {
	emailAddress: mockEmailAddress,
	onChange: jest.fn(),
	onSubmitEditing: jest.fn(),
	returnKeyType: 'done',
	name: 'name',
	accessibilityLabel: 'accessibility label',
};

function setup(otherProps) {
	const wrapper = create(
		<EmailAddressEdit
			{...props}
			{...otherProps}
		/>
	);
	const instance = wrapper.getInstance();
	// adding ref stored in this._emailAddress manually
	instance._emailAddress = {
		focus: jest.fn(),
		triggerValidation: jest.fn(),
	};
	return {
		wrapper,
		instance,
	};
}

describe('EmailAddressEdit', () => {
	describe('render', () => {
		it('should render with full props', () => {
			const { wrapper } = setup();
			expect(wrapper.toJSON()).toMatchSnapshot();
		});
	});
	describe('focus', () => {
		it('should call focus on email address', () => {
			const { instance } = setup({
				emailAddress: undefined,
			});
			instance.focus();
			expect(instance._emailAddress.focus).toBeCalled();
		});
	});
	describe('triggerValidation', () => {
		it('should call triggerValidation on input', () => {
			const { instance } = setup();
			instance.triggerValidation();
			expect(instance._emailAddress.triggerValidation).toBeCalledWith();
		});
	});
	describe('validateEmail', () => {
		beforeEach(() => {
			isValidEmail.mockClear();
		});
		it('should handle a valid email', () => {
			const { instance } = setup();
			const result = instance.validateEmail(mockEmailAddress);
			expect(result).toEqual(true);
			expect(isValidEmail).toBeCalledWith(mockEmailAddress);
		});
		it('should handle an invalid email', () => {
			const { instance } = setup();
			const result = instance.validateEmail('');
			expect(result).toEqual('Please enter a valid email address.');
		});
	});
});
