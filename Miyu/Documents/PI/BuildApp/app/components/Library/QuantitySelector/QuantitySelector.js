import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	View,
	StyleSheet,
	TextInput,
	TouchableHighlight,
	TouchableWithoutFeedback,
	ViewPropTypes,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Text } from 'BuildLibrary';
import styles from '../../../lib/styles';
import helpers from '../../../lib/helpers';

const componentStyles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		backgroundColor: styles.colors.white,
		height: 44,
	},
	oneThird: {
		flex: 3,
	},
	selectorButton: {
		flex: 3,
		alignItems: 'center',
		borderWidth: styles.dimensions.borderWidth,
		borderColor: styles.colors.grey,
	},
	buttonDisabled: {
		backgroundColor: styles.colors.greyLight,
		borderWidth: styles.dimensions.borderWidth,
		borderColor: styles.colors.grey,
	},
	selectorButtonIcon: {
		justifyContent: 'center',
		marginTop: styles.measurements.gridSpace1,
	},
	quantityButton: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		borderWidth: styles.dimensions.borderWidth,
		borderColor: styles.colors.grey,
	},
	quantityButtonWithSelectors: {
		borderLeftWidth: 0,
		borderRightWidth: 0,
	},
	quantityTextInput: {
		flex: 1,
		alignItems: 'flex-end',
		fontSize: styles.fontSize.large,
		textAlign: 'right',
		paddingRight: styles.measurements.gridSpace1,
	},
	primaryTheme: {
		backgroundColor: styles.colors.primary,
		borderWidth: 0,
	},
	primaryThemeColor: {
		color: styles.colors.white,
	},
	primaryThemeSelectorButtonMargins: {
		marginHorizontal: 1,
	},
	fullThemeContainer: {
		borderColor: styles.colors.grey,
		backgroundColor: styles.colors.greyLight,
		borderWidth: styles.dimensions.borderWidth,
	},
	fullThemeWidth: {
		width: 48,
	},
	fullThemeBackground: {
		backgroundColor: styles.colors.white,
	},
	fullThemeQuantityTitle: {
		flex: 1,
		justifyContent: 'center',
		marginLeft: styles.measurements.gridSpace1,
	},
	fullThemeSelectorButtonIcon: {
		backgroundColor: styles.colors.none,
		marginTop: 5,
	},
});

/**
 * QuantitySelector: visual component used to change a value either with touch or keypad edit.
 */
export default class QuantitySelector extends Component {
	displayName = 'QuantitySelector';

	constructor(props) {
		super(props);

		this.state = {
			editMode: false,
			selectorMode: this.isFullTheme() || this.isMiniTheme(),
			quantity: helpers.toInteger(this.props.quantity),
		};
	}

	onSetModes = () => {
		this.setState({
			selectorMode: !this.state.selectorMode || !this.state.editMode,
			editMode: this.state.selectorMode ? !this.state.editMode : false,
		}, () => {
			this.props.onToggleSelectors(this.state.selectorMode);
		});
	};

	onHideSelectors = () => {
		this.setState({ selectorMode: false, editMode: false });
	};

	onFocus = () => {
		if (this.props.onInputFocus) {
			this.props.onInputFocus(this.props.id);
		}
	};

	plusQuantity = () => {
		if (!this.isRightSelectorDisabled()) {
			const quantity = this.state.quantity + 1;
			this.updateQuantity(quantity);
		}
	};

	minusQuantity = () => {
		const quantity = this.state.quantity - 1;
		this.updateQuantity(quantity);
	};

	updateQuantity = (quantity) => {
		this.setState({ quantity, editMode: false }, () => {
			this.props.onUpdateQuantity(this.state.quantity, this.props.id);
		});
	};

	endEditMode = () => {
		this.props.onUpdateQuantity(this.state.quantity, this.props.id);
		this.setState({ editMode: false });
	};

	endEditing = () => {
		let quantity = helpers.toInteger(this.state.quantity);
		if (quantity === 0 && !this.props.allowZero) {
			quantity = 1;
			this.changeQuantity(quantity);
		}
		this.props.onUpdateQuantity(quantity, this.props.id);
		this.setState({ editMode: false });
	};

