import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	StyleSheet,
	TextInput,
	View,
} from 'react-native';
import { Button } from 'BuildLibrary';
import styles from '../../../lib/styles';

const componentStyles = StyleSheet.create({
	row: {
		height: 42,
		paddingHorizontal: styles.measurements.gridSpace2,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	createProjectInputText: {
		flex: 1,
		...StyleSheet.flatten(styles.text.italics),
		color: styles.colors.secondary,
		fontSize: styles.fontSize.small,
		marginRight: styles.measurements.gridSpace1,
	},
	error: {
		borderWidth: styles.dimensions.borderWidth,
		borderColor: styles.colors.error,
	},
});

export default class TextInputWithButton extends Component {
	constructor(props) {
		super(props);
		this.state = {
			text: '',
			error: false,
			showButton: false,
		};
	}

	getComponentStyle = () => {
		const style = [componentStyles.row];
		if (this.state.error) {
			style.push(componentStyles.error);
		}
		return style;
	};

	getTextInputStyle = () => {
		const style = [componentStyles.createProjectInputText];
		if (this.state.showButton) {
			style.push(styles.text.default);
		}
		return style;
	};

	clearInput = () => {
		if (this.textInput) {
			this.textInput.clear();
			this.textInput.blur();
		}
	};

	onPressCreate = () => {
		const { text } = this.state;
		if (text && text.trim()) {
			this.props.onCreate(text);
		} else {
			this.setState({ error: true });
		}
	};

	renderButton = () => {
		if (this.state.showButton) {
			return (
				<Button
					onPress={() => {
						this.setState({ isLoading: true });
						this.onPressCreate();
					}}
					text={this.props.buttonText}
					textColor="primary"
					textWeight="normal"
					color="none"
					borders={false}
					trackAction={this.props.analytics.actionName}
					trackContextData={this.props.analytics.contextData}
					accessibilityLabel={this.props.buttonText}
					isLoading={this.props.isLoading}
				/>
			);
		}
	};

	render() {
		return (
			<View style={this.getComponentStyle()}>
				<TextInput
					ref={(ref) => {
						if (ref) {
							this.textInput = ref;
						}
					}}
					autoFocus={false}
					autoCorrect={false}
					multiline={false}
					clearButtonMode="while-editing"
					style={this.getTextInputStyle()}
					placeholder={this.props.placeholderText}
					placeholderTextColor={styles.colors.greyDark}
					value={this.state.text}
					autoCapitalize="none"
					underlineColorAndroid="transparent"
					selectionColor={styles.colors.primary}
					onChangeText={(text) => {
						this.setState({
							text,
							showButton: text && text.length,
							error: false,
						});
					}}
					onFocus={() => {
						if (this.state.text && this.state.text.length) {
							this.setState({ showButton: true });
						}
						if (this.props.onInputFocus) {
							this.props.onInputFocus();
						}
					}}
					onBlur={() => this.setState({ showButton: false })}
				/>
				{this.renderButton()}
			</View>
		);
	}
}

TextInputWithButton.propTypes = {
	onCreate: PropTypes.func.isRequired,
	placeholderText: PropTypes.string.isRequired,
	buttonText: PropTypes.string.isRequired,
	analytics: PropTypes.shape({
		actionName: PropTypes.string.isRequired,
		contextData: PropTypes.object,
	}).isRequired,
	onInputFocus: PropTypes.func,
	isLoading: PropTypes.bool,
};

TextInputWithButton.defaultProps = {
	isLoading: false,
};
