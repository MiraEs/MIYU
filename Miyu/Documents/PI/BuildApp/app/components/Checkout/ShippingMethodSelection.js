import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	StyleSheet,
	View,
} from 'react-native';
import {
	Text,
} from 'BuildLibrary';
import EventEmitter from '../../lib/eventEmitter';
import styles from '../../lib/styles';
import PhoneHelper from '../../lib/PhoneHelper';
import OptionSelectButton from '../OptionSelectButton';
import ShippingMethod from '../ShippingMethod';


const componentStyles = StyleSheet.create({
	indent: {
		marginHorizontal: styles.measurements.gridSpace1,
	},
});

class ShippingMethodSelection extends Component {

	getAvailableShippingOptions = (shippingOptions) => {
		return shippingOptions ? shippingOptions.filter((option) => option.customerAvailable) : [];
	};

	renderShippingMethod = (shippingOptions, selectedShippingIndex) => {
		if (shippingOptions) {
			return <ShippingMethod shippingMethod={shippingOptions[selectedShippingIndex]} />;
		}
	};

	/*
		bounce is a stub so OptionSelectButton.bounce can be called
	 */
	bounce = () => {};// NOSONAR

	render() {
		const { cart, isDisabled, hasError, onPress, user } = this.props;
		const { shippingOptions } = cart.cart;
		const { selectedShippingIndex } = cart;
		const filtered = this.getAvailableShippingOptions(shippingOptions);
		const phone = PhoneHelper.getPhoneNumberByUserType(user);

		if (shippingOptions && (shippingOptions.length !== filtered.length)) {
			return (
				<OptionSelectButton
					style={componentStyles.indent}
					onPress={() => EventEmitter.emit('onCallUs', phone, true)}
				>
					<View style={styles.elements.flex}>
						<Text weight="bold">{shippingOptions[0].shippingOption}</Text>
						<Text color="error">
							Due to higher shipping charges for this area, a shipping quote is required
							{' '}before placing an order. Please contact us at {PhoneHelper.formatPhoneNumber(phone)} to place your order.
						</Text>
					</View>
				</OptionSelectButton>
			);
		}

		return (
			<OptionSelectButton
				key="shippingMethod"
				onPress={onPress}
				text="Select a shipping method"
				ref={(ref) => this.shippingMethod = ref}
				style={componentStyles.indent}
				isDisabled={isDisabled}
				hasError={hasError}
				errorMessage="Please finish filling in your information before submitting your order."
				accessibilityLabel="Select Shipping Method Button"
			>
				{this.renderShippingMethod(shippingOptions, selectedShippingIndex)}
			</OptionSelectButton>
		);
	}
}

ShippingMethodSelection.propTypes = {
	cart: PropTypes.object.isRequired,
	isDisabled: PropTypes.bool,
	hasError: PropTypes.bool,
	onPress: PropTypes.func.isRequired,
	user: PropTypes.object.isRequired,
};

ShippingMethodSelection.defaultProps = {
	isDisabled: false,
	hasError: false,
};

export default ShippingMethodSelection;
