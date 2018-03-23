import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	View,
	StyleSheet,
	TouchableOpacity,
	Animated,
	ViewPropTypes,
} from 'react-native';
import { Text } from 'BuildLibrary';
import styles from '../lib/styles';
import helpers from '../lib/helpers';
import Icon from 'react-native-vector-icons/Ionicons';

const componentStyles = StyleSheet.create({
	tappable: {
		borderWidth: styles.dimensions.borderWidth,
		borderStyle: 'solid',
		borderColor: styles.colors.grey,
		padding: styles.measurements.gridSpace1,
		backgroundColor: styles.colors.white,
		flexWrap: 'wrap',
	},
	disabled: {
		borderWidth: styles.dimensions.borderWidth,
		borderStyle: 'solid',
		borderColor: styles.colors.grey,
		padding: styles.measurements.gridSpace1,
		backgroundColor: styles.colors.greyLight,
	},
	disabledText: {
		color: styles.colors.greyDark,
	},
	selected: {
		borderColor: styles.colors.accent,
		borderWidth: styles.dimensions.borderWidthLarge,
	},
	error: {
		borderColor: styles.colors.error,
		borderWidth: styles.dimensions.borderWidthLarge,
	},
	errorMessage: {
		flex: 1,
		flexDirection: 'row',
		paddingHorizontal: styles.measurements.gridSpace1,
	},
	option: {
		marginTop: styles.measurements.gridSpace1,
		justifyContent: 'space-between',
		/*minHeight: 44,*/
	},
	nonSelectedOption: {
		paddingRight: styles.measurements.gridSpace1,
		marginTop: styles.measurements.gridSpace1,
		/*minHeight: 44,*/
		backgroundColor: styles.colors.white,
	},
	optionName: {
		fontSize: styles.fontSize.regular,
		fontFamily: styles.fonts.mainRegular,
		color: styles.colors.secondary,
	},
	icon: {
		position: 'absolute',
		right: styles.measurements.gridSpace1,
		bottom: styles.measurements.gridSpace2,
	},
	hideOverflow: {
		flex: 1,
		overflow: 'hidden',
	},
});

export default class OptionSelectButton extends Component {
	constructor(props) {
		super(props);
		this.state = {
			bounce: new Animated.Value(styles.fontSize.regular),
			isDisabled: props.isDisabled,
		};
	}

	componentWillReceiveProps(newProps) {
		this.setState({ isDisabled: newProps.isDisabled });
	}

	bounce = () => {
		Animated.timing(
			this.state.bounce,
			{toValue: styles.fontSize.regular+2}
		).start(() => {
			Animated.timing(
				this.state.bounce,
				{toValue: styles.fontSize.regular}
			).start();
		});
	};

	disable = () => {
		this.setState({ isDisabled: true });
	};

	getStyles = () => {
		const { style, hasError, isSelected } = this.props;
		const { isDisabled } = this.state;
		const buttonState = isDisabled ? 'disabled' : 'tappable';
		let buttonStyle = [componentStyles.option, styles.elements.centeredFlexRow, componentStyles[buttonState], style];

		if (isSelected) {
			buttonStyle = [...buttonStyle, componentStyles.selected];
		}

		if (hasError && !isDisabled) {
			buttonStyle = [...buttonStyle, componentStyles.error];
		}

		return buttonStyle;
	};

	renderContent = () => {
		const { children, isConfigured } = this.props;
		const { isDisabled } = this.state;
		const textColor = isDisabled ? componentStyles.disabledText : null;
		const bounce = { fontSize: this.state.bounce };

		if (children) {
			return children;
		} else if (isConfigured) {
			return (
				<Text lineHeight={false}>
					<Text
						style={textColor}
						lineHeight={false}
					>
						{this.props.text}
					</Text>
					<Text
						style={textColor}
						lineHeight={false}
						weight="bold"
					>
						{this.props.boldText}
					</Text>
				</Text>
			);
		}

		return (
			<Animated.Text style={[componentStyles.optionName, textColor, bounce]}>
				{this.props.text}
			</Animated.Text>
		);
	};

	renderIcon = () => {
		const { isDisabled } = this.state;
		const { hideIcon } = this.props;

		if (!isDisabled && !hideIcon) {
			return (
				<Icon
					name="ios-arrow-forward"
					size={28}
					color={styles.colors.grey}
				/>
			);
		}
	};

	renderErrorMessage = () => {
		const { hasError, errorMessage, isDisabled } = this.props;

		if (hasError && errorMessage && !isDisabled) {
			return (
				<Text
					style={componentStyles.errorMessage}
					color="error"
				>
					{errorMessage}
				</Text>
			);
		}
	};

	render() {
		const { onPress } = this.props;
		const { isDisabled } = this.state;

		return (
			<TouchableOpacity
				onPress={isDisabled ? helpers.noop : onPress}
				activeOpacity={isDisabled ? 1: 0.2}
				accessibilityLabel={(this.props.accessibilityLabel || '').replace(' ', '')}
			>
				<View
					style={this.getStyles()}
				>
					<View
						style={[styles.elements.centeredFlexRow, componentStyles.hideOverflow]}
					>
						{this.renderContent()}
					</View>
					{this.renderIcon()}
				</View>
				{this.renderErrorMessage()}
			</TouchableOpacity>
		);
	}
}

OptionSelectButton.propTypes = {
	onPress: PropTypes.func.isRequired,
	text: PropTypes.string,
	children: PropTypes.oneOfType([
		PropTypes.element,
		PropTypes.array,
	]),
	boldText: PropTypes.string,
	isConfigured: PropTypes.bool,
	isDisabled: PropTypes.bool,
	isSelected: PropTypes.bool,
	style: ViewPropTypes.style,
	hasError: PropTypes.bool,
	hideIcon: PropTypes.bool,
	errorMessage: PropTypes.string,
	accessibilityLabel: PropTypes.string.isRequired,
};
OptionSelectButton.defaultProps = {
	text: '',
	boldText: '',
	isConfigured: false,
	isDisabled: false,
	isSelected: false,
	style: {},
	children: null,
	hasError: false,
	hideIcon: false,
	accessibilityLabel: 'notset',
};
