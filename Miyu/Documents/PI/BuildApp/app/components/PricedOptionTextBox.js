import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	View,
	StyleSheet,
} from 'react-native';
import FormInput from './FormInput';
import styles from '../lib/styles';

const componentStyles = StyleSheet.create({
	inputContainer: {
		backgroundColor: styles.colors.white,
	},
});

export default class PricedOptionTextBox extends Component {

	constructor(props) {
		super(props);
		this.state = {
			value: props.defaultValue || '',
		};
	}

	onSubmitEditing = (ref, event) => {
		const option = {
			pricedOptionId: this.props.pricedOptionId,
			text: event.nativeEvent.text,
			value: this.props.labelText,
		};
		if (option.text) {
			this.props.onSelect(option);
		}
		this.setState({ value: option.text });
	};

	onBlur = () => {
		const option = {
			pricedOptionId: this.props.pricedOptionId,
			text: this.state.value,
			value: this.props.labelText,
		};
		if (option.text) {
			this.props.onSelect(option);
		}
	};

	onChange = ({ nativeEvent }) => {
		this.setState({ value: nativeEvent.text });
	};

	render() {
		return (
			<View>
				<FormInput
					onChange={this.onChange}
					name="pricedOptionTextBox"
					placeholder={this.props.placeholderText}
					returnKeyType="done"
					onBlur={this.onBlur}
					onSubmitEditing={this.onSubmitEditing}
					defaultValue={this.props.defaultValue}
					label={this.props.labelText}
					value={this.state.value}
					textInputContainer={componentStyles.inputContainer}
					accessibilityLabel={`${this.props.labelText}PricedOptionText`}
				/>
			</View>
		);
	}
}

PricedOptionTextBox.propTypes = {
	labelText: PropTypes.string.isRequired,
	placeholderText: PropTypes.string.isRequired,
	onSelect: PropTypes.func.isRequired,
	pricedOptionId: PropTypes.string.isRequired,
	cost: PropTypes.number,
	defaultValue: PropTypes.string,
};

PricedOptionTextBox.defaultProps = {
	cost: 0,
	defaultValue: '',
};
