import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	View,
	StyleSheet,
} from 'react-native';

import { connect } from 'react-redux';
import styles from '../lib/styles';
import {
	Text,
	IconButton,
	Image,
	ImageButton,
	withScreen,
} from 'BuildLibrary';
import Address from '../components/Address';
import TrackingActions from '../lib/analytics/TrackingActions';

const componentStyles = StyleSheet.create({
	screen: {
		flex: 1,
		backgroundColor: styles.colors.greyLight,
	},
	payPalInfo: {
		backgroundColor: styles.colors.white,
		paddingLeft: styles.measurements.gridSpace2,
		paddingBottom: styles.measurements.gridSpace2,
		marginBottom: styles.measurements.gridSpace1,
		borderBottomColor: styles.colors.grey,
		borderBottomWidth: styles.dimensions.borderWidth,
	},
	payPalImageRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: styles.measurements.gridSpace1,
	},
	payPalImage: {
		height: 28,
		width: 98,
	},
	creditCardButton: {
		marginTop: styles.measurements.gridSpace1,
		width: (styles.dimensions.width / 3) * 2,
		flex: 0,
		alignSelf: 'center',
	},
	otherText: {
		marginTop: styles.measurements.gridSpace2,
	},
	editButton: {
		flex: 0,
		paddingRight: 0,
	},
});

export class PaymentPayPalScreen extends Component {

	setScreenTrackingInformation() {
		return {
			name: 'build:app:paymentpaypal',
		};
	}

	getShippingAddress = () => {
		const { user, paypal } = this.props;

		if (user && user.shippingAddresses && paypal && paypal.shippingAddressId) {
			return user.shippingAddresses.find((address) => address.addressId === paypal.shippingAddressId);
		}
	};

	renderPayPalInfo = () => {
		const { onEdit } = this.props;
		const payPalImage = require('../../images/PP_logo.png');
		const shippingAddress = this.getShippingAddress();

		if (shippingAddress) {
			return (
				<View
					style={componentStyles.payPalInfo}
				>
					<View
						style={componentStyles.payPalImageRow}
					>
						<Image
							resizeMode="contain"
							source={payPalImage}
							style={componentStyles.payPalImage}
						/>
						<IconButton
							borders={false}
							iconName="md-create"
							color="white"
							onPress={onEdit}
							style={componentStyles.editButton}
							text="Edit Info"
							textColor="primary"
							trackAction="EDIT_PAYPAL_INFO"
							accessibilityLabel="Edit PayPal Info"
						/>
					</View>
					<Text
						weight="bold"
					>
						Shipping to:
					</Text>
					<Address
						address={shippingAddress}
						boldName={false}
					/>
				</View>
			);
		}
	};

	renderCreditCardButton = () => {
		const { navigator } = this.props;

		return (
			<View>
				<Text
					textAlign="center"
					style={componentStyles.otherText}
				>
					Other Payment Methods
				</Text>
				<ImageButton
					accessibilityLabel="Credit Card"
					style={componentStyles.creditCardButton}
					onPress={() => {
						navigator.pop(1);
						navigator.replace('checkoutCreditCard');
					}}
					source={require('../../images/creditCard.png')}
					trackAction={TrackingActions.PAYMENT_PAYPAL}
				>
					<Text
						weight="bold"
					>
						Credit Card
					</Text>
				</ImageButton>
			</View>
		);
	};

	render() {

		return (
			<View style={componentStyles.screen}>
				{this.renderPayPalInfo()}
				{this.renderCreditCardButton()}
			</View>
		);
	}
}

PaymentPayPalScreen.route = {
	navigationBar: {
		visible: true,
		title: 'Payment Method',
	},
};

PaymentPayPalScreen.propTypes = {
	navigator: PropTypes.object,
	onEdit: PropTypes.func.isRequired,
	paypal: PropTypes.object,
	user: PropTypes.object,
};

PaymentPayPalScreen.defaultProps = {};

const mapStateToProps = (state) => {
	return {
		user: state.userReducer.user,
		paypal: state.checkoutReducer.paypal,
	};
};

export default connect(mapStateToProps)(withScreen(PaymentPayPalScreen));