	changeQuantity = (quantity) => {
		this.setState({
			quantity: helpers.toInteger(quantity),
		}, () => this.props.onUpdateQuantity(this.state.quantity, this.props.id));
	};

	getContainerStyle = () => {
		const style = [componentStyles.container];
		if (this.isFullTheme()) {
			style.push(componentStyles.fullThemeContainer);
		}
		style.push(this.props.style);
		return style;
	};

	getSelectorButtonStyle = () => {
		const frozenObj = StyleSheet.flatten(componentStyles.selectorButton);
		const style = [{...frozenObj}];
		if (this.isPrimaryTheme()) {
			style.push(componentStyles.primaryTheme, componentStyles.primaryThemeSelectorButtonMargins);
		} else if (this.isFullTheme()) {
			delete style[0].flex;
			style.push(componentStyles.fullThemeWidth, componentStyles.fullThemeBackground);
		}
		return style;
	};

	getButtonDisabledStyle = () => {
		const style = [componentStyles.buttonDisabled];
		if (this.isPrimaryTheme()) {
			style.push(componentStyles.primaryTheme);
		} else if (this.isFullTheme()) {
			style.push(componentStyles.fullThemeBackground);
		}
		return style;
	};

	getRightSelectorButtonStyle = () => {
		const style = [ this.getSelectorButtonStyle() ];
		if (this.isRightSelectorDisabled()) {
			style.push(this.getButtonDisabledStyle());
		}
		return style;
	}

	getSelectorButtonIconStyle = () => {
		const style = [componentStyles.selectorButtonIcon];
		if (this.isPrimaryTheme()) {
			style.push(componentStyles.primaryThemeColor);
		} else if (this.isFullTheme()) {
			style.push(componentStyles.fullThemeSelectorButtonIcon);
		}
		return style;
	};

	getQuantityButtonStyle = () => {
		const frozenObj = StyleSheet.flatten(componentStyles.quantityButton);
		const style = [{...frozenObj}];
		if (this.isPrimaryTheme()) {
			style.push(componentStyles.primaryTheme);
		} else if (this.isFullTheme()) {
			delete style[0].flex;
			style.push(componentStyles.fullThemeWidth, componentStyles.fullThemeBackground);
		}
		if (this.state.selectorMode && !this.isFullTheme()) {
			style.push(componentStyles.quantityButtonWithSelectors, componentStyles.oneThird);
		}
		return style;
	};

	getQuantityTextInputStyle = () => {
		return this.applyWhiteColorToText(componentStyles.quantityTextInput);
	};

	isPrimaryTheme = () => {
		return this.props.theme === 'primary';
	};

	isFullTheme = () => {
		return this.props.theme === 'full';
	};

	isMiniTheme = () => {
		return this.props.theme === 'mini';
	};

	isRightSelectorDisabled = () => {
		const { quantity } = this.state;
		const { maxQuantity } = this.props;

		return !!maxQuantity && quantity >= maxQuantity;
	}

	/**
	 * if theme prop is set to primary then use primary color as background and white text/icons
	 * @param styleToUpdate
	 * @returns {*[]}
	 */
	applyPrimaryTheme = (styleToUpdate) => {
		const style = [styleToUpdate];
		if (this.isPrimaryTheme()) {
			style.push(componentStyles.primaryTheme);
		}
		return style;
	};

	/**
	 * Update given style with primary theme by setting the color attribute to white if {@link theme} prop
	 * was set to primary.
	 * @param styleToUpdate
	 * @returns {*[]} returns primary themed style
	 */
	applyWhiteColorToText = (styleToUpdate) => {
		const style = [styleToUpdate];
		if (this.isPrimaryTheme()) {
			style.push(componentStyles.primaryThemeColor);
		}
		return style;
	};

	renderQuantityTitle = () => {
		if (this.isFullTheme()) {
			return (
				<View style={componentStyles.fullThemeQuantityTitle}>
					<Text lineHeight={false}>Quantity:</Text>
				</View>
			);
		}
	};

