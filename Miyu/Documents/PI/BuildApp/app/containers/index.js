'use strict';

import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	View,
	StatusBar,
	AppState,
	Platform,
	StyleSheet,
} from 'react-native';
import {
	InputAccessoryView,
} from 'BuildLibrary';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
	getCustomer,
	getCustomerInfoOnAppStartUp,
} from '../actions/UserActions';
import {
	getClientLoginData,
} from '../actions/SocialLoginActions';
import {
	getSessionCart,
	updateCartItemBounce,
} from '../actions/CartActions';
import {
	setReference,
	REFERENCE_MODAL,
} from '../actions/ReferenceActions';
import {
	getUnacknowledgedNotificationCount,
} from '../actions/NotificationActions';
import 'react-native-browser-polyfill';
import router from '../router';
import {
	DID_LOGIN_WITH_SOCIAL,
} from '../constants/SocialConstants';
import store from 'react-native-simple-store';
import { StackNavigation } from '@expo/ex-navigation';
import tracking from '../lib/analytics/tracking';
import EventEmitter from '../lib/eventEmitter';
import helpers from '../lib/helpers';
import codePush from 'react-native-code-push';
import ActionSheet from '../components/actionSheet';
import AlertBar from '../components/AlertBar';
import HalfPageListSelector from '../components/HalfPageListSelector';
import Modal from '../components/Modal';
import ScreenOverlay from '../components/ScreenOverlay';
import {
	APP_LAUNCH_INFO,
	STORE_CUSTOMER_INFO,
	DID_OPEN_PREVIOUSLY,
} from '../constants/constants';
import SimpleStoreHelpers from '../lib/SimpleStoreHelpers';
import {
	navigationBarDark,
	navigationBarLight,
} from '../styles/navigationBarStyles';

import { Device } from 'BuildNative';
import bugsnag from '../lib/bugsnag';


const componentStyles = StyleSheet.create({
	container: {
		flex: 1,
	},
});

class Index extends Component {

	constructor(props) {
		super(props);

		this.onAppStateChange = this.onAppStateChange.bind(this);
		this.bugsnag = bugsnag;
		this.state = {
			status: 'anonymous',
		};
	}

	componentWillMount() {
		AppState.addEventListener('change', this.onAppStateChange);
		if (Platform.OS === 'ios') {
			StatusBar.setBarStyle('default', false);
		}
	}

	componentDidMount() {
		const { setReference } = this.props.actions;

		const is3dEnabled = Device.is3dModelEnabled();
		const isArKitEnabled = Device.isArKitEnabled();
		tracking.setIs3dEnabledValues(is3dEnabled);
		tracking.setIsAREnabledValues(isArKitEnabled);


		setReference(REFERENCE_MODAL, this.modal);

		store.get(DID_LOGIN_WITH_SOCIAL).then((result) => {
			if (result) {
				this.props.actions.getClientLoginData()
					.then(this.loadCustomerData)
					.catch(helpers.noop)
					.done();
			} else {
				// we need to log this error in the future
				this.props.actions.getCustomerInfoOnAppStartUp()
					.then(this.loadCustomerData)
					.catch(helpers.noop)
					.done();
			}
			this.setState({ socialLogin: result });

			if (!this.state.appState) {
				this.trackAppState('active');
			}
		});

		store.get(DID_OPEN_PREVIOUSLY).then((didOpenPreviously) => {
			if (!didOpenPreviously) {
				tracking.trackInstallAndFirstLaunch();
				store.save(DID_OPEN_PREVIOUSLY, true);
			}
		});

		EventEmitter.addListener('showScreenAlert', this.showScreenAlert);

		SimpleStoreHelpers.shouldNewCartBounce()
			.then((shouldBounce) => this.props.actions.updateCartItemBounce(shouldBounce))
			.catch(helpers.noop)
			.done();

		codePush.sync();
	}

	componentWillReceiveProps(nextProps) {
		const { user } = this.props.state.userReducer;
		const nextUser = nextProps.state.userReducer.user;
		if (nextUser.customerId && nextUser.email && nextUser.email !== user.email) {
			this.bugsnag.setUser(tracking.numberToString(nextUser.customerId), '', nextUser.email);
		}

	}

	componentWillUnmount() {
		EventEmitter.removeListener('showScreenAlert', this.showScreenAlert);
	}

	loadCustomerData = () => {
		store.get('SESSION_CART_ID')
			.then((sessionCartId) => {
				if (sessionCartId) {
					// we need to log this error in the future
					this.props.actions.getSessionCart({ sessionCartId }).catch(helpers.noop).done();
				}
			});

		this.props.actions.getUnacknowledgedNotificationCount().catch(helpers.noop).done();
	};

	showScreenAlert = ({ message, type, button, callback, bannerVisibleTimeout }) => {
		if (this.alertBar) {
			this.alertBar.showAlert(message, type, button, callback, bannerVisibleTimeout);
		}
	};

	trackAppState = (appState) => {
		if (appState === 'active') {
			store.get(APP_LAUNCH_INFO).then((appLaunchInfo) => {
				let launchType = 'Returning';
				if (appLaunchInfo === null) {
					launchType = 'First Launch Ever';
					store.save(APP_LAUNCH_INFO, { isFirstLaunchEver: true }).done();
				}
				store.get(STORE_CUSTOMER_INFO).then((customer) => {
					let attributes = {};
					if (customer) {
						attributes = {
							socialLogin: this.state.socialLogin ? 'Yes' : 'No',
						};

						if (customer.customerId && customer.email) {
							const customerId = tracking.numberToString(customer.customerId);
							attributes = {
								...attributes,
								customerId,
								email: customer.email,
							};
							this.bugsnag.setUser(customerId, '', customer.email);
						}
					}
					tracking.trackAction('App_launch', {
						resume: this.state.appState !== undefined,
						'Launch Type': launchType,
						...attributes,
					});
				});
			}).done();
		} else {
			store.get(APP_LAUNCH_INFO).then((appLaunchInfo) => {
				if (appLaunchInfo !== null && appLaunchInfo.isFirstLaunchEver) {
					store.save(APP_LAUNCH_INFO, { isFirstLaunchEver: false }).done();
				}
			}).done();
			tracking.trackAction('App_closed');
		}
		this.setState({
			appState,
		});
	};

	onAppStateChange = (state) => {
		codePush.sync();
		this.trackAppState(state);
	};

	render() {
		const { isAccessoryHidden } = this.props.state.keyboardReducer;

		return (
			<View style={componentStyles.container}>
				<StackNavigation
					id="root"
					navigatorUID="root"
					initialRoute={router.getRoute('main')}
					defaultRouteConfig={{
						navigationBar: {
							...Platform.select({
								ios: navigationBarLight,
								android: navigationBarDark,
							}),
							visible: false,
						},
					}}
				/>
				<Modal ref={(ref) => this.modal = ref} />
				<ActionSheet ref={(ref) => this.actionSheet = ref} />
				<HalfPageListSelector ref={(ref) => this.halfPageListSelector = ref} />
				<ScreenOverlay />
				<AlertBar ref={(ref) => this.alertBar = ref} />
				<InputAccessoryView isAccessoryHidden={isAccessoryHidden} />
			</View>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		state,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			getCustomer,
			getClientLoginData,
			getSessionCart,
			getCustomerInfoOnAppStartUp,
			getUnacknowledgedNotificationCount,
			setReference,
			updateCartItemBounce,
		}, dispatch),
	};
};

Index.propTypes = {
	actions: PropTypes.object.isRequired,
	state: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Index);
