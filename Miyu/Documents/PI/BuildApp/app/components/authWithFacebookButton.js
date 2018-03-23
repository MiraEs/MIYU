import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	TouchableHighlight,
	Text,
	View,
	StyleSheet,
} from 'react-native';
import styles from '../lib/styles';
import Icon from 'react-native-vector-icons/Ionicons';

const componentStyles = StyleSheet.create({
	loginWithFacebookButton: {
		marginTop: styles.measurements.gridSpace1,
		marginBottom: 30,
		marginVertical: styles.measurements.gridSpace3,
		height: 44,
	},
	loginWithFacebookButtonText: {
		color: styles.colors.white,
		fontSize: 16,
		fontFamily: styles.fonts.mainBold,
	},
	loginWithFacebookRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
	},
	facebookIcon: {
		position: 'absolute',
		left: 20,
		top: -2,
	},
});

class AuthWithFacebookButton extends Component {

	render() {
		return (
			<TouchableHighlight
				onPress={this.props.onPress}
				style={componentStyles.loginWithFacebookButton}
				underlayColor={styles.colors.facebookBlueDark}
			>
				<View style={componentStyles.loginWithFacebookRow}>
					<Icon
						name="logo-facebook"
						size={25}
						color="white"
						style={componentStyles.facebookIcon}
					/>
					<Text style={componentStyles.loginWithFacebookButtonText}>{this.props.text}</Text>
				</View>

			</TouchableHighlight>
		);
	}

}

AuthWithFacebookButton.propTypes = {
	onPress: PropTypes.func.isRequired,
	text: PropTypes.string.isRequired,
};

module.exports = AuthWithFacebookButton;
