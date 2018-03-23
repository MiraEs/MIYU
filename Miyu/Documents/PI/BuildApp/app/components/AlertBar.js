import React, { Component } from 'react';
import {
	StyleSheet,
	View,
	TouchableWithoutFeedback,
} from 'react-native';
import {
	LinkButton,
	Text,
} from 'BuildLibrary';
import { createAnimatableComponent } from 'react-native-animatable';
import helpers from '../lib/helpers';
import styles from '../lib/styles';
import {
	BANNER_VISIBLE_TIMEOUT,
	BANNER_SLIDE_DOWN,
	BANNER_SLIDE_UP,
} from '../constants/constants';
import Icon from 'react-native-vector-icons/Ionicons';
import TrackingActions from '../lib/analytics/TrackingActions';

const componentStyles = StyleSheet.create({
	container: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
	},
	message: {
		justifyContent: 'flex-end',
		height: 100,
		paddingHorizontal: styles.measurements.gridSpace2,
		paddingBottom: styles.measurements.gridSpace1,
		paddingTop: styles.measurements.gridSpace1 + (helpers.isIOS() ? 20 : 0),
		elevation: 5,
		shadowColor: 'black',
		shadowOffset: {
			width: 0,
			height: 3,
		},
		shadowOpacity: 0.4,
		shadowRadius: 3,
	},
	messageRow: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		flex: 1,
	},
	messageIcon: {
		marginRight: styles.measurements.gridSpace1,
	},
	messageText: {
		flex: -1,
	},
	linkButtonStyles: {
		paddingLeft: styles.measurements.gridSpace1,
	},
});

export default class AlertBar extends Component {

	constructor(props) {
		super(props);
		this.state = {
			isMessageVisible: false,
			message: null,
			type: 'success',
			button: null,
		};
		this.alertQueue = [];
		this.alertCallbackQueue = [];
		this.playingAlerts = false;
		this._callback = null;
	}

	playAlerts = () => {
		if (this.alertQueue.length) {
			const { message, type, button, bannerVisibleTimeout } = this.alertQueue.shift();
			this.playingAlerts = true;
			this.fadeInDown(message, type, button, this.playAlerts, bannerVisibleTimeout);
		} else {
			while (this.alertCallbackQueue.length) {
				const callback = this.alertCallbackQueue.shift();
				if (callback && typeof callback === 'function') {
					callback();
				}
			}
			this.playingAlerts = false;
		}
	};

	showAlert = (message, type = 'success', button = null, callback = null, bannerVisibleTimeout = BANNER_VISIBLE_TIMEOUT) => {
		this.alertQueue.push({ message, type, button, bannerVisibleTimeout });
		this.alertCallbackQueue.push(callback);
		if (!this.playingAlerts) {
			this.playAlerts();
		}
	};

	fadeInDown = (message, type = 'success', button = null, callback = null, bannerVisibleTimeout = BANNER_VISIBLE_TIMEOUT) => {
		this._callback = callback;
		this.setState({
			isMessageVisible: true,
			message,
			type,
			button,
		}, () => setTimeout(this.fadeOutUp, bannerVisibleTimeout));
	};

	fadeOutUp = () => {
		if (this.messageView) {
			this.messageView.fadeOutUp(BANNER_SLIDE_UP)
			.then(() => this.setState({
				message: null,
				isMessageVisible: false,
				button: null,
			}))
			.then(() => {
				if (typeof this._callback === 'function') {
					this._callback();
				}
			});
		}
	};

	getStyles = () => {
		const style = {
			icon: 'checkmark',
			backgroundColor: {
				backgroundColor: styles.colors.primary,
			},
		};

		if (this.state.type === 'error') {
			style.icon = 'close-circle';
			style.backgroundColor = {
				backgroundColor: styles.colors.error,
			};
		} else if (this.state.type === 'warning') {
			style.icon = 'warning';
			style.backgroundColor = {
				backgroundColor: styles.colors.accent,
			};
		}
		if (this.state.type === 'info') {
			style.icon = 'information-circle';
			style.backgroundColor = {
				backgroundColor: styles.colors.greyLight,
			};
		}

		return style;
	};

	renderButton = () => {
		const { button } = this.state;
		if (button) {
			return (
				<LinkButton
					onPress={() => {
						this.setState({
							message: null,
							isMessageVisible: false,
							button: null,
						}, button.onPress);
						this.playingAlerts = false;
					}}
					style={componentStyles.linkButtonStyles}
					analyticsData={{
						trackName: TrackingActions.ALERT_BAR_LINK_BUTTON,
						trackData: { buttonText: button.text },
					}}
				>
					<Text
						color={this.state.type === 'info' ? 'secondary' : 'white'}
						lineHeight={false}
						textAlign="left"
						decoration="underline"
						style={componentStyles.messageText}
					>
						{button.text}
					</Text>
				</LinkButton>
			);
		}
	};

	render() {
		const { isMessageVisible, message } = this.state;
		if (!isMessageVisible) {
			return null;
		}

		const AnimatedView = createAnimatableComponent(View);
		const messageStyles = this.getStyles();

		return (
			<View style={componentStyles.container}>
				<TouchableWithoutFeedback onPress={() => this.fadeOutUp()}>
					<AnimatedView
						animation="fadeInDown"
						duration={BANNER_SLIDE_DOWN}
						ref={(ref) => this.messageView = ref}
						style={[componentStyles.message, messageStyles.backgroundColor]}
					>
						<View style={componentStyles.messageRow}>
							<Icon
								name={helpers.getIcon(messageStyles.icon)}
								size={32}
								color={this.state.type === 'info' ? styles.colors.secondary : styles.colors.white}
								style={componentStyles.messageIcon}
							/>
							<Text
								color={this.state.type === 'info' ? 'secondary' : 'white'}
								lineHeight={false}
								textAlign="left"
								style={componentStyles.messageText}
							>
								{message}
							</Text>
							{this.renderButton()}
						</View>
					</AnimatedView>
				</TouchableWithoutFeedback>
			</View>
		);
	}
}
