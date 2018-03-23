import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import {
	View,
	StyleSheet,
	LayoutAnimation,
} from 'react-native';
import animations from '../lib/animations';
import styles from '../lib/styles';
import helpers from '../lib/helpers';
import TappableListItem from '../components/TappableListItem';
import EventEmitter from '../lib/eventEmitter';
import ListHeader from '../components/listHeader';
import Avatar from '../components/Avatar';
import { Device } from 'BuildNative';
import {
	Text,
	ListView,
	Button,
	withScreen,
} from 'BuildLibrary';
import { signUserOut } from '../actions/UserActions';
import {
	clearSessionCart,
	copySessionCart,
} from '../actions/CartActions';
import { setComponentMeasurements } from '../actions/LayoutActions';
import {
	ORDERS_BUTTON,
	ACCOUNT_DETAILS_BUTTON,
} from '../constants/LayoutConstants';
import { connect } from 'react-redux';
import TrackingActions from '../lib/analytics/TrackingActions';
import {
	getUnacknowledgedNotificationCount,
} from '../actions/NotificationActions';
import { trackState } from '../actions/AnalyticsActions';
import cloneDeep from 'lodash.clonedeep';

const componentStyles = StyleSheet.create({
	container: {
		backgroundColor: styles.colors.lightGray,
	},
	headerBox: {
		padding: styles.measurements.gridSpace2,
		backgroundColor: styles.colors.white,
		borderBottomColor: styles.colors.iOSDivider,
		borderBottomWidth: styles.dimensions.borderWidth,
	},
	headerText: {
		paddingVertical: styles.measurements.gridSpace1,
	},
	buttonRow: {
		flexDirection: 'row',
		justifyContent: 'center',
	},
	primaryButton: {
		marginRight: styles.measurements.gridSpace1,
	},
	avatar: {
		marginRight: styles.measurements.gridSpace1,
	},
	logoutButton: {
		width: 200,
		alignSelf: 'center',
	},
});

export class MoreScreen extends Component {

	constructor(props) {
		super(props);

		this.ds = new ListView.DataSource({
			rowHasChanged: (r1, r2) => r1 !== r2,
			sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
		});
	}

	componentWillMount() {
		const { actions, isLoggedIn } = this.props;
		if (isLoggedIn) {
			actions.getUnacknowledgedNotificationCount().catch(helpers.noop).done();
		}
	}

	componentWillReceiveProps(nextProps) {
		if (!this.props.scrollToTop && nextProps.scrollToTop) {
			this.actionsList.scrollTo({ y: 0 });
		}
	}

	setScreenTrackingInformation() {
		return {
			name: 'build:app:more',
		};
	}

	goToOrders = () => {
		this.props.navigator.push('orders');
	};

	goToProjects = () => {
		this.props.navigator.push('projects');
	};

	goToReturns = () => {
		this.props.navigator.push('returns');
	};

	goToLookback = () => {
		this.props.navigator.push('lookback');
	};

	afterSignOut = () => {
		LayoutAnimation.configureNext(animations.fadeIn);
		if (helpers.isAndroid() && this.actionsList) {
			this.actionsList.scrollTo({ y: 0 });
		}
	};

	signOut = () => {
		const { sessionCartId, sessionCartItems } = this.props.cart;
		const { clearSessionCart, copySessionCart, signUserOut } = this.props.actions;
		const signOutAction = () => signUserOut(() => this.afterSignOut());
		if (sessionCartId) {
			let cartAction = clearSessionCart;
			if (sessionCartItems.length) {
				cartAction = () => copySessionCart({ sessionCartId });
			}
			cartAction().catch(helpers.noop).done(signOutAction);
		} else {
			signOutAction();
		}
	};

	managePushNotifications = () => {
		this.props.navigator.push('pushNotificationSettings');
	};

	showDevOptions = () => {
		this.props.navigator.push('devOptionsScreen');
	};

	goToNotifications = () => {
		EventEmitter.emit('hideNavigatorRightButton');
		this.props.navigator.push('notifications', {
			isHidden: this.hideMarkAllReadButton,
		});
	};

	hideMarkAllReadButton = () => {
		return !this.props.notificationCount;
	};

