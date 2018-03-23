import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	TextInput,
	View,
	StyleSheet,
	TouchableOpacity,
	findNodeHandle,
	ViewPropTypes,
} from 'react-native';
import {
	Text,
	Image,
} from 'BuildLibrary';
import styles from '../lib/styles';
import Icon from 'react-native-vector-icons/Ionicons';
import helpers from '../lib/helpers';
import { ANIMATION_TIMEOUT_200 } from '../constants/AnimationConstants';
import uuid from 'uuid';
import FormErrorMessage from './FormErrorMessage';

const defaultReturnKeyType = 'next';

const componentStyles = StyleSheet.create({
	input: {
		backgroundColor: styles.colors.white,
	},
	inputBorderError: {
		borderColor: styles.colors.error,
	},
	inputBorder: {
		paddingHorizontal: styles.measurements.gridSpace2,
		marginVertical: styles.measurements.gridSpace1,
		borderColor: styles.colors.grey,
		borderWidth: styles.dimensions.borderWidth,
	},
	textInputContainer: {
		backgroundColor: styles.colors.white,
	},
	noText: {
		height: 0,
	},
	labelText: {
		marginTop: styles.measurements.gridSpace1,
	},
	inlineLabelText: {
		marginBottom: styles.measurements.gridSpace1,
	},
	image: {
		width: 37,
		height: 37,
		backgroundColor: styles.colors.white,
	},
	imageInputContainer: {
		flexDirection: 'row',
	},
	imageInput: {
		flex: 9,
	},
	inline: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	spacer: {
		width: styles.measurements.gridSpace1,
	},
	icon: {
		alignSelf: 'center',
	},
});

export default class FormInput extends Component {

	constructor(props, context = {}) {
		super(props);

		if (!context.hasParentForm) {
			console.error('You must wrap the FormInput component inside of a Form component');
		}

		this.setValidationFunc();
		this.id = uuid.v1();
		this.value = props.value;

		this.state = {
			valid: props.valid || null,
			error: props.error || '',
		};

		if (context.registerInputWithForm && typeof context.registerInputWithForm === 'function') {
			context.registerInputWithForm(this);
		}
	}

	componentWillReceiveProps({ value, error, valid, validateOnChange }) {
		const oldValue = this.value;

		this.value = value;

		// only change valid & error if someone actually passes in values
		// this prevents internal errors from being accidently cleared
		if (typeof valid === 'boolean') {
			this.setState({ valid, error });
		}

		if (oldValue !== value && validateOnChange) {
			this.validate(value);
		}
	}

	componentWillUnmount() {
		this._input = null;
	}

	clearValue = () => {
		const { isRequired, name } = this.props;

		this.value = null;

		if (this.context.onInputValueChange) {
			this.context.onInputValueChange(name, null, !isRequired);
		}
	};

	getScrollPadding = () => {
		const defaultPadding = helpers.isIOS() ? 145 : 120;
		if (this.context.inputFocusOffset) {
			return defaultPadding + this.context.inputFocusOffset;
		} else if (this.props.focusOffset) {
			return defaultPadding + this.props.focusOffset;
		}
		return defaultPadding;
	};

