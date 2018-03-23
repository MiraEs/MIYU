import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	View,
	StyleSheet,
} from 'react-native';
import { Text } from 'BuildLibrary';
import styles from '../lib/styles';
import DropDown from '../components/DropDown';
import EventEmitter from '../lib/eventEmitter';
import {
	HALF_HEIGHT,
} from '../constants/constants';
import dismissKeyboard from 'dismissKeyboard';
import Icon from 'react-native-vector-icons/Ionicons';
import helpers from '../lib/helpers';

const componentStyles = StyleSheet.create({
	borderError: {
		borderColor: styles.colors.error,
	},
	buttonNoMargin: {
		marginHorizontal: 0,
	},
	errorContainer: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	errorText: {
		marginBottom: styles.measurements.gridSpace2,
	},
	errorIcon: {
		marginBottom: styles.measurements.gridSpace2,
		marginRight: 4,
	},
	noError: {
		height: 0,
	},
	labelText: {
		marginTop: styles.measurements.gridSpace1,
	},
});

export default class FormDropDown extends Component {

	constructor(props, context) {
		super(props);

		this.validationFunctions = this.setValidationFunc();

		this.options = this.mapOptions(props.options);

		const { value } = props;
		const index = this.options.findIndex((option) => option.value === value);

		this.state = {
			index,
			value,
			valid: null,
			error: '',
		};

		if (context && typeof context.registerInputWithForm === 'function') {
			context.registerInputWithForm(this);
		}
	}

	componentWillReceiveProps({ value, options }) {
		const oldValue = this.props.value;

		this.options = this.mapOptions(options);
		const index = this.options.findIndex((option) => option.value === value);

		this.setState({ value, index });

		if (value !== oldValue) {
			this.validate(value);
		}
	}

	clearValue = () => {
		const { onChange } = this.props;

		this.setState({ value: null, index: -1 });

		if (onChange) {
			onChange(null, null);
		}
	};

	focus = () => {
		this.toggleModal();
	};

	getTextFromArr = (arr, index) => {
		return arr && arr[index]
			&& arr[index].text;
	};

	handleChange = (index) => {
		const { name, onChange, options, dependentOnKey } = this.props;
		const { value } = options[index];
		const { onInputValueChange } = this.context;

		// if the dropdown is dependent on another field
		// save the value from the object that links them
		if (dependentOnKey && options[index].hasOwnProperty(dependentOnKey)) {
			this.setState({ key: options[index][dependentOnKey] });
		}

		this.setState({ index, value });

		const valid = this.validate(value);

		// pass the changes up the chain
		if (typeof onInputValueChange === 'function') {
			onInputValueChange(name, value, valid);
		}
		if (typeof onChange === 'function') {
			onChange(value, valid);
		}
	};

	isValid = () => {
		return this.state.valid !== false;
	};

	mapOptions = (options) => {
		return options.map((option) => {
			option.onPress = this.handleChange;
			return option;
		});
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

		return validations;
	};

	toggleModal = () => {
		const {
			dropDownCustomTemplate,
			modalHeight,
			modalDescription,
			options,
		} = this.props;

		const eventEmitterOptions = {
			selectedIndex: this.state.index,
			heightDescription: modalHeight,
			description: modalDescription,
			onHide: this.triggerValidation,
			options,
		};

		if (dropDownCustomTemplate) {
			eventEmitterOptions.getTemplate = dropDownCustomTemplate;
		}

		dismissKeyboard();
		EventEmitter.emit('showHalfPageListSelector', eventEmitterOptions);
	};

	triggerValidation = () => {
		return this.validate(this.state.value);
	};

	validate = (value) => {
		const { validationFunctions } = this;
		let error;
		let valid = true;

		if (validationFunctions) {
			validationFunctions.forEach((valFunc) => {
				if (valid) {
					const result = valFunc(value);

					if (result !== true) {
						valid = false;
						error = result;
					}
				}
			});
		}

		this.setState({ valid, error });

		return valid;
	};

	valueExists = (value) => {
		return !!value || this.props.isRequiredError;
	};

	renderErrorText = () => {
		const { errorStyle } = this.props;
		const { error } = this.state;

		if (!error) {
			return null;
		}

		return (
			<View style={componentStyles.errorContainer}>
				<Icon
					name={helpers.getIcon('close-circle')}
					size={16}
					color={styles.colors.error}
					style={[
						componentStyles.errorIcon,
						errorStyle,
					]}
				/>
				<Text
					size="small"
					color="error"
					weight="bold"
					lineHeight={false}
					style={[
						componentStyles.errorText,
						errorStyle,
					]}
				>
					{error}
				</Text>
			</View>
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

	render() {
		const {
			componentStyle,
			options,
			label,
		} = this.props;
		const {
			index,
			valid,
		} = this.state;

		return (
			<View style={componentStyle}>
				<Text
					weight="bold"
					style={label ? componentStyles.labelText : componentStyles.noError}
				>
					{label}
				</Text>
				<DropDown
					{...this.props}
					ref={(c) => this._dropDown = c}
					onPress={this.toggleModal}
					buttonStyle={[
						componentStyles.buttonNoMargin,
						valid === false ? componentStyles.borderError : null,
					]}
					text={this.getTextFromArr(options, index)}
					accessibilityLabel={this.props.accessibilityLabel}
				/>
				{this.renderErrorText()}
				{this.renderHelpText()}
			</View>
		);
	}
}

FormDropDown.contextTypes = {
	formHandle: PropTypes.object,
	inputFocusOffset: PropTypes.number,
	onSubmitEditing: PropTypes.func,
	registerInputWithForm: PropTypes.func,
	onInputValueChange: PropTypes.func,
};

FormDropDown.propTypes = {
	componentStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
	dropDownCustomTemplate: PropTypes.func,
	errorStyle: PropTypes.object,
	isRequired: PropTypes.bool,
	isRequiredError: PropTypes.string,
	help: PropTypes.string,
	label: PropTypes.string,
	modalDescription: PropTypes.string,
	modalHeight: PropTypes.string,
	name: PropTypes.string.isRequired,
	onChange: PropTypes.func, // this is required if the formInput is not in a form
	options: PropTypes.arrayOf(PropTypes.shape({
		text: PropTypes.string,
		value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	})).isRequired,
	placeholder: PropTypes.string,
	validationFunction: PropTypes.oneOfType([PropTypes.func, PropTypes.array]),
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	dependentOnKey: PropTypes.string,
	accessibilityLabel: PropTypes.string.isRequired,
};

FormDropDown.defaultProps = {
	isRequired: false,
	isRequiredError: 'This field is required.',
	label: '',
	modalDescription: '',
	modalHeight: HALF_HEIGHT,
	placeholder: '',
};
