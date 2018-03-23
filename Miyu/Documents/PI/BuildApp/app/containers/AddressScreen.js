'use strict';

import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	StyleSheet,
	View,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styles from '../lib/styles';
import Address from '../components/Address';
import FixedBottomButton from '../components/FixedBottomButton';
import { SHIPPING_ADDRESS } from '../constants/Addresses';
import TrackingActions from '../lib/analytics/TrackingActions';
import RadioOption from '../components/RadioOption';
import {
	Text,
	ScrollView,
	withScreen,
} from 'BuildLibrary';
import helpers from '../lib/helpers';
import { FADE } from '../constants/constants';
import { updateSessionCart } from '../actions/CartActions';
import { trackState } from '../actions/AnalyticsActions';

const componentStyles = StyleSheet.create({
	formContent: {
		marginHorizontal: styles.measurements.gridSpace1,
		marginTop: styles.measurements.gridSpace1,
	},
	button: {
		marginBottom: 40,
		width: 200,
	},
	background: {
		backgroundColor: styles.colors.greyLight,
	},
	address: {
		marginHorizontal: styles.measurements.gridSpace1,
		marginVertical: styles.measurements.gridSpace1,
	},
});

export class AddressScreen extends Component {

	componentWillMount() {
		helpers.setStatusBarHidden(false, FADE);
		const { addresses } = this.props;
		if (!addresses.length) {
			this.newAddress();
		}
	}

	setScreenTrackingInformation() {
		return {
			name: 'build:app:address',
		};
	}

	handleListItemSelect = (address) => {
		const { updateAddress, addressTypeId, sessionCartId, onSaveSuccess, actualTaxes } = this.props,
			{ updateSessionCart } = this.props.actions;

		if (addressTypeId === SHIPPING_ADDRESS) {
			updateSessionCart({
				cart: { zipCode: address.zip },
				sessionCartId,
				actualTaxes,
			}).catch(helpers.noop).done();
		}

		updateAddress(address.addressId);
		onSaveSuccess();
	};

	newAddress = () => {
		const { addressTypeId, onSaveSuccess } = this.props;
		const title = this.props.addressTypeId === SHIPPING_ADDRESS ? 'Shipping Address' : 'Billing Address';

		this.props.navigator.push('newAddress', {
			title,
			addressTypeId,
			onSaveSuccess,
			padBottom: true,
		});
	};

	renderAddresses = () => {
		const { addresses, addressId, addressTypeId, defaultAddressId } = this.props;

		return addresses.filter((address) => address.type === addressTypeId)
			.sort((a, b) => b.addressId - a.addressId)
			.sort((a, b) => b.addressId === defaultAddressId ? Number.POSITIVE_INFINITY : 0)
			.map((address, index) => {
				return (
					<RadioOption
						onPress={this.handleListItemSelect.bind(this, address)}
						key={index}
						isSelected={addressId ? addressId === address.addressId : index === 0}
					>
						<Address
							address={address}
							style={componentStyles.address}
						/>
					</RadioOption>
				);
			});
	};

	render() {
		const buttonText = this.props.addressTypeId === SHIPPING_ADDRESS ? 'New Shipping Address' : 'New Billing Address';
		const selectText = this.props.addressTypeId === SHIPPING_ADDRESS ? 'Select a Shipping Address' : 'Select a Billing Address';
		return (
			<View style={[styles.elements.screen, componentStyles.background]}>
				<ScrollView
					style={componentStyles.formContent}
					ref={(ref) => this.scrollView = ref}
					scrollsToTop={true}
				>
					<Text
						weight="bold"
						size="large"
					>
						{selectText}
					</Text>
					<Text
						color="error"
						size="small"
					>
						{this.props.error}
					</Text>
					{this.renderAddresses()}
				</ScrollView>
				<FixedBottomButton
					buttonText={buttonText}
					color="white"
					style={componentStyles.button}
					onPress={this.newAddress}
					trackAction={TrackingActions.ADDRESS_NEW_ADDRESS}
					pinToKeyboard={false}
					hideOnKeyboardShow={true}
					accessibilityLabel="New Address Button"
				/>
			</View>
		);
	}

}

AddressScreen.route = {
	navigationBar: {
		visible: true,
		title({ title }) {
			return title;
		},
	},
};

AddressScreen.propTypes = {
	selectedAddressIndex: PropTypes.number,
	addressId: PropTypes.number,
	addresses: PropTypes.array,
	error: PropTypes.any,
	updateAddress: PropTypes.func.isRequired,
	addressTypeId: PropTypes.string,
	actions: PropTypes.object,
	sessionCartId: PropTypes.number,
	defaultAddressId: PropTypes.number,
	onSaveSuccess: PropTypes.func.isRequired,
	title: PropTypes.string,
	navigator: PropTypes.shape({
		push: PropTypes.func,
	}),
	actualTaxes: PropTypes.bool,
};

AddressScreen.defaultProps = {
	selectedAddressIndex: 0,
	addresses: [],
	addressId: 0,
	addressTypeId: SHIPPING_ADDRESS,
	defaultAddressId: null,
	title: 'Checkout',
};

const mapStateToProps = (state, ownProps) => {
	return {
		error: state.userReducer.errors.checkout,
		addresses: ownProps.addressTypeId === SHIPPING_ADDRESS ? state.userReducer.user.shippingAddresses : state.userReducer.user.billingAddresses,
		addressId: ownProps.addressTypeId === SHIPPING_ADDRESS ? state.checkoutReducer.shippingAddressId : state.checkoutReducer.billingAddressId,
		sessionCartId: state.cartReducer.cart.sessionCartId,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			updateSessionCart,
			trackState,
		}, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(withScreen(AddressScreen));
