jest.mock('../../services/httpClient', () => ({}));
jest.mock('../../store/configStore', () => ({}));
jest.mock('../../lib/analytics/tracking');
jest.mock('BuildNative');
jest.mock('BuildLibrary');
jest.mock('../../components/Form', () => 'Form');
jest.mock('../../components/FormInput', () => 'FormInput');

import { CustomerImpersonator } from '../CustomerImpersonator';
import React from 'react';

const defaultProps = {
	actions: {
		signUserOut: jest.fn(),
		loginWithCreds: jest.fn(() => ({
			then: () => ({
				catch: () => ({
					done: jest.fn(),
				}),
			}),
		})),
		setImpersonatorId: jest.fn(),
	},
	isLoggedIn: false,
	isLoggingIn: false,
	impersonatorId: 1,
	user: {
		firstName: 'Bob',
		lastName: 'Smith',
	},
};

describe('CustomerImpersonator component', () => {
	it('should render correctly with user logged in', () => {
		const tree = require('react-test-renderer').create(
			<CustomerImpersonator
				{...defaultProps}
				isLoggedIn={true}
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render correctly with user logged out', () => {
		const tree = require('react-test-renderer').create(
			<CustomerImpersonator
				{...defaultProps}
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render correctly with no impersonatorId', () => {
		const tree = require('react-test-renderer').create(
			<CustomerImpersonator
				{...defaultProps}
				isLoggedIn={true}
				impersonatorId={undefined}
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});
});

describe('CustomerImpersonator functions', () => {
	describe('renderPasswordInput', () => {
		it('should render correctly with a password field', () => {
			const wrapper = require('react-test-renderer').create(
				<CustomerImpersonator
					{...defaultProps}
				/>
			);
			wrapper.getInstance().state.password = 'password';
			expect(wrapper.getInstance().renderPasswordInput()).toMatchSnapshot();
		});

		it('should render correctly without a password field', () => {
			const wrapper = require('react-test-renderer').create(
				<CustomerImpersonator
					{...defaultProps}
				/>
			).getInstance();
			expect(wrapper.renderPasswordInput()).toMatchSnapshot();
		});
	});

	describe('logout', () => {
		it('should call the function', () => {
			require('react-test-renderer').create(
				<CustomerImpersonator
					{...defaultProps}
				/>
			)
				.getInstance()
				.logout();
			expect(defaultProps.actions.signUserOut).toBeCalled();
		});
	});

	describe('onChange', () => {
		it('should set the state', () => {
			const values = {
				customerId: {
					value: 2,
				},
				inputPassword: {
					value: 'asdf',
				},
			};
			const wrapper = require('react-test-renderer').create(
				<CustomerImpersonator
					{...defaultProps}
				/>
			)
				.getInstance();
			wrapper.onChange(values);
			expect(wrapper.state.customerId).toEqual(2);
			expect(wrapper.state.inputPassword).toEqual('asdf');
		});

		it('should not set the state', () => {
			const values = {};
			const wrapper = require('react-test-renderer').create(
				<CustomerImpersonator
					{...defaultProps}
				/>
			)
				.getInstance();
			wrapper.onChange(values);
			expect(wrapper.state.customerId).toEqual(null);
			expect(wrapper.state.inputPassword).toEqual(null);
		});
	});

	describe('login', () => {
		it('should call functions', () => {
			const values = {
				customerId: {
					value: 2,
				},
				inputPassword: {
					value: 'asdf',
				},
			};
			const wrapper = require('react-test-renderer').create(
				<CustomerImpersonator
					{...defaultProps}
				/>
			)
				.getInstance();
			wrapper.onChange(values);

			wrapper.login();
			expect(defaultProps.actions.setImpersonatorId).toBeCalledWith(2);
			expect(defaultProps.actions.loginWithCreds).toBeCalledWith('admin', 'asdf', false);
		});
	});

});
