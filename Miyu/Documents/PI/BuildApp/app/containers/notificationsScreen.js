import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import { trackAction } from '../actions/AnalyticsActions';
import helpers from '../lib/helpers';
import NavigationBarIconButton from '../components/navigationBar/NavigationBarIconButton';
import TrackingActions from '../lib/analytics/TrackingActions';
import { connect } from 'react-redux';
import {
	withScreen,
	TabbedPager,
} from 'BuildLibrary';
import { bindActionCreators } from 'redux';
import {
	allowNotifications,
	getNotificationSettings,
	saveNotificationSettings,
} from '../actions/UserActions';
import router from '../router/index';
import NotificationsTab from '../components/NotificationsTab';
import { markNotificationsAcknowledged } from '../actions/NotificationActions';
import { navigatorPush } from '../actions/NavigatorActions';

export class NotificationsScreen extends Component {

	constructor(props) {
		super(props);
		this.state = {
			hideEnableNotifications: false,
		};
		this.tabs = [{
			name: 'All',
			component: (
				<NotificationsTab
					showEmptyButton={true}
					showEnableNotificationsPrompt={true}
				/>
			),
		}, {
			name: 'Orders',
			component: (
				<NotificationsTab
					eventTypes={[
						'order',
						'tracking',
						'return',
						'quote',
					]}
					showEmptyButton={true}
				/>
			),
		}, {
			name: 'Projects',
			component: (
				<NotificationsTab
					emptyText="Stay up to date with everything going on in your projects"
					eventTypes={[
						'post',
						'team_member',
						'team_expert',
					]}
				/>
			),
		}];
	}

	componentDidMount() {
		if (this.props.isLoggedIn) {
			this.props.actions.getNotificationSettings();
		}
		this.props.actions.markNotificationsAcknowledged();
	}

	setScreenTrackingInformation() {
		return {
			name: 'build:app:more:notifications',
		};
	}


	render() {
		return <TabbedPager tabs={this.tabs}/>;
	}

}

NotificationsScreen.route = {
	navigationBar: {
		title: 'Notifications',
		renderRight: () => {
			return (
				<NavigationBarIconButton
					onPress={() => navigatorPush(router.getRoute('pushNotificationSettings'), 'more')}
					iconName={helpers.getIcon('settings')}
					trackAction={TrackingActions.FAVORITES_NAV_TAP_NEW_FAVORITE_LIST}
				/>
			);
		},
	},
};

NotificationsScreen.propTypes = {
	actions: PropTypes.object,
	notificationSettings: PropTypes.object,
	navigator: PropTypes.shape({
		push: PropTypes.func,
	}),
	navigation: PropTypes.shape({
		getNavigator: PropTypes.func,
	}),
	isLoggedIn: PropTypes.bool,
};

const mapStateToProps = (state) => {
	return {
		notificationSettings: state.userReducer.notificationSettings,
		isLoggedIn: state.userReducer.isLoggedIn,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			allowNotifications,
			getNotificationSettings,
			markNotificationsAcknowledged,
			saveNotificationSettings,
			trackAction,
		}, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(withScreen(NotificationsScreen));
