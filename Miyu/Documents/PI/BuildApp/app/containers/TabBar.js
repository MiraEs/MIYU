import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	StyleSheet,
	Platform,
} from 'react-native';
import {
	StackNavigation,
	TabNavigation,
	TabNavigationItem,
	withNavigation,
} from '@expo/ex-navigation';
import { Text } from 'build-library';
import {
	HOME,
	CART,
	EXPERTS,
	LISTS,
	MORE,
	PROJECTS,
} from '../constants/constants';
import {
	HOME_TAB,
	CART_TAB,
	EXPERTS_TAB,
} from '../constants/LayoutConstants';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import IconBadge from '../components/IconBadge';
import {
	navigationBarDark,
	navigationBarLight,
} from '../styles/navigationBarStyles';
import router from '../router';
import TabBarIcon from '../components/TabBarIcon';
import styles from '../lib/styles';
import { setComponentMeasurements } from '../actions/LayoutActions';
import EventEmitter from '../lib/eventEmitter';
import helpers from '../lib/helpers';
import isEqual from 'lodash.isequal';

const componentStyles = StyleSheet.create({
	text: {
		marginBottom: 10,
	},
});

@withNavigation
export class TabBar extends Component {

	constructor(props) {
		super(props);

		this.tabIcons = Platform.select({
			ios: {
				home: 'ios-home-outline',
				projects: 'ios-paper-outline',
				cart: 'ios-cart-outline',
				experts: 'ios-help-circle-outline',
				more: 'ios-contact-outline',
			},
			android: {
				home: 'md-home',
				projects: 'md-list-box',
				cart: 'md-cart',
				experts: 'md-help-circle',
				more: 'md-contact',
			},
		});

		this.selectedTabIcons = Platform.select({
			ios: {
				home: 'ios-home',
				projects: 'ios-paper',
				cart: 'ios-cart',
				experts: 'ios-help-circle',
				more: 'ios-contact',
			},
			android: {
				home: 'md-home',
				projects: 'md-list-box',
				cart: 'md-cart',
				experts: 'md-help-circle',
				more: 'md-contact',
			},
		});

		this.state = {
			tabs: this.generateTabs(props),
		};
	}

	componentDidMount() {
		const { setComponentMeasurements } = this.props.actions;
		setComponentMeasurements(this.getTabLocations(HOME_TAB, 1));
		setComponentMeasurements(this.getTabLocations(EXPERTS_TAB, 2));
		setComponentMeasurements(this.getTabLocations(CART_TAB, 3));
	}

