import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	SectionList,
	StyleSheet,
	View,
} from 'react-native';
import {
	Button,
	KeyboardSpacer,
	ScrollView,
	Text,
	withScreen,
} from 'BuildLibrary';
import styles from '../../../lib/styles';
import helpers from '../../../lib/helpers';
import { MockScrollView } from '../../../lib/MockedComponents';
import {
	HOME,
	TEMPLATE_ORDER,
} from '../../../constants/constants';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import TrackingActions from '../../../lib/analytics/TrackingActions';
import { trackAction } from '../../../actions/AnalyticsActions';
import Round from '../../../components/Round';
import TappableListItem from '../../../components/TappableListItem';
import Icon from 'react-native-vector-icons/Ionicons';
import {
	addItemsToCartFromProject,
	createEmptyShoppingList,
	deleteGroup,
	getShoppingListsForProject,
	updateShoppingList,
	resetShoppingListsEditingFlag,
} from '../../../actions/ProjectActions';
import { withNavigation } from '@expo/ex-navigation';
import AddToCartButton from '../../../components/AddToCartButton';
import ShoppingListHeaderName from '../../../components/ShoppingList/ShoppingListHeaderName';
import ShoppingListSectionItem from '../../../components/ShoppingList/ShoppingListSectionItem';
import { showAlert } from '../../../actions/AlertActions';
import isEqual from 'lodash.isequal';
import { processItemsForList } from '../../../lib/ShoppingListHelper';
import { addOrderToProject } from '../../../actions/ProjectEventActions';
import SimpleStoreHelpers from '../../../lib/SimpleStoreHelpers';

const componentStyles = StyleSheet.create({
	tab: {
		width: styles.dimensions.width,
	},
	horizontalRule: {
		borderBottomWidth: styles.dimensions.borderWidth,
		borderBottomColor: styles.colors.primary,
		width: 60,
		marginVertical: styles.measurements.gridSpace1,
	},
	addGroupButton: {
		margin: styles.measurements.gridSpace1,
		alignItems: 'flex-start',
	},
	addGroupIcon: {
		marginRight: styles.measurements.gridSpace1,
	},
	addOrderWrapper: {
		backgroundColor: styles.colors.white,
		marginTop: styles.measurements.gridSpace2,
	},
	addOrderText: {
		borderBottomWidth: styles.dimensions.borderWidth,
		borderBottomColor: styles.colors.greyLight,
		paddingHorizontal: styles.measurements.gridSpace2,
		paddingVertical: styles.measurements.gridSpace1,
	},
	dialogWrapper: {
		borderWidth: styles.dimensions.borderWidth,
		borderColor: styles.colors.grey,
		alignItems: 'center',
		backgroundColor: styles.colors.primaryLight,
		padding: styles.measurements.gridSpace2,
		marginHorizontal: styles.measurements.gridSpace1,
	},
	dialogButtonsWrapper: {
		flexDirection: 'row',
		flex: 1,
	},
	dialogButtons: {
		flex: 1,
		marginTop: styles.measurements.gridSpace2,
	},
	button: {
		marginBottom: styles.measurements.gridSpace1,
	},
	shoppingListFooter: {
		paddingVertical: styles.measurements.gridSpace2,
		paddingHorizontal: styles.measurements.gridSpace1,
		backgroundColor: styles.colors.white,
	},
	footerEstimatedTotalWrapper: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-end',
		marginBottom: styles.measurements.gridSpace2,
	},
	defaultSectionSeparator: {
		height: styles.measurements.gridSpace1,
	},
	sectionSeparator: {
		height: styles.measurements.gridSpace1,
		borderTopWidth: styles.dimensions.borderWidth,
		borderColor: styles.colors.greyDark,
	},
});

const DEFAULT_NAME = 'My New Group';

export class ShoppingListTab extends Component {

