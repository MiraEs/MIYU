import React, {
	Component,
} from 'react';
import {
	StyleSheet,
	TouchableOpacity,
	View,
} from 'react-native';
import styles from '../lib/styles';
import {
	Button,
	Image,
	Text,
} from 'BuildLibrary';
import Icon from 'react-native-vector-icons/Ionicons';
import EventEmitter from '../lib/eventEmitter';
import TrackingActions from '../lib/analytics/TrackingActions';
import PushNotificationsIOS from 'PushNotificationsIOS';

const componentStyles = StyleSheet.create({
	button: {
		marginTop: styles.measurements.gridSpace2,
		flex: 0,
	},
	content: {
		paddingHorizontal: styles.measurements.gridSpace1,
		paddingBottom: styles.measurements.gridSpace1,
	},
	container: {
		padding: styles.measurements.gridSpace1,
		marginHorizontal: styles.measurements.gridSpace3,
		backgroundColor: styles.colors.white,
	},
	icon: {
		backgroundColor: styles.colors.none,
	},
	iconWrapper: {
		position: 'absolute',
		top: -6,
		right: 8,
	},
	image: {
		alignSelf: 'center',
		width: 175,
		height: 92,
		margin: styles.measurements.gridSpace3,
	},
});

export default class NotificationSoftAsk extends Component {

	dismiss = () => {
		EventEmitter.emit('hideScreenOverlay');
	};

	renderCloseButton = () => {
		return (
			<TouchableOpacity
				style={componentStyles.iconWrapper}
				onPress={this.dismiss}
			>
				<Icon
					style={componentStyles.icon}
					color={styles.colors.grey}
					size={45}
					name="ios-close"
				/>
			</TouchableOpacity>
		);
	};

	render() {
		return (
			<View style={componentStyles.container}>
				<View style={componentStyles.content}>
					<Image
						resizeMode="contain"
						style={componentStyles.image}
						source={require('../images/home-screen-logo.png')}
					/>
					<Text textAlign="center">
						Enable notifications to receive real-time order updates, alerts on instant price drops and
						exclusive
						coupons.
					</Text>
					<Button
						style={componentStyles.button}
						onPress={() => {
							PushNotificationsIOS.requestPermissions().then(this.dismiss);
						}}
						text="Opt into Push Notifications"
						trackAction={TrackingActions.NOTIFICATIONS_SOFT_ASK_OPT_IN}
						accessibilityLabel="Opt In Button"
					/>
					<Button
						style={componentStyles.button}
						text="No thanks, not at this time"
						color="white"
						textColor="secondary"
						onPress={this.dismiss}
						trackAction={TrackingActions.NOTIFICATIONS_SOFT_ASK_NO_THANKS}
						accessibilityLabel="No Thanks Button"
					/>
				</View>
				{this.renderCloseButton()}
			</View>
		);
	}

}
