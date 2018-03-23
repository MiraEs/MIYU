'use strict';
import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';

import {
	View,
	StyleSheet,
	Platform,
} from 'react-native';

import {
	IconButton,
	ScrollView,
	Text,
	withScreen,
} from 'BuildLibrary';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import helpers, {
	isAndroid,
	isIOS,
	setStatusBarHidden,
} from '../lib/helpers';
import styles from '../lib/styles';
import { NavigationStyles } from '@expo/ex-navigation';
import LoginForm from '../components/login/LoginForm';
import SignUpForm from '../components/login/SignUpForm';
import ForgotPasswordForm from '../components/login/ForgotPasswordForm';
import ChooseCreateOrLinkSocialAccountScreen from './chooseCreateOrLinkSocialAccountScreen';
import OrSeparator from '../components/OrSeparator';

import {
	resetLogin,
	update,
	getCustomerRep,
} from '../actions/UserActions';
import { getClientLoginData } from '../actions/SocialLoginActions';
import { copySessionCart, getSessionCart } from '../actions/CartActions';
import { unauthorizedError } from '../actions/ErrorActions';
import tracking from '../lib/analytics/tracking';
import NavigationBar from '../components/NavigationBar';
import TrackingActions from '../lib/analytics/TrackingActions';
import { getUserInfo } from '../services/facebookService';
import store from 'react-native-simple-store';
import {
	STORE_CUSTOMER_INFO,
	STORE_NOTIFICATIONS_OPT_IN,
} from '../constants/constants';
import animations from '../lib/animations';
import EventEmitter from '../lib/eventEmitter';
import NotificationSoftAsk from '../components/NotificationSoftAsk';
import KeyboardSpacer from '../components/Library/View/KeyboardSpacer';
import { showAlert } from '../actions/AlertActions';

const componentStyles = StyleSheet.create({
	loginContent: {
		marginHorizontal: styles.measurements.gridSpace1,
		paddingTop: styles.measurements.gridSpace1,
	},
	contentText: {
		paddingHorizontal: 40,
	},
	marginOr: {
		marginVertical: styles.measurements.gridSpace4,
	},
	iconButton: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		marginHorizontal: styles.measurements.gridSpace1,
	},
	facebookButton: {
		flex: 0,
	},
	facebookIcon: {
		marginRight: 10,
	},
});

export class LoginModal extends Component {

