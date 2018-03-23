import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	StyleSheet,
	TouchableHighlight,
	View,
} from 'react-native';
import styles from '../lib/styles';
import {
	Button,
	Image,
	Text,
} from 'BuildLibrary';
import { connect } from 'react-redux';
import { withNavigation } from '@expo/ex-navigation';
import {
	getNotifications,
	markNotificationRead,
} from '../actions/NotificationActions';
import {
	allowNotifications,
	getNotificationSettings,
} from '../actions/UserActions';
import FetchErrorMessage from './fetchErrorMessage';
import TrackingActions from '../lib/analytics/TrackingActions';
import { HOME } from '../constants/constants';
import PagingListView from '../components/PagingListView';
import { trackAction } from '../actions/AnalyticsActions';
import { bindActionCreators } from 'redux';
import helpers from '../lib/helpers';
import NotificationUtils from '../lib/NotificationUtils';
import tracking from '../lib/analytics/tracking';

const componentStyles = StyleSheet.create({
	dot: {
		backgroundColor: styles.colors.primary,
		width: 6,
		height: 6,
		borderRadius: 3,
		alignSelf: 'center',
		marginLeft: 5,
		marginTop: 2,
	},
	empty: {
		alignItems: 'center',
		justifyContent: 'center',
		padding: styles.measurements.gridSpace1,
	},
	emptyWrapper: {
		justifyContent: 'center',
		width: styles.dimensions.width,
		flex: 1,
	},
	emptyText: {
		paddingTop: styles.measurements.gridSpace1,
		paddingBottom: styles.measurements.gridSpace2,
	},
	icon: {
		width: 20,
		height: 20,
		marginRight: styles.measurements.gridSpace1,
		marginTop: styles.measurements.gridSpace1,
	},
	notificationRow: {
		flexDirection: 'row',
		alignItems: 'flex-start',
	},
	wrapper: {
		width: styles.dimensions.width,
		flex: 1,
	},
	section: {
		backgroundColor: styles.colors.white,
		padding: styles.measurements.gridSpace1,
		borderBottomWidth: styles.dimensions.borderWidth,
		borderBottomColor: styles.colors.grey,
	},
});

@withNavigation
export class NotificationsTab extends Component {

	constructor(props) {
		super(props);
		this.state = {
			buttonIsLoading: false,
		};
	};


	getNotificationIcon = (type) => {
		const iconPaths = {
			ORDER: require('../images/event-order-icon.png'),
			TRACKING: require('../images/event-shipping-icon.png'),
			RETURN: require('../images/event-return-icon.png'),
			QUOTE: require('../images/event-cart-icon.png'),
			POST: require('../images/event-status-update-icon.png'),
			TEAM_MEMBER: require('../images/event-team-icon.png'),
			TEAM_EXPERT: require('../images/event-team-icon.png'),
			FAVORITE_LIST: require('../images/event-favorite-icon.png'),
		};
		return iconPaths[type] || iconPaths.POST;
	};

	renderDot = (active) => {
		if (active) {
			return <View style={componentStyles.dot}/>;
		}
	};

	navigateToSingleEvent = (notification) => {
		this.props.actions.trackAction('Notification_tap', {
			type: notification.eventType,
		});
		if (notification.active) {
			this.props.actions.markNotificationRead(notification.id).catch(helpers.noop).done();
		}
		this.props.navigator.push('singleEvent', {
			eventId: notification.eventId,
			title: notification.eventType,
		});
	};

	enableNotifications = () => {
		const { actions } = this.props;
		this.setState({ buttonIsLoading: true }, () => {
			actions.allowNotifications(true)
			.then(this.props.actions.getNotificationSettings)
			.done(() => this.setState({ buttonIsLoading: false }));
		});
		tracking.setPushNotificationsEnabled(true);
	};

