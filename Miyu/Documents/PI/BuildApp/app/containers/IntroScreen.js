import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
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
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import helpers from '../lib/helpers';
import Pager from '../components/Library/Pager/Pager';
import { NavigationStyles } from '@expo/ex-navigation';
import Tutorial from '../components/Tutorial';
import {
	trackState,
	trackAction,
} from '../actions/AnalyticsActions';
import TrackingActions from '../lib/analytics/TrackingActions';
import EventEmitter from '../lib/eventEmitter';
import Icon from 'react-native-vector-icons/Ionicons';
import PushNotificationsIOS from 'PushNotificationsIOS';

const componentStyles = StyleSheet.create({
	button: {
		marginHorizontal: styles.measurements.gridSpace2,
		marginTop: styles.measurements.gridSpace2,
	},
	lower: {
		height: 174,
	},
	container: {
		backgroundColor: styles.colors.white,
		flex: 1,
	},
	page: {
		flex: 1,
		width: styles.dimensions.width,
	},
	pager: {
		flex: 1,
		width: styles.dimensions.width,
		backgroundColor: styles.colors.greyLight,
		paddingBottom: styles.measurements.gridSpace1,
	},
	image: {
		height: 200,
		width: 200,
	},
	skipButton: {
		flexDirection: 'row',
		alignItems: 'center',
		alignSelf: 'flex-end',
		paddingRight: styles.measurements.gridSpace2,
		height: styles.dimensions.tapSizeMedium,
	},
	textBox: {
		padding: styles.measurements.gridSpace1,
		borderColor: styles.colors.grey,
		borderTopWidth: styles.dimensions.borderWidth,
		borderBottomWidth: styles.dimensions.borderWidth,
	},
	touchableOpacity: {
		flexDirection: 'row',
		height: 44,
		alignItems: 'center',
		justifyContent: 'center',
	},
	upper: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'flex-end',
		backgroundColor: styles.colors.white,
	},
	whiteButton: {
		color: styles.colors.secondary,
	},
});

export class IntroScreen extends Component {

	constructor(props) {
		super(props);
		this.pages = [{
			title: 'Get the most out of Build.com\n',
			body: 'With an account you can collaborate with projects, organize favorites, and easily manage your orders and shipments.',
			upperStyle: {
				justifyContent: 'center',
			},
			textBoxStyle: {},
			buttons: [
				{
					text: 'Login',
					color: 'primary',
					onPress: () => {
						this.props.navigator.push('loginModal', {
							loginSuccess: () => {
								this.props.navigator.pop();
								this.pager.goToPage(1);
							},
							noNotificationPrompt: true,
							hideStatusBarOnUnmount: true,
						});
					},
					accessibilityLabel: 'Login Button',
					trackAction: TrackingActions.ONBOARDING_LOGIN,
				},
				{
					text: 'Sign Up',
					color: 'white',
					textColor: 'secondary',
					onPress: () => {
						this.props.navigator.push('loginModal', {
							loginSuccess: () => {
								this.props.navigator.pop();
								this.pager.goToPage(1);
							},
							initialScreen: 'SIGNUP',
							noNotificationPrompt: true,
							hideStatusBarOnUnmount: true,
						});
					},
					accessibilityLabel: 'Sign Up Button',
					trackAction: TrackingActions.ONBOARDING_SIGNUP,
				},
				{
					text: 'Continue as Guest',
					textColor: 'secondary',
					textOnly: true,
					onPress: () => this.pager.goToPage(1),
					accessibilityLabel: 'Continue As Guest Button',
					trackAction: TrackingActions.ONBOARDING_CONTINUE_AS_GUEST,
				},
			],
			image: require('../images/home-screen-logo.png'),
			imageStyle: {
				width: 200,
				height: 110,
				marginBottom: styles.measurements.gridSpace3,
			},
		}];
		if (helpers.isIOS()) {
			this.pages.push({
				title: () => {
					if (this.props.isLoggedIn) {
						return 'Welcome to Build!';
					} else {
						return 'Receive Build Deals!';
					}
				},
				body: () => {
					if (this.props.isLoggedIn) {
						return 'Enable notifications to receive real-time order updates, alerts on instant price drops and exclusive coupons.';
					} else {
						return 'Enable notifications to receive alerts on instant price drops and exclusive coupons.';
					}
				},
				buttons: [
					{
						text: 'Opt into Push Notifications',
						color: 'primary',
						onPress: () => {
							PushNotificationsIOS.requestPermissions().then(() => {
								this.pager.goToPage(2);
							});
						},
						accessibilityLabel: 'Notifications Opt In',
						trackAction: TrackingActions.ONBOARDING_NOTIFICATIONS_OPT_IN,
					},
					{
						text: 'No thanks, not at this time',
						color: 'white',
						textColor: 'secondary',
						onPress: () => this.pager.goToPage(2),
						accessibilityLabel: 'Notifications Opt Out',
						trackAction: TrackingActions.ONBOARDING_NOTIFICATIONS_OPT_OUT,
					},
				],
				image: require('../images/rep/helper.png'),
			});
		}
		this.pages.push({
			title: 'Ok, you\'re all set up!',
			body: 'Feel free to hit the "Experts" tab whenever you need help from one of our awesome product experts!',
			buttons: [
				{
					text: 'Tour the App',
					color: 'primary',
					onPress: () => this.finishOnboarding(true),
					accessibilityLabel: 'Tour The App',
					trackAction: TrackingActions.ONBOARDING_TOUR_THE_APP,
				},
				{
					text: 'Start Shopping',
					color: 'white',
					textColor: 'secondary',
					onPress: this.finishOnboarding,
					accessibilityLabel: 'Start Shopping',
					trackAction: TrackingActions.ONBOARDING_START_SHOPPING,
				},
			],
			image: require('../images/rep/helper.png'),
		});
	}