	componentWillReceiveProps(nextProps) {
		const shoppingListsChanged = this.props.shoppingLists !== nextProps.shoppingLists;
		const projectsChanged = this.props.projects !== nextProps.projects;
		const cartCountHasChanged = this.props.headerProps && nextProps.headerProps && this.props.headerProps.cartCount !== nextProps.headerProps.cartCount;
		const notificationCountHasChanged = this.props.notificationCount !== nextProps.notificationCount;
		if (shoppingListsChanged || projectsChanged || cartCountHasChanged || notificationCountHasChanged) {
			this.setState({ tabs: this.generateTabs(nextProps) });
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		return !isEqual(nextState.tabs, this.state.tabs);
	}

	getToolbarIconColor = (selected) => {
		if (selected) {
			return styles.colors.primary;
		}
		return styles.colors.secondary;
	};

	getToolbarIcon = (iconName, selected) => {
		if (selected) {
			return this.selectedTabIcons[iconName];
		}
		return this.tabIcons[iconName];
	};

	generateTabs = (props) => {
		const tabs = [
			this.getHomeTab(),
		];

		if (props.shoppingLists && !props.projects) {
			tabs.push(this.getProjectsTab(props));
		}

		return [
			...tabs,
			this.getCartTab(),
			this.getHelpTab(),
			this.getMoreTab(),
		];
	};

	onTabPress = (selectTab, tab) => {
		EventEmitter.emit('tabPress', tab);
		selectTab();

		const { navigation } = this.props;
		// when clicked on a tab we want to start from the initial route
		if (navigation) {
			navigation.performAction(({ stacks }) => {
				const tabNavigator = navigation.navigationState.navigators[tab];
				if (tabNavigator && tabNavigator.index !== 0 && this.props.selectedTab === tab) {
					stacks(tab).popToTop();
				}
			});
		}
	};

	getTabLocations = (componentName, tabNumber) => {
		return {
			componentName,
			measurements: {
				height: 30,
				width: 39,
				y: 22,
				x: styles.dimensions.width * (tabNumber / 4) - (styles.dimensions.width / 5),
			},
		};
	};

	getHomeTab = () => {
		return (
			<TabNavigationItem
				accessibilityLabel={`${HOME}-tab`}
				key={HOME}
				id={HOME}
				title="Shop"
				renderTitle={this.renderTabBarTitle}
				onPress={(selectTab) => this.onTabPress(selectTab, HOME)}
				renderIcon={(selected) => {
					return (
						<TabBarIcon
							size={22}
							topOffset={5}
							color={this.getToolbarIconColor(selected)}
							name={this.getToolbarIcon(HOME, selected)}
						/>
					);
				}}
			>
				<StackNavigation
					initialRoute={router.getRoute(this.props.contentHomeScreen ? 'contentHome' : 'home')}
					id={HOME}
					navigatorUID={HOME}
					defaultRouteConfig={{
						navigationBar: this.getDefaultNavigationBarConfig(),
					}}
				/>
			</TabNavigationItem>
		);
	};

	getHelpTab = () => {
		return (
			<TabNavigationItem
				accessibilityLabel="experts-tab"
				key="experts"
				id="experts"
				title="Help"
				renderTitle={this.renderTabBarTitle}
				onPress={(selectTab) => this.onTabPress(selectTab, EXPERTS)}
				renderIcon={(selected) => {
					return (
						<TabBarIcon
							size={22}
							topOffset={5}
							color={this.getToolbarIconColor(selected)}
							name={this.getToolbarIcon(EXPERTS, selected)}
						/>
					);
				}}
			>
				<StackNavigation
					initialRoute={router.getRoute('help')}
					id="experts"
					navigatorUID="experts"
					defaultRouteConfig={{
						navigationBar: this.getDefaultNavigationBarConfig(),
					}}
				/>
			</TabNavigationItem>
		);
	};

	getCartTab = () => {
		return (
			<TabNavigationItem
				accessibilityLabel="cart-tab"
				key="cart"
				id="cart"
				title="Cart"
				renderTitle={this.renderTabBarTitle}
				renderBadge={() => {
					return (
						<IconBadge
							badgeCount={this.props.headerProps.cartCount}
							style={styles.elements.badgeIconPosition}
							isHiddenWhenNoCount={true}
						/>
					);
				}}
				renderIcon={(selected) => {
					return (
						<TabBarIcon
							size={22}
							topOffset={5}
							color={this.getToolbarIconColor(selected)}
							name={this.getToolbarIcon(CART, selected)}
						/>
					);
				}}
				onPress={() => this.props.navigation.getNavigator('root').push('cartScreen')}
			/>
		);
	};

	getMoreTab = () => {
		return (
			<TabNavigationItem
				accessibilityLabel="more-tab"
				key="more"
				id="more"
				title="Account"
				renderTitle={this.renderTabBarTitle}
				onPress={(selectTab) => this.onTabPress(selectTab, MORE)}
				renderBadge={() => {
					return (
						<IconBadge
							badgeCount={this.props.notificationCount}
							style={styles.elements.badgeIconPosition}
							isHiddenWhenNoCount={true}
						/>
					);
				}}
				renderIcon={(selected) => {
					return (
						<TabBarIcon
							size={22}
							topOffset={5}
							color={this.getToolbarIconColor(selected)}
							name={this.getToolbarIcon(MORE, selected)}
						/>
					);
				}}
			>
				<StackNavigation
					initialRoute={router.getRoute('more')}
					id="more"
					navigatorUID="more"
					defaultRouteConfig={{
						navigationBar: this.getDefaultNavigationBarConfig(),
					}}
				/>
			</TabNavigationItem>
		);
	};

	getProjectsTab = () => {
		return (
			<TabNavigationItem
				accessibilityLabel={`${LISTS}-tab`}
				key={LISTS}
				id={LISTS}
				title="Lists"
				renderTitle={this.renderTabBarTitle}
				onPress={(selectTab) => this.onTabPress(selectTab, LISTS)}
				renderIcon={(selected) => {
					return (
						<TabBarIcon
							size={helpers.isIOS() ? 20 : 22}
							topOffset={helpers.isIOS() ? 6 : 5}
							color={this.getToolbarIconColor(selected)}
							name={this.getToolbarIcon(PROJECTS, selected)}
						/>
					);
				}}
			>
				<StackNavigation
					initialRoute={router.getRoute('listsOverviewScreen')}
					id={LISTS}
					navigatorUID={LISTS}
					defaultRouteConfig={{
						navigationBar: this.getDefaultNavigationBarConfig(),
					}}
				/>
			</TabNavigationItem>
		);
	};

	getDefaultNavigationBarConfig = () => {
		return Platform.select({
			ios: navigationBarLight,
			android: navigationBarDark,
		});
	};

	renderTabBarTitle = (selected, title) => {
		return (
			<Text
				color={selected ? 'primary' : 'secondary'}
				size="small"
				lineHeight={Text.sizes.small}
				style={componentStyles.text}
			>
				{title}
			</Text>
		);
	};

	render() {
		return (
			<TabNavigation
				initialTab={HOME}
				id="main"
				navigatorUID="main"
				tabBarHeight={styles.dimensions.tapSizeMedium}
			>
				{this.state.tabs}
			</TabNavigation>
		);
	}

}

TabBar.propTypes = {
	actions: PropTypes.shape({
		setComponentMeasurements: PropTypes.func,
	}),
	contentHomeScreen: PropTypes.bool,
	headerProps: PropTypes.shape({
		cartCount: PropTypes.number,
	}),
	navigation: PropTypes.shape({
		getNavigator: PropTypes.func,
	}),
	notificationCount: PropTypes.number,
	projects: PropTypes.bool,
	selectedTab: PropTypes.string,
	shoppingLists: PropTypes.bool,
};

const mapStateToProps = ({
	cartReducer,
	featuresReducer,
	layoutReducer,
	notificationReducer,
}) => {
	return {
		headerProps: {
			cartCount: cartReducer.cart.quantity || 0,
		},
		notificationCount: notificationReducer.notificationCount || 0,
		contentHomeScreen: featuresReducer.features.contentHomeScreen,
		selectedTab: layoutReducer.selectedTab,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			setComponentMeasurements,
		}, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(TabBar);
