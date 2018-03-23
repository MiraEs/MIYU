import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	TouchableOpacity,
	StyleSheet,
} from 'react-native';
import { Text } from 'build-library';
import styles from '../../lib/styles';
import helpers from '../../lib/helpers';

const componentStyles = StyleSheet.create({
	button: {
		padding: styles.measurements.gridSpace1,
		marginTop: helpers.isAndroid() ? 9 : 5,
	},
	disabled: {
		opacity: 0.5,
	},
});

class NavigationBarTextButton extends Component {

	getTextStyle = () => {
		const style = [{
			color: styles.colors[this.props.color],
		}];
		if (this.props.disabled) {
			style.push(componentStyles.disabled);
		}
		return style;
	};

	handleButtonPressed = () => {
		if (!this.props.disabled) {
			this.props.onPress();
		}
	};

	render() {
		return (
			<TouchableOpacity
				style={componentStyles.button}
				onPress={this.handleButtonPressed}
			>
				<Text style={this.getTextStyle()}>{this.props.children}</Text>
			</TouchableOpacity>
		);
	}

}

NavigationBarTextButton.defaultProps = {
	color: helpers.isIOS() ? 'primary' : 'white',
	disabled: false,
};

NavigationBarTextButton.propTypes = {
	color: PropTypes.oneOf([
		'primary',
		'secondary',
		'white',
	]),
	disabled: PropTypes.bool,
	onPress: PropTypes.func,
	children: PropTypes.node,
};

export default NavigationBarTextButton;
