import { create } from 'react-test-renderer';
import React from 'react';
import 'react-native';
import {
	LoginForm,
	mapStateToProps,
	mapDispatchToProps,
} from '../LoginForm';

const props = {
	linkAccounts: false,
	loginFail: jest.fn(),
	loginSuccess: jest.fn(),
	navForgotPassword: jest.fn(),
	actions: {},
	isLoggingIn: false,
	isLoggingInSocial: false,
	error: '',
	user: {},
};

function setup(otherProps) {
	const wrapper = create(
		<LoginForm
			{...props}
			{...otherProps}
		/>
	);
	const instance = wrapper.getInstance();
	return {
		wrapper,
		instance,
	};
}

describe('LoginForm', () => {
	it('should render with full props', () => {
		const { wrapper } = setup();
		expect(wrapper.toJSON()).toMatchSnapshot();
	});
	it('should map state to props', () => {
		const state = {
			userReducer: {
				isLoggingIn: true,
				isLoggingInSocial: false,
				user: {},
			},
		};
		const result = mapStateToProps(state);
		expect(result).toMatchSnapshot();
	});
	it('should map dispatch to props', () => {
		const dispatch = jest.fn(fn => fn);
		const result = mapDispatchToProps(dispatch);
		expect(result).toMatchSnapshot();
	});
});