	renderNotificationRow = (notification) => {
		const rowStyles = [styles.elements.row, componentStyles.notificationRow];
		rowStyles.push({
			backgroundColor: notification.active ? styles.colors.white : styles.colors.greyLight,
		});
		return (
			<TouchableHighlight onPress={() => this.navigateToSingleEvent(notification)}>
				<View
					accessibilityLabel="Notification Element"
					style={rowStyles}
				>
					<Image
						source={this.getNotificationIcon(notification.eventType)}
						style={componentStyles.icon}
					/>
					<View style={styles.elements.flex1}>
						<Text weight="bold">{notification.message}</Text>
						{this.renderText(notification.projectName)}
						<View style={styles.elements.flexRow}>
							<Text>{helpers.getDate(notification.createdDate)}</Text>
							{this.renderDot(notification.active)}
						</View>
					</View>
				</View>
			</TouchableHighlight>
		);
	};

	renderText = (text) => {
		if (text) {
			return <Text>{text}</Text>;
		}
		return <Text />;
	};

	renderEmptyButton = () => {
		const {
			navigator,
			navigation,
			showEmptyButton,
		} = this.props;
		if (showEmptyButton) {
			return (
				<Button
					accessibilityLabel="Get Started Button"
					onPress={() => {
						navigation.performAction(({ tabs }) => tabs('main').jumpToTab(HOME));
						navigator.pop();
					}}
					text="Get Started"
					trackAction={TrackingActions.NOTIFICATIONS_GET_STARTED}
				/>
			);
		}
	};

	renderEmpty = () => {
		return (
			<View style={componentStyles.emptyWrapper}>
				<View style={componentStyles.empty}>
					<Text
						textAlign="center"
						weight="bold"
					>
						There's nothing to see here
					</Text>
					<Text
						textAlign="center"
						style={componentStyles.emptyText}
					>
						{this.props.emptyText}
					</Text>
					{this.renderEmptyButton()}
				</View>
			</View>
		);
	};

	renderHeader = () => {
		if (this.props.showEnableNotificationsPrompt && !NotificationUtils.areNotificationsOn(this.props.notificationSettings)) {
			return (
				<View style={componentStyles.section}>
					<Text
						size="large"
						weight="bold"
						textAlign="center"
					>
						Stay in the loop
					</Text>
					<Text
						textAlign="center"
						style={componentStyles.marginBottom2}
					>
						Get order updates and important info sent to your phone.
					</Text>
					<Button
						onPress={this.enableNotifications}
						text="Enable Notifications"
						style={componentStyles.button}
						trackAction={TrackingActions.NOTIFICATIONS_ENABLE_NOTIFICATIONS}
						isLoading={this.state.buttonIsLoading}
						accessibilityLabel="Enable Notifications"
					/>
				</View>
			);
		}
	};

	render() {
		const {
			actions: { getNotifications },
			error,
			eventTypes,
			notifications,
		} = this.props;
		return (
			<View style={componentStyles.wrapper}>
				<PagingListView
					data={notifications}
					loadPage={(page) => getNotifications({ page, eventTypes })}
					paging={this.props.paging}
					renderRow={this.renderNotificationRow}
					renderHeader={this.renderHeader}
					renderEmpty={this.renderEmpty}
				/>
				<FetchErrorMessage text={error}/>
			</View>
		);
	}

}

NotificationsTab.propTypes = {
	actions: PropTypes.object,
	emptyText: PropTypes.string,
	error: PropTypes.string,
	eventTypes: PropTypes.array,
	navigator: PropTypes.object,
	navigation: PropTypes.object,
	notifications: PropTypes.array,
	notificationSettings: PropTypes.object,
	paging: PropTypes.shape({
		page: PropTypes.number,
		pages: PropTypes.number,
	}).isRequired,
	showEmptyButton: PropTypes.bool,
	showEnableNotificationsPrompt: PropTypes.bool,
};

NotificationsTab.defaultProps = {
	emptyText: 'Start shopping and get notified about your activity',
};

const mapStateToProps = (state, ownProps) => {
	const composite = state.notificationReducer.composites[ownProps.eventTypes || 'all'] || {};
	return {
		notifications: composite.notifications,
		notificationSettings: state.userReducer.notificationSettings,
		error: composite.error,
		loading: composite.loading,
		paging: composite.paging || {},
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			allowNotifications,
			getNotifications,
			getNotificationSettings,
			markNotificationRead,
			trackAction,
		}, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(NotificationsTab);