	scrollToInput = () => {
		const scrollViewReference = this.props.scrollView || this.context.formHandle;

		if ((helpers.isIOS() || this.props.scrollToOnAndroid) && this.props.scrollToOnFocus && scrollViewReference) {
			setTimeout(() => {
				const scrollResponder = scrollViewReference.getScrollResponder();
				scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
					findNodeHandle(this._input),
					this.getScrollPadding(),
					true,
				);
			}, ANIMATION_TIMEOUT_200); // delay until after validation has rendered so we get the correct scroll distance
		}
	};

	isValid = () => {
		return this.state.valid !== false;
	};

	focus = () => {
		this._input.focus();
	};

	handleFocus = (event) => {
		this.context.onFocus(event);
		if (this.props.onFocus) {
			this.props.onFocus(this._input);
		}
		this.scrollToInput();
	};

	handleBlur = (event) => {
		const { validateOnBlur } = this.props;

		this.context.onBlur(event);

		if (validateOnBlur) {
			this.validate(this.value);
		}

		if (typeof this.props.onBlur === 'function') {
			this.props.onBlur(this._input, event);
		}
	};

	onSubmitEditing = (event) => {
		this.context.onSubmitEditing && this.context.onSubmitEditing(event, {
			input: this._input,
			id: this.id,
		});
		this.validate(this.value);
		const { onSubmitEditing } = this.props;
		if (onSubmitEditing && typeof onSubmitEditing === 'function') {
			onSubmitEditing(this._input, event);
		}
	};

	handleChange = (event) => {
		const { name, validateOnChange, onChange } = this.props;
		let { valid } = this.state;
		const value = event.nativeEvent.text;
		const { onInputValueChange } = this.context;

		this.value = value;

		if (validateOnChange || valid === false) {
			valid = this.validate(value);
		}

		// pass the changes up the chain
		if (typeof onInputValueChange === 'function') {
			onInputValueChange(name, value, valid);
		}
		if (typeof onChange === 'function') {
			onChange(event);
		}
	};

	setValidationFunc = () => {
		const { validationFunction, isRequired } = this.props;
		const validations = [];

		if (isRequired) {
			validations.push(this.valueExists);
		}

		if (Object.prototype.toString.call(validationFunction) === '[object Array]') {
			validations.push(...validationFunction);
		} else if (Object.prototype.toString.call(validationFunction) === '[object Function]') {
			validations.push(validationFunction);
		}

		this.validationFunction = validations;
	};

	triggerValidation = () => {
		return this.validate(this.value);
	};

	validate = (value) => {
		const { validationFunction } = this;
		let error;
		let valid = true;

		if (validationFunction) {
			validationFunction.map((valFunc) => {
				const result = valFunc(value);

				if (valid && result !== true) {
					valid = false;
					error = result;
				}
			});
		}

		this.setState({ valid, error });

		return valid;
	};

	valueExists = (value) => {
		return !!value || this.props.isRequiredError;
	};

	getReturnKeyType = () => {
		const {
			multiline,
			returnKeyType,
		} = this.props;
		if (returnKeyType !== defaultReturnKeyType) {
			return returnKeyType;
		}
		return multiline ? 'default' : returnKeyType;
	};

	renderErrorText = () => {
		const { errorStyle, hideErrorText } = this.props;
		const { error } = this.state;

		if (hideErrorText || !error) {
			return null;
		}

		return (
			<FormErrorMessage
				message={error}
				errorStyle={errorStyle}
			/>
		);
	};

	renderHelpText = () => {
		const { help } = this.props;

		if (!help) {
			return null;
		}

		return (
			<Text
				lineHeight={false}
				size="small"
				color="greyDark"
			>
				{help}
			</Text>
		);
	};

	renderIcon = () => {
		const { icon, onIconPress } = this.props;

		if (icon) {
			return (
				<TouchableOpacity
					onPress={onIconPress}
					style={componentStyles.icon}
				>
					<Icon
						size={styles.fontSize.large}
						name={helpers.getIcon(icon)}
						color={styles.colors.greyLight}
					/>
				</TouchableOpacity>
			);
		}
	};

	render() {
		const {
			componentStyle,
			inputStyle,
			label,
			image,
			inlineLabel,
			lines,
			multiline,
			icon,
			textInputContainerStyle,
		} = this.props;
		const {
			valid,
		} = this.state;
		const height = { height: styles.buttons.regular.height * lines };
		const inlineStyle = inlineLabel ? componentStyles.inline : null;
		const inlineWrapStyle = inlineLabel ? styles.elements.flex : null;
		const inlineSpacer = inlineLabel ? <View style={componentStyles.spacer}/> : null;
		const labelStyle = inlineLabel ? componentStyles.inlineLabelText : componentStyles.labelText;
		const props = {
			...this.props,
			returnKeyType: this.getReturnKeyType(),
		};

		return (
			<View style={[componentStyle, inlineStyle]}>
				<Text
					weight="bold"
					style={label ? labelStyle : componentStyles.noText}
				>
					{label}
				</Text>
				{inlineSpacer}
				<View style={inlineWrapStyle}>
					<View
						style={[
							componentStyles.inputBorder,
							valid === false ? componentStyles.inputBorderError : '',
							image || icon ? componentStyles.imageInputContainer : '',
							componentStyles.textInputContainer,
							textInputContainerStyle,
						]}
					>
						<TextInput
							{...props}
							ref={(c) => this._input = c}
							onBlur={this.handleBlur}
							onChange={this.handleChange}
							style={[
								styles.elements.text,
								componentStyles.input,
								height,
								inputStyle,
								image || icon ? componentStyles.imageInput : '',
							]}
							multiline={multiline}
							onFocus={this.handleFocus}
							onSubmitEditing={this.onSubmitEditing}
							accessible={true}
							accessibilityLabel={this.props.accessibilityLabel}
						/>
						{
							image ?
								<Image
									source={image}
									style={componentStyles.image}
									resizeMode="contain"
								/>
								:
								null
						}
						{this.renderIcon()}
					</View>
					{this.renderErrorText()}
					{this.renderHelpText()}
				</View>
			</View>
		);
	}
}

