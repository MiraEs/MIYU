import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	AppState,
	NativeModules,
	Linking,
	InteractionManager,
	PushNotificationIOS,
	View,
} from 'react-native';
import { whyDidYouUpdate } from 'why-did-you-update';
import {
	APP_LAUNCH_INFO,
	STORE_CUSTOMER_INFO,
	MORE,
} from '../constants/constants';
import {
	AUTH_STATUS_UNKNOWN,
} from '../constants/Auth';
import TabBar from './TabBar';
import {
	updateDeviceToken,
	registerDeviceToken,
} from '../actions/UserActions';
import environment from '../lib/environment';
import {
	getUnacknowledgedNotificationCount,
	updateNotificationCount,
} from '../actions/NotificationActions';
import {
	handleBranchLink,
	handleLink,
} from '../actions/DeepLinkingActions';
import { showAlert } from '../actions/AlertActions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import EventEmitter from '../lib/eventEmitter';
import styles from '../lib/styles';
import PushNotification from 'react-native-push-notification';
import helpers from '../lib/helpers';
import { refreshCurrentScreen } from '../actions/ErrorActions';
import errorAlertHandler from '../lib/ErrorAlertHandler';
import store from 'react-native-simple-store';
import tracking from '../lib/analytics/tracking';
import branch from 'react-native-branch';
import SimpleStoreHelpers from '../lib/SimpleStoreHelpers';
import ContactUsHelper from '../lib/ContactUsHelper';
import PhoneHelper from '../lib/PhoneHelper';

export class Main extends Component {

	componentWillMount() {
		store.get(APP_LAUNCH_INFO).then((appLaunchInfo) => {
			if (this.props.features.onboarding && (appLaunchInfo === null || appLaunchInfo.isFirstLaunchEver)) {
				this.props.navigator.push('introScreen');
			}
		}).done();

		helpers.setStatusBarStyle('default', true);
		helpers.setStatusBarHidden(false, 'fade');
	}

	componentDidMount() {
		const { handleBranchLink } = this.props.actions;
		if (helpers.isIOS()) {
			PushNotificationIOS.addEventListener('register', this.onRegisterNotifications);
			PushNotificationIOS.addEventListener('notification', this.onRemoteNotification);
		}

		Linking.getInitialURL().then((url) => {
			if (url) {
				this.handleIncomingLink({ url });
			}
		});

		Linking.addEventListener('url', this.handleIncomingLink);

		branch.subscribe((payload) => handleBranchLink(payload));

		AppState.addEventListener('change', this.onAppStateChange);

		store.get(STORE_CUSTOMER_INFO).then((user) => {
			tracking.setCustomerValues(user, this.props.isLoggedIn);
		}).catch(() => {
			tracking.setCustomerValues(null, this.props.isLoggedIn);
		}).done();

		EventEmitter.addListener('showErrorAlert', this.showErrorAlert);
		EventEmitter.addListener('onCallUs', this.onCallUs);

		const { whyDidYouUpdate: whyDidYouUpdateFeature } = this.props.features;
		if (whyDidYouUpdateFeature && __DEV__) {
			whyDidYouUpdate(React);
		}
	}

