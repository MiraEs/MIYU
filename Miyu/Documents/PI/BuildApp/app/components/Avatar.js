'use strict';
import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	View,
	StyleSheet,
	ViewPropTypes,
} from 'react-native';
import {
	Image,
	Text,
} from 'BuildLibrary';
import styles from '../lib/styles';
import Icon from 'react-native-vector-icons/Ionicons';

const componentStyles = StyleSheet.create({
	background: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	small: {
		width: 26,
		height: 26,
		borderRadius: 13,
	},
	textSmall: {
		fontSize: 7,
	},
	medium: {
		width: 40,
		height: 40,
		borderRadius: 20,
	},
	textMedium: {
		fontSize: 11,
	},
	large: {
		width: 50,
		height: 50,
		borderRadius: 25,
	},
	textLarge: {
		fontSize: 15,
	},
});
const iconSize = {
	small: 20,
	medium: 32,
	large: 40,
};

class Avatar extends Component {

	shouldComponentUpdate(nextProps) {
		return this.props.firstName !== nextProps.firstName || this.props.lastName !== nextProps.lastName || this.props.url !== nextProps.url;
	}

	getAvatarBackgroundColor = (initials) => {
		let { backgroundColor } = this.props;

		if (!backgroundColor) {
			if (initials) {
				const colors = ['#1abc9c', '#2ecc71', '#3498db', '#9b59b6', '#34495e', '#16a085', '#27ae60', '#2980b9', '#8e44ad', '#2c3e50', '#f1c40f', '#e67e22', '#e74c3c', '#95a5a6', '#f39c12', '#d35400', '#c0392b', '#bdc3c7', '#7f8c8d'];
				const charIndex = initials.charCodeAt(0) - 65,
					colorIndex = charIndex % 19;

				backgroundColor = colors[colorIndex] || '#4B4B4B';
			} else {
				backgroundColor = '#00b7c2';
			}
		}

		return backgroundColor;
	};

	getInitials = () => {
		const { firstName, lastName } = this.props;
		if (firstName && lastName) {
			return `${firstName.charAt(0).toUpperCase()}${lastName.charAt(0).toUpperCase()}`;
		}
	};

	render() {
		const {
			backgroundColor,
			size,
			style,
			accessibilityLabel,
			url,
			textSize,
		} = this.props;

		if (url) {
			return (
				<Image
					resizeMode="cover"
					source={{ uri: url }}
					style={[componentStyles[size], style]}
					accessibilityLabel={accessibilityLabel}
				/>
			);
		}

		let contents;
		const initials = this.getInitials();
		if (initials) {
			contents = (
				<Text
					lineHeight={false}
					color="white"
					weight="bold"
					style={componentStyles[textSize]}
				>
					{initials}
				</Text>
			);
		} else {
			const color = backgroundColor ? styles.colors.white : '#b3eaed';
			contents = (
				<Icon
					name="ios-person"
					size={iconSize[size]}
					color={color}
				/>
			);
		}

		return (
			<View
				style={[componentStyles.background, componentStyles[size], { backgroundColor: this.getAvatarBackgroundColor(initials) }, style]}
				accessibilityLabel={accessibilityLabel}
			>
				{contents}
			</View>
		);
	}

}

Avatar.propTypes = {
	backgroundColor: PropTypes.string,
	firstName: PropTypes.string,
	lastName: PropTypes.string,
	size: PropTypes.string,
	textSize: PropTypes.string,
	url: PropTypes.string,
	style: ViewPropTypes.style,
	accessibilityLabel: PropTypes.string,
};

Avatar.defaultProps = {
	firstName: '',
	lastName: '',
	size: 'medium',
	textSize: 'textMedium',
	style: {},
};

export default Avatar;