	renderLeftSelector = () => {
		const { disableDelete } = this.props;
		const { quantity } = this.state;
		const leftIconName = quantity <= 1 ? 'trash' : 'remove';

		if (quantity <= 1 && disableDelete) {
			return (
				<View
					style={[this.getSelectorButtonStyle(), this.getButtonDisabledStyle()]}
				>
					<Icon
						style={this.getSelectorButtonIconStyle()}
						name={helpers.getIcon('remove')}
						color={styles.colors.mediumGray}
						size={30}
					/>
				</View>
			);
		}

		return (
			<TouchableHighlight
				style={this.getSelectorButtonStyle()}
				underlayColor={styles.colors.greyLight}
				onPress={this.minusQuantity}
			>
				<Icon
					style={this.getSelectorButtonIconStyle()}
					name={helpers.getIcon(leftIconName)}
					size={30}
				/>
			</TouchableHighlight>
		);
	};

	renderRightSelector = () => {
		const iconColor = this.isRightSelectorDisabled() ? styles.colors.mediumGray : styles.colors.secondary;
		return (
			<TouchableHighlight
				style={this.getRightSelectorButtonStyle()}
				underlayColor={styles.colors.greyLight}
				onPress={this.plusQuantity}
			>
				<Icon
					style={this.getSelectorButtonIconStyle()}
					color={iconColor}
					name={helpers.getIcon('add')}
					size={30}
				/>
			</TouchableHighlight>
		);
	};

	renderQuantityLabel = (textColor) => {
		if (!this.isFullTheme()) {
			return (
				<Text
					size="xsmall"
					weight="bold"
					color={textColor}
					lineHeight={false}
				>
					QTY
				</Text>
			);
		}
	};

	renderQuantity = () => {
		if (this.state.editMode) {
			return (
				<View style={this.getQuantityButtonStyle()}>
					<TextInput
						style={this.getQuantityTextInputStyle()}
						keyboardType="numeric"
						autoFocus={true}
						maxLength={4}
						selectTextOnFocus={true}
						onChangeText={this.changeQuantity}
						onSubmitEditing={this.endEditMode}
						onEndEditing={this.endEditing}
						onFocus={this.onFocus}
						value={helpers.toQuantity(this.state.quantity)}
						underlineColorAndroid="transparent"
					/>
				</View>
			);
		}

		const textColor = this.isPrimaryTheme() ? 'white' : 'secondary';
		return (
			<TouchableWithoutFeedback onPress={this.onSetModes}>
				<View style={this.getQuantityButtonStyle()}>
					<Text
						weight="bold"
						color={textColor}
						lineHeight={false}
					>
						{helpers.toQuantity(this.state.quantity)}
					</Text>
					{this.renderQuantityLabel(textColor)}
				</View>
			</TouchableWithoutFeedback>
		);
	};

	render() {
		if (this.state.selectorMode) {
			return (
				<View style={this.getContainerStyle()}>
					{this.renderQuantityTitle()}
					{this.renderLeftSelector()}
					{this.renderQuantity()}
					{this.renderRightSelector()}
				</View>
			);
		}

		return (
			<View style={this.getContainerStyle()}>
				{this.renderQuantity()}
			</View>
		);
	}
}

QuantitySelector.propTypes = {
	allowZero: PropTypes.bool.isRequired,
	disableDelete: PropTypes.bool,
	id: PropTypes.string,
	maxQuantity: PropTypes.number,
	onUpdateQuantity: PropTypes.func,
	onInputFocus: PropTypes.func,
	onToggleSelectors: PropTypes.func,
	quantity: PropTypes.number,
	style: ViewPropTypes.style,
	theme: PropTypes.oneOf(['regular', 'primary', 'full', 'mini']),
};

QuantitySelector.defaultProps = {
	allowZero: true,
	quantity: 1,
	onUpdateQuantity: helpers.noop,
	onInputFocus: helpers.noop,
	onToggleSelectors: helpers.noop,
	theme: 'regular',
};
