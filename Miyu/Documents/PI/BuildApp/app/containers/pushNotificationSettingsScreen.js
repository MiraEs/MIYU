'use strict';
import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	View,
	Switch,
	StyleSheet,
	Linking,
	AppState,
} from 'react-native';
import {
	ListView,
	Text,
	Button,
} from 'BuildLibrary';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import NotificationUtils from '../lib/NotificationUtils';
import helpers from '../lib/helpers';
import {
	getNotificationSettings,
	saveNotificationSettings,
	saveMultiNotificationSettings,
	allowNotifications,
} from '../actions/UserActions';
import styles from '../lib/styles';
import TrackingActions from '../lib/analytics/TrackingActions';
import tracking from '../lib/analytics/tracking';
import { trackState } from '../actions/AnalyticsActions';
import PushNotificationsIOS from 'PushNotificationsIOS';
import { STORE_NOTIFICATIONS_OPT_IN } from '../constants/constants';
import store from 'react-native-simple-store';
import { GUEST_NOTIFICATIONS_SETTINGS } from '../constants/Notifications';
import { LinkingManager } from 'BuildNative';

const componentStyles = StyleSheet.create({
	textView: {
		flex: 1,
		paddingRight: styles.measurements.gridSpace2,
	},
	switch: {
		width: 45,
	},
	header: {
		borderBottomWidth: styles.measurements.gridSpace1,
		borderBottomColor: styles.colors.greyLight,
	},
	row: {
		padding: styles.measurements.gridSpace2,
	},
	section: {
		backgroundColor: styles.colors.white,
		marginBottom: styles.measurements.gridSpace1,
		padding: styles.measurements.gridSpace1,
	},
	settingsButton: {
		marginTop: styles.measurements.gridSpace2,
	},
});

const friendlyNameMap = {
	TEAM_MEMBER: {
		text: 'Project Invites',
		description: 'Get notified when a new member is added to your projects team.',
	},
	POST: {
		text: 'Photos & Posts',
		description: 'Get notified when a team member comments, posts or adds photos.',
	},
	ORDER: {
		text: 'Orders',
		description: 'Get up to date information on your order status.',
	},
	TEAM_EXPERT: {
		text: 'Team Expert',
		description: 'Get notified about updates from your personal Expert.',
	},
	FAVORITE_LIST: {
		text: 'Favorites List',
		description: 'Get notifications about Favorites Lists linked to your project.',
	},
	TRACKING: {
		text: 'Tracking',
		description: 'Get notified when your order ships.',
	},
	RETURN: {
		text: 'Returns',
		description: 'Get up to date information on your return status.',
	},
	MARKETING: {
		text: 'Promotions',
		description: 'Deals, Coupons, and Sales alerts customized to you.',
	},
};

const TYPE_PUSH = 'PUSH';
const EVENT_TYPE = {
	MARKETING: 'MARKETING',
};

export class SettingsScreen extends Component {

	constructor(props) {
		super(props);
		this.state = {
			pushNotificationsEnabled: false,
		};
	}

	componentWillMount() {
		if (!this.props.isLoggedIn) {
			store.get(GUEST_NOTIFICATIONS_SETTINGS).then((settings) => {
				if (settings) {
					this.props.actions.saveNotificationSettings(settings);
				}
			});
		}

		this.setPushNotificationsState();
		AppState.addEventListener('change', this.setPushNotificationsState);
	}

	componentDidMount() {
		this.props.actions.trackState('build:app:pushnotificationsettings');
	}

	componentWillReceiveProps(nextProps) {
		const currentMarketingSetting = this.props.notificationSettings[EVENT_TYPE.MARKETING];
		const nextMarketingSetting = nextProps.notificationSettings[EVENT_TYPE.MARKETING];
		if (currentMarketingSetting && nextMarketingSetting && currentMarketingSetting.PUSH !== nextMarketingSetting.PUSH) {
			tracking.setPushNotificationsEnabled(nextMarketingSetting.PUSH);
		}

		if (this.props.allIndividualNotificationsOff !== nextProps.allIndividualNotificationsOff) {
			this.toggleAllNotifications(!nextProps.allIndividualNotificationsOff);
		}
	}

	componentWillUnmount() {
		AppState.removeEventListener('change', this.setPushNotificationsState);
	}

	formatTypes = (notificationTypes) => {
		const notificationTypesList = [];
		for (const type in notificationTypes) {
			if (friendlyNameMap[type]) {
				notificationTypesList.push({
					type,
					text: friendlyNameMap[type].text,
					enabled: notificationTypes[type].PUSH,
					description: friendlyNameMap[type].description,
				});
			}
		}
		notificationTypesList.sort((a, b) => a.text > b.text);
		return notificationTypesList;
	};

	setPushNotificationsState = () => {
		NotificationUtils.areNotificationsEnabled()
		.then((pushNotificationsEnabled) => this.setState({ pushNotificationsEnabled }))
		.done();
	};

