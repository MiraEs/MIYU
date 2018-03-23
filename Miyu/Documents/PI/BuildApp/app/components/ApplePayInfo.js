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
	applePayImage: {
		margin: styles.measurements.gridSpace1,
		backgroundColor: styles.colors.white,
	},
	infoContainer: {
		justifyContent: 'center',
	},
});

class ApplePayInfo extends Component {

	render() {
		const { paid } = this.props;
		const text = paid ? 'Paid with' : 'Paying with';

		return (
			<View style={componentStyles.container}>
				<View style={componentStyles.infoContainer}>
					<Text weight="bold">{text}</Text>
				</View>
				<Image
					style={componentStyles.applePayImage}
					source={require('../../images/ApplePay2.png')}
					resizeMode="contain"
					height={70}
					width={70}
				/>
			</View>
		);
	}
}

ApplePayInfo.propTypes = {
	paid: PropTypes.bool,
};

ApplePayInfo.defaultProps = {
	paid: false,
};

export default ApplePayInfo;
