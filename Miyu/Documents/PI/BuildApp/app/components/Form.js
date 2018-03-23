import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	UIManager,
	findNodeHandle,
} from 'react-native';
import { ScrollView } from 'BuildLibrary';
import styles from '../lib/styles';
import helpers from '../lib/helpers';

export default class Form extends Component {
	constructor(props) {
		super(props);

		this._form = {};
		this.registeredInputs = {};
		this.orderIndex = 0;
		this.inputHasFocus = false;
		this.overscrollDistance = 0;

		this.state = {
			formFields: {},
			valid: true,
		};
	}

	/**
	 * @description All items that need to be passed down to child components for
	 * Form to FormInput communication
	 */
	getChildContext() {
		return {
			hasParentForm: true,
			formHandle: this.state.scrollView,
			inputFocusOffset: this.props.inputFocusOffset,
			onSubmitEditing: this.onSubmitEditing,
			registerInputWithForm: this.registerInputWithForm,
			onInputValueChange: this.handleFieldChange,
			onFocus: this.onFocus,
			onBlur: this.onBlur,
		};
	}

	componentWillUnmount() {
		// Clear timeouts in case form unmounts before timeouts are run
		clearTimeout(this.onBlurTimeout);
		clearTimeout(this.onSubmitEditingTimeout);
		this._form = null;
		this.registeredInputs = null;
	}

	/**
	 * Get the input in registeredInputs that matches the provided ID
	 * @arg {number} id The uuid of the registered input
	 */
	getInputById = (id) => {
		if (id) {
			const inputs = this.registeredInputs;
			return Object.keys(inputs).find((key) => {
				return inputs[key].id === id;
			});
		}
	};

	/**
	 * @description Handle when the user presses the return key with whatever label
	 * it has. Right now this just focuses on the next input in the registeredInputs
	 * @arg {Object} event The event from the native keyboards
	 * @arg {Object} options The input and ID of that input for selection from the registeredInputs
	 */
	onSubmitEditing = (event, options = {}) => {
		const matchingInput = this.getInputById(options.id);
		if (matchingInput) {
			const matchingInputIndex = helpers.toInteger(matchingInput);
			const nextInput = this.registeredInputs[matchingInputIndex + 1];
			if (nextInput) {
				nextInput.focus();
			} else {
				// force validation and focus first input with validation error
				const firstInvalidInputName = Object.keys(this._form).find((name) => !this._form[name].isValid());
				if (this._form[firstInvalidInputName]) {
					// if the first input with a validation error is the input that was
					// just blurred we need to wait a little to make the focus effective.
					const delay = options.input.props.name === firstInvalidInputName ? 200 : 0;
					this.onSubmitEditingTimeout = setTimeout(this._form[firstInvalidInputName].focus, delay);
				}
			}
		}
	};

	/**
	 * When an input blurs set the inputHasFocus flag and after a little break, if
	 * need be, scroll the forms scrollview back down into place.
	 */
	onBlur = () => {
		this.inputHasFocus = false;
		// delay just in case another input gains focus
		this.onBlurTimeout = setTimeout(() => {
			if (helpers.isIOS() && !this.inputHasFocus && this.overscrollDistance > 0) {
				// if there is need based on the ScrollView's scrolled position, scroll
				// the view back down into place
				const { measure } = UIManager;

				// sometimes this function is run after the reference to
				// the form has been removed from the container
				if (this.state.scrollView) {
					const scrollViewNode = findNodeHandle(this.state.scrollView);
					const innerViewNode = this.state.scrollView.getInnerViewNode();
					measure(scrollViewNode, (frameX, frameY, frameWidth, scrollViewHeight) => {
						measure(innerViewNode, (frameX, frameY, frameWidth, innerViewHeight) => {
							const y = innerViewHeight > scrollViewHeight ? innerViewHeight - scrollViewHeight + styles.measurements.gridSpace1 : 0;
							this.state.scrollView.scrollTo({ y });
						});
					});
				}
			}
		}, 200);
	};