	updateNotificationSetting = (enabled, eventType) => {
		this.props.actions.saveNotificationSettings({
			enabled,
			eventType,
			notificationType: TYPE_PUSH,
		}).then(() => {
			if (eventType === EVENT_TYPE.MARKETING) {
				tracking.setPushNotificationsEnabled(enabled);
			}
		}).done();
	};

	toggleAllNotifications = (enabled) => {
		const { actions, isLoggedIn } = this.props;
		actions.allowNotifications(enabled).then(() => {
			if (isLoggedIn) {
				return this.props.actions.getNotificationSettings();
			} else {
				this.updateNotificationSetting(enabled, EVENT_TYPE.MARKETING);
			}
		}).done();
		tracking.setPushNotificationsEnabled(enabled);
	};

	renderHeader = () => {
		return (
			<View style={[styles.elements.row, componentStyles.row, componentStyles.header]}>
				<View style={componentStyles.textView}>
					<Text>Allow Notifications</Text>
				</View>
				<Switch
					accessibilityLabel="Notifications Switch"
					disabled={!this.props.allowsNotifications && this.arePushNotificationsDisabled()}
					onTintColor={styles.colors.primary}
					style={componentStyles.switch}
					onValueChange={this.toggleAllNotifications}
					value={this.props.allowsNotifications && !this.arePushNotificationsDisabled()}
				/>
			</View>
		);
	};

	renderRow = (row) => {
		return (
			<View style={[styles.elements.row, componentStyles.row]}>
				<View style={componentStyles.textView}>
					<Text
						weight="bold"
						lineHeight={false}
					>
						{row.text}
					</Text>
					<Text size="small">{row.description}</Text>
				</View>
				<Switch
					disabled={this.arePushNotificationsDisabled()}
					style={componentStyles.switch}
					onTintColor={styles.colors.primary}
					onValueChange={(value) => this.updateNotificationSetting(value, row.type)}
					value={row.enabled && !this.arePushNotificationsDisabled()}
				/>
			</View>
		);
	};

	arePushNotificationsDisabled = () => {
		return !this.state.pushNotificationsEnabled;
	};

	requestPushPermissions = () => {
		if (helpers.isIOS()) {
			store.get(STORE_NOTIFICATIONS_OPT_IN).then((hasRequestedPermissionsBefore) => {
				if (hasRequestedPermissionsBefore) {
					Linking.canOpenURL('app-settings:').then((isSupported) => {
						if (isSupported) {
							Linking.openURL('app-settings:');
						}
					}).catch(helpers.noop);
				} else {
					PushNotificationsIOS.requestPermissions().then((permissions) => {
						if (permissions) {
							this.setState({ pushNotificationsEnabled: true });
						}
					}).done();
				}
			});
		} else {
			LinkingManager.openBuildAppSettings();
		}
	};

	renderPushNotificationsWarning = () => {
		if (this.arePushNotificationsDisabled()) {
			return (
				<View style={componentStyles.section}>
					<Text
						weight="bold"
						size="large"
						textAlign="center"
					>
						Push notifications are disabled
					</Text>
					<Text textAlign="center">
						To receive notifications outside of this app, continue to your phone settings and enable
						notifications.
					</Text>
					<Button
						accessibilityLabel="Enable Push Notifications"
						trackAction={TrackingActions.ENABLE_PUSH_NOTIFICATIONS_TAP}
						text="Enable Push Notifications"
						style={componentStyles.settingsButton}
						onPress={this.requestPushPermissions}
					/>
				</View>
			);
		}
	};

	render() {
		const ds = new ListView.DataSource({
			rowHasChanged: (r1, r2) => r1.enabled !== r2.enabled,
		});
		return (
			<View style={styles.elements.screenGreyLight}>
				{this.renderPushNotificationsWarning()}
				<ListView
					enableEmptySections={true}
					dataSource={ds.cloneWithRows(this.formatTypes(this.props.notificationSettings))}
					renderHeader={this.renderHeader}
					renderRow={this.renderRow.bind(this)}
					scrollsToTop={true}
				/>
			</View>
		);
	}

}

SettingsScreen.propTypes = {
	allowsNotifications: PropTypes.bool.isRequired,
	allIndividualNotificationsOff: PropTypes.bool.isRequired,
	actions: PropTypes.object.isRequired,
	notificationSettings: PropTypes.object.isRequired,
	isLoggedIn: PropTypes.bool.isRequired,
};

SettingsScreen.route = {
	navigationBar: {
		title: 'Notification Settings',
	},
};

function mapStateToProps({ userReducer }) {
	const { notificationSettings, isLoggedIn, userPushNotificationsEnabled } = userReducer;
	const allowedNotifications = Object.keys(notificationSettings)
	.filter((key) => friendlyNameMap[key] !== undefined)
	.filter((key) => notificationSettings[key] && notificationSettings[key].PUSH === true);

	return {
		isLoggedIn,
		notificationSettings,
		allowsNotifications: userPushNotificationsEnabled,
		allIndividualNotificationsOff: allowedNotifications.length === 0,
	};
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators({
			getNotificationSettings,
			saveNotificationSettings,
			saveMultiNotificationSettings,
			allowNotifications,
			trackState,
		}, dispatch),
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsScreen);
