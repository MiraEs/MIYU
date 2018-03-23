'use strict';

import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	StyleSheet,
	Text,
	View,
	ViewPropTypes,
} from 'react-native';
import styles from '../lib/styles';

const componentStyles = StyleSheet.create({
	container: {
		borderWidth: styles.dimensions.borderWidthLarge,
		borderColor: styles.colors.error,
		backgroundColor: styles.colors.white,
	},
	text: {
		textAlign: 'center',
	},
	titleContanier: {
		padding: styles.measurements.gridSpace1,
		backgroundColor: styles.colors.error,
	},
	title: {
		color: styles.colors.white,
	},
	bodyPadding: {
		padding: styles.measurements.gridSpace1,
	},
});

class InlineAlert extends Component {

	render() {
		return (
			<View style={[componentStyles.container, this.props.style]}>
				<View style={componentStyles.titleContanier}>
					<Text style={[componentStyles.text, styles.text.bold, componentStyles.title]}>{this.props.title}</Text>
				</View>
				<View style={componentStyles.bodyPadding}>{this.props.children}</View>
			</View>
		);
	}

}

InlineAlert.propTypes = {
	children: PropTypes.oneOfType([
		PropTypes.array,
		PropTypes.element,
		PropTypes.string,
	]).isRequired,
	title: PropTypes.string.isRequired,
	style: ViewPropTypes.style,
};

InlineAlert.defaultProps = {
	style: {},
};

export default InlineAlert;
