'use strict';
import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import ReactNative, {
	ViewPropTypes,
} from 'react-native';
import {
	Button,
	Text,
} from 'BuildLibrary';
import Icon from 'react-native-vector-icons/Ionicons';
import styles from '../../../lib/styles';


const componentStyles = ReactNative.StyleSheet.create({
	layout: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		marginRight: styles.measurements.gridSpace1,
	},
	text: {
		marginHorizontal: styles.measurements.gridSpace1,
	},
});

class IconButton extends Component {

	getIconSize = () => {
		const { iconSize } = this.props;
		if (iconSize === 'small') {
			return 16;
		} else if (iconSize === 'large') {
			return 32;
		}
		return 25;
	};

	renderText() {
		const { size, text, textColor } = this.props;

		if (text) {
			return (
				<Text
					numberOfLines={1}
					style={componentStyles.text}
					color={textColor}
					size={size}
					weight="bold"
					lineHeight={false}
					textAlign="center"
				>
					{text}
				</Text>
			);
		}
	}

	render() {
		const { borders, color, iconName, iconStyle, isLoading, onPress, size, style, textColor, trackAction, trackContextData } = this.props;

		return (
			<Button
				borders={borders}
				color={color}
				textColor={textColor}
				isLoading={isLoading}
				onPress={onPress}
				size={size}
				style={style}
				trackAction={trackAction}
				trackContextData={trackContextData}
				accessibilityLabel={this.props.accessibilityLabel}
			>
				<ReactNative.View style={componentStyles.layout}>
					<Icon
						color={styles.colors[textColor]}
						name={iconName}
						size={this.getIconSize()}
						style={iconStyle}
					/>
					{this.renderText()}
				</ReactNative.View>
			</Button>
		);
	}
}

IconButton.propTypes = {
	onPress: PropTypes.func.isRequired,
	color: PropTypes.oneOf([
		'error',
		'facebookBlue',
		'primary',
		'white',
	]),
	borders: PropTypes.bool,
	iconName: PropTypes.string.isRequired,
	iconSize: PropTypes.oneOf([
		'small',
		'regular',
		'large',
	]),
	iconStyle: ViewPropTypes.style,
	isLoading: PropTypes.bool,
	size: PropTypes.oneOf([
		'small',
		'regular',
	]),
	style: ViewPropTypes.style,
	text: PropTypes.any,
	textColor: PropTypes.oneOf([
		'primary',
		'secondary',
		'white',
		'accent',
	]),
	trackAction: PropTypes.string,
	trackContextData: PropTypes.object,
	accessibilityLabel: PropTypes.string.isRequired,
};

IconButton.defaultProps = {
	color: 'primary',
	borders: true,
	iconSize: 'regular',
	isLoading: false,
	size: 'regular',
	textColor: 'secondary',
};

export default IconButton;
