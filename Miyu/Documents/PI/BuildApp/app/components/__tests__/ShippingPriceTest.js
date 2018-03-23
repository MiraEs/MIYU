import { create } from 'react-test-renderer';
import React from 'react';
import 'react-native';
import ShippingPrice from '../ShippingPrice';

jest.mock('../../lib/PhoneHelper', () => ({
	getPhoneNumberByUserType: jest.fn(user => user.phone),
}));

const props = {};

function setup(otherProps) {
	const wrapper = create(
		<ShippingPrice
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

describe('ShippingPrice', () => {
	it('should render with default props', () => {
		const {wrapper} = setup();
		expect(wrapper.toJSON()).toMatchSnapshot();
	});
	it('should render with null shippingCost', () => {
		const { wrapper } = setup({
			shippingCost: null,
		});
		expect(wrapper.toJSON()).toMatchSnapshot();
	});
	it('should render with a shipping cost', () => {
		const {wrapper} = setup({
			shippingCost: 123.45,
		});
		expect(wrapper.toJSON()).toMatchSnapshot();
	});
	it('should render call shipping cost', () => {
		const {wrapper} = setup({
			user: {
				phone: 3216543213,
			},
			callUs: true,
		});
		expect(wrapper.toJSON()).toMatchSnapshot();
	});
});