	componentWillReceiveProps(nextProps) {
		if (helpers.isIOS() && nextProps.isLoggedIn && !this.props.isLoggedIn) {
			PushNotification.checkPermissions(({ alert }) => {
				if (alert) {
					SimpleStoreHelpers.getPushDeviceToken().then((token) => {
						/*
						 * This is a special case where previous logged in user opted for push and they accepted it,
						 * But next logged in user doesn't get asked for push opt-in. So we use the stored device token to
						 * register next logged in user for push.
						 * P.S. We only need to do this on iOS, since we configure push notification after user logs in.
						 */
						if (token) {
							this.onRegisterNotifications(token);
						}
					}).done();
				}
			});
		}

		// Once we receive the auth status, we can route push notifications
		if (this.props.user.status !== nextProps.user.status && nextProps.user.status !== AUTH_STATUS_UNKNOWN) {
			InteractionManager.runAfterInteractions(this.configureNotifications);
		}

		if (nextProps.unauthorizedError && this.props.unauthorizedError !== nextProps.unauthorizedError) {
			EventEmitter.emit('showScreenAlert', {
				message: 'Your session has expired. Please log in again.',
				type: 'error',
				callback: () => {
					this.props.navigation.getNavigator('root').push('loginModal', {
						loginSuccess: () => {
							this.props.navigation.getNavigator('root').pop();
							EventEmitter.emit('screenWillLoad');
						},
					});
				},
			});
		}

		const { whyDidYouUpdate: newWhyDidYouUpdate } = nextProps.features;
		const { whyDidYouUpdate: oldWhyDidYouUpdate } = this.props.features;
		if (newWhyDidYouUpdate !== oldWhyDidYouUpdate && __DEV__) {
			if (newWhyDidYouUpdate) {
				whyDidYouUpdate(React);
			} else {
				// this allows us to effectively turn-off whyDidYouUpdate
				whyDidYouUpdate(React, { exclude: /.*/ });
			}
		}
	}

	componentWillUnmount() {
		if (helpers.isIOS()) {
			PushNotificationIOS.removeEventListener('register', this.onRegisterNotifications);
			PushNotificationIOS.removeEventListener('notification', this.onRemoteNotification);
		}
		Linking.removeEventListener('url', this.handleIncomingLink);

		AppState.removeEventListener('change', this.onAppStateChange);
		EventEmitter.removeListener('showErrorAlert', this.showErrorAlert);
		EventEmitter.removeListener('onCallUs', this.onCallUs);
	}

	configureNotifications = () => {
		if (helpers.isIOS()) {
			PushNotificationIOS.getInitialNotification().then((payload) => {
				if (payload && !this.hasHandledInitialNotification) {
					this.hasHandledInitialNotification = true;
					if (payload._data && payload._data.ll_deep_link_url) {
						// handle deep link from Localytics
						this.handleIncomingLink({
							url: payload._data.ll_deep_link_url,
						});
					} else {
						this.routeNotification(payload);
					}
				}
			});
		} else {
			PushNotification.configure({
				onRegister: ({ token }) => {
					NativeModules.LocalyticsManager.registerPushNotifications();
					this.onRegisterNotifications(token);
				},
				onNotification: (notification) => {
					if (notification.userInteraction) {
						this.props.navigation.performAction(({ tabs }) => tabs('main').jumpToTab(MORE));
						this.props.navigation.getNavigator(MORE).push('singleEvent', {
							fromNotificationClick: true,
							eventId: notification.eventId,
						});
					} else if (notification.foreground) {
						this.props.actions.updateNotificationCount(this.props.notificationCount + 1);
						this.showInAppNotification(notification);
					}
				},
				senderID: environment.gcmSenderId,
				permissions: {
					alert: true,
					badge: true,
					sound: true,
				},
				requestPermissions: true,
			});
		}
	};

	onCallUs = (phone = {}, showSessionInfo = false) => {
		const {
			lastViewedProduct,
			sessionCartId,
			user: { isPro },
		} = this.props;

		if (showSessionInfo) {
			ContactUsHelper.callWithAlert(phone, isPro, sessionCartId, lastViewedProduct);
		} else {
			ContactUsHelper.callUs(phone, isPro);
		}
	};

	routeNotification = (notification) => {
		this.props.navigation.performAction(({ tabs }) => tabs('main').jumpToTab(MORE));
		InteractionManager.runAfterInteractions(() => {
			this.props.navigation.getNavigator(MORE).push('singleEvent', {
				fromNotificationClick: true,
				eventId: notification.eventId || notification._alert && notification._alert.eventId,
			});
		});
	};

