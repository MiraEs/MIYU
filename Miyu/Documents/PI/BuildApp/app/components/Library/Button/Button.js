'use strict';
import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import ReactNative, {
	StyleSheet,
	ViewPropTypes,
} from 'react-native';
import {
	Text,
} from 'BuildLibrary';
import styles from '../../../lib/styles';
import { trackAction } from '../../../actions/AnalyticsActions';
import store from '../../../store/configStore';

const componentStyles = StyleSheet.create({
	component: {
		flex: 1,
		justifyContent: 'center',
	},
});

class Button extends Component {

	getStyles = () => {
		const { size } = this.props;
		return {
			...styles.buttons[size],
		};
	};

	getViewStyles = () => {
		const { borders, color, alignItems } = this.props;
		let borderStyle = {};

		if (borders) {
			borderStyle = {
				borderWidth: styles.dimensions.borderWidth,
				borderColor: color === 'white' ? styles.colors.grey : styles.colors[color],
			};
		}

		return [componentStyles.component, {
			backgroundColor: styles.colors[color],
			paddingHorizontal: styles.measurements.gridSpace2,
			opacity: this.props.isDisabled ? .3 : 1,
			...borderStyle,
			alignItems,
		}];
	};

	renderChildren = () => {
		const { textColor, textSize, textWeight, isLoading } = this.props;
		if (isLoading) {
			return <ReactNative.ActivityIndicator color={styles.colors[textColor]} />;
		}
		if (this.props.text) {
			return (
				<Text
					color={textColor}
					lineHeight={false}
					textAlign="center"
					weight={textWeight}
					size={textSize}
				>
					{this.props.text}
				</Text>
			);
		}

		return this.props.children;
	};

	render() {
		const { isDisabled, isLoading, style } = this.props;

		return (
			<ReactNative.TouchableOpacity
				disabled={isDisabled || isLoading}
				onPress={() => {
					const { trackContextData } = this.props;
					let data = trackContextData;
					if (trackContextData && typeof trackContextData === 'function') {
						data = trackContextData();
					}
					store.dispatch(trackAction(this.props.trackAction, data));
					this.props.onPress();
				}}
				style={[this.getStyles(), style]}
				accessibilityLabel={this.props.accessibilityLabel}
			>
				<ReactNative.View style={this.getViewStyles()}>
					{this.renderChildren()}
				</ReactNative.View>
			</ReactNative.TouchableOpacity>
		);
	}
}

Button.propTypes = {
	onPress: PropTypes.func.isRequired,
	alignItems: PropTypes.string,
	borders: PropTypes.bool,
	children: PropTypes.oneOfType([
		PropTypes.array,
		PropTypes.string,
		PropTypes.element,
		PropTypes.number,
	]),
	color: PropTypes.oneOf([
		'primary',
		'white',
		'none',
		'error',
		'facebookBlue',
		'greyLight',
		'black',
	]),
	isDisabled: PropTypes.bool,
	isLoading: PropTypes.bool,
	size: PropTypes.oneOf([
		'small',
		'regular',
		'large',
	]),
	textSize: PropTypes.oneOf([
		'xsmall',
		'small',
		'regular',
		'large',
		'larger',
	]).isRequired,
	style: ViewPropTypes.style,
	text: PropTypes.string,
	textColor: PropTypes.oneOf([
		'primary',
		'secondary',
		'white',
		'accent',
	]),
	textWeight: PropTypes.oneOf([
		'normal',
		'bold',
	]),
	trackAction: PropTypes.string.isRequired,
	trackContextData: PropTypes.oneOfType([
		PropTypes.object,
		PropTypes.func,
	]),
	accessibilityLabel: PropTypes.string.isRequired,
};

Button.defaultProps = {
	alignItems: 'center',
	textSize: 'regular',
	borders: true,
	color: 'primary',
	isDisabled: false,
	isLoading: false,
	size: 'regular',
	textColor: 'white',
	textWeight: 'bold',
};

export default Button;
