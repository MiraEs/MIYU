jest.mock('../../../app/lib/ApplePay', () => {
	return {
		updateShippingMethods: jest.fn(),
		invalidShippingAddress: jest.fn(),
		paymentRequest: jest.fn(),
		selectShippingMethod: jest.fn(),
		invalidPayment: jest.fn(),
		authorizedPayment: jest.fn(),
	};
});
jest.mock('../../../app/lib/helpers', () => {
	return {
		noop: jest.fn(),
		isIOS: jest.fn(() => true),
		isAndroid: jest.fn(),
		getIcon: jest.fn((name) => `ios-${name}`),
		calcGrandTotal: jest.fn(() => '815.25'),
	};
});
jest.mock('../../../app/actions/NavigatorActions', () => {
	return {
		navigatorPop: jest.fn(),
	};
});
jest.mock('BuildNative');
jest.mock('BuildLibrary');
jest.mock('../../../app/services/httpClient', () => 'httpClient');

jest.unmock('react-native');

import React from 'react';
import renderer from 'react-test-renderer';
import ApplePay from '../../../app/lib/ApplePay';
import { CheckoutApplePayScreen, mapStateToProps, route } from '../CheckoutApplePayScreen';
import checkoutReducer from './../../../__mocks__/reducers/checkoutReducer';
import cartReducer from './../../../__mocks__/reducers/cartReducer';
import userReducer from './../../../__mocks__/reducers/userReducer';

const defaultProps = {
	checkout: { ...checkoutReducer },
	cart: { ...cartReducer.cart },
	selectedShippingIndex: cartReducer.selectedShippingIndex,
	user: { ...userReducer.user },
	actions: {
		authorizeApplePay: jest.fn((payment) => Promise.resolve(payment)),
		setSelectedShippingIndex: jest.fn((index) => Promise.resolve(index)),
		updateSessionCart: jest.fn((update) => Promise.resolve(update)),
		getSessionCart: jest.fn(() => Promise.resolve()),
	},
	navigator: {
		pop: jest.fn((index) => index),
	},
	cartReducer,
};

const defaultState = {
	payment: false,
	waitingForAuthorized: false,
};

