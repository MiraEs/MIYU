'use strict';
import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	View,
	Text,
	TouchableHighlight,
	Platform,
	ActivityIndicator,
	StyleSheet,
	ViewPropTypes,
} from 'react-native';
import styles from '../lib/styles';
const { facebookBlue, facebookBlueDark } = styles.colors;
import Icon from 'react-native-vector-icons/Ionicons';
import { trackAction } from '../actions/AnalyticsActions';
import store from '../store/configStore';

const componentStyles = StyleSheet.create({
	button: {
		backgroundColor: styles.colors.primary,
		alignItems: 'center',
		justifyContent: 'center',
		height: 44,
	},
	buttonText: {
		textAlign: 'center',
		color: '#fff',
		fontSize: styles.fontSize.regular,
		fontFamily: styles.fonts.mainBold,
		marginHorizontal: styles.measurements.gridSpace1,
	},
	iconButton: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		marginHorizontal: styles.measurements.gridSpace1,
	},
	facebookIcon: {
		marginRight: 10,
	},
	loadingIcon: {
		height: 17,
	},
	loginWithFacebookButtonText: {
		color: 'white',
		fontSize: 16,
		fontFamily: styles.fonts.mainBold,
	},
});

class Button extends Component {

	constructor(props) {
		super(props);
		this.displayName = '';
		this.state = {
			padding: styles.measurements.gridSpace1,
			underlayColor: styles.colors.primaryDark,
			...this.getStyles(props),
		};
	}

	componentWillReceiveProps(nextProps) {
		this.setState(this.getStyles(nextProps));
	}

	getStyles = (props) => {
		const options = { iconColor: styles.colors.white };
		const { style, size, color, type, text, disableBorder } = props;

		options.buttonStyle = [componentStyles.button, style];
		options.buttonTextStyle = [componentStyles.buttonText];

		if (disableBorder !== true) {
			options.buttonStyle.push({
				borderWidth: styles.dimensions.borderWidth,
				borderColor: styles.colors.grey,
			});
		}

		if (size === 'small') {
			options.buttonStyle.push({
				height: 37,
			});
			options.buttonTextStyle.push({
				fontSize: styles.fontSize.small,
			});
			options.padding = styles.measurements.gridSpace1;
		}

		if (color === 'secondary') {
			options.buttonStyle.push({
				backgroundColor: styles.colors.lightGray,
				borderColor: styles.colors.grey,
			});
			options.buttonTextStyle.push({
				color: styles.colors.secondary,
			});
			options.underlayColor = styles.colors.grey;
			options.iconColor = styles.colors.secondary;
		}
		if (color === 'white') {
			options.buttonStyle.push({
				backgroundColor: styles.colors.white,
				borderColor: styles.colors.grey,
				borderWidth: styles.dimensions.borderWidth,
			});
			options.buttonTextStyle.push({
				color: styles.colors.secondary,
			});
			options.underlayColor = styles.colors.grey;
			options.iconColor = styles.colors.secondary;
		}

		if (type === 'icon') {
			if (!text) {
				options.buttonStyle.push({
					width: size === 'small' ? 37 : 44,
				});
			} else {
				options.buttonTextStyle.push({
					marginLeft: styles.measurements.gridSpace1,
				});
			}
		}

		if (type === 'link') {
			options.buttonStyle.push({
				backgroundColor: null,
				borderWidth: 0,
			});
			options.buttonTextStyle.push({
				color: styles.colors.secondary,
			});
			options.underlayColor = null;
		}

		if (type === 'facebook') {
			options.buttonStyle.push({
				backgroundColor: facebookBlue,
				borderColor: facebookBlue,
			});
			options.buttonTextStyle.push({
				color: styles.colors.white,
			});
			options.underlayColor = facebookBlueDark;
		}

		return options;
	};

	renderButton = () => {
		if (this.props.type === 'facebook') {
			return (
				<View style={componentStyles.iconButton}>
					<Icon
						name="logo-facebook"
						size={25}
						color="white"
						style={componentStyles.facebookIcon}
					/>
					<Text style={componentStyles.loginWithFacebookButtonText}>{this.props.text}</Text>
				</View>
			);
		} else if (this.props.type === 'icon') {
			const text = this.props.text ? <Text style={this.state.buttonTextStyle}>{this.props.text}</Text> : null;
			const iconSize = this.props.size === 'small' ? 16 : 25;

			return (
				<View style={componentStyles.iconButton}>
					<Icon
						color={this.state.iconColor}
						name={this.props.iconName}
						size={iconSize}
					/>
					{text}
				</View>
			);
		}
		return (
			<Text
				style={this.state.buttonTextStyle}
				lineHeight={false}
			>
				{this.props.text}
			</Text>
		);
	};

	render() {
		return (
			<TouchableHighlight
				onPress={() => {
					store.dispatch(trackAction(this.props.trackAction, this.props.trackContextData));
					this.props.onPress();
				}}
				style={this.state.buttonStyle}
				underlayColor={this.state.underlayColor}
				accessibilityLabel={this.props.accessibilityLabel}
			>
				{(() => {
					if (this.props.isLoading) {
						if (Platform.OS === 'ios') {
							return (
								<View>
									<ActivityIndicator
										animating={true}
										color={'#fff'}
										style={componentStyles.loadingIcon}
									/>
								</View>
							);
						} else {
							return (
								<Text style={styles.elements.mainFont}>{this.props.loadingText}</Text>
							);
						}
					}
					return this.renderButton();
				})()}
			</TouchableHighlight>
		);
	}

}

Button.propTypes = {
	isLoading: PropTypes.bool,
	onPress: PropTypes.func.isRequired,
	size: PropTypes.oneOf(['default', 'small']),
	style: ViewPropTypes.style,
	text: PropTypes.string,
	loadingText: PropTypes.string,
	color: PropTypes.oneOf(['primary', 'secondary', 'white']),
	type: PropTypes.oneOf(['facebook', 'icon', 'link']),
	iconName: PropTypes.string,
	accessibilityLabel: PropTypes.string.isRequired,
	disableBorder: PropTypes.bool,
	trackAction: PropTypes.string.isRequired,
	trackContextData: PropTypes.object,
};

module.exports = Button;
