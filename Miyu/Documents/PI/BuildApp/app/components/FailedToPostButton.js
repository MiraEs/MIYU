'use strict';
import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	TouchableOpacity,
	Text,
	StyleSheet,
	ActionSheetIOS,
	Platform,
} from 'react-native';
import styles from '../lib/styles';
import Icon from 'react-native-vector-icons/Ionicons';

const componentStyles = StyleSheet.create({
	errorContainer: {
		flexDirection: 'row',
	},
});

class FailedToPostButton extends Component {

	constructor(props) {
		super(props);
		this.confirmRetry = this.confirmRetry.bind(this);
	}

	confirmRetry() {
		if (Platform.OS === 'ios') {
			ActionSheetIOS.showActionSheetWithOptions({
				options: [
					'Try Again',
					'Cancel',
				],
			}, (index) => {
				if (index === 0) {
					this.props.onPress();
				}
			});
		} else {
			this.props.onPress();
		}
	}

	render() {
		return (
			<TouchableOpacity
				onPress={this.confirmRetry}
				style={componentStyles.errorContainer}
			>
				<Text style={styles.text.error}>Failed To Post </Text>
				<Icon
					name="ios-alert-outline"
					size={16}
					color={styles.colors.error}
				/>
			</TouchableOpacity>
		);
	}

}

FailedToPostButton.propTypes = {
	onPress: PropTypes.func.isRequired,
};

module.exports = FailedToPostButton;
