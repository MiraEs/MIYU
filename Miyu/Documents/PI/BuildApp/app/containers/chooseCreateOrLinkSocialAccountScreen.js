'use strict';

import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	View,
	StyleSheet,
} from 'react-native';
import {
	Button,
	Text,
} from 'BuildLibrary';
import OrSeparator from '../components/OrSeparator';
import styles from '../lib/styles';
import {
	createSocialLoginCustomer,
	updatePresentNoEmailError,
} from '../actions/SocialLoginActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import TrackingActions from '../lib/analytics/TrackingActions';
import helpers from '../lib/helpers';
import tracking from '../lib/analytics/tracking';
import {
	trackAction,
	trackState,
} from '../actions/AnalyticsActions';

const componentStyles = StyleSheet.create({
	middle: {
		marginVertical: styles.measurements.gridSpace4,
	},
	buttons: {
		flex: 0,
		marginTop: styles.measurements.gridSpace3,
	},
});

export class ChooseCreateOrLinkSocialAccountScreen extends Component {

	constructor(props) {
		super(props);
		this.props.actions.trackState('build:app:createOrLinkSocialAccount');
		this.state = {
			isCreateAccountLoading: false,
		};
	}

	createAccount = () => {
		const {
			actions: { createSocialLoginCustomer },
		} = this.props;

		this.setState({
			isCreateAccountLoading: true,
		});

		createSocialLoginCustomer().then((data) => {
			if (data && data.shouldPromptForCredentials) {
				// if we're here, we've detected that the user already has an account with that email
				// so we weren't able to create their account and they need to link instead
				this.props.navLogin(true);
			} else {
				tracking.trackAccountCreated();
				const { actions, cart, user } = this.props;
				actions.trackAction(TrackingActions.CUSTOMER_SIGNUP_COMPLETE, {
					user,
					cart,
					methodName: 'Facebook',
				});
				this.props.loginSuccess();
			}

			this.setState({
				isCreateAccountLoading: false,
			});
		})
		.catch(() => {
			this.setState({
				isCreateAccountLoading: false,
			});
		});
	};

	renderNoEmailError = () => {
		const {
			user: { noEmailErrorMessage },
		} = this.props;

		if (noEmailErrorMessage) {
			return <Text color="error">{noEmailErrorMessage}</Text>;
		}
	};

	render() {
		const buttonsDisabled = !!this.props.user.noEmailErrorMessage;

		return (
			<View>
				{this.renderNoEmailError()}
				<Text
					size="large"
					weight="bold"
					textAlign="center"
				>
					Do you want to create a Build.com account?
				</Text>
				<Button
					key="createAccount"
					disabled={buttonsDisabled}
					isLoading={this.state.isCreateAccountLoading}
					onPress={this.createAccount}
					text="Create My Account"
					style={componentStyles.buttons}
					accessibilityLabel="Create Account"
					trackAction={TrackingActions.CREATE_SOCIAL_ACCOUNT}
				/>
				<OrSeparator style={componentStyles.middle} />
				<Text
					size="large"
					weight="bold"
					textAlign="center"
				>
					Already have a Build.com account?
				</Text>
				<Text textAlign="center">
					Log in to link your Build and Facebook accounts
				</Text>
				<Button
					key="login"
					disabled={buttonsDisabled}
					onPress={this.props.navLogin}
					text="Login"
					style={componentStyles.buttons}
					color="white"
					textColor="secondary"
					accessibilityLabel="Login"
					trackAction={TrackingActions.LINK_SOCIAL_ACCOUNT}
				/>
			</View>
		);
	}

}

ChooseCreateOrLinkSocialAccountScreen.propTypes = {
	actions: PropTypes.object.isRequired,
	cart: PropTypes.object,
	loginSuccess: PropTypes.func.isRequired,
	navCreate: PropTypes.func.isRequired,
	navLogin: PropTypes.func.isRequired,
	user: PropTypes.object,
};

ChooseCreateOrLinkSocialAccountScreen.defaultProps = {
	loginSuccess: helpers.noop,
};

const mapStateToProps = (state) => {
	return {
		user: state.userReducer.user,
		cart: state.cartReducer.cart,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			createSocialLoginCustomer,
			updatePresentNoEmailError,
			trackAction,
			trackState,
		}, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ChooseCreateOrLinkSocialAccountScreen);
