'use strict';

jest.mock('../../../app/services/httpClient', () => ({}));
jest.mock('../../../app/store/configStore', () => ({}));

jest.mock('BuildNative');
jest.mock('BuildLibrary');
jest.unmock('react-native');

import React from 'react';
import { CouponButton } from '../CouponButton';
import { create } from 'react-test-renderer';

const props = {
	actions: {
		addCoupon: jest.fn(() => ({
			then: jest.fn((fn) => {
				fn();
				return {
					catch: jest.fn(() => ({
						done: jest.fn(),
					})),
				};
			}),
		})),
		showAccessories: jest.fn(),
	},
	cart: {},
	modal: {
		hide: jest.fn(() => ({
			then: jest.fn((fn) => {
				fn();
			}),
		})),
	},
};

function setup(otherProps) {
	const wrapper = create(
		<CouponButton
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

describe('CouponButton component', () => {
	it('should render correctly', () => {
		const { wrapper } = setup();
		expect(wrapper.toJSON()).toMatchSnapshot();
	});
	it('should handle an added coupon', () => {
		const { instance } = setup();
		const couponCode = 'SAVEMUNMUNS';
		instance.onAddCoupon(couponCode);
		expect(props.modal.hide).toBeCalled();
		expect(props.actions.showAccessories).toBeCalled();
	});
});