FormInput.contextTypes = {
	hasParentForm: PropTypes.bool.isRequired,
	formHandle: PropTypes.object,
	inputFocusOffset: PropTypes.number,
	onSubmitEditing: PropTypes.func,
	registerInputWithForm: PropTypes.func,
	onInputValueChange: PropTypes.func,
	onFocus: PropTypes.func,
	onBlur: PropTypes.func,
};

FormInput.propTypes = {
	autoCapitalize: PropTypes.oneOf(['none', 'sentences', 'words', 'characters']),
	autoCorrect: PropTypes.bool,
	componentStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array, ViewPropTypes.style]),
	error: PropTypes.string,
	errorStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array, Text.propTypes.style]),
	focusOffset: PropTypes.number,
	help: PropTypes.string,
	hideErrorText: PropTypes.bool,
	inlineLabel: PropTypes.bool,
	inputStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array, Text.propTypes.style]),
	name: PropTypes.string.isRequired,
	isRequired: PropTypes.bool,
	isRequiredError: PropTypes.string,
	keyboardType: PropTypes.oneOf(['default', 'email-address', 'numeric', 'phone-pad', 'ascii-capable', 'numbers-and-punctuation', 'url', 'number-pad', 'name-phone-pad', 'decimal-pad', 'twitter', 'web-search']),
	returnKeyType: PropTypes.oneOf(['done', 'go', defaultReturnKeyType, 'search', 'send']),
	label: PropTypes.string,
	lines: PropTypes.number,
	maxLength: PropTypes.number,
	multiline: PropTypes.bool,
	onChange: PropTypes.func, // this is required if the formInput is not in a form
	placeholder: PropTypes.string,
	scrollToOnFocus: PropTypes.bool,
	scrollView: PropTypes.object,
	secureTextEntry: PropTypes.bool,
	valid: PropTypes.bool,
	validationFunction: PropTypes.func,
	value: PropTypes.string,
	onFocus: PropTypes.func,
	onBlur: PropTypes.func,
	onSubmitEditing: PropTypes.func,
	image: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
	textInputContainerStyle: PropTypes.oneOfType([
		PropTypes.object,
		PropTypes.array,
		ViewPropTypes.style,
	]),
	icon: PropTypes.string,
	onIconPress: PropTypes.func,
	validateOnBlur: PropTypes.bool,
	validateOnChange: PropTypes.bool,
	scrollToOnAndroid: PropTypes.bool,
	accessibilityLabel: PropTypes.string.isRequired,
};

FormInput.defaultProps = {
	autoCapitalize: 'sentences',
	underlineColorAndroid: 'transparent',
	autoCorrect: true,
	hideErrorText: false,
	inlineLabel: false,
	isRequired: false,
	isRequiredError: 'This field is required.',
	keyboardType: 'default',
	label: '',
	lines: 1,
	multiline: false,
	placeholder: '',
	returnKeyType: defaultReturnKeyType,
	scrollToOnFocus: true,
	secureTextEntry: false,
	textInputContainerStyle: {},
	validateOnBlur: true,
	validateOnChange: false,
	scrollToOnAndroid: false,
};
