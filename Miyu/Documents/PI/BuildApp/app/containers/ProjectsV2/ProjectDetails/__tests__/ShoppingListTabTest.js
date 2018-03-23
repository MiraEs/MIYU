jest.mock('BuildNative');
jest.mock('BuildLibrary');
jest.mock('../../../../components/Round', () => 'Round');
jest.mock('../../../../components/TappableListItem', () => 'TappableListItem');
jest.mock('../../../../services/httpClient', () => ({ get: () => Promise.resolve({}) }));
jest.mock('../../../../lib/analytics/TrackingActions', () => ({}));
jest.mock('../../../../lib/styles');
jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');
jest.mock('../../../../components/ShoppingList/ShoppingListSectionItem', () => 'ShoppingListSectionItem');
jest.mock('../../../../lib/styles');
jest.mock('../../../../lib/helpers');
jest.mock('react-redux');
jest.mock('redux');
jest.mock('../../../../reducers/helpers/projectsReducerHelper');
jest.mock('../../../../components/AddToCartButton');
jest.mock('../../../../components/ShoppingList/ShoppingListHeaderName');
jest.mock('../../../../components/ShoppingList/ShoppingListSectionItem');
jest.mock('../../../../actions/AlertActions', () => ({}));
jest.mock('../../../../lib/ShoppingListHelper', () => ({
	processItemsForList: jest.fn(() => ([])),
}));
jest.mock('../../../../lib/SimpleStoreHelpers', () => ({
	setBounceShoppingListRow: jest.fn(),
	shouldBounceShoppingListRow: jest.fn(() => Promise.resolve()),
}));


jest.mock('react-native');

import { ShoppingListTab } from '../ShoppingListTab';
import React from 'react';
import { create } from 'react-test-renderer';
import SimpleStoreHelpers from '../../../../lib/SimpleStoreHelpers';