	constructor(props) {
		super(props);

		this.scroll = new MockScrollView();

		const { shoppingLists = [] } = props;
		this.state = {
			dataSource: this.generateShoppingListData(shoppingLists),
			addAllToCartEnabled: true,
			groupsToCollapse: {},
			waitForSimpleStore: true,
			bounceShoppingListRowOnMount: false,
		};

		SimpleStoreHelpers.shouldBounceShoppingListRow()
			.then((shouldBounce) => {
				this.setState({
					waitForSimpleStore: false,
					// first time shouldBounce will be null
					bounceShoppingListRowOnMount: shouldBounce === null ? true : shouldBounce,
				});
			})
			.catch(helpers.noop)
			.done();
	}

	componentWillReceiveProps({ shoppingLists = [] }) {
		// check to see if an outside action (like opening the Add to Project modal)
		// has wiped out the data for this screen and reload it, if necessary
		const { shoppingLists: oldShoppingLists = [] } = this.props;
		const oldPropsHadShoppingListData = oldShoppingLists.reduce((prev, list = {}) => {
			return prev || list.hasOwnProperty('shoppingListSessionCartItems');
		}, false);
		const nextPropsHasShoppingListData = shoppingLists.reduce((prev, list = {}) => {
			return prev || list.hasOwnProperty('shoppingListSessionCartItems');
		}, false);
		if (oldPropsHadShoppingListData && !nextPropsHasShoppingListData) {
			this.getScreenData();
		}


		if (!isEqual(this.props.shoppingLists, shoppingLists)) {
			this.setState({
				dataSource: this.generateShoppingListData(shoppingLists),
			});
		}
	}

	componentWillUnmount() {
		const { actions, projectId} = this.props;
		actions.resetShoppingListsEditingFlag({ projectId });

		if (this.state.bounceShoppingListRowOnMount) {
			SimpleStoreHelpers.setBounceShoppingListRow(false);
		}
	}

	setScreenTrackingInformation() {
		return {
			name: 'build:app:projects:details:shoppinglist',
		};
	}

	getScreenData = () => {
		this.props.actions.getShoppingListsForProject({ projectId: this.props.projectId });
	};

	generateShoppingListData = (shoppingLists) => {
		let defaultShoppingListIndex = -1;
		const filteredShoppingLists = shoppingLists.filter((shoppingList, index) => {
			if (!shoppingList.name) {
				defaultShoppingListIndex = index;
			}
			return shoppingList.name;
		});

		// push the default group at the end of the list
		if (defaultShoppingListIndex !== -1) {
			filteredShoppingLists.push(shoppingLists[defaultShoppingListIndex]);
		}

		const sections = [];
		filteredShoppingLists.forEach((shoppingList, index) => {
			const { shoppingListSessionCartItems = [] } = shoppingList;
			sections.push({
				shoppingList,
				data: shoppingListSessionCartItems ? processItemsForList(shoppingListSessionCartItems) : [],
				sectionIndex: index,
			});
		});
		return sections;
	};

	addOrderToProject = (order) => {
		const data = {
			order,
			projectId: this.props.projectId,
			customerId: this.props.customerId,
		};

		this.props.actions.addOrderToProject(data);
	};

	hasShoppingLists = () => {
		const { dataSource = [] } = this.state;
		return dataSource.reduce(
			(prev, { data = [], shoppingList: { name } = {} } = {}) => prev || !!name || !!data.length,
			false
		);
	};

	openOrderSelector = () => {
		const { orders, actions } = this.props;
		actions.trackAction(TrackingActions.SHOPPING_LIST_VIEW_ALL_ORDERS_TAP);
		this.props.navigation.getNavigator('root').push('listSelector', {
			title: 'Add Order',
			list: orders,
			listItemText: 'orderNumber',
			template: TEMPLATE_ORDER,
			showCancelButton: false,
			onSelectItem: this.addOrderToProject,
			tracking: {
				name: TrackingActions.SHOPPING_LIST_VIEW_ORDERS,
			},
		});
	};

	addGroup = () => {
		const { projectId } = this.props;
		const newGroup = {
			data: [],
			shoppingList: {
				name: DEFAULT_NAME,
				isEditing: true,
				projectId,
			},
		};
		const sections = [newGroup, ...this.state.dataSource];
		this.setState({ dataSource: sections });
	};

