import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	StyleSheet,
	View,
} from 'react-native';
import styles from '../lib/styles';
import {
	TouchableOpacity,
} from 'BuildLibrary';

const componentStyles = StyleSheet.create({
	card: {
		marginHorizontal: styles.measurements.gridSpace1,
		marginBottom: styles.measurements.gridSpace1,
		backgroundColor: styles.colors.white,
		elevation: 3,
		shadowColor: 'black',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.3,
		shadowRadius: 3,
	},
	cardText: {
		padding: styles.measurements.gridSpace1,
	},
});

export default class CardView extends Component {

	render() {
		if (this.props.onPress) {
			return (
				<TouchableOpacity
					trackAction={this.props.trackAction}
					style={componentStyles.card}
					onPress={this.props.onPress}
				>
					{this.props.children}
				</TouchableOpacity>
			);
		} else {
			return (
				<View style={componentStyles.card}>
					{this.props.children}
				</View>
			);
		}
	}

}

CardView.propTypes = {
	article: PropTypes.object,
	children: PropTypes.node,
	imageDimensions: PropTypes.shape({
		width: PropTypes.number,
		height: PropTypes.number,
	}),
	onPress: PropTypes.func,
	trackAction: PropTypes.string,
};
