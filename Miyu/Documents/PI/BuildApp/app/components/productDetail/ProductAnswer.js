'use strict';

import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	StyleSheet,
	View,
} from 'react-native';
import { Text } from 'BuildLibrary';
import styles from '../../lib/styles';

const componentStyles = StyleSheet.create({
	answerContainer: {
		flexDirection: 'row',
		flex: 1,
		marginTop: styles.measurements.gridSpace1,
	},
	answerA: {
		marginRight: styles.measurements.gridSpace1,
	},
	answerText: {
		flex: 1,
		flexWrap: 'wrap',
	},
});

class ProductAnswer extends Component {

	render() {
		return (
			<View style={componentStyles.answerContainer}>
				<View style={componentStyles.answerA}>
					<Text weight="bold">A:</Text>
				</View>
				<View style={componentStyles.answerText}>
					{this.props.children}
				</View>
			</View>
		);
	}

}

ProductAnswer.propTypes = {
	children: PropTypes.node,
};

export default ProductAnswer;
