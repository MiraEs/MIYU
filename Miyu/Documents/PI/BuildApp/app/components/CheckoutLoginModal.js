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
	Image,
	withScreen,
	Text,
} from 'BuildLibrary';
import styles from '../lib/styles';
import Icon from 'react-native-vector-icons/Ionicons';
import TrackingActions from '../lib/analytics/TrackingActions';
import helpers from '../lib/helpers';
import {
	PAYPAL,
} from '../constants/CheckoutConstants';

import NavigationBarIconTitle from '../components/navigationBar/NavigationBarIconTitle';

const componentStyles = StyleSheet.create({
	contentWrapper: {
		flex: 1,
		padding: styles.measurements.gridSpace2,
	},
	verticalMargin: {
		marginVertical: styles.measurements.gridSpace1,
	},
	perksContainer: {
		paddingVertical: styles.measurements.gridSpace1,
		paddingHorizontal: 40,
	},
	perksIcon: {
		paddingRight: styles.measurements.gridSpace2,
	},
	perksText: {
		flex: 1,
	},
	title: {
		marginRight: styles.measurements.gridSpace1,
	},
});

export class CheckoutLoginModal extends Component {

	setScreenTrackingInformation() {
		return {
			name: 'build:app:checkoutloginmodal',
		};
	}

	onCheckoutLogin = (isGuest = false) => {
		const { onCheckoutLogin } = this.props;

		onCheckoutLogin(isGuest);
	};

	onLogin = (initialScreen = 'LOGIN') => {
		const { navigator } = this.props;

		navigator.push('loginModal', {
			loginSuccess: () => {
				navigator.pop();
				this.onCheckoutLogin();
			},
			showEnrollAsPro: false,
			isCheckout: true,
			initialScreen,
		});
	};

	onGuest = () => {
		this.onCheckoutLogin(true);
	};

	renderTitle = () => {
		const { paymentType } = this.props;
		const payPalLogo = require('../../images/PP_logo.png');

		if (paymentType === PAYPAL) {
			return (
				<View style={[styles.elements.centeredFlexRow, componentStyles.verticalMargin]}>
					<Text
						weight="bold"
						style={componentStyles.title}
					>
						Proceed to
					</Text>
					<Image
						resizeMode="contain"
						height={25}
						width={100}
						source={payPalLogo}
						style={componentStyles.test}
					/>
				</View>
			);
		}

		return (
			<Text
				weight="bold"
				style={componentStyles.verticalMargin}
			>
				Build.com members always get more!
			</Text>
		);
	};

	render() {

		return (
			<View style={styles.elements.screen}>
				<View style={componentStyles.contentWrapper}>
					{this.renderTitle()}
					<Button
						text="Log in to Build.com"
						color="primary"
						style={[componentStyles.verticalMargin, styles.elements.noFlex]}
						onPress={this.onLogin}
						trackAction={TrackingActions.CHECKOUT_LOGIN}
						accessibilityLabel="Member Sign In Button"
					/>
					<Button
						text="Create a Build.com Account"
						color="white"
						textColor="secondary"
						style={[componentStyles.verticalMargin, styles.elements.noFlex]}
						onPress={() => this.onLogin('SIGNUP')}
						trackAction={TrackingActions.CHECKOUT_SIGNUP}
						accessibilityLabel="Create Account Button"
					/>
					<View style={componentStyles.perksContainer}>
						<View style={[styles.elements.centeredFlexRow, componentStyles.verticalMargin]}>
							<Icon
								name="logo-codepen"
								size={40}
								style={componentStyles.perksIcon}
								color={styles.colors.secondary}
							/>
							<Text
								weight="bold"
								style={componentStyles.perksText}
							>
								Earn rewards points on every purchase
							</Text>
						</View>
						<View style={[styles.elements.centeredFlexRow, componentStyles.verticalMargin]}>
							<Icon
								name="md-cart"
								size={40}
								style={componentStyles.perksIcon}
								color={styles.colors.secondary}
							/>
							<Text
								weight="bold"
								style={componentStyles.perksText}
							>
								Save time with super fast checkout
							</Text>
						</View>
						<View style={[styles.elements.centeredFlexRow, componentStyles.verticalMargin]}>
							<Icon
								name="md-heart"
								size={40}
								style={componentStyles.perksIcon}
								color={styles.colors.secondary}
							/>
							<Text
								weight="bold"
								style={componentStyles.perksText}
							>
								Create Favorites Lists
							</Text>
						</View>
					</View>
					<Button
						text="Guest Checkout"
						color="white"
						textColor="secondary"
						style={[componentStyles.verticalMargin, styles.elements.noFlex]}
						onPress={this.onGuest}
						trackAction={TrackingActions.CHECKOUT_GUESTCHECKOUT}
						accessibilityLabel="Guest Checkout Button"
					/>
				</View>
			</View>
		);
	}
}

CheckoutLoginModal.route = {
	navigationBar: {
		visible: true,
		renderTitle(navProps) {
			const { title } = navProps.params;

			return (
				<NavigationBarIconTitle color={helpers.isIOS() ? 'secondary' : 'greyLight'}>
					{title}
				</NavigationBarIconTitle>
			);
		},
	},
};

CheckoutLoginModal.propTypes = {
	navigator: PropTypes.shape({
		push: PropTypes.func,
		replace: PropTypes.func,
	}),
	onCheckoutLogin: PropTypes.func.isRequired,
	paymentType: PropTypes.string.isRequired,
};

export default (withScreen(CheckoutLoginModal));