	constructor(props) {
		super(props);
		this.state = {
			error: '',
			isSocialLogin: false,
			showScreen: props.initialScreen || 'LOGIN',
			isFacebook: false,
			isPro: false,
		};
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.customer && nextProps.customer.state === 'AUTH_STATUS_AUTHENTICATED') {
			if (this.state.isFacebook) {
				this.loginFacebookSuccess();
			} else {
				this.loginSuccess();
			}
		}
	}

	componentWillUnmount() {
		if (this.props.hideStatusBarOnUnmount) {
			setStatusBarHidden(true, 'fade');
		}
	}

	setScreenTrackingInformation() {
		return {
			name: 'build:app:loginmodal',
		};
	}

	getScreenConfigs = () => {
		const { isSocialLogin } = this.state;
		const { actions } = this.props;
		const configs = {
			FORGOT: {
				descriptionText: 'We will send you an email with a link to reset your password.',
				leftNavButton: {
					icon: helpers.getIcon('arrow-back'),
					onPress: () => this.setState({ showScreen: 'LOGIN' }),
				},
				title: {
					text: 'Reset Password',
				},
				style: this.getNavigationBarStyle(),
			},
			LOGIN: {
				descriptionText: '',
				leftNavButton: {
					icon: helpers.getIcon('close'),
					onPress: () => {
						actions.resetLogin();
						if (this.state.isSocialLogin) {
							this.setState({ showScreen: 'CHOOSE_CREATE' });
						} else {
							this.props.navigator.pop();
						}
					},
				},
				title: {
					text: 'Login',
				},
				style: this.getNavigationBarStyle(),
			},
			SIGNUP: {
				descriptionText: '',
				leftNavButton: {
					icon: helpers.getIcon('close'),
					onPress: () => {
						if (this.state.isSocialLogin) {
							this.setState({ showScreen: 'CHOOSE_CREATE' });
						} else {
							this.props.navigator.pop();
						}
					},
				},
				title: {
					text: 'Sign Up',
				},
				rightNavButton: {
					text: 'Login',
					onPress: () => {
						this.setState({ showScreen: 'LOGIN' });
					},
				},
				style: this.getNavigationBarStyle(),
			},
			CHOOSE_CREATE: {
				descriptionText: '',
				leftNavButton: {
					text: 'Cancel',
					onPress: () => this.setState({ showScreen: 'LOGIN', isSocialLogin: false }),
				},
				title: {
					text: 'Create/Link Account',
				},
				style: this.getNavigationBarStyle(),
			},
		};

		if (!isSocialLogin) {
			configs.LOGIN.rightNavButton = {
				text: 'Sign Up',
				onPress: () => {
					actions.resetLogin();
					this.setState({ showScreen: 'SIGNUP' });
				},
			};
		}

		return configs;
	};

	getNavigationBarStyle = () => {
		return Platform.select({
			ios: {
				borderBottomWidth: styles.dimensions.borderWidth,
				borderBottomColor: styles.colors.grey,
			},
		});
	};

	/**
	 *
	 * In some cases it seems like the user object doesn't exists or in other words props hasn't received the auth user
	 * object. We need to wait until the auth user is available and then track the login success and perform other tasks.
	 */
	hasLoggedInCustomer = (customer) => {
		return customer && customer.status === 'AUTH_STATUS_AUTHENTICATED';
	};

	// before turning on facebook make sure that this correctly pops the user
	// back to the screen they were on and catches the error
	loginWithFacebook = () => {
		const {
			actions: { getClientLoginData, update },
		} = this.props;

		this.setState({
			error: '',
		});

		getClientLoginData()
			.then((data) => {
				if (data && data.promptForCustomer) {
					getUserInfo()
						.then((user) => {
							update(user);
							if (!user.email) {
								this.props.actions.showAlert('Sorry! Your Facebook account must have an email address associated with it.  Please allow Facebook to share your email with us, or create your account through Build.com.', 'error', null, null, 7000);
							} else {
								this.setState({ isSocialLogin: true, showScreen: 'CHOOSE_CREATE' });
							}
						})
						.catch((error) => {
							this.setState({ error });
						})
						.done();
				} else if (data && !data.hasOwnProperty('isCancelled')) {
					update(data);
					this.loginFacebookSuccess();
				}
			})
			.catch((error) => {
				this.props.loginFail(error.message);
				this.setState({ error: error.message });
			})
			.done();
	};

	loginFacebookSuccess = () => {
		if (this.hasLoggedInCustomer(this.props.customer)) {
			tracking.trackCustomerLoggedIn(this.props.customer, 'Facebook');
			this.loginSuccess();
		} else {
			this.setState({ isFacebook: true });
		}
	};

	loginSuccess = async () => {
		if (this.hasLoggedInCustomer(this.props.customer)) {
			const {
				actions: {
					copySessionCart,
					getSessionCart,
					unauthorizedError,
				},
				cart: {
					sessionCartId,
				},
				customer: {
					customerId,
					email,
				},
				isCheckout,
				noNotificationPrompt,
			} = this.props;
			store.save(STORE_CUSTOMER_INFO, { customerId, email }).catch(helpers.noop).done();
			unauthorizedError(false);

			if (isIOS() && !noNotificationPrompt && !isCheckout) {
				store.get(STORE_NOTIFICATIONS_OPT_IN).then((result) => {
					if (!result) {
						EventEmitter.emit('showCustomScreenOverlay', {
							component: <NotificationSoftAsk />,
							animation: animations.fadeIn,
							overlayStyles: {
								justifyContent: 'center',
							},
						});
					}
				});
			}

			if (sessionCartId) {
				copySessionCart({ customerId, sessionCartId })
					.then(({ sessionCartId }) => getSessionCart({ sessionCartId, recalculatePrice: true }))
					.then(this.maybeGetCustomerRep)
					.catch(helpers.noop)
					.done(() => this.props.loginSuccess());
			} else {
				await this.maybeGetCustomerRep();
				this.props.loginSuccess();
			}
		}
	};

	maybeGetCustomerRep = async () => {
		const { actions } = this.props;
		const { isPro, customerId } = this.props.customer;
		if (isPro && customerId) {
			await actions.getCustomerRep(customerId);
		}
	}

	renderChooseCreateOrLinkSocialAccount = () => {
		const { showScreen } = this.state;
		if (showScreen === 'CHOOSE_CREATE') {
			return (
				<View>
					<ChooseCreateOrLinkSocialAccountScreen
						loginFail={this.props.loginFail}
						loginSuccess={this.loginFacebookSuccess}
						navCreate={() => this.setState({ showScreen: 'SIGNUP' })}
						navLogin={(emailExists = false) => {
							this.setState({
								error: emailExists ? 'There is an account associated with this email. Do you want to log in?' : '',
								showScreen: 'LOGIN',
							});
						}}
						isCheckout={this.props.isCheckout}
					/>
				</View>
			);
		}
	};

	renderDescriptionText = (descriptionText) => {
		if (descriptionText) {
			return (
				<Text
					style={componentStyles.contentText}
					textAlign="center"
				>
					{descriptionText}
				</Text>
			);
		}
	};

	renderError = () => {
		const { error } = this.state;

		if (!error) {
			return null;
		}

		return (
			<Text
				color="error"
				size="small"
			>
				{error}
			</Text>
		);
	};

	// uses a variable that we can flip when facebook is ready
	renderFacebookButton = () => {
		const { isSocialLogin, showScreen } = this.state;
		const { features: { facebookLoginIOS, facebookLoginAndroid }, isLoadingSocial } = this.props;
		const facebookIOS = facebookLoginIOS && isIOS();
		const facebookAndroid = facebookLoginAndroid && isAndroid();

		let buttonText = 'Login with Facebook';
		if (showScreen === 'SIGNUP') {
			buttonText = 'Sign up with Facebook';
		}

		if ((facebookIOS || facebookAndroid) && !isSocialLogin) {
			return (
				<View>
					<OrSeparator style={componentStyles.marginOr} />
					<IconButton
						color="facebookBlue"
						iconName="logo-facebook"
						isLoading={isLoadingSocial}
						name="facebookButton"
						onPress={this.loginWithFacebook}
						style={componentStyles.facebookButton}
						text={buttonText}
						textColor="white"
						accessibilityLabel="Facebook Button"
						trackAction={TrackingActions.LOGIN_MODAL_FACEBOOK}
					/>
				</View>
			);
		}
	};

	renderForgotPasswordScreen = () => {
		const { showScreen } = this.state;

		if (showScreen === 'FORGOT') {
			return (
				<View>
					<ForgotPasswordForm
						navLogin={() => this.setState({ showScreen: 'LOGIN' })}
					/>
				</View>
			);
		}

	};

	renderLoginScreen = () => {
		const { isSocialLogin, showScreen } = this.state;

		if (showScreen === 'LOGIN') {
			return (
				<View>
					<LoginForm
						loginFail={this.props.loginFail}
						loginSuccess={this.loginSuccess}
						navForgotPassword={() => this.setState({ showScreen: 'FORGOT' })}
						linkAccounts={isSocialLogin}
						isCheckout={this.props.isCheckout}
						noNotificationPrompt={this.props.noNotificationPrompt}
					/>
					{this.renderFacebookButton()}
				</View>
			);
		}
	};

	renderSignupScreen = () => {
		const { isSocialLogin, showScreen } = this.state;

		if (showScreen === 'SIGNUP') {
			return (
				<View>
					<SignUpForm
						loginFail={this.props.loginFail}
						loginSuccess={this.loginSuccess}
						linkAccounts={isSocialLogin}
						isCheckout={this.props.isCheckout}
						noNotificationPrompt={this.props.noNotificationPrompt}
						showEnrollAsPro={this.props.showEnrollAsPro}
						onChangeIsPro={(isPro) => this.setState({ isPro })}
						isPro={this.state.isPro}
					/>
					{!this.state.isPro && this.renderFacebookButton()}
				</View>
			);
		}

	};

	render() {
		const { showScreen } = this.state;
		const {
			leftNavButton,
			title,
			rightNavButton,
			descriptionText,
			style,
		} = this.getScreenConfigs()[showScreen];

		return (
			<View
				style={styles.elements.screen}
			>
				<NavigationBar
					leftNavButton={leftNavButton}
					title={title}
					rightNavButton={rightNavButton}
					style={style}
					light={helpers.isIOS()}
				/>
				<ScrollView
					keyboardShouldPersistTaps="always"
					style={componentStyles.loginContent}
				>
					{this.renderDescriptionText(descriptionText)}
					{this.renderError()}
					{this.renderForgotPasswordScreen()}
					{this.renderLoginScreen()}
					{this.renderSignupScreen()}
					{this.renderChooseCreateOrLinkSocialAccount()}
				</ScrollView>
				<KeyboardSpacer />
			</View>
		);
	}

}

