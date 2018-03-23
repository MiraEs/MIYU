'use strict';
import React, {
	PureComponent,
} from 'react';
import PropTypes from 'prop-types';
import {
	StyleSheet,
	View,
	ViewPropTypes,
} from 'react-native';
import {
	Text,
} from 'BuildLibrary';
import styles from '../../lib/styles';

const componentStyles = StyleSheet.create({
	stepWrapper: {
		backgroundColor: styles.colors.white,
		padding: styles.measurements.gridSpace1,
	},
	stepText: {
		alignSelf: 'flex-end',
	},
});

export default class StepText extends PureComponent {
	render() {
		const {
			currentStep,
			maxStep,
			style,
		} = this.props;

		return (
			<View style={[componentStyles.stepWrapper, style]}>
				<Text style={componentStyles.stepText}>Step {currentStep} of {maxStep}</Text>
			</View>
		);
	}
}

StepText.propTypes = {
	currentStep: PropTypes.number.isRequired,
	maxStep: PropTypes.number.isRequired,
	style: ViewPropTypes.style,
};