	componentWillMount() {
		helpers.setStatusBarHidden(true, 'fade');
	}

	componentDidMount() {
		this.props.actions.trackState('build:app:intro');
	}

	componentWillUnmount() {
		if (this.timeout) {
			clearTimeout(this.timeout);
		}
	}

	renderPage = (page, index) => {
		let buttons;
		if (page.buttons) {
			buttons = page.buttons.map((button, index) => {
				if (button.textOnly) {
					return (
						<TouchableOpacity
							key={index}
							style={[componentStyles.touchableOpacity, componentStyles.button]}
							onPress={button.onPress}
						>
							<Text
								weight="bold"
								decoration="underline"
							>{button.text} </Text>
							<Icon
								color={styles.colors.secondary}
								size={18}
								name="ios-arrow-forward"
							/>
						</TouchableOpacity>
					);
				}
				return (
					<Button
						style={[componentStyles.button, button.style]}
						color={button.color}
						key={index}
						text={button.text}
						onPress={button.onPress}
						textColor={button.textColor}
						accessibilityLabel={button.accessibilityLabel}
						trackAction={button.trackAction}
					/>
				);
			});
		}

		return (
			<View
				style={componentStyles.page}
				key={index}
			>
				<View style={[componentStyles.upper, page.upperStyle]}>
					<Image
						resizeMode="contain"
						source={page.image}
						style={page.imageStyle || componentStyles.image}
					/>
					<View style={page.textBoxStyle || componentStyles.textBox}>
						<Text
							size="large"
							textAlign="center"
						>
							<Text
								weight="bold"
								size="large"
							>
								{typeof page.title === 'function' ? page.title() : page.title}{' '}
							</Text>
							{typeof page.body === 'function' ? page.body() : page.body}
						</Text>
					</View>
				</View>
				<View style={componentStyles.lower}>
					{buttons}
				</View>
			</View>
		);
	};

	finishOnboarding = (showTour) => {
		helpers.setStatusBarHidden(false, 'fade');
		this.props.navigator.pop();
		if (showTour) {
			EventEmitter.emit('showCustomScreenOverlay', {
				component: <Tutorial />,
				alpha: 0.5,
			});
		}
	};

	render() {
		const pages = this.pages.map(this.renderPage);
		return (
			<View style={componentStyles.container}>
				<TouchableOpacity
					accessibilityLabel="Skip"
					style={componentStyles.skipButton}
					onPress={() => {
						this.props.actions.trackAction(TrackingActions.ONBOARDING_SKIP_INTRO);
						this.finishOnboarding();
					}}
				>
					<Text lineHeight={false}>Skip </Text>
					<Icon
						color={styles.colors.secondary}
						size={18}
						name="ios-arrow-forward"
					/>
				</TouchableOpacity>
				<Pager
					markerEnabled={false}
					scrollEnabled={false}
					style={componentStyles.pager}
					ref={(ref) => this.pager = ref}
				>
					{pages}
				</Pager>
			</View>
		);
	}

}

IntroScreen.route = {
	styles: {
		...NavigationStyles.SlideVertical,
		gestures: null,
	},
};

IntroScreen.propTypes = {
	actions: PropTypes.shape({
		trackState: PropTypes.func,
		trackAction: PropTypes.func,
		registerDeviceToken: PropTypes.func,
	}),
	isLoggedIn: PropTypes.bool,
	navigator: PropTypes.shape({
		push: PropTypes.func,
		pop: PropTypes.func,
	}),
};

IntroScreen.defaultProps = {};

const mapStateToProps = ({ userReducer }) => {
	return {
		isLoggedIn: userReducer.isLoggedIn,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			trackState,
			trackAction,
		}, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(IntroScreen);
