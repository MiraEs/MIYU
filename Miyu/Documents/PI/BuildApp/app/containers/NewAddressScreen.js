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
import helpers, { setStatusBarHidden } from '../lib/helpers';
import styles from '../lib/styles';
import AddressEdit from '../components/AddressEdit';
import { saveCustomerAddress } from '../actions/UserActions';
import { updateSessionCart } from '../actions/CartActions';
import {
	updateShippingAddress,
	updateBillingAddress,
} from '../actions/CheckoutActions';
import FixedBottomButton from '../components/FixedBottomButton';
import {
	Text,
	withScreen,
	KeyboardAwareView,
} from 'BuildLibrary';
import TrackingActions from '../lib/analytics/TrackingActions';
import {
	STATE_EDIT_ADDRESS,
	SHIPPING_ADDRESS,
	STATE_ADD_ADDRESS,
	STATE_CHECKOUT_ADDRESS,
} from '../constants/Addresses';
import { showAlert } from '../actions/AlertActions';


const componentStyles = StyleSheet.create({
	formContent: {
		paddingVertical: styles.measurements.gridSpace1,
		paddingHorizontal: styles.measurements.gridSpace1,
	},
});

export class NewAddressScreen extends Component {

	constructor(props) {
		super(props);
		const address = {
			addressId: null,
			firstName: props.user.firstName,
			lastName: props.user.lastName,
			zip: props.cartZip,
		};

		this.state = {
			address: this.props.address || address,
			error: '',
			isLoading: props.isLoading,
		};
	}

	componentWillMount() {
		setStatusBarHidden(false, 'fade');
	}

	setScreenTrackingInformation() {
		return {
			name: 'build:app:newaddress',
		};
	}


	handleFormChange = (address, valid) => {
		this.setState({
			valid,
			address,
		});
	};

	handleFormWarning = (message) => {
		this.props.actions.showAlert(message, 'warning', null, null, 5000);
	};

	submitNewAddress = () => {
		const validForm = this.triggerValidation();

		if (validForm) {
			this.setState({ error: '', isLoading: true });

			const { actions, addressTypeId, sessionCartId, addressScreenState, onSaveSuccess } = this.props;
			const { saveCustomerAddress, updateShippingAddress, updateBillingAddress, updateSessionCart } = actions;
			const { address } = this.state;
			if (address.city) {
				address.city = address.city.trim();
			}

			// save address to api
			saveCustomerAddress(address, addressTypeId)
				.then((newAddress) => {
					this.setState({ isLoading: false });
					// set cart address to new address
					if (addressTypeId === SHIPPING_ADDRESS) {
						updateShippingAddress(newAddress.addressId);
						updateSessionCart({ cart: { zipCode: address.zip }, sessionCartId })
							.catch(helpers.noop).done();
					} else {
						updateBillingAddress(newAddress.addressId);
					}

					if (addressScreenState === STATE_EDIT_ADDRESS) {
						this.props.actions.showAlert('Successfully updated address', 'success', null, () => {
							onSaveSuccess();
						});
					} else {
						onSaveSuccess();
					}
				})
				.catch((error) => {
					const state = this.props.addressScreenState === STATE_EDIT_ADDRESS ? 'updated' : 'save';

					this.props.actions.showAlert(`Failed to ${state} address`, 'error');
					this.setState({ error: error.message, isLoading: false });
				});
		}
	};

	triggerValidation = () => {
		return this._addressForm.triggerValidation();
	};

	getFixedButtonText = () => {
		const { addressScreenState } = this.props;
		let text = 'Use This Address';
		if (addressScreenState === STATE_ADD_ADDRESS) {
			text = 'Add New Address';
		} else if (addressScreenState === STATE_EDIT_ADDRESS) {
			text = 'Update Address';
		}
		return text;
	};

	renderHeaderText = () => {
		let headerText = this.props.addressTypeId === SHIPPING_ADDRESS ? 'Enter a New Shipping Address' : 'Enter a New Billing Address';
		if (this.props.addressScreenState === STATE_EDIT_ADDRESS) {
			headerText = this.props.addressTypeId === SHIPPING_ADDRESS ? 'Update Shipping Address' : 'Update Billing Address';
		}
		return (
			<Text
				size="large"
				weight="bold"
			>
				{headerText}
			</Text>
		);
	};

	render() {
		const { isLoading, address } = this.state;

		return (
			<View
				style={styles.elements.screen}
			>
				<AddressEdit
					ref={(ref) => this._addressForm = ref}
					address={address}
					onChange={this.handleFormChange}
					poHelpText={this.props.addressTypeId === SHIPPING_ADDRESS}
					style={componentStyles.formContent}
					topSpacing={this.props.padBottom ? styles.dimensions.bottomBarHeight : 0}
					formWarning={this.handleFormWarning}
				>
					{this.renderHeaderText()}
					<Text
						color="error"
						size="small"
					>
						{this.state.error}
					</Text>
				</AddressEdit>
				<KeyboardAwareView>
					<FixedBottomButton
						buttonText={this.getFixedButtonText()}
						isLoading={isLoading}
						onPress={this.submitNewAddress}
						pinToKeyboard={false}
						trackAction={TrackingActions.NEW_ADDRESS_SUBMIT}
						accessibilityLabel="Submit New Address"
						hideOnKeyboardShow={true}
					/>
				</KeyboardAwareView>
			</View>
		);
	}

}

NewAddressScreen.route = {
	navigationBar: {
		visible: true,
		title(props) {
			return props.title || 'New Address';
		},
	},
};

NewAddressScreen.propTypes = {
	addressTypeId: PropTypes.string.isRequired, // this indicates if this is a shipping or billing address
	address: PropTypes.object,
	isLoading: PropTypes.bool,
	actions: PropTypes.object,
	user: PropTypes.object,
	cartZip: PropTypes.string,
	sessionCartId: PropTypes.number,
	onSaveSuccess: PropTypes.func.isRequired,
	addressScreenState: PropTypes.oneOf([
		STATE_EDIT_ADDRESS,
		STATE_ADD_ADDRESS,
		STATE_CHECKOUT_ADDRESS,
	]),
	title: PropTypes.string,
	padBottom: PropTypes.bool,
	navigator: PropTypes.shape({
		pop: PropTypes.func,
	}),
	showAlert: PropTypes.object,
};

NewAddressScreen.defaultProps = {
	isLoading: false,
	addressScreenState: STATE_CHECKOUT_ADDRESS,
	padBottom: false,
};

const mapStateToProps = (state) => {
	return {
		error: state.userReducer.errors.checkout,
		user: state.userReducer.user,
		cartZip: state.cartReducer.cart.zipCode,
		sessionCartId: state.cartReducer.cart.sessionCartId,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			saveCustomerAddress,
			updateShippingAddress,
			updateBillingAddress,
			updateSessionCart,
			showAlert,
		}, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(withScreen(NewAddressScreen));