	/**
	 * Set the inputHasFocus flag to true.
	 */
	onFocus = () => {
		this.inputHasFocus = true;
	};

	/**
	 * On scroll calculate if the ScrollView is scrolled past the end of the
	 * ScrollView container and set the overscroll distance.
	 * @arg {Object} event Synthetic scroll event
	 */
	onScroll = (event) => {
		const {
			contentSize,
			layoutMeasurement,
			contentOffset,
		} = event.nativeEvent;
		if ((contentSize.height - contentOffset.y) < layoutMeasurement.height) {
			this.overscrollDistance = layoutMeasurement.height - (contentSize.height - contentOffset.y);
		} else {
			this.overscrollDistance = 0;
		}
	};

	/**
	 * Expose the Form's underlying ScrollView
	 */
	getScrollView = () => {
		return this.state.scrollView;
	};

	/**
	 * @description Allows inputs to register themselves with the form so that we can hook up
	 * navigaiton through the form automatically via the keyboards next button.
	 * @param {Object} input The input to register with the form
	 */
	registerInputWithForm = (input) => {
		this._form[input.props.name] = input;
		this.registeredInputs[this.orderIndex] = input;
		this.orderIndex = this.orderIndex + 1;
	};

	// this type of function declaration seems to help prevent the function
	// from losing scope when it is passed as a contextType
	handleFieldChange = (key, value, valid) => {
		const { onChange } = this.props;
		const { formFields } = this.state;
		formFields[key] = {
			value,
			valid,
		};

		let formValid = false;
		if (valid === true) {
			// reduce the form fields to see if the whole form is valid
			formValid = Object.values(formFields).reduce((prev, curr) => prev && curr.valid, true);
		}

		Object.values(this._form).forEach((field) => {
			// check to see if any other fields are dependent on this one
			// and clear them if they don't match the new value
			if (field.props.dependentOnKey === key && field.state.key !== value) {
				field.clearValue();
			}
		});

		this.setState({ formFields, valid: formValid });

		if (onChange) {
			onChange(formFields, formValid);
		}
	};

	triggerValidation = () => {
		const form = this._form;
		let firstInvalidInputName;

		const valid = Object.values(form).reduce((prev, field) => {
			const fieldValid = field.triggerValidation ? field.triggerValidation() : true;
			if (!firstInvalidInputName && !fieldValid) {
				firstInvalidInputName = field.props.name;
			}
			return prev && fieldValid;
		}, true);

		if (firstInvalidInputName && form[firstInvalidInputName]) {
			form[firstInvalidInputName].focus();
		}

		this.setState({ valid });

		return valid;
	};

	render() {
		return (
			<ScrollView
				ref={(scrollView) => {
					// we have to do this this way so that getChildContext gets called again
					// and the child FormInputs get access to the ScrollView
					if (!this.state.scrollView) {
						this.setState({ scrollView: this.props.alternateScrollHandle || scrollView });
					}
				}}
				onScroll={this.onScroll}
				style={this.props.style}
				keyboardShouldPersistTaps="always"
				scrollsToTop={this.props.scrollsToTop}
				accessibilityLabel={this.props.accessibilityLabel}
			>
				{this.props.children}
			</ScrollView>
		);
	}
}

Form.childContextTypes = {
	hasParentForm: PropTypes.bool.isRequired,
	formHandle: PropTypes.object,
	inputFocusOffset: PropTypes.number,
	onSubmitEditing: PropTypes.func,
	registerInputWithForm: PropTypes.func,
	onInputValueChange: PropTypes.func,
	onFocus: PropTypes.func,
	onBlur: PropTypes.func,
};

Form.propTypes = {
	alternateScrollHandle: PropTypes.object,
	children: PropTypes.oneOfType([
		PropTypes.element,
		PropTypes.array,
		PropTypes.string,
	]),
	inputFocusOffset: PropTypes.number,
	onChange: PropTypes.func,
	scrollsToTop: PropTypes.bool,
	style: ScrollView.propTypes.style,
	accessibilityLabel: PropTypes.string,
};