	navigateToCategory = (categoryId) => {
		const { index, routes } = this.props.navigators[HOME];
		const { params = {} } = routes[index];
		const home = this.props.navigation.getNavigator(HOME);

		if (!categoryId) {
			home.popToTop();
		} else if (params.categoryId !== categoryId) {
			home.push('category', {
				categoryId,
			});
		}

		this.props.navigation.performAction(({ tabs }) => tabs('main').jumpToTab(HOME));
	};

	updateShoppingListGroup = (shoppingList) => {
		const { actions, projectId } = this.props;
		return actions.updateShoppingList({ projectId, shoppingList });
	};

	validateNewName = (projectShoppingListGroupId, newName = '') => {
		const { shoppingLists } = this.props;
		const listsWithSameName = shoppingLists.filter((list) => {
			const { name = '' } = list;
			return (name === null ? name : name.trim()) === newName.trim() &&
				list.projectShoppingListGroupId !== projectShoppingListGroupId;
		});
		return !listsWithSameName.length || `You already have a list named ${newName}`;
	};

	getUnpurchasedItems = (shoppingList) => {
		const unpurchasedSubItems = [];
		const unpurchasedItems = shoppingList.shoppingListSessionCartItems.filter((shoppingListItem) => {
			if (shoppingListItem.hasSubItems) {
				const filteredSubItems = shoppingListItem.subItems.filter((subItem) => {
					return subItem.quantityUnpurchased;
				});
				if (filteredSubItems && filteredSubItems.length) {
					filteredSubItems.forEach((filteredSubItem) => {
						if (!filteredSubItem.parentUniqueId) {
							// need this to add subitem to cart
							filteredSubItem.parentUniqueId = shoppingListItem.product.uniqueId;
						}
					});
					unpurchasedSubItems.push(...filteredSubItems);
				}
			}
			return shoppingListItem.quantityUnpurchased;
		});
		return unpurchasedItems.concat(unpurchasedSubItems);
	};

	onPressAddAllToCart = () => {
		const { actions, projectId, shoppingLists } = this.props;
		const items = [];
		shoppingLists.forEach((shoppingList) => {
			const shoppingItems = this.getUnpurchasedItems(shoppingList);
			items.push(...shoppingItems);
		});
		actions.trackAction(TrackingActions.SHOPPING_LIST_ADD_ALL_TO_CART_TAP);
		actions.addItemsToCartFromProject(projectId, items).done();
	};

	onPressAddGroupToCart = (shoppingList) => {
		const items = this.getUnpurchasedItems(shoppingList);
		this.props.actions.addItemsToCartFromProject(shoppingList.projectId, items).done();
	};

	renderAddGroup = () => {
		return (
			<Button
				accessibilityLabel="Add a Group"
				color="white"
				onPress={this.addGroup}
				style={componentStyles.addGroupButton}
				trackAction={TrackingActions.SHOPPING_LIST_ADD_GROUP}
			>
				<View style={styles.elements.centeredFlexRow}>
					<Round
						backgroundColor={styles.colors.primary}
						diameter={16}
						style={componentStyles.addGroupIcon}
					>
						<Icon
							name="ios-medical"
							size={11}
							color={styles.colors.white}
						/>
					</Round>
					<Text
						weight="bold"
					>Add a Group </Text><Text
						style={styles.elements.flex}
					>
						(Kitchen, Lighting, etc.)
					</Text>
				</View>
			</Button>
		);
	};

	renderScreenContent = () => {
		if (this.hasShoppingLists()) {
			return this.renderShoppingList();
		}

		return (
			<View>
				{this.renderAddGroup()}
				{this.renderShoppingListDialog()}
			</View>
		);
	};

	renderSectionSeparator = ({ leadingItem }) => {
		if (leadingItem) {
			return (
				<View style={componentStyles.sectionSeparator} />
			);
		}

		return null;
	};

	renderAddOrder = () => {
		if (this.props.orders && this.props.orders.length) {
			return (
				<View style={componentStyles.addOrderWrapper}>
					<View style={componentStyles.addOrderText}>
						<Text>Already placed an order you'd like to add to this project?</Text>
					</View>
					<TappableListItem
						onPress={this.openOrderSelector}
						body="View All Orders"
						accessibilityLabel="View All Orders"
					/>
				</View>
			);
		}
	};