	goToFavorites = () => {
		this.props.navigator.push('favorites');
	};

	goToAccountDetails = () => {
		this.props.navigator.push('accountDetails');
	};

	handleItemPress = (action) => {
		const { isLoggedIn } = this.props;
		const { allowGuest, onPress, text } = action;
		if (!isLoggedIn && !allowGuest) {
			if (text === 'Notifications') {
				// We are purposely sending users to notifications settings. In future, we are removing settings screen
				// from More screen and adding a link to settings through Notifications screen
				this['managePushNotifications'].call(this);
			} else {
				this.login('LOGIN', this[onPress].bind(this));
			}
		} else {
			this[onPress].call(this);
		}
	};

	measureComponent = (componentName) => {
		if (componentName) {
			helpers.measureComponentByRef(this[componentName], (measurements) => {
				this.props.actions.setComponentMeasurements({
					componentName,
					measurements,
				});
			});
		}
	};

	renderAction = (action) => {
		const { text, icon, style, accessibilityLabel, measure, leadIcon } = action;
		if (action.disabled && action.disabled()) {
			return null;
		}
		let badgeCount = 0;
		if (text === 'Notifications') {
			badgeCount = this.props.notificationCount;
		}
		return (
			<TappableListItem
				ref={measure ? (ref) => this[measure] = ref : null}
				onLayout={() => this.measureComponent(measure)}
				onPress={() => this.handleItemPress(action)}
				body={text}
				icon={icon}
				style={style}
				accessibilityLabel={accessibilityLabel}
				badgeCount={badgeCount}
				leadIcon={leadIcon}
			/>
		);
	};

	renderSectionHeader = (data, sectionId) => {
		const sectionHeaders = {
			account: 'Account',
			info: 'General Info',
		};
		return (
			<ListHeader
				text={sectionHeaders[sectionId]}
				accessibilityLabel={`MoreScreenSection${sectionId}`}
			/>);
	};

	login = (initialScreen = 'LOGIN') => {
		this.props.navigation.getNavigator('root').push('loginModal', {
			initialScreen,
			loginSuccess: () => {
				this.props.navigation.getNavigator('root').pop();
			},
		});
	};

	renderHeader = () => {
		const { isLoggedIn, customer } = this.props;
		if (isLoggedIn) {
			return (
				<View
					style={[componentStyles.headerBox, styles.elements.row]}
				>
					<Avatar
						size="large"
						url={customer && customer.apiUser ? customer.apiUser.avatar : ''}
						fullName={`${customer.firstName} ${customer.lastName}`}
						firstName={customer.firstName}
						lastName={customer.lastName}
						style={componentStyles.avatar}
						accessibilityLabel="Avatar"
					/>
					<Text accessibilityLabel="More Screen Greeting">Hello, {customer.firstName}</Text>
				</View>
			);
		} else if (!this.props.tutorialMode) {
			return (
				<View
					style={componentStyles.headerBox}
				>
					<Text
						textAlign="center"
						style={componentStyles.headerText}
					> Log in or sign up to access your {'\n'}
						account information.</Text>
					<View
						style={componentStyles.buttonRow}
					>
						<Button
							onPress={() => this.login()}
							style={[styles.elements.flex1, componentStyles.primaryButton]}
							text="Login"
							color="primary"
							accessibilityLabel="Login Button"
							trackAction={TrackingActions.MORE_LOGIN}
						/>
						<Button
							onPress={() => this.login('SIGNUP')}
							style={styles.elements.flex1}
							text="Sign Up"
							color="primary"
							accessibilityLabel="Sign Up Button"
							trackAction={TrackingActions.MORE_SIGN_UP}
						/>
					</View>
				</View>
			);
		}
		return null;
	};

