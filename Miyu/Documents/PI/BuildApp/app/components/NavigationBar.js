'use strict';
import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	View,
	StyleSheet,
	TouchableOpacity,
} from 'react-native';
import { Navigator } from 'react-native-deprecated-custom-components';
import helpers from '../lib/helpers';
import Icon from 'react-native-vector-icons/Ionicons';
import styles from '../lib/styles';
import NavigationBarBackButton from '../components/ExNavigationBarBackButton';
import { Text } from 'BuildLibrary';
import { HIT_SLOP } from '../constants/constants';

const totalNavHeight = Navigator.NavigationBar.Styles.General.TotalNavHeight;
const iosStatusBarHeight = 20;

const componentStyles = StyleSheet.create({
	backButton: {
		justifyContent: 'center',
		alignItems: 'center',
		height: 44,
		width: 44,
	},
	buttonStyle: {
		flexDirection: 'row',
		minHeight: 44,
		minWidth: 44,
		justifyContent: 'center',
		alignItems: 'center',
	},
	left: {
		flex: 1,
		alignItems: 'flex-start',
	},
	center: {
		flex: 3,
		alignItems: 'center',
	},
	right: {
		flex: 1,
		alignItems: 'flex-end',
		paddingRight: styles.measurements.gridSpace1,
	},
	navigationBar: {
		height: totalNavHeight,
		backgroundColor: styles.colors.secondary,
		shadowColor: 'black',
	},
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'space-around',
		flexDirection: 'row',
	},
	containerStatusBarHeight: {
		marginTop: iosStatusBarHeight,
	},
	navBarButtonText: {
		fontSize: styles.fontSize.regular,
		textAlign: 'center',
		marginVertical: styles.measurements.gridSpace1,
		color: styles.colors.white,
		fontFamily: styles.fonts.mainRegular,
	},
	navBarButtonTextLeft: {
		paddingLeft: styles.measurements.gridSpace1,
	},
	navBarTitleText: {
		fontFamily: styles.fonts.mainRegular,
	},
	icon: {
		paddingRight: styles.measurements.gridSpace1,
	},
	lightBackground: {
		backgroundColor: styles.colors.white,
	},
	lightColor: {
		color: styles.colors.mediumDarkGray,
		opacity: 1,
	},
});

class NavigationBar extends Component {

	constructor(props) {
		super(props);

		this.state = {
			lightBackground: this.props.light ? componentStyles.lightBackground : {},
			lightColor: this.props.light ? componentStyles.lightColor : {},
		};
	}

	getIcon = (name, style = {}) => {
		const color = this.props.light ? styles.colors.mediumDarkGray : styles.colors.white;
		let fontSize = 28;

		if (!name) {
			return <View />;
		}

		if (name === 'ios-close') {
			// this icon is smaller than most so we bump up the size
			fontSize = 38;
		}

		return (
			<Icon
				name={name}
				style={[{ fontSize }, style]}
				color={color}
			/>
		);
	};

	getTitle = () => {
		const { title, capitalize, light } = this.props;
		if (title) {
			return (
				<View style={componentStyles.center}>
					<Text
						lineHeight={false}
						weight="bold"
						textAlign="center"
						capitalize={capitalize}
						style={[componentStyles.navBarTitleText, this.props.title.style]}
						numberOfLines={1}
						color={light ? 'secondary' : 'white'}
					>
						{title.text}
					</Text>
				</View>
			);
		}
	};

	getRightButton = () => {
		const { rightNavButton, light } = this.props;

		if (!rightNavButton) {
			return <View style={componentStyles.right} />;
		}
		return (
			<View style={componentStyles.right}>
				<TouchableOpacity
					onPress={rightNavButton.onPress}
					style={componentStyles.buttonStyle}
					hitSlop={HIT_SLOP}
					accessibilityLabel="Right Nav Button"
				>
					{this.getIcon(rightNavButton.icon, rightNavButton.style)}
					<Text
						lineHeight={false}
						color={light ? 'greyDark' : 'white'}
						style={[componentStyles.navBarButtonText, this.state.lightColor, rightNavButton.style]}
					>
						{rightNavButton.text}
					</Text>
				</TouchableOpacity>
			</View>
		);
	};

	getLeftButton = () => {
		const { leftNavButton, light, showBackButton } = this.props;

		if (showBackButton) {
			return (
				<NavigationBarBackButton
					tintColor={helpers.isIOS() ? styles.colors.primary : styles.colors.white}
					style={componentStyles.backButton}
				/>
			);
		}

		if (!leftNavButton) {
			return <View style={componentStyles.left} />;
		}

		return (
			<View style={componentStyles.left}>
				<TouchableOpacity
					onPress={leftNavButton.onPress}
					hitSlop={HIT_SLOP}
					style={componentStyles.buttonStyle}
					accessibilityLabel="Left Nav Button"
				>
					{this.getIcon(leftNavButton.icon, leftNavButton.style)}
					<Text
						lineHeight={false}
						color={light ? 'greyDark' : 'white'}
						style={[componentStyles.navBarButtonText, componentStyles.navBarButtonTextLeft, this.state.lightColor, leftNavButton.style]}
					>
						{leftNavButton.text}
					</Text>
				</TouchableOpacity>
			</View>
		);
	};

	render() {
		return (
			<View style={[componentStyles.navigationBar, this.state.lightBackground, this.props.style]}>
				<View style={[componentStyles.container, this.props.fullHeader && helpers.isIOS() ? componentStyles.containerStatusBarHeight : {}]}>
					{this.getLeftButton()}
					{this.getTitle()}
					{this.getRightButton()}
				</View>
			</View>
		);
	}

}

NavigationBar.propTypes = {
	leftNavButton: PropTypes.object,
	rightNavButton: PropTypes.object,
	title: PropTypes.object,
	style: PropTypes.object,
	light: PropTypes.bool,
	capitalize: PropTypes.string,
	showBackButton: PropTypes.bool,
	fullHeader: PropTypes.bool,
};

NavigationBar.defaultProps = {
	fullHeader: true,
};

module.exports = NavigationBar;
