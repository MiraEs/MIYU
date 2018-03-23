'use strict';
import React, {
	PureComponent,
} from 'react';
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
	linkWrapper: {
		paddingVertical: styles.measurements.gridSpace2,
	},
});

export default class ReturnPolicyLink extends PureComponent {
	render() {
		return (
			<View style={[componentStyles.linkWrapper, this.props.style]}>
				<Text color="primary">
					Return Policy
				</Text>
			</View>
		);
	}
}

ReturnPolicyLink.propTypes = {
	style: ViewPropTypes.style,
};