	getMenuActions = () => {
		return {
			'account': [{
				text: 'Notifications',
				onPress: 'goToNotifications',
				accessibilityLabel: 'Notifications',
			}, {
				text: 'Projects',
				onPress: 'goToProjects',
				accessibilityLabel: 'My Projects',
				disabled: () => !this.props.projects,
			}, {
				text: 'Favorites',
				onPress: 'goToFavorites',
				accessibilityLabel: 'My Favorites',
				disabled: () => this.props.shoppingLists,
			}, {
				text: 'Account Details',
				onPress: 'goToAccountDetails',
				accessibilityLabel: 'Account Details',
				measure: ACCOUNT_DETAILS_BUTTON,
			}, {
				text: 'Orders',
				onPress: 'goToOrders',
				accessibilityLabel: 'Orders',
				measure: ORDERS_BUTTON,
			}, {
				text: 'Returns',
				onPress: 'goToReturns',
				accessibilityLabel: 'Returns',
			}, {
				text: 'Lookback',
				allowGuest: true,
				accessibilityLabel: 'Lookback',
				onPress: 'goToLookback',
				disabled: () => true,
			}, {
				text: 'Development Options',
				onPress: 'showDevOptions',
				allowGuest: true,
				accessibilityLabel: 'Development Options',
				disabled: () => (!__DEV__ && !Device.isTest()),
			}],
		};
	};

	getActions = () => {
		const newActions = cloneDeep(this.getMenuActions());
		if (!this.props.isLoggedIn && !this.props.tutorialMode) {
			newActions.account.forEach((accountMenuAction) => {
				if (accountMenuAction.text === 'Notifications' || accountMenuAction.text === 'Shopping Lists') {
					accountMenuAction.leadIcon = 'empty-space';
				} else {
					accountMenuAction.leadIcon = helpers.getIcon('lock');
				}
			});
		}
		return this.ds.cloneWithRowsAndSections(newActions);
	};

	renderFooter = () => {
		if (this.props.isLoggedIn) {
			return (
				<View style={componentStyles.headerBox}>
					<Button
						textColor="secondary"
						text="Logout"
						color="white"
						onPress={this.signOut}
						style={componentStyles.logoutButton}
						accessibilityLabel="Logout Button"
						trackAction={TrackingActions.MORE_LOG_OUT}
					/>
				</View>
			);
		} else {
			return <View/>;
		}
	};

	render() {
		return (
			<View style={[styles.elements.screenWithHeader, componentStyles.container]}>
				<ListView
					automaticallyAdjustContentInsets={false}
					dataSource={this.getActions()}
					renderRow={this.renderAction}
					renderHeader={this.renderHeader}
					renderFooter={this.renderFooter}
					renderSectionHeader={this.renderSectionHeader}
					ref={(ref) => this.actionsList = ref}
					scrollsToTop={true}
				/>
			</View>
		);
	}

}

MoreScreen.propTypes = {
	actions: PropTypes.object.isRequired,
	articles: PropTypes.bool,
	customer: PropTypes.object,
	isLoggedIn: PropTypes.bool,
	cart: PropTypes.object,
	favorites: PropTypes.bool,
	projects: PropTypes.bool,
	isLookbackEnabled: PropTypes.bool,
	notificationCount: PropTypes.number,
	onboarding: PropTypes.bool,
	tutorialMode: PropTypes.bool,
	navigator: PropTypes.shape({
		push: PropTypes.func,
	}),
	scrollToTop: PropTypes.bool,
	navigation: PropTypes.shape({
		getNavigator: PropTypes.func,
		performAction: PropTypes.func,
	}),
	shoppingLists: PropTypes.bool,
};

MoreScreen.defaultProps = {
	notificationCount: 0,
};

MoreScreen.route = {
	navigationBar: {
		title: 'Account',
		renderLeft: null,
	},
};

const mapStateToProps = (state) => {
	return {
		articles: state.featuresReducer.features.articles,
		cart: state.cartReducer.cart,
		projects: state.featuresReducer.features.projects,
		customer: state.userReducer.user,
		isLoggedIn: state.userReducer.isLoggedIn,
		notificationCount: state.notificationReducer.notificationCount,
		onboarding: state.featuresReducer.features.onboarding,
		isLookbackEnabled: state.featuresReducer.features.lookback.enabled,
		shoppingLists: state.featuresReducer.features.shoppingLists,
		tutorialMode: state.layoutReducer.tutorialMode,
		scrollToTop: state.eventsReducer.scrollAccountTabToTop,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			signUserOut,
			getUnacknowledgedNotificationCount,
			setComponentMeasurements,
			clearSessionCart,
			copySessionCart,
			trackState,
		}, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(withScreen(MoreScreen));
