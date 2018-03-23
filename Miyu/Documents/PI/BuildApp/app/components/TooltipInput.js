import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	StyleSheet,
	View,
	ViewPropTypes,
} from 'react-native';
import styles from '../lib/styles';
import { Text } from 'BuildLibrary';
import FormInput from './FormInput';
import Triangle from '../components/Triangle';

const componentStyles = StyleSheet.create({
	errorStyle: {
		marginTop: -96,
	},
	label: {
		marginHorizontal: styles.measurements.gridSpace1,
		marginTop: styles.measurements.gridSpace1,
		alignSelf: 'flex-start',
	},
	input: {
		borderWidth: styles.dimensions.borderWidth,
		borderColor: styles.colors.grey,
		marginVertical: 0,
	},
	inputContainer: {
		flex: 1,
		paddingHorizontal: styles.measurements.gridSpace1,
	},
	tooltip: {
		backgroundColor: styles.colors.white,
		borderWidth: styles.dimensions.borderWidth,
		borderTopWidth: 0,
		borderColor: styles.colors.grey,
		padding: styles.measurements.gridSpace1,
	},
	triangle: {
		position: 'absolute',
		top: 39,
		left: 30,
	},
});

export default class TooltipInput extends Component {

	constructor(props) {
		super(props);
		this.state = {
			value: props.initValue,
		};
	}

	renderTooltip = () => {
		return (
			<View style={componentStyles.tooltip}>
				{this.props.renderTooltip()}
			</View>
		);
	};

	focus = () => {
		this.formInput.focus();
	};

	render() {
		return (
			<View style={[styles.elements.flexRow, this.props.style]}>
				<Text style={[componentStyles.label, styles.elements.text]}>{this.props.label}</Text>
				<View style={componentStyles.inputContainer}>
					<FormInput
						ref={(ref) => this.formInput = ref}
						errorStyle={componentStyles.errorStyle}
						focusOffset={130}
						maxLength={this.props.maxLength}
						keyboardType="numeric"
						name={this.props.inputName}
						onChange={this.props.onChange}
						onChangeText={this.props.onChangeText}
						onSubmitEditing={this.props.onSubmitEditing}
						placeholder={this.props.placeholder}
						scrollToOnAndroid={true}
						textInputContainerStyle={componentStyles.input}
						validationFunction={this.props.validationFunction}
						validateOnChange={true}
						value={this.props.value}
						accessibilityLabel={this.props.accessibilityLabel}
					/>
					<Triangle style={componentStyles.triangle}/>
					{this.renderTooltip()}
				</View>
			</View>
		);
	}
}

TooltipInput.propTypes = {
	label: PropTypes.string,
	inputName: PropTypes.string,
	placeholder: PropTypes.string,
	initValue: PropTypes.string,
	onChange: PropTypes.func,
	onChangeText: PropTypes.func,
	onSubmitEditing: PropTypes.func,
	renderTooltip: PropTypes.func,
	validationFunction: PropTypes.func,
	style: PropTypes.oneOfType([
		PropTypes.object,
		ViewPropTypes.style,
	]),
	maxLength: PropTypes.number,
	value: PropTypes.string,
	accessibilityLabel: PropTypes.string.isRequired,
};