	renderShoppingListDialog = () => {
		return (
			<View style={componentStyles.dialogWrapper}>
				<Icon
					name={helpers.getIcon('list-box')}
					size={30}
					color={styles.colors.primary}
				/>
				<Text weight="bold">Add Products</Text>
				<Text
					family="archer"
					size="large"
				>
					Shared Shopping List
				</Text>
				<View style={componentStyles.horizontalRule} />
				<Text textAlign="center">
					Find the products you'd like to add by searching for it's name or SKU#.
					Tap <Text weight="bold">
						Add to Project
					</Text> from any product page. Use the quick
					links below to begin!
				</Text>
				<View style={componentStyles.dialogButtonsWrapper}>
					<View style={componentStyles.dialogButtons}>
						<Button
							accessibilityLabel="Bathroom"
							onPress={() => this.navigateToCategory(108412)}
							style={componentStyles.button}
							text="Bathroom"
							trackAction={TrackingActions.SHOPPING_LIST_CATEGORY_TAP}
							trackContextData={{
								categoryId: 108412,
								categoryName: 'Bathroom',
							}}
						/>
						<Button
							accessibilityLabel="Kitchen"
							onPress={() => this.navigateToCategory(108413)}
							style={componentStyles.button}
							text="Kitchen"
							trackAction={TrackingActions.SHOPPING_LIST_CATEGORY_TAP}
							trackContextData={{
								categoryId: 108413,
								categoryName: 'Kitchen',
							}}
						/>
						<Button
							accessibilityLabel="Hardware"
							onPress={() => this.navigateToCategory(108415)}
							style={componentStyles.button}
							text="Hardware"
							trackAction={TrackingActions.SHOPPING_LIST_CATEGORY_TAP}
							trackContextData={{
								categoryId: 108415,
								categoryName: 'Hardware',
							}}
						/>
						<Button
							accessibilityLabel="Shop More"
							onPress={() => this.navigateToCategory()}
							text="Shop More"
							trackAction={TrackingActions.SHOPPING_LIST_CATEGORY_TAP}
						/>
					</View>
				</View>
			</View>
		);
	};

	renderShoppingListFooter = () => {
		const { shoppingLists = [] } = this.props;
		const estimatedTotal = shoppingLists.reduce((prevValue, list = {}) => {
			const {
				sessionCart: {
					subTotal = 0,
				} = {},
			} = list;
			return prevValue + subTotal;
		}, 0);
		return (
			<View style={componentStyles.shoppingListFooter}>
				<View style={componentStyles.footerEstimatedTotalWrapper}>
					<Text weight="bold">Estimated Total</Text>
					<Text
						color="primary"
						size="large"
						weight="bold"
					>
						{helpers.toUSD(estimatedTotal)}
					</Text>
				</View>
				<AddToCartButton
					ref={(ref) => {
						if (ref) {
							this.addToCartButton = ref;
						}
					}}
					style={componentStyles.addToCartButton}
					text="Add All To Cart"
					disabled={!this.state.addAllToCartEnabled}
					onPress={this.onPressAddAllToCart}
				/>
			</View>
		);
	};