LoginModal.route = {
	styles: {
		...NavigationStyles.SlideVertical,
		gestures: null,
	},
};

LoginModal.propTypes = {
	loginFail: PropTypes.func,
	loginSuccess: PropTypes.func,
	features: PropTypes.object,
	actions: PropTypes.object.isRequired,
	error: PropTypes.string,
	showScreen: PropTypes.string,
	initialScreen: PropTypes.string,
	isCheckout: PropTypes.bool,
	noNotificationPrompt: PropTypes.bool,
	isLoadingSocial: PropTypes.bool,
	customer: PropTypes.object,
	cart: PropTypes.object,
	hideStatusBarOnUnmount: PropTypes.bool,
	navigator: PropTypes.shape({
		pop: PropTypes.func,
	}),
	showEnrollAsPro: PropTypes.bool,
};

LoginModal.defaultProps = {
	showEnrollAsPro: true,
	loginFail: helpers.noop,
	loginSuccess: helpers.noop,
	isCheckout: false,
};

const mapStateToProps = (state) => {
	return {
		cart: state.cartReducer.cart,
		customer: state.userReducer.user,
		features: state.featuresReducer.features,
		error: state.userReducer.errors.login,
		isLoadingSocial: state.userReducer.isLoggingInSocial,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			copySessionCart,
			getSessionCart,
			getClientLoginData,
			resetLogin,
			showAlert,
			unauthorizedError,
			getCustomerRep,
			update,
		}, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(withScreen(LoginModal));
