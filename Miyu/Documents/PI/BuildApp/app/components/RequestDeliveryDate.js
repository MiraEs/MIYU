import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	StyleSheet,
	View,
} from 'react-native';
import { getDateStrictFormat } from '../lib/helpers';
import productHelpers from '../lib/productHelpers';
import styles from '../lib/styles';
import OptionSelectButton from '../components/OptionSelectButton';
import { withNavigation } from '@expo/ex-navigation';

const componentStyles = StyleSheet.create({
	wrapper: {
		paddingHorizontal: styles.measurements.gridSpace1,
	},
});

@withNavigation
export default class RequestDeliveryDate extends Component {

	render() {
		const {
			cart,
			cart: {
				requestedDeliveryDate,
				zipCode,
			},
			isDisabled,
			navigator,
			testID,
			trackAction,
		} = this.props;
		if (productHelpers.cartHasGeProducts(cart)) {
			return (
				<View style={componentStyles.wrapper}>
					<OptionSelectButton
						accessibilityLabel="Schedule Delivery"
						isDisabled={isDisabled}
						text={requestedDeliveryDate ? `Requested Delivery: ${getDateStrictFormat(requestedDeliveryDate)}` : 'Schedule Delivery'}
						onPress={() => navigator.push('cartDeliverySummary', {
							cart,
							requestedDeliveryDate,
							zipCode,
						})}
						testID={testID}
						trackAction={trackAction}
					/>
				</View>
			);
		} else {
			return null;
		};
	}

}

RequestDeliveryDate.propTypes = {
	cart: PropTypes.object.isRequired,
	navigator: PropTypes.object,
	isDisabled: PropTypes.bool,
	testID: PropTypes.string.isRequired,
	trackAction: PropTypes.string.isRequired,
};
