'use strict';
import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	View,
	StyleSheet,
} from 'react-native';
import styles from '../lib/styles';
import {
	Text,
	Image,
} from 'BuildLibrary';


const componentStyles = StyleSheet.create({
	container: {
		flexDirection: 'row',
	},
	payPalImage: {
		margin: styles.measurements.gridSpace1,
		backgroundColor: styles.colors.white,
	},
	infoContainer: {
		justifyContent: 'center',
	},
});

class PayPalInfo extends Component {

	render() {
		const { paid } = this.props;
		const text = paid ? 'Paid with PayPal' : 'Paying with PayPal';

		return (
			<View style={componentStyles.container}>
				<View style={componentStyles.infoContainer}>
					<Text weight="bold">{text}</Text>
				</View>
				<Image
					style={componentStyles.payPalImage}
					source={require('../../images/PP_logo.png')}
					resizeMode="contain"
					height={70}
					width={70}
				/>
			</View>
		);
	}
}

PayPalInfo.propTypes = {
	paid: PropTypes.bool,
};

PayPalInfo.defaultProps = {
	paid: false,
};

export default PayPalInfo;
