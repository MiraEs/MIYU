'use strict';

import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	View,
	StyleSheet,
	Alert,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
	isAndroid,
	isIOS,
	getIcon,
	isPushNotificationsAllowed,
	noop,
	setStatusBarHidden,
} from '../lib/helpers';
import styles from '../lib/styles';
import NavigationBarIconButton from '../components/navigationBar/NavigationBarIconButton';
import {
	create,
	getNotificationSettings,
	saveNotificationSettings,
	updateSignUpError,
	signUserOut,
	updateCustomer,
} from '../actions/UserActions';
import {
	getProjects,
	getShoppingLists,
} from '../actions/ProjectActions';
import Form from '../components/Form';
import FormInput from '../components/FormInput';
import ErrorText from '../components/ErrorText';
import {
	HOME,
	LISTS,
} from '../constants/constants';
import {
	Button,
	Text,
	withScreen,
	ScrollView,
} from 'BuildLibrary';
import Icon from 'react-native-vector-icons/Ionicons';
import EventEmitter from '../lib/eventEmitter';
import { ORDER_NOTIFICATIONS } from '../constants/Notifications';
import { hasProjects } from '../reducers/helpers/projectsReducerHelper';
import { trackState } from '../actions/AnalyticsActions';
import TrackingActions from '../lib/analytics/TrackingActions';
import PushNotificationsIOS from 'PushNotificationsIOS';
import { showAlert } from '../actions/AlertActions';

const CHECKOUT_CONFIRMATION_CLOSE_ON_PRESS = 'CHECKOUT_CONFIRMATION_CLOSE_ON_PRESS';

const componentStyles = StyleSheet.create({
	button: {
		width: 200,
		alignSelf: 'center',
		marginTop: styles.measurements.gridSpace2,
		flex: 0,
	},
	horizontalRule: {
		borderColor: styles.colors.lightGray,
		borderBottomWidth: styles.dimensions.borderWidthLarge,
	},
	section: {
		marginHorizontal: styles.measurements.gridSpace1,
		paddingBottom: styles.measurements.gridSpace3,
		marginBottom: styles.measurements.gridSpace3,
	},
	check: {
		alignSelf: 'center',
		marginTop: styles.measurements.gridSpace1,
	},
	marginBottom2: {
		marginBottom: styles.measurements.gridSpace2,
		marginHorizontal: styles.measurements.gridSpace2,
	},
	buttonLeft: {
		flex: 1,
		marginRight: 7,
	},
});

export class CheckoutConfirmationScreen extends Component {

	constructor(props) {
		super(props);

		this.state = {
			password: '',
			passwordConfirm: '',
			showBanner: false,
			showAddToProject: true,
			iOSPushNotificationsOn: false,
		};
	}

	componentWillMount() {
		const { isLoggedIn } = this.props,
			{
				getProjects,
				getNotificationSettings,
				getShoppingLists,
			} = this.props.actions;

		if (isLoggedIn) {
			getProjects().done();
			getShoppingLists().done();
		}

		getNotificationSettings();
		setStatusBarHidden(false, 'fade');

		if (isIOS()) {
			this.areIOSPushNotificationsOn().then((iOSPushNotificationsOn) =>
				this.setState({ iOSPushNotificationsOn })
			);
		}
	}

	componentDidMount() {
		EventEmitter.addListener(CHECKOUT_CONFIRMATION_CLOSE_ON_PRESS, this.navigateHome);
		if (isIOS() && !this.props.user.isGuest && !this.state.iOSPushNotificationsOn) {
			setTimeout(() => {
				this.requestIOSPermissions().done();
			}, 1000);
		}
	}

	componentWillReceiveProps(newProps) {
		if (newProps.orders && newProps.orders.length) {
			const order = newProps.orders.find((order) => order.orderNumber === this.props.orderNumber);

			if (order) {
				this.setBannerMessage(order);
			}
		}
	}

	componentWillUnmount() {
		EventEmitter.removeListener(CHECKOUT_CONFIRMATION_CLOSE_ON_PRESS, this.navigateHome);
		const { user } = this.props,
			{ signUserOut } = this.props.actions;
		if (user.isGuest) {
			signUserOut(null, user.isGuest);
		}
	}

	setScreenTrackingInformation() {
		return {
			name: 'build:app:checkoutconfirmation',
		};
	}