describe('CheckoutApplePayScreen component', () => {
	const wrapper = renderer.create(<CheckoutApplePayScreen {...defaultProps} />);

	beforeEach(() => {
		wrapper.getInstance().props = defaultProps;
	});

	it('should render with default props', () => {
		wrapper.getInstance().setState(defaultState);

		expect(wrapper).toMatchSnapshot();
	});

	it('componentWillReceiveProps should call ApplePay.updateShippingMethods', () => {
		wrapper.getInstance().componentWillReceiveProps({
			...defaultProps,
			cart: {
				...defaultProps.cart,
				zipCode: '95973',
			},
		});
		const shipping = wrapper.getInstance().getPaymentDetails(wrapper.getInstance().props.cartReducer);

		expect(ApplePay.updateShippingMethods).toBeCalledWith(shipping);
	});

	it('componentWillReceiveProps should call ApplePay.selectShippingMethod', () => {
		const { cart, cartReducer } = wrapper.getInstance().props;
		const newCartReducer = {
			...cartReducer,
			selectedShippingIndex: 1,
		};
		wrapper.getInstance().componentWillReceiveProps({
			cart,
			selectedShippingIndex: 1,
			cartReducer: newCartReducer,
		});

		expect(ApplePay.selectShippingMethod).toBeCalledWith(wrapper.getInstance().getPaymentDetails(newCartReducer));
	});

	it('setScreenTrackingInformation should return with expected results', () => {
		const results = wrapper.getInstance().setScreenTrackingInformation();
		expect(results).toEqual({ name: 'build:app:checkoutapplepay' });
	});

	it('getPaymentDetails should return with expected results', () => {
		const expected = {
			items: [
				{ amount: '0', label: 'Shipping' },
				{ amount: '55.11', label: 'Tax' },
				{ amount: '815.25', label: 'Build.com' },
			],
			options: [
				{
					amount: '0',
					detail: 'Standard Delivery (5 - 7 Business Days)',
					label: 'Standard Delivery',
				},
				{
					amount: '58.53',
					detail: 'Two Day Delivery (2 Business Days)',
					label: 'Two Day Delivery',
				},
				{
					amount: '97.77',
					detail: 'One Day Delivery (1 Business Day)',
					label: 'One Day Delivery',
				},
			],
		};
		wrapper.getInstance().props = {
			...defaultProps,
			selectedShippingIndex: 0,
		};
		const shipping = wrapper.getInstance().getPaymentDetails(wrapper.getInstance().props.cartReducer);

		expect(shipping).toEqual(expected);
	});

	it('paymentRequest should call ApplePay.paymentRequest', () => {
		const shipping = wrapper.getInstance().getPaymentDetails(cartReducer);

		expect(ApplePay.paymentRequest).toBeCalledWith(shipping, 'merchant.com.build.buildapp-prod');
	});

	it('paymentRequestDidFinish should call navigator.pop', () => {
		wrapper.getInstance().setState({ waitingForAuthorized: false });
		wrapper.getInstance().paymentRequestDidFinish();

		expect(wrapper.getInstance().props.navigator.pop).toBeCalledWith();
	});

	it('didSelectShippingAddress should call actions.updateSessionCart', () => {
		const zipCode = '95973';
		const update = { cart: { zipCode: '95973' }, sessionCartId: 406071211 };

		wrapper.getInstance().props = {
			...defaultProps,
			cart: {
				...defaultProps.cart,
			},
		};

		wrapper.getInstance().didSelectShippingAddress(zipCode);

		expect(wrapper.getInstance().props.actions.updateSessionCart).toBeCalledWith(update);
	});

	it('didSelectShippingAddress should fail and call invalidShippingAddress', () => {
		const zipCode = '95973';

		wrapper.getInstance().props = {
			...defaultProps,
			actions: {
				...defaultProps.actions,
				updateSessionCart: jest.fn(() => Promise.reject()),
			},
		};

		wrapper.getInstance().didSelectShippingAddress(zipCode);
		expect.assertions(1);

		return expect(wrapper.getInstance().props.actions.updateSessionCart()).rejects.toEqual(undefined);
	});

	it('didSelectShippingAddress should call ApplePay.updateShippingMethods', () => {
		const zipCode = '95014';
		const shipping = wrapper.getInstance().getPaymentDetails(cartReducer);

		wrapper.getInstance().didSelectShippingAddress(zipCode);

		expect(ApplePay.updateShippingMethods).toBeCalledWith(shipping);
	});

	it('didSelectShippingMethod should call actions.setSelectedShippingIndex', () => {
		const method = {
			label: cartReducer.cart.shippingOptions[0].shippingOption,
			amount: cartReducer.cart.shippingOptions[0].shippingCost,
		};

		wrapper.getInstance().didSelectShippingMethod(method);

		expect(wrapper.getInstance().props.actions.setSelectedShippingIndex).toBeCalledWith(0);
	});

	it('mapStateToProps should return with expected results', () => {
		const state = {
			checkoutReducer,
			cartReducer,
			userReducer,
		};
		const results = mapStateToProps(state);

		expect(results).toEqual({
			checkout: { ...checkoutReducer },
			cart: { ...cartReducer.cart },
			cartReducer: { ...cartReducer },
			selectedShippingIndex: cartReducer.selectedShippingIndex,
			user: { ...userReducer.user },
		});
	});

	it('route.navigationBar.renderLeft back button should handle press', () => {
		const spy = jest.spyOn(route.navigationBar, 'navigatorPop');
		const navBar = renderer.create(route.navigationBar.renderLeft());

		navBar.getInstance().props.onPress();
		expect(spy).toHaveBeenCalled();
	});

	it('route.navigationBar.renderRight button should handle press', () => {
		const navBar = renderer.create(route.navigationBar.renderRight());

		navBar.getInstance().props.onPress();
		expect(navBar.getInstance().props.onPress).toBeCalledWith();
	});

	it('route.navigationBar.styles.sceneAnimations should return backgroundColor of transparent', () => {
		const sceneAnimations = route.styles.sceneAnimations(wrapper.getInstance().props);

		expect(sceneAnimations.backgroundColor).toEqual('transparent');
	});
});
