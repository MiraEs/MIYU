'use strict';
import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Text } from 'react-native';
import styles from '../lib/styles';

const componentStyles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
	},
});
class LoadError extends Component {

	render() {
		return (
			<View style={componentStyles.container}>
				<Text
					style={[styles.elements.center, {
						color: styles.colors.mediumDarkGray,
						fontFamily: styles.fonts.mainRegular,
					}]}
				>
					{this.props.message}
				</Text>
			</View>
		);
	}

}

LoadError.propTypes = {
	message: PropTypes.string.isRequired,
};

module.exports = LoadError;
