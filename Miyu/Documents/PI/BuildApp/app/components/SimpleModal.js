'use strict';

import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	View,
	TouchableOpacity,
	StyleSheet,
} from 'react-native';
import {
	ScrollView,
	Text,
} from 'BuildLibrary';
import styles from '../lib/styles';
import EventEmitter from '../lib/eventEmitter';
import Icon from 'react-native-vector-icons/Ionicons';

const componentStyles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
	},
	modal: {
		paddingHorizontal: styles.measurements.gridSpace1,
		paddingBottom: styles.measurements.gridSpace1,
		marginHorizontal: styles.measurements.gridSpace1,
		backgroundColor: styles.colors.white,
	},
	titleBar: {
		flexDirection: 'row',
	},
	titleTextContainer: {
		flex: 1,
		marginTop: styles.measurements.gridSpace1,
	},
	button: {
		paddingTop: styles.measurements.gridSpace1,
		paddingHorizontal: styles.measurements.gridSpace1,
	},
});

export default class SimpleModal extends Component {

	hide = () => {
		EventEmitter.emit('hideScreenOverlay');
		if (this.props.onClose) {
			this.props.onClose();
		}
	};

	render() {
		return (
			<View style={componentStyles.container}>
				<View style={componentStyles.modal}>
					<View style={componentStyles.titleBar}>
						<View style={componentStyles.titleTextContainer}>
							<Text weight="bold">{this.props.title}</Text>
						</View>
						<TouchableOpacity
							onPress={this.hide}
							style={componentStyles.button}
						>
							<Icon
								name="md-close"
								size={28}
							/>
						</TouchableOpacity>
					</View>
					<ScrollView>
						{this.props.children}
					</ScrollView>
				</View>
			</View>
		);
	}
}

SimpleModal.propTypes = {
	title: PropTypes.string,
	children: PropTypes.node.isRequired,
	onClose: PropTypes.func,
};

SimpleModal.defaultProps = {
	title: '',
};