	onRegisterNotifications = (token) => {
		tracking.setPushNotificationsEnabled(true);
		const {
			updateDeviceToken,
			registerDeviceToken,
		} = this.props.actions;

		updateDeviceToken(token);
		registerDeviceToken()
			.catch(helpers.noop) // need to decide how we want to handle any errors here
			.done();
	};

	onRemoteNotification = (payload) => {
		if (AppState.currentState === 'active') {
			this.props.actions.updateNotificationCount(this.props.notificationCount + 1);
			this.showInAppNotification(payload);
		} else if (payload && payload._alert && payload._alert.eventId && AppState.currentState !== 'active') {
			const { eventId } = payload._alert;
			if (this.pendingNotificationId === eventId) {
				this.routeNotification(payload);
			} else {
				// When the app is running in the background, onRemoteNotification fires both when the notification is
				// received, and when it is tapped. The payload is identical in each case, so this ensures we will only
				// the event when the user taps the notification.
				this.pendingNotificationId = eventId;
			}
		}
	};

	showInAppNotification = (notification) => {
		if (!(notification._data && notification._data.hasOwnProperty('ll'))) {
			this.props.actions.showAlert('', 'info', {
				text: notification.message || notification._alert && notification._alert.body,
				onPress: () => this.routeNotification(notification),
			}, null, 10000);
		}
	};

	showErrorAlert = (isNetworkError) => {
		const { user } = this.props;
		const phone = PhoneHelper.getPhoneNumberByUserType(user);
		errorAlertHandler.showErrorAlert(this.props.actions.refreshCurrentScreen, isNetworkError, phone);
	};

	handleIncomingLink = ({ url }) => {
		if (url !== null) {
			this.props.actions.handleLink(url);
		}
	};

	onAppStateChange = (appState) => {
		if (appState === 'active') {
			this.props.actions.getUnacknowledgedNotificationCount().catch(helpers.noop).done();
			errorAlertHandler.shouldTryRefresh().then((refresh) => {
				if (refresh) {
					errorAlertHandler.resetShouldTryRefresh();
					this.props.actions.refreshCurrentScreen();
				}
			});
		}
	};

	render() {
		return (
			<View style={styles.elements.flex}>
				<TabBar
					projects={this.props.features.projects}
					shoppingLists={this.props.features.shoppingLists}
				/>
			</View>
		);
	}
}

Main.propTypes = {
	actions: PropTypes.object.isRequired,
	isLoggedIn: PropTypes.bool.isRequired,
	features: PropTypes.object.isRequired,
	notificationCount: PropTypes.number,
	lastViewedProduct: PropTypes.object,
	sessionCartId: PropTypes.number,
	navigator: PropTypes.shape({
		push: PropTypes.func,
	}),
	navigation: PropTypes.shape({
		performAction: PropTypes.func,
		getNavigator: PropTypes.func,
	}),
	unauthorizedError: PropTypes.bool,
	user: PropTypes.object,
};

const mapStateToProps = ({ cartReducer, errorReducer, userReducer, featuresReducer, notificationReducer, productDetailReducer, productsReducer }) => {
	const { lastViewedProductCompositeId } = productDetailReducer;
	let lastViewedProduct = {};
	if (lastViewedProductCompositeId) {
		lastViewedProduct = productsReducer[lastViewedProductCompositeId];
	}
	return {
		lastViewedProduct,
		isLoggedIn: userReducer.isLoggedIn,
		features: featuresReducer.features,
		notificationCount: notificationReducer.notificationCount || 0,
		sessionCartId: cartReducer.cart.sessionCartId,
		unauthorizedError: errorReducer.unauthorized,
		user: userReducer.user,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			updateDeviceToken,
			registerDeviceToken,
			getUnacknowledgedNotificationCount,
			updateNotificationCount,
			refreshCurrentScreen,
			handleBranchLink,
			handleLink,
			showAlert,
		}, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);