const defaultProps = {
	actions: {
		addItemsToCartFromProject: jest.fn(() => Promise.resolve()),
		addOrderToProject: jest.fn(),
		createEmptyShoppingList: jest.fn(),
		getShoppingListsForProject: jest.fn(),
		saveShoppingList: jest.fn(),
		resetShoppingListsEditingFlag: jest.fn(),
		updateShoppingList: jest.fn(),
		loadOrders: jest.fn(),
		trackAction: jest.fn(),
	},
	customerId: 0,
	error: '',
	projectId: 1,
	loading: false,
	shoppingLists: [],
	navigators: {
		root: {
			routes: [
				{
					key: '111df600-c1dc-4ec2-a4d7-c03437744615',
					routeName: 'main',
					params: {},
					config: {
						styles: {
							navigationBarAnimations: {},
						},
						navigationBar: {
							visible: false,
							backgroundColor: '#63666A',
							tintColor: '#EBEDEF',
							titleStyle: 88,
						},
						eventEmitter: {
							_subscriber: {
								_subscriptionsForType: {},
								_currentSubscription: null,
							},
							_currentSubscription: null,
						},
					},
				},
			],
			index: 0,
			defaultRouteConfig: {
				styles: {
					navigationBarAnimations: {},
				},
				navigationBar: {
					visible: false,
					backgroundColor: '#63666A',
					tintColor: '#EBEDEF',
					titleStyle: 88,
				},
			},
			type: 'stack',
		},
		main: {
			routes: [
				{
					key: 'home',
				},
				{
					key: 'more',
				},
			],
			index: 1,
			parentNavigatorUID: 'root',
			defaultRouteConfig: {},
			type: 'tab',
		},
		home: {
			routes: [
				{
					key: '87aea2df-3c03-495c-a622-cbd28c0937c3',
					routeName: 'contentHome',
					params: {},
					config: {
						styles: {
							navigationBarAnimations: {},
						},
						navigationBar: {
							visible: true,
							backgroundColor: '#63666A',
							tintColor: '#EBEDEF',
							titleStyle: 88,
						},
						eventEmitter: {
							_subscriber: {
								_subscriptionsForType: {},
								_currentSubscription: null,
							},
							_currentSubscription: null,
						},
					},
				},
			],
			index: 0,
			parentNavigatorUID: 'main',
			defaultRouteConfig: {
				styles: {
					navigationBarAnimations: {},
				},
				navigationBar: {
					visible: true,
					backgroundColor: '#63666A',
					tintColor: '#EBEDEF',
					titleStyle: 88,
				},
			},
			type: 'stack',
		},
		more: {
			routes: [
				{
					key: 'd6954001-341e-42b8-82a7-41a3d5d2762a',
					routeName: 'more',
					params: {},
					config: {
						styles: {
							navigationBarAnimations: {},
						},
						navigationBar: {
							visible: true,
							backgroundColor: '#63666A',
							tintColor: '#EBEDEF',
							titleStyle: 88,
							title: 'More',
						},
						eventEmitter: {
							_subscriber: {
								_subscriptionsForType: {},
								_currentSubscription: null,
							},
							_currentSubscription: null,
						},
					},
				},
				{
					key: 'f8e1a2bf-ea41-476b-8d7c-e4b751498e7d',
					routeName: 'devOptionsScreen',
					params: {},
					config: {
						styles: {
							navigationBarAnimations: {},
						},
						navigationBar: {
							visible: true,
							backgroundColor: '#63666A',
							tintColor: '#EBEDEF',
							titleStyle: 88,
							title: 'Dev Options',
						},
						eventEmitter: {
							_subscriber: {
								_subscriptionsForType: {},
								_currentSubscription: null,
							},
							_currentSubscription: null,
						},
					},
				},
				{
					key: '63ac54bd-1a95-44de-8f42-6ad8d80627d1',
					routeName: 'reduxStore',
					params: {},
					config: {
						styles: {
							navigationBarAnimations: {},
						},
						navigationBar: {
							visible: true,
							backgroundColor: '#63666A',
							tintColor: '#EBEDEF',
							titleStyle: 88,
							title: 'Save to File',
						},
						eventEmitter: {
							_subscriber: {
								_subscriptionsForType: {},
								_currentSubscription: null,
							},
							_currentSubscription: null,
						},
					},
				},
			],
			index: 2,
			parentNavigatorUID: 'main',
			defaultRouteConfig: {
				styles: {
					navigationBarAnimations: {},
				},
				navigationBar: {
					visible: true,
					backgroundColor: '#63666A',
					tintColor: '#EBEDEF',
					titleStyle: 88,
				},
			},
			type: 'stack',
		},
	},
	navigation: {
		getNavigator: jest.fn((name) => {
			const navs = {
				home: {
					popToTop: jest.fn(),
					push: jest.fn(),
				},
			};
			return navs[name];
		}),
		performAction: jest.fn(() => ({
			jumpToTab: jest.fn(),
		})),
	},
};
const listWithItem = [{
	name: 'Test',
	projectId: 1,
	projectShoppingListGroupId: 1,
	shoppingListSessionCartItems: [{
		name: 'test',
		quantityPurchased: 1,
		quantityUnpurchased: 1,
	}],
}];
const listNoItem = [{
	name: 'Test',
	projectId: 1,
	shoppingListSessionCartItems: [],
}];


