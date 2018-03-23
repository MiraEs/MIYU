import React from 'react';
import ReactNative from 'react-native';
jest.unmock('react-native');
import {
	ProductPricedOptionButtons,
	mapStateToProps,
	mapDispatchToProps,
} from '../ProductPricedOptionButtons';

jest.mock('@expo/ex-navigation');
jest.mock('redux');
jest.mock('react-redux');
jest.mock('../../../lib/ProductConfigurationHelpers', () => ({
	getProductComposite: jest.fn(() => ({
		productCompositeId: 1234,
		pricedOptionGroups: [],
	})),
	getProductConfiguration: jest.fn(() => ({
		selectedPricedOptions: [],
	})),
}));
jest.mock('../ProductConfigurationButton', () => 'ProductConfigurationButton');
jest.mock('../../../constants/productDetailConstants', () => ({}));
jest.mock('../../../actions/ProductConfigurationsActions', () => ({
	setProductConfigurationPricedOption: jest.fn(),
}));

const productConfigurationId = 'u-u-i-d';
const props = {
	actions: {
		setProductConfigurationPricedOption: jest.fn(),
	},
	navigation: {
		getNavigator: jest.fn(() => ({
			push: jest.fn(),
		})),
	},
	compositeId: 1234,
	pricedOptionGroups: [{
		optionName: 'name',
		pricedOptions: [],
	}, {
		optionName: 'default selection name',
		pricedOptions: [{
			defaultSelection: true,
			inputType: 'radio',
		}],
	}],
	selectedPricedOptions: [{
		optionName: 'name',
		name: 'value',
	}],
	productConfigurationId,
};

describe('ProductPricedOptionButtons', () => {

	let keyboardDismissSpy;

	beforeEach(() => {
		keyboardDismissSpy = spyOn(ReactNative.Keyboard, 'dismiss');
	});

	it('should render with full props', () => {
		const wrapper = require('react-test-renderer').create(
			<ProductPricedOptionButtons {...props} />
		).toJSON();
		expect(wrapper).toMatchSnapshot();
	});

	it('should render nothing with no priced option groups', () => {
		const wrapper = require('react-test-renderer').create(
			<ProductPricedOptionButtons
				{...props}
				pricedOptionGroups={[]}
			/>
		).toJSON();
		expect(wrapper).toMatchSnapshot();
	});

	it('should mapStateToProps', () => {
		const state = {};
		const ownProps = {
			productConfigurationId,
		};
		const result = mapStateToProps(state, ownProps);
		expect(result).toMatchSnapshot();
	});

	it('should mapDispatchToProps', () => {
		const dispatch = jest.fn((fn) => fn);
		const result = mapDispatchToProps(dispatch);
		expect(result).toMatchSnapshot();
	});

	it('should navigate on configure button press', () => {
		const wrapper = require('react-test-renderer').create(
			<ProductPricedOptionButtons {...props} />
		);
		wrapper.getInstance().onPressConfigureButton();
		expect(keyboardDismissSpy).toBeCalled();
		expect(props.navigation.getNavigator).toBeCalledWith('root');
	});
});
