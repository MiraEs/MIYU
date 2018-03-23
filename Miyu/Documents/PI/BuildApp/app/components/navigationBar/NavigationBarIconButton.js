'use strict';

import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	TouchableOpacity,
	ActivityIndicator,
	StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import helpers from '../../lib/helpers';
import styles from '../../lib/styles';
import store from '../../store/configStore';
import { trackAction } from '../../actions/AnalyticsActions';

const componentStyles = StyleSheet.create({
	button: {
		padding: styles.measurements.gridSpace1,
		marginTop: helpers.isAndroid() ? 6 : 0,
		justifyContent: 'center',
		height: styles.dimensions.tapSizeMedium,
		minWidth: styles.dimensions.tapSizeMedium,
	},
	activityIndicator: {
		marginTop: 3,
	},
	icon: {
		textAlign: 'center',
	},
});

class NavigationBarIconButton extends Component {

	renderIcon() {
		if (this.props.loading) {
			return (
				<ActivityIndicator
					style={componentStyles.activityIndicator}
					color={this.props.color}
				/>
			);
		} else {
			return (
				<Icon
					name={this.props.iconName}
					color={this.props.color}
					size={this.props.iconName === 'ios-close' ? 38 : this.props.iconSize}
					style={componentStyles.icon}
				/>
			);
		}
	}

	render() {
		const { trackData, onPress } = this.props;
		return (
			<TouchableOpacity
				style={componentStyles.button}
				onPress={() => {
					store.dispatch(trackAction(this.props.trackAction, trackData));
					onPress();
				}}
			>
				{this.renderIcon()}
			</TouchableOpacity>
		);
	}

}

NavigationBarIconButton.propTypes = {
	iconName: PropTypes.string,
	iconSize: PropTypes.number,
	color: PropTypes.string,
	onPress: PropTypes.func,
	trackAction: PropTypes.string.isRequired,
	trackData: PropTypes.string,
	loading: PropTypes.bool,
};

NavigationBarIconButton.defaultProps = {
	color: helpers.isIOS() ? styles.colors.primary : styles.colors.white,
	iconSize: 28,
	loading: false,
};

export default NavigationBarIconButton;