describe('ShoppingListTab component', () => {
	it('should render with no groups', () => {
		const tree = create(
			<ShoppingListTab {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render a group with an item', () => {
		const tree = create(
			<ShoppingListTab
				{...defaultProps}
				shoppingLists={listWithItem}
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render a group without any item', () => {
		const tree = create(
			<ShoppingListTab
				{...defaultProps}
				shoppingLists={listNoItem}
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

});

describe('ShoppingListTab function tests', () => {
	it('setScreenTrackingInformation', () => {
		const tree = create(
			<ShoppingListTab {...defaultProps} />
		).getInstance().setScreenTrackingInformation();
		expect(tree).toMatchSnapshot();
	});

	it('addOrderToProject', () => {
		const instance = new ShoppingListTab(defaultProps);
		const order = {
			siteName: 'Build',
			orderNumber: 65178518,
			orderStatus: 'cancelled',
			orderDate: 1477177440000,
			itemCount: 2,
			total: 0,
			projectName: null,
			productImage: 'mirabelle/mirabelle_mir3001_roughin.jpg',
			friendlyStatus: {
				id: 42,
				status: 'Cancelled',
				description: 'Your order has been cancelled. This may have been at your request or because the product&#x28;s&#x29; is &#x28;are&#x29; no longer available. The order total will be credited back to you within 72 hours.',
			},
		};
		instance.addOrderToProject(order);
		expect(instance.props.actions.addOrderToProject).toHaveBeenCalledWith({
			order,
			projectId: instance.props.projectId,
			customerId: instance.props.customerId,
		});
	});

	it('addGroup', () => {
		create(
			<ShoppingListTab {...defaultProps} />
		).getInstance().addGroup();
		const instance = new ShoppingListTab(defaultProps);
		instance.setState = jest.fn();
		instance.addGroup();
		expect(instance.setState).toBeCalledWith({
			dataSource: [{
				data: [],
				shoppingList: {
					isEditing: true,
					name: 'My New Group',
					'projectId': 1,
				},
			}],
		});
	});

	describe('validateNewName', () => {
		it('validateNewName with empty list', () => {
			const result = create(
				<ShoppingListTab {...defaultProps} />
			)
				.getInstance()
				.validateNewName({
					name: 'Test',
					projectShoppingListGroupId: 1,
				});
			expect(result).toEqual(true);
		});

		it('validateNewName with a list', () => {
			const result = create(
				<ShoppingListTab
					{...defaultProps}
					shoppingLists={listWithItem}
				/>
			)
				.getInstance()
				.validateNewName({
					name: 'Test',
					projectShoppingListGroupId: 1,
				});
			expect(result).toEqual(true);
		});
	});

	it('getUnpurchasedItems', () => {
		const instance = new ShoppingListTab(defaultProps);
		const shoppingList = {
			shoppingListSessionCartItems: [{
				quantityUnpurchased: 0,
				quantityPurchased: 1,
			}, {
				quantityUnpurchased: 1,
				quantityPurchased: 1,
			}, {
				quantityUnpurchased: 1,
				quantityPurchased: 0,
			}],
		};
		const result = instance.getUnpurchasedItems(shoppingList);
		const expected = [{
			quantityUnpurchased: 1,
			quantityPurchased: 1,
		}, {
			quantityUnpurchased: 1,
			quantityPurchased: 0,
		}];
		expect(result).toEqual(expected);
	});

	it('onPressAddAllToCart', () => {
		const shoppingLists = [
			{
				shoppingListSessionCartItems: [
					{
						quantityUnpurchased: 0,
						quantityPurchased: 1,
					},
					{
						quantityUnpurchased: 1,
						quantityPurchased: 1,
					},
					{
						quantityUnpurchased: 1,
						quantityPurchased: 0,
					},
				],
			},
			{
				shoppingListSessionCartItems: [
					{
						quantityUnpurchased: 0,
						quantityPurchased: 2,
					},
				],
			},
		];
		const instance = new ShoppingListTab({
			...defaultProps,
			shoppingLists,
		});
		instance.onPressAddAllToCart();

		const items = [
			{
				quantityUnpurchased: 1,
				quantityPurchased: 1,
			},
			{
				quantityUnpurchased: 1,
				quantityPurchased: 0,
			},
		];
		expect(instance.props.actions.addItemsToCartFromProject).toHaveBeenCalledWith(defaultProps.projectId, items);
	});

	it('onPressAddGroupToCart', () => {
		const instance = new ShoppingListTab(defaultProps);
		const shoppingList = {
			projectId: 1,
			shoppingListSessionCartItems: [
				{
					quantityUnpurchased: 0,
					quantityPurchased: 1,
				},
				{
					quantityUnpurchased: 1,
					quantityPurchased: 1,
				},
				{
					quantityUnpurchased: 1,
					quantityPurchased: 0,
				},
			],
		};
		instance.onPressAddGroupToCart(shoppingList);
		const items = [
			{
				quantityUnpurchased: 1,
				quantityPurchased: 1,
			},
			{
				quantityUnpurchased: 1,
				quantityPurchased: 0,
			},
		];
		expect(instance.props.actions.addItemsToCartFromProject).toHaveBeenCalledWith(shoppingList.projectId, items);
	});

	it('renderShoppingListFooter', () => {
		const tree = create(
			<ShoppingListTab {...defaultProps} />
		).getInstance().renderShoppingListFooter();
		expect(tree).toMatchSnapshot();
	});

	it('renderAddGroup', () => {
		const tree = create(
			<ShoppingListTab {...defaultProps} />
		).getInstance().renderAddGroup();
		expect(tree).toMatchSnapshot();
	});

	it('generateShoppingListData', () => {
		const instance = new ShoppingListTab(defaultProps);
		const shoppingLists = [
			{
				name: '',
				shoppingListSessionCartItems: [],
			},
			{
				name: 'Test Group',
				shoppingListSessionCartItems: [],
			},
		];
		const result = instance.generateShoppingListData(shoppingLists);
		const expected = [
			{
				data: [],
				shoppingList: {
					name: 'Test Group',
					shoppingListSessionCartItems: [],
				},
				sectionIndex: 0,
			},
			{
				data: [],
				shoppingList: {
					name: '',
					shoppingListSessionCartItems: [],
				},
				sectionIndex: 1,
			},
		];
		expect(result).toEqual(expected);
	});

	it('updateShoppingList', () => {
		const instance = new ShoppingListTab(defaultProps);
		const shoppingList = {
			name: 'my new name',
		};
		instance.updateShoppingListGroup(shoppingList);
		expect(instance.props.actions.updateShoppingList).toHaveBeenCalledWith({
			projectId: defaultProps.projectId,
			shoppingList,
		});
	});

	it('getScreenData', () => {
		const instance = new ShoppingListTab(defaultProps);
		instance.getScreenData();
		expect(instance.props.actions.getShoppingListsForProject).toHaveBeenCalledWith({ projectId: defaultProps.projectId });
	});

	describe('navigateToCategory', () => {
		it('should call navigateToCategory without categoryId', () => {
			const instance = new ShoppingListTab(defaultProps);
			instance.navigateToCategory();
			expect(instance.props.navigation.performAction).toHaveBeenCalled();
		});

		it('should call navigateToCategory with categoryId', () => {
			const instance = new ShoppingListTab(defaultProps);
			instance.navigateToCategory(1);
			expect(instance.props.navigation.performAction).toHaveBeenCalled();
		});
	});
});

describe('lifecycle methods', () => {
	describe('componentWillReceiveProps', () => {
		it('should set state when shoppings lists are not equal', () => {
			const instance = new ShoppingListTab(defaultProps);
			const shoppingLists = [
				{
					name: '',
					shoppingListSessionCartItems: [],
				},
				{
					name: 'Test Group',
					shoppingListSessionCartItems: [],
				},
			];
			instance.setState = jest.fn();
			instance.componentWillReceiveProps({ shoppingLists });
			expect(instance.setState).toHaveBeenCalledWith({
				dataSource: [
					{
						data: [],
						shoppingList: {
							name: 'Test Group',
							shoppingListSessionCartItems: [],
						},
						sectionIndex: 0,
					},
					{
						data: [],
						shoppingList: {
							name: '',
							shoppingListSessionCartItems: [],
						},
						sectionIndex: 1,
					},
				],
			});
		});

		it('should setState is not called when shoppingLists are same', () => {
			const instance = new ShoppingListTab(defaultProps);
			instance.setState = jest.fn();
			instance.componentWillReceiveProps({ shoppingLists: [] });
			expect(instance.setState).not.toHaveBeenCalled();
		});
	});

	describe('componentWillUnmount', () => {
		it('should call resetShoppingListsEditingFlag', () => {
			const instance = new ShoppingListTab(defaultProps);
			instance.componentWillUnmount();
			expect(instance.props.actions.resetShoppingListsEditingFlag).toHaveBeenCalled();
		});

		it('should call SimpleStoreHelpers.setBounceShoppingListRow', () => {
			const instance = create(<ShoppingListTab {...defaultProps} />).getInstance();
			instance.state.bounceShoppingListRowOnMount = true;
			instance.componentWillUnmount();
			expect(SimpleStoreHelpers.setBounceShoppingListRow).toHaveBeenCalled();
		});
	});
});
