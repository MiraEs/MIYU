import { create } from 'react-test-renderer';
import React from 'react';
import 'react-native';
import { ShippingEstimateModal } from '../ShippingEstimateModal';

const props = {
	actions: {},
	cart: {},
	selectedShippingIndex: 2,
	onClose: jest.fn(),
	user: {},
};

function setup(otherProps) {
	const wrapper = create(
		<ShippingEstimateModal
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

describe('ShippingEstimateModal', () => {
	it('should render with full props', () => {
		const { wrapper } = setup();
		expect(wrapper.toJSON()).toMatchSnapshot();
	});
});
