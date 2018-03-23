'use strict';

import React, {
	Component,
} from 'react';
import {
	View,
	StyleSheet,
	ViewPropTypes,
} from 'react-native';
import styles from '../lib/styles';

const width = styles.measurements.gridSpace2;
const height = styles.measurements.gridSpace1;

const componentStyles = StyleSheet.create({
	container: {
		height,
		width,
	},
	triangle: {
		width: 0,
		height: 0,
		backgroundColor: 'transparent',
		borderStyle: 'solid',
		borderLeftWidth: width / 2,
		borderRightWidth: width / 2,
		borderBottomWidth: height,
		borderLeftColor: 'transparent',
		borderRightColor: 'transparent',
		borderBottomColor: styles.colors.white,
	},
	triangle2: {
		borderBottomColor: styles.colors.grey,
		position: 'absolute',
		top: -1,
	},
});

class Triangle extends Component {

	render() {
		return (
			<View style={[componentStyles.container, this.props.style]}>
				<View style={[componentStyles.triangle, componentStyles.triangle2]} />
				<View style={componentStyles.triangle} />
			</View>
		);
	}

}

Triangle.propTypes = {
	style: ViewPropTypes.style,
};

Triangle.defaultProps = {
	style: {},
};

export default Triangle;
