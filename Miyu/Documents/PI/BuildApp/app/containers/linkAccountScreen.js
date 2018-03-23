'use strict';

import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	View,
	Text,
	Image,
	StyleSheet,
	TextInput,
	TouchableOpacity,
} from 'react-native';
import styles from '../lib/styles';
import Button from '../components/button';
import NavigationBar from '../components/NavigationBar';
import Icon from 'react-native-vector-icons/Ionicons';
import { linkExistingCustomer } from '../actions/SocialLoginActions';
import Joi from 'rn-joi';
import { connect } from 'react-redux';
import TrackingActions from '../lib/analytics/TrackingActions';
import { trackState } from '../actions/AnalyticsActions';
import { bindActionCreators } from 'redux';

const componentStyles = StyleSheet.create({
	screen: {
		backgroundColor: styles.colors.white,
		flex: 1,
	},
	content: {
		margin: styles.measurements.gridSpace1,
	},
	promptText: {
		color: styles.colors.secondary,
		fontFamily: styles.fonts.mainRegular,
	},
	button: {
		marginTop: styles.measurements.gridSpace1,
	},
	linkGraphics: {
		marginHorizontal: 50,
		marginVertical: styles.measurements.gridSpace3,
		flexDirection: 'row',
		justifyContent: 'space-around',
	},
	forgotPassword: {
		marginTop: styles.measurements.gridSpace3,
	},
	forgotPasswordText: {
		color: styles.colors.primary,
		textAlign: 'center',
		paddingVertical: styles.measurements.gridSpace1,

	},
	socialContainer: {
		backgroundColor: styles.colors.facebookBlue,
		height: 40,
		width: 40,
		borderRadius: 3,
		overflow: 'hidden',
	},
	socialIcon: {
		position: 'absolute',
		bottom: -10,
		right: 8,
	},
	graphicalItem: {
		width: 100,
		alignItems: 'center',
	},
	logo: {
		width: 100,
		height: 40,
	},
	error: {
		paddingBottom: styles.measurements.gridSpace1,
	},
});

export class LinkAccountScreen extends Component {

	constructor(props) {
		super(props);
		this.credentials = {
			username: props.email || '',
			password: '',
		};

		this.state = {
			isLoading: false,
			error: '',
		};
	}

	componentDidMount() {
		this.props.actions.trackState('build:app:linkaccount');
	}

	navigateToForgotPassword = () => {
		this.props.navigator.push('forgotPassword', {
			shouldResetStatusBar: false,
		});
	};

	linkAccount = () => {
		this.setState({
			isLoading: true,
		});

		const { dispatch, loginSuccess } = this.props;
		const { username, password } = this.credentials;

		const request = {
			username,
			password,
			socialLoginType: 'facebook',
			socialUserAccessToken: this.props.user.socialUserAccessToken,
			socialUserId: this.props.user.socialUserId,
		};

		const schema = Joi.object().keys({
			username: Joi.string().email().required(),
			password: Joi.string().required(),
		});

		try {
			Joi.assert({ username, password }, schema);
		} catch (error) {
			const { path, type } = error.details[0];
			const messages = {
				username: {
					'string.email': 'You must enter a valid email address',
					'any.required': 'You must provide an email address',
				},
				password: { 'any.required': 'You must provide a password' },
			};

			this.setState({
				error: messages[path][type],
				isLoading: false,
			});
			return;
		}

		dispatch(linkExistingCustomer(request))
			.then((data) => {
				this.setState({
					isLoading: false,
				});
				if (!data.hasOwnProperty('error')) {
					loginSuccess();
				}
			}, () => {
				this.setState({
					isLoading: false,
				});
			});
	};

	onInputChange = (text, field) => {
		this.credentials[field] = text;
	};

	onCancel = () => {
		this.props.navigator.pop();
	};

	renderError = () => {
		const { error } = this.state;
		if (error) {
			return (
				<Text style={[styles.text.error, styles.text.center, componentStyles.error]}>{error}</Text>
			);
		}
	};

	render() {
		return (
			<View style={componentStyles.screen}>
				<NavigationBar
					leftNavButton={{
						text: 'Cancel',
						onPress: this.onCancel,
					}}
					title={{
						text: 'Link Account',
					}}
				/>
				<View style={componentStyles.content}>
					<Text style={componentStyles.promptText}>Just sign in to your Build.com account and you are good to go!</Text>
					<View style={componentStyles.linkGraphics}>
						<View style={componentStyles.graphicalItem}>
							<View style={componentStyles.socialContainer}>
								<Icon
									color={styles.colors.white}
									name="logo-facebook"
									size={42}
									style={componentStyles.socialIcon}
								/>
							</View>
						</View>
						<View style={componentStyles.graphicalItem}>
							<Icon
								color={styles.colors.secondary}
								name="ios-swap"
								size={40}
							/>
						</View>
						<Image
							resizeMode="contain"
							source={require('../images/home-screen-logo.png')}
							style={componentStyles.logo}
						/>
					</View>
					{this.renderError()}
					<View style={styles.elements.inputGroup}>
						<TextInput
							autoCapitalize="none"
							autoCorrect={false}
							autoFocus={!this.props.email}
							defaultValue={this.props.email}
							keyboardType="email-address"
							onChangeText={(text) => this.onInputChange(text, 'username')}
							placeholder="Email"
							style={styles.elements.inputGroupItem}
							underlineColorAndroid="transparent"
						/>
						<View style={styles.elements.inputGroupDivider}/>
						<TextInput
							autoFocus={!!this.props.email}
							onChangeText={(text) => this.onInputChange(text, 'password')}
							placeholder="Password"
							secureTextEntry={true}
							style={styles.elements.inputGroupItem}
							underlineColorAndroid="transparent"
						/>
					</View>
					<Button
						isLoading={this.state.isLoading}
						onPress={this.linkAccount}
						text="Link Account"
						style={componentStyles.button}
						trackAction={TrackingActions.LINK_ACCOUNT_LINK}
						accessibilityLabel="Link Account"
					/>
					<TouchableOpacity
						onPress={this.navigateToForgotPassword}
						style={componentStyles.forgotPassword}
					>
						<Text style={componentStyles.forgotPasswordText}>Forgot Password</Text>
					</TouchableOpacity>
				</View>
			</View>
		);
	}

}

LinkAccountScreen.propTypes = {
	actions: PropTypes.shape({
		trackState: PropTypes.func,
	}),
	navigator: PropTypes.shape({
		push: PropTypes.func,
		pop: PropTypes.func,
	}),
	email: PropTypes.string,
	user: PropTypes.object,
	dispatch: PropTypes.func,
	loginSuccess: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
	return {
		user: state.userReducer.user,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({ trackState }, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(LinkAccountScreen);
