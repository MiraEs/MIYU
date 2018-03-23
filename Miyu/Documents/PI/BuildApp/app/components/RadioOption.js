import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	View,
	StyleSheet,
	TouchableOpacity,
} from 'react-native';
import {Text} from 'BuildLibrary';
import styles from '../lib/styles';
const componentStyles = StyleSheet.create({
	option: {
		marginBottom: styles.measurements.gridSpace1,
		backgroundColor: styles.colors.white,
	},
	borderSelected: {
		borderWidth: styles.dimensions.borderWidthLarge,
		borderStyle: 'solid',
		borderColor: styles.colors.accent,
	},
	border: {
		borderWidth: styles.dimensions.borderWidth,
		borderStyle: 'solid',
		borderColor: styles.colors.grey,
	},
	wrapperView: {
		flex: 1,
	},
});

export default class RadioOption extends Component {
	constructor() {
		super();
		this.getStyle = this.getStyle.bind(this);
	}
	getStyle() {
		const {isSelected} = this.props;
		const style = [componentStyles.option];
		isSelected ? style.push(componentStyles.borderSelected) : style.push(componentStyles.border);
		return style;
	}

	render() {
		const {onPress, text, children} = this.props;
		if (children) {
			return (
				<TouchableOpacity onPress={onPress}>
					<View
						style={this.getStyle()}
					>
						{children}
					</View>
				</TouchableOpacity>
			);
		}
		return (
			<TouchableOpacity onPress={onPress}>
				<View
					style={this.getStyle()}
				>
					<View style={componentStyles.wrapperView}>
						<Text
							style={styles.elements.text}
						>
							{text}
						</Text>
					</View>
				</View>
			</TouchableOpacity>
		);
	}
}

RadioOption.propTypes = {
	onPress: PropTypes.func.isRequired,
	isSelected: PropTypes.bool,
	text: PropTypes.string,
	children: PropTypes.oneOfType([
		PropTypes.element,
		PropTypes.array,
	]),
};

RadioOption.defaultProps = {
	children: null,
	isSelected: false,
	text: '',
};
