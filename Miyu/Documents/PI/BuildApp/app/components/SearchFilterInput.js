import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	TextInput,
	StyleSheet,
	View,
} from 'react-native';
import styles from '../lib/styles';
import helpers from '../lib/helpers';
import Icon from 'react-native-vector-icons/Ionicons';

const componentStyles = StyleSheet.create({
	container: {
		padding: styles.measurements.gridSpace1,
		borderBottomWidth: styles.dimensions.borderWidth,
		borderBottomColor: styles.colors.grey,
	},
	input: {
		flex: 1,
		height: 44,
		paddingRight: styles.measurements.gridSpace1,
		color: styles.colors.secondary,
		fontSize: styles.fontSize.small,
	},
	inputContainer: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	icon: {
		marginHorizontal: styles.measurements.gridSpace1,
	},
	border: {
		borderWidth: styles.dimensions.borderWidth,
		borderColor: styles.colors.grey,
	},
	listViewThemeBackground: {
		backgroundColor: styles.colors.greyLight,
	},
});

class SearchFilterInput extends Component {

	constructor() {
		super();
		this.state = {
			isFocused: false,
		};
	}

	getInputContainerStyle = () => {
		const style = [componentStyles.inputContainer];
		if (this.props.theme === 'regular') {
			style.push(componentStyles.border);
		} else {
			style.push(componentStyles.listViewThemeBackground);
		}
		return style;
	};

	renderIcon = () => {
		const { style, selectionColor } = this.props;
		const color = this.state.isFocused && selectionColor ? selectionColor : styles.colors.greyDark;
		return (
			<Icon
				name={helpers.getIcon('search')}
				size={21}
				style={[componentStyles.icon, style.icon]}
				color={color}
			/>
		);
	};

	renderTextInput = () => {
		const { onChangeText, style, placeholder, text, theme } = this.props;
		const placeholderColor = theme === 'regular' ? styles.colors.grey : styles.colors.greyDark;
		return (
			<TextInput
				clearButtonMode="while-editing"
				onChangeText={onChangeText}
				style={[componentStyles.input, style.input]}
				placeholder={placeholder}
				placeholderTextColor={placeholderColor}
				defaultValue={text}
				autoCapitalize="none"
				underlineColorAndroid="transparent"
				onFocus={(event) => {
					this.setState({ isFocused: true });
					this.props.onFocus(event);
				}}
				onLayout={this.props.onLayout}
				onBlur={() => {
					this.setState({ isFocused: false });
				}}
				selectionColor={this.props.selectionColor}
				autoCorrect={false}
			/>
		);
	};

	renderInputContainer = () => {
		if (this.props.theme === 'regular') {
			return (
				<View style={this.getInputContainerStyle()}>
					{this.renderIcon()}
					{this.renderTextInput()}
				</View>
			);
		}
		return (
			<View style={this.getInputContainerStyle()}>
				{this.renderTextInput()}
				{this.renderIcon()}
			</View>
		);
	};

	render() {
		const { style } = this.props;
		if (this.props.theme === 'listview') {
			return this.renderInputContainer();
		}
		return (
			<View style={[componentStyles.container, style.container]}>
				{this.renderInputContainer()}
			</View>
		);
	}

}

SearchFilterInput.propTypes = {
	onChangeText: PropTypes.func.isRequired,
	onFocus: PropTypes.func,
	onLayout: PropTypes.func,
	style: PropTypes.object,
	placeholder: PropTypes.string,
	text: PropTypes.string,
	theme: PropTypes.oneOf([ 'regular', 'listview' ]),
	selectionColor: PropTypes.string,
};

SearchFilterInput.defaultProps = {
	onChangeText() {
		return null;
	},
	style: {
		container: {},
		input: {},
		icon: {},
	},
	placeholder: '',
	text: '',
	onFocus: helpers.noop,
	onLayout: helpers.noop,
	theme: 'regular',
	selectionColor: '',
};

export default SearchFilterInput;