	addOrderToProject = () => {
		const { isLoggedIn, orderNumber, projects, user } = this.props;

		if (isLoggedIn && !user.isGuest) {
			this.setState({
				showBanner: true,
			}, () => {
				if (hasProjects(projects)) {
					this.props.navigator.push('projects', { orderNumber });
				} else {
					this.props.navigator.push('newProject', { orderNumber });
				}
			});
		} else {
			Alert.alert('Account Required', 'Please create an account to enable Projects.', [{
				text: 'OK',
			}]);
		}
	};

	areOrderNotificationsOn = () => {
		const { notificationSettings } = this.props;

		return ORDER_NOTIFICATIONS.reduce((prev, setting) => {
			return prev &&
				notificationSettings[setting] &&
				notificationSettings[setting].PUSH;
		}, true);
	};

	areIOSPushNotificationsOn = () => {
		return new Promise((resolve) => {
			PushNotificationsIOS.checkPermissions((notificationsObj) => {
				resolve(isPushNotificationsAllowed(notificationsObj));
			});
		});
	};

	createAccount = () => {
		const { updateCustomer, updateSignUpError } = this.props.actions,
			{ iOSPushNotificationsOn, password, passwordConfirm } = this.state;

		const valid = this.createAccountForm.triggerValidation();

		updateSignUpError('');
		if (valid) {
			updateCustomer({
				password,
				passwordConfirm,
				isGuest: false,
			}).then(() => {
				if (!iOSPushNotificationsOn) {
					this.requestIOSPermissions().then(() => this.navigateHome()).done();
				} else {
					this.navigateHome();
				}
			}).catch(this.createAccountFail).done();
		}
	};

	createAccountFail = (signUpError) => {
		this.props.actions.updateSignUpError(signUpError.message);
	};

	enableNotifications = () => {
		const {
			actions: { saveNotificationSettings },
			user: { isGuest },
		} = this.props;

		if (isGuest) {
			Alert.alert('Account Required', 'Please create an account to enable notifications.', [{
				text: 'OK',
			}]);
		} else {
			ORDER_NOTIFICATIONS.map((setting) =>
				saveNotificationSettings({
					enabled: true,
					eventType: setting,
					notificationType: 'PUSH',
				})
			);
		}
	};

	handlePassword = ({ password: { value: password } }) => {
		this.setState({
			password,
			passwordConfirm: password,
		});
	};

	navigateHome = () => {
		const {
			hasListsTab,
			navigation,
			navigator,
		} = this.props;
		navigation.performAction(({ stacks, tabs }) => {
			tabs('main').jumpToTab(HOME);
			if (hasListsTab) {
				stacks(LISTS).popToTop();
			}
		});
		navigator.popToTop();
	};

	requestIOSPermissions = () => {
		const {
			actions: { saveNotificationSettings },
			notificationSettings,
		} = this.props;

		return PushNotificationsIOS.requestPermissions()
			.then((newNotificationsObj) => {
				if (isPushNotificationsAllowed(newNotificationsObj)) {
					this.setState({ iOSPushNotificationsOn: true });
					// push is now allowed so turn them all on
					Object.keys(notificationSettings).map((setting) =>
						saveNotificationSettings({
							enabled: true,
							eventType: setting,
							notificationType: 'PUSH',
						})
					);
				}
			})
			.catch(noop);
	};

	setBannerMessage = (order) => {
		const { projectName } = order;
		let { showBanner } = this.state;
		let bannerMessage = 'Error: unable to add order to project.';
		let bannerType = 'error';

		if (projectName) {
			bannerMessage = `Order added to ${projectName}.`;
			bannerType = 'success';
			showBanner = true;
		}

		if (showBanner) {
			this.props.actions.showAlert(bannerMessage, bannerType);
			this.setState({
				showAddToProject: !projectName,
				showBanner: false,
			});
		}
	};

	renderAddToProject = () => {
		const { showAddToProject } = this.state;
		const { projectsFeature } = this.props;

		if (!showAddToProject || !projectsFeature) {
			return null;
		}

		return (
			<Button
				color="white"
				onPress={this.addOrderToProject}
				text="Add to Project"
				textColor="secondary"
				accessibilityLabel="Add to Project"
				style={componentStyles.buttonLeft}
				trackAction={TrackingActions.CHECKOUT_CONFIRMATION_ADD_TO_PROJECT}
			/>
		);
	};
	renderCreateAccount = () => {
		const { isCreatingUser, isLoggedIn, signUpError, user } = this.props;

		if (isLoggedIn && !user.isGuest) {
			return <View />;
		}

		return (
			<View style={[componentStyles.section, componentStyles.horizontalRule]}>
				<Text
					size="large"
					weight="bold"
					textAlign="center"
				>
					Make Checkout Fast & Easy
				</Text>
				<Text
					textAlign="center"
					style={componentStyles.marginBottom2}
				>
					Create an account to save your billing & shipping information for next time.
				</Text>
				<ErrorText text={signUpError} />
				<Form
					ref={(c) => this.createAccountForm = c}
					onChange={this.handlePassword}
					scrollView={this.scrollView}
					style={styles.elements.flex}
				>
					<FormInput
						value={this.state.password}
						isRequired={true}
						label="Password"
						name="password"
						secureTextEntry={true}
						accessibilityLabel="Password"
					/>
				</Form>
				<Button
					isLoading={isCreatingUser}
					color="primary"
					onPress={this.createAccount}
					text="Create an Account"
					accessibilityLabel="Create an Account"
					style={componentStyles.button}
					trackAction={TrackingActions.CHECKOUT_CONFIRMATION_CREATE_ACCOUNT}
				/>
			</View>
		);
	};