	renderShoppingList = () => {
		return (
			<SectionList
				renderItem={(info) => {
					const { item, index, section: { shoppingList, sectionIndex }} = info;
					const { waitForSimpleStore } = this.state;
					if (this.state.groupsToCollapse[shoppingList.projectShoppingListGroupId] || waitForSimpleStore) {
						return null;
					}
					return (
						<ShoppingListSectionItem
							onUpdateItem={this.getScreenData}
							parentItem={item}
							shoppingList={shoppingList}
							bounceOnMount={sectionIndex === 0 && index === 0 && this.state.bounceShoppingListRowOnMount}
						/>
					);
				}}
				renderSectionHeader={({ section }) => {
					const { shoppingList } = section;

					// hide header if default group
					if (!shoppingList.name) {
						return <View style={componentStyles.defaultSectionSeparator}/>;
					}

					const hasItems = shoppingList.shoppingListSessionCartItems
						&& shoppingList.shoppingListSessionCartItems.length;
					return (
						<ShoppingListHeaderName
							isEditing={shoppingList.isEditing}
							isNew={!shoppingList.projectShoppingListGroupId}
							isSectionEmpty={!hasItems}
							name={shoppingList.name}
							onBlur={() => {
								if (!shoppingList.projectShoppingListGroupId) {
									this.setState((prevState) => {
										const [, ...rest] = prevState.dataSource;
										return {
											dataSource: rest,
										};
									});
								}
							}}
							onSaveName={(name) => this.updateShoppingListGroup({
								...shoppingList,
								name,
							})}
							scrollHandle={this.scroll}
							validateNewName={() => this.validateNewName(shoppingList.projectShoppingListGroupId)}
							onSendGroupToCartPress={() => {
								this.onPressAddGroupToCart(shoppingList);
							}}
							onDeleteGroupPress={() => {
								if (hasItems) {
									this.props.actions.showAlert('Please remove all the products before deleting.', 'warning');
								} else {
									this.props.actions.deleteGroup(shoppingList.projectShoppingListGroupId, shoppingList.projectId)
										.catch(() => this.props.actions.showAlert('Failed to delete the group.', 'error'))
										.done();
								}
							}}
							onCollapse={(collapse) => {
								const groupsToCollapse = {...this.state.groupsToCollapse};
								groupsToCollapse[shoppingList.projectShoppingListGroupId] = collapse;
								this.setState({ groupsToCollapse });
							}}
						/>
					);
				}}
				sections={this.state.dataSource}
				keyExtractor={(item, index) => `${item.itemKey}-${index}`}
				extraData={this.state.groupsToCollapse}
				ListHeaderComponent={this.renderAddGroup}
				ListFooterComponent={this.renderShoppingListFooter}
				ListEmptyComponent={this.renderShoppingListDialog}
				SectionSeparatorComponent={this.renderSectionSeparator}
			/>
		);
	};

	render() {
		return (
			<ScrollView
				ref={(c) => {
					if (c) {
						this.scroll = c;
					}
				}}
				style={[styles.elements.screenGreyLight, componentStyles.tab]}
			>
				{this.renderScreenContent()}
				{this.renderAddOrder()}
				<KeyboardSpacer/>
			</ScrollView>
		);
	}
}

ShoppingListTab.displayName = 'Shopping List Tab';

ShoppingListTab.propTypes = {
	actions: PropTypes.object.isRequired,
	customerId: PropTypes.number,
	error: PropTypes.string.isRequired,
	projectId: PropTypes.number.isRequired,
	projectName: PropTypes.string,
	loading: PropTypes.bool.isRequired,
	navigation: PropTypes.shape({
		getNavigator: PropTypes.func,
		performAction: PropTypes.func,
	}),
	navigators: PropTypes.object,
	orders: PropTypes.array,
	shoppingLists: PropTypes.array,
};

ShoppingListTab.defaultProps = {};

const mapStateToProps = (state, props) => {
	const project = state.projectsReducer.shoppingLists.find((project) => project.project.id === props.projectId);
	const projectName = project ? project.project.name : '';
	const projectOrders = state.ordersReducer.orders.filter((order) => {
		const shouldKeep = !order.projectName || order.projectName === projectName;
		if (shouldKeep) {
			order.total = order.total.toString();
			order.orderDate = helpers.getDateStrictFormat(order.orderDate).toString();
			order.selected = order.projectName === projectName;
		}
		return shouldKeep;
	});
	return {
		customerId: state.userReducer.user.customerId,
		error: state.projectsReducer.error,
		loadError: state.teamReducer.error,
		loading: state.projectsReducer.loadingShoppingLists,
		navigators: state.navigation.navigators,
		projectName: project ? project.project.name : '',
		shoppingLists: project ? project.shoppingLists : [],
		orders: projectOrders,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			addItemsToCartFromProject,
			addOrderToProject,
			createEmptyShoppingList,
			deleteGroup,
			getShoppingListsForProject,
			resetShoppingListsEditingFlag,
			showAlert,
			trackAction,
			updateShoppingList,
		}, dispatch),
	};
};

export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(withScreen(ShoppingListTab)));
