jest.mock('BuildNative');
jest.mock('BuildLibrary');
jest.mock('react-native');
jest.mock('../../lib/analytics/tracking');
jest.mock('../../components/LoadingView', () => 'LoadingView');
jest.mock('../../components/navigationBar/NavigationBarIconButton', () => 'NavigationBarIconButton');
jest.mock('../../components/Cart/EmptyCart', () => 'EmptyCart');
jest.mock('../../components/Cart/CartRow', () => 'CartRow');
jest.mock('../../components/Cart/CartRowActions', () => 'CartRowActions');
jest.mock('../../components/Cart/CartRowFooter', () => 'CartRowFooter');
jest.mock('../../components/Cart/ShippingEstimateModal', () => 'ShippingEstimateModal');
jest.mock('../../components/Cart/SaveCartModal', () => 'SaveCartModal');
jest.mock('../../components/Cart/LoadCartModal', () => 'LoadCartModal');
jest.mock('../../components/Cart/EmailCartModal', () => 'EmailCartModal');
jest.mock('../../components/Cart/PaymentMethodModal', () => 'PaymentMethodModal');
jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');
jest.mock('react-native-keyboard-spacer/KeyboardSpacer', () => 'KeyboardSpacer');
jest.mock('../../../node_modules/react-native/Libraries/Experimental/SwipeableRow/SwipeableListView', () => 'SwipeableListView');
jest.mock('../../router', () => ({
	getRoute: jest.fn((route) => route),
}));
jest.mock('../../actions/NavigatorActions', () => ({
	navigatorPop: jest.fn(),
	navigatorPush: jest.fn(),
}));
jest.mock('../../lib/helpers', () => ({
	getIcon: (icon) => `ios-${icon}`,
	isAndroid: () => false,
	isIOS: () => true,
	toUSD: (val) => `$${val}`,
}));

import { CartScreen } from '../CartScreen';
import React from 'react';
import {
	ActionSheetIOS,
	Animated,
} from 'react-native';
import SwipeableListViewDataSource from '../../../node_modules/react-native/Libraries/Experimental/SwipeableRow/SwipeableListViewDataSource';
import {
	navigatorPush,
} from '../../actions/NavigatorActions';

import styles from '../../lib/styles';

import cartReducer from '../../../__mocks__/reducers/cartReducer';
import userReducer from '../../../__mocks__/reducers/userReducer';
import renderer from 'react-test-renderer';

const dataSource = new SwipeableListViewDataSource({
	sectionHeaderHasChanged: (r1, r2) => r1 !== r2,
	rowHasChanged: (r1, r2) => r1 !== r2 || r2.hasChanged,
});

const defaultProps = {
	actions: {
		trackAction: jest.fn(),
		trackState: jest.fn(),
		updateCartItemBounce: jest.fn(),
	},
	cart: cartReducer.cart,
	couponCode: '',
	features: {
		shoppingLists: false,
	},
	isLoggedIn: false,
	modal: {
		show: jest.fn(),
		hide: jest.fn(() => Promise.resolve()),
	},
	navigator: {
		pop: jest.fn(),
		push: jest.fn(),
	},
	products: {},
	user: userReducer.user,
};

const defaultState = {
	isMessageVisible: false,
	message: null,
	hideQuantitySelectors: false,
	updatingCartAnimLeft: new Animated.Value(styles.dimensions.width),
	dataSource: dataSource.cloneWithRowsAndSections([defaultProps.cart.sessionCartItems]),
};

describe('CartScreen component', () => {

	it('snapshot test', () => {
		const wrapper = renderer.create(<CartScreen {...defaultProps} />);
		expect(wrapper.toJSON()).toMatchSnapshot();
	});

	it('loading snapshot test', () => {
		const wrapper = renderer.create(
			<CartScreen
				{...defaultProps}
				isLoading={true}
			/>
		);
		expect(wrapper.toJSON()).toMatchSnapshot();
	});

	it('no cart items snapshot test', () => {
		const wrapper = renderer.create(
			<CartScreen
				{...defaultProps}
				cart={{
					...defaultProps.cart,
					sessionCartItems: [],
				}}
			/>
		);
		expect(wrapper.toJSON()).toMatchSnapshot();
	});

	it('should bounce turn off bounceFirstRowOnMount', () => {
		renderer.create(
			<CartScreen
				{...defaultProps}
				bounceFirstRowOnMount={true}
			/>
		);
		expect(defaultProps.actions.updateCartItemBounce).toBeCalledWith(false);
	});

	it('initial state', () => {
		const wrapper = renderer.create(<CartScreen {...defaultProps} />);
		const state = wrapper.getInstance().state;

		expect(state.isMessageVisible).toEqual(defaultState.isMessageVisible);
		expect(state.message).toEqual(defaultState.message);
		expect(state.hideQuantitySelectors).toEqual(defaultState.hideQuantitySelectors);
	});

	it('expect method getItem to return expected results', () => {
		const wrapper = renderer.create(<CartScreen {...defaultProps} />);
		const cartItems = defaultProps.cart.sessionCartItems;
		const key = defaultProps.cart.sessionCartItems[0].itemKey;
		const results = wrapper.getInstance().getItem(cartItems, key);

		expect(results).toEqual(defaultProps.cart.sessionCartItems[0]);
	});

	it('expect method getTotalQuantity to return expected results', () => {
		const wrapper = renderer.create(<CartScreen {...defaultProps} />);
		const results = wrapper.getInstance().getTotalQuantity();

		expect(results).toEqual(3);
	});

	it('expect method getGrandTotal to return expected results', () => {
		const wrapper = renderer.create(<CartScreen {...defaultProps} />);
		const results = wrapper.getInstance().getGrandTotal();

		expect(results).toEqual('$815.25');
	});

	it('expect method onSaveCartModal to run navigator push', () => {
		const wrapper = renderer.create(<CartScreen {...defaultProps} />);
		const spy = jest.spyOn(wrapper.getInstance().props.navigator, 'push');
		wrapper.getInstance().onSaveCartModal();

		expect(spy).toHaveBeenCalled();
	});

	it('expect method onEmailCartModal to run modal show', () => {
		const wrapper = renderer.create(<CartScreen {...defaultProps} />);
		const spy = jest.spyOn(wrapper.getInstance().props.modal, 'show');
		wrapper.getInstance().onEmailCartModal();

		expect(spy).toHaveBeenCalled();
	});

	it('expect method onEmailCart to run modal show', () => {
		const wrapper = renderer.create(<CartScreen {...defaultProps} />);
		const spy = jest.spyOn(wrapper.getInstance().props.modal, 'hide');
		wrapper.getInstance().onEmailCart();

		expect(spy).toHaveBeenCalled();
	});
});

