import React from 'react';
import { PaymentMethodScreen, mapStateToProps, route } from '../PaymentMethodScreen';
import {
	APPLE_PAY,
	CREDIT_CARD,
	PAYPAL,
} from '../../../app/constants/CheckoutConstants';
import { navigatorPopToRoute } from '../../actions/NavigatorActions';

jest.mock('../../../app/lib/ApplePay', () => {
	return {
		canMakePayments: () => {
			return Promise.resolve({
				canMakePayments: true,
				canMakePaymentsUsingNetworks: true,
			});
		},
	};
});
jest.mock('BuildNative');
jest.mock('BuildLibrary');
jest.mock('../../../app/services/httpClient', () => 'httpClient');
jest.mock('../../../app/lib/helpers', () => {
	return {
		isIOS: () => true,
		isAndroid: jest.fn(),
		getIcon: (name) => `ios-${name}`,
	};
});
jest.mock('../../../app/components/CheckoutLoginModal', () => 'CheckoutLoginModal');
jest.mock('../../../app/actions/NavigatorActions', () => {
	return {
		navigatorPopToRoute: jest.fn(),
		navigatorPop: jest.fn(),
	};
});

jest.unmock('react-native');


const defaultProps = {
	isGuest: true,
	applePay: false,
	navigator: {
		push: jest.fn(),
	},
};

const defaultState = {
	isLoaded: true,
	promptLogin: false,
	slideOptions: false,
	canMakePayments: false,
	canMakePaymentsUsingNetworks: false,
};

describe('PaymentMethodScreen component', () => {
	it('should render with default props', () => {
		const wrapper = require('react-test-renderer').create(
			<PaymentMethodScreen {...defaultProps} />
		);
		wrapper.getInstance().setState(defaultState);

		expect(wrapper).toMatchSnapshot();
	});

	it('should render with CheckoutLoginModal', () => {
		const wrapper = require('react-test-renderer').create(
			<PaymentMethodScreen
				{...defaultProps}
				isGuest={true}
			/>
		);
		wrapper.getInstance().setState({
			...defaultState,
			promptLogin: true,
		});

		expect(wrapper).toMatchSnapshot();
	});

	it('should render with ApplePay button', () => {
		const wrapper = require('react-test-renderer').create(
			<PaymentMethodScreen
				{...defaultProps}
				applePay={true}
			/>
		);
		wrapper.getInstance().setState({
			...defaultState,
			canMakePayments: true,
			canMakePaymentsUsingNetworks: true,
		});

		expect(wrapper).toMatchSnapshot();
	});

	it('should handle Credit Card button press', () => {
		const wrapper = require('react-test-renderer').create(
			<PaymentMethodScreen
				{...defaultProps}
				applePay={true}
			/>
		);
		wrapper.getInstance().onCheckout(CREDIT_CARD);

		expect(defaultProps.navigator.push).toBeCalledWith('checkoutCreditCard');
	});

	it('should handle PayPal button press', () => {
		const wrapper = require('react-test-renderer').create(
			<PaymentMethodScreen
				{...defaultProps}
				applePay={true}
			/>
		);
		wrapper.getInstance().onCheckout(PAYPAL);

		expect(defaultProps.navigator.push).toBeCalledWith('checkoutPayPal');
	});

	it('should handle ApplePay button press', () => {
		const wrapper = require('react-test-renderer').create(
			<PaymentMethodScreen
				{...defaultProps}
				applePay={true}
			/>
		);
		wrapper.getInstance().onCheckout(APPLE_PAY);

		expect(navigatorPopToRoute).toBeCalledWith('cartScreen', 'root');
		expect(defaultProps.navigator.push).toBeCalledWith('checkoutApplePay');
	});

	it('onCheckoutLogin should return with expected results', () => {
		const wrapper = require('react-test-renderer').create(
			<PaymentMethodScreen
				{...defaultProps}
				applePay={true}
			/>
		);
		wrapper.getInstance().onCheckoutLogin();
		expect(wrapper.getInstance().state.promptLogin).toEqual(false);
		expect(wrapper.getInstance().state.slideOptions).toEqual(true);
	});

	it('setScreenTrackingInformation should return with expected results', () => {
		const wrapper = require('react-test-renderer').create(
			<PaymentMethodScreen
				{...defaultProps}
				applePay={true}
			/>
		);
		const results = wrapper.getInstance().setScreenTrackingInformation();
		expect(results).toMatchSnapshot();
	});

	it('mapStateToProps should return with expected results', () => {
		const results = mapStateToProps({
			userReducer: { user: { isGuest: true } },
			featuresReducer: { features: { applePay: true} },
		});

		expect(results).toMatchSnapshot();
	});

	it('route.navigationBar.renderLeft should return with expected results', () => {
		const results = route.navigationBar.renderLeft();
		expect(results).toMatchSnapshot();
	});

	it('route.navigationBar.renderLeft back button should handle press', () => {
		const spy = jest.spyOn(route.navigationBar, 'navigatorPop');
		const navBar = require('react-test-renderer').create(
			route.navigationBar.renderLeft()
		);

		navBar.getInstance().props.onPress();
		expect(spy).toHaveBeenCalled();
	});
});
