'use strict';
import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	StyleSheet,
	View,
} from 'react-native';
import styles from '../../lib/styles';
import helpers from '../../lib/helpers';
import { Text, Button } from 'BuildLibrary';
import Icon from 'react-native-vector-icons/Ionicons';
import { EMPTY_CART_LOAD } from '../../lib/analytics/TrackingActions';


const componentStyles = StyleSheet.create({
	component: {
		flex: 1,
		backgroundColor: styles.colors.greyLight,
	},
	row: {
		justifyContent: 'flex-start',
		alignItems: 'center',
		marginTop: styles.measurements.gridSpace2,
		paddingBottom: styles.measurements.gridSpace3,
		backgroundColor: styles.colors.white,
		borderTopWidth: styles.dimensions.borderWidth,
		borderBottomWidth: styles.dimensions.borderWidth,
		borderColor: styles.colors.grey,
	},
	wrap: {
		marginTop: styles.measurements.gridSpace3,
	},
	button: {
		flex: 0,
	},
});

class EmptyCart extends Component {

	render() {
		return (
			<View style={componentStyles.component}>
				<View style={componentStyles.row}>
					<View style={componentStyles.wrap}>
						<Icon
							name={helpers.getIcon('cart')}
							size={55}
							color={styles.colors.greyLight}
						/>
					</View>
					<View style={componentStyles.wrap}>
						<Text lineHeight={false}>Your shopping cart is empty</Text>
					</View>
					<View style={componentStyles.wrap}>
						<Button
							accessibilityLabel="Load Cart Button"
							text="Load Cart"
							onPress={this.props.onLoadCartModal}
							trackAction={EMPTY_CART_LOAD}
							style={componentStyles.button}
						/>
					</View>
				</View>
			</View>
		);
	}
}

EmptyCart.propTypes = {
	onLoadCartModal: PropTypes.func.isRequired,
};

export default EmptyCart;