	renderNotifications = () => {
		if (
			((this.state.iOSPushNotificationsOn || isAndroid()) &&
				!this.areOrderNotificationsOn()) ||
			this.props.user.isGuest
		) {
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
						trackAction={TrackingActions.CHECKOUT_CONFIRMATION_ENABLE_NOTIFICATIONS}
						accessibilityLabel="Enable Notifications"
					/>
				</View>
			);
		}

		return <View />;
	};

	render() {
		const { orderNumber } = this.props;

		return (
			<View
				style={styles.elements.screen}
			>
				<ScrollView ref={(ref) => this.scrollView = ref}>
					<View style={[componentStyles.section, componentStyles.horizontalRule]}>
						<Icon
							color={styles.colors.primary}
							name="md-checkmark-circle"
							size={60}
							style={componentStyles.check}
						/>
						<Text
							weight="bold"
							textAlign="center"
						>
							Thank you for your order!
						</Text>
						<Text textAlign="center">Your confirmation number is</Text>
						<Text
							weight="bold"
							textAlign="center"
							style={componentStyles.marginBottom2}
							accessibilityLabel="Order Number"
							selectable={true}
						>
							#{orderNumber}
						</Text>
						<View style={styles.elements.flexRow}>
							{this.renderAddToProject()}
							<Button
								color="white"
								onPress={this.navigateHome}
								text="Continue Shopping"
								textColor="secondary"
								accessibilityLabel="Continue Shopping"
								style={styles.elements.flex1}
								trackAction={TrackingActions.CHECKOUT_CONFIRMATION_CONTINUE_SHOPPING}
							/>
						</View>
					</View>
					{this.renderCreateAccount()}
					{this.renderNotifications()}
				</ScrollView>
			</View>
		);
	}
}

CheckoutConfirmationScreen.route = {
	navigationBar: {
		visible: true,
		title: 'Checkout',
		renderLeft() {
			return (
				<NavigationBarIconButton
					onPress={() => EventEmitter.emit(CHECKOUT_CONFIRMATION_CLOSE_ON_PRESS)}
					iconName={getIcon('close')}
					trackAction={TrackingActions.CHECKOUT_CONFIRMATION_NAV_TAP_CLOSE}
				/>
			);
		},
	},
};

CheckoutConfirmationScreen.propTypes = {
	actions: PropTypes.object,
	isCreatingUser: PropTypes.bool,
	isLoggedIn: PropTypes.bool,
	hasListsTab: PropTypes.bool,
	notificationSettings: PropTypes.object,
	projectsFeature: PropTypes.bool,
	signUpError: PropTypes.string,
	user: PropTypes.object,
	orderNumber: PropTypes.number,
	projects: PropTypes.object,
	navigator: PropTypes.shape({
		push: PropTypes.func,
		popToTop: PropTypes.func,
	}),
	navigation: PropTypes.shape({
		performAction: PropTypes.func,
	}),
};

const mapStateToProps = (state) => {
	return {
		isCreatingUser: state.userReducer.isCreatingUser,
		isLoggedIn: state.userReducer.isLoggedIn,
		hasListsTab: !!state.navigation.navigators[LISTS],
		notificationSettings: state.userReducer.notificationSettings,
		projectsFeature: state.featuresReducer.features.projects,
		signUpError: state.userReducer.errors.signUp,
		user: state.userReducer.user,
		orders: state.ordersReducer.orders,
		projects: state.projectsReducer.projects,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			create,
			getNotificationSettings,
			getShoppingLists,
			saveNotificationSettings,
			updateSignUpError,
			signUserOut,
			getProjects,
			updateCustomer,
			trackState,
			showAlert,
		}, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(withScreen(CheckoutConfirmationScreen));