describe('CartScreen functions', () => {
	it('renderCartRow', () => {
		const wrapper = renderer.create(<CartScreen {...defaultProps} />).getInstance();
		const result = wrapper.renderCartRow(defaultProps.cart.sessionCartItems[0], 0, 0);
		expect(result).toMatchSnapshot();
	});

	it('renderCartRowActions', () => {
		const wrapper = renderer.create(<CartScreen {...defaultProps} />).getInstance();
		const result = wrapper.renderCartRowActions(defaultProps.cart.sessionCartItems[0], 0, 0);
		expect(result).toMatchSnapshot();
	});

	it('renderCartRowFooter', () => {
		const wrapper = renderer.create(<CartScreen {...defaultProps} />).getInstance();
		const result = wrapper.renderCartRowFooter();
		expect(result).toMatchSnapshot();
	});

	it('renderCartRowHeader', () => {
		const wrapper = renderer.create(<CartScreen {...defaultProps} />).getInstance();
		const result = wrapper.renderCartRowHeader();
		expect(result).toMatchSnapshot();
	});

	describe('onToolsPress', () => {
		it('should display only 2 buttons', () => {
			const wrapper = renderer.create(
				<CartScreen
					{...defaultProps}
					cart={{
						...defaultProps.cart,
						sessionCartItems: [],
					}}
				/>
			).getInstance();
			wrapper.onToolsPress();
			expect(ActionSheetIOS.showActionSheetWithOptions).toBeCalledWith({
				options: ['Load Cart', 'Cancel'],
				cancelButtonIndex: 1,
				tintColor: '#63666A',
			}, expect.any(Function));
		});

		it('should display 5 buttons', () => {
			const wrapper = renderer.create(
				<CartScreen
					{...defaultProps}
				/>
			).getInstance();
			wrapper.onToolsPress();
			expect(ActionSheetIOS.showActionSheetWithOptions).toBeCalledWith({
				options: ['Email Cart', 'Save Cart', 'Load Cart', 'Empty Cart', 'Cancel'],
				cancelButtonIndex: 4,
				tintColor: '#63666A',
			}, expect.any(Function));
		});

		it('should display 6 buttons', () => {
			const wrapper = renderer.create(
				<CartScreen
					{...defaultProps}
					features={{
						...defaultProps.features,
						shoppingLists: true,
					}}
				/>
			).getInstance();
			wrapper.onToolsPress();
			expect(ActionSheetIOS.showActionSheetWithOptions).toBeCalledWith({
				options: ['Email Cart', 'Save Cart', 'Load Cart', 'Empty Cart', 'Add To Project', 'Cancel'],
				cancelButtonIndex: 5,
				tintColor: '#63666A',
			}, expect.any(Function));
		});
	});

	it('onAddCartToProject', () => {
		const wrapper = renderer.create(
			<CartScreen
				{...defaultProps}
				isLoggedIn={true}
			/>
		).getInstance();
		wrapper.onAddCartToProject();
		expect(defaultProps.actions.trackAction).toBeCalledWith('build:app:cart:addcarttoproject', { sessionCartId: 406071211 });
		expect(navigatorPush).toBeCalledWith('addToProjectModal', 'root');
	});

	it('onAddItemToProject', () => {
		const wrapper = renderer.create(
			<CartScreen
				{...defaultProps}
				isLoggedIn={true}
			/>
		).getInstance();
		wrapper.onAddItemToProject(defaultProps.cart.sessionCartItems[0]);
		expect(defaultProps.actions.trackAction).toBeCalledWith('build:app:cart:additemtoproject', { cost: 501.7, finish: 'Arctic Stainless', manufacturer: 'Delta', productId: '9159-DST', quantity: 1, sku: '9159-AR-DST', uniqueId: 1738979 });
		expect(navigatorPush).toBeCalledWith('addToProjectModal', 'root');
	});
});
