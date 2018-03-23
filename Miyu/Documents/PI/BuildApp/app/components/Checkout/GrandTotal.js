'use strict';
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
import styles from '../../lib/styles';
import helpers from '../../lib/helpers';

const componentStyles = StyleSheet.create({
	grandTotal: {
		backgroundColor: styles.colors.white,
		borderColor: styles.colors.grey,
		borderTopWidth: styles.dimensions.borderWidth,
		paddingHorizontal: styles.measurements.gridSpace2,
		paddingVertical: styles.measurements.gridSpace1,
	},
	grandTotalRow: {
		flexDirection: 'row',
		alignItems: 'flex-end',
	},
});

class GrandTotal extends Component {

	calcGrandTotal = () => {
		const { cart, storeCredit, useStoreCredit } = this.props;
		const credit = useStoreCredit ? storeCredit : 0;
		const grandTotal = helpers.calcGrandTotal(cart, credit);

		return helpers.toUSD(grandTotal);
	};

	render() {

		return (
			<View style={componentStyles.grandTotal}>
				<View
					accessibilityLabel="Total Price"
					style={componentStyles.grandTotalRow}
				>
					<Text
						size="large"
						weight="bold"
						lineHeight={false}
						style={styles.elements.flex}
					>
						Grand Total
					</Text>
					<Text
						size="large"
						weight="bold"
						lineHeight={false}
						color="primary"
					>
						{this.calcGrandTotal()}
					</Text>
				</View>
			</View>
		);
	}
}

GrandTotal.propTypes = {
	cart: PropTypes.object,
	storeCredit: PropTypes.number,
	useStoreCredit: PropTypes.bool,
};

GrandTotal.defaultProps = {
	storeCredit: 0,
	useStoreCredit: false,
};

export default GrandTotal;
