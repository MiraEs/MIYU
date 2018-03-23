'use strict';
import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	StyleSheet,
	Keyboard,
} from 'react-native';
import { Button } from 'BuildLibrary';
import PinToKeyboard from '../components/PinToKeyboard';
import styles from '../lib/styles';

const componentStyles = StyleSheet.create({
	button: {
		height: 44,
		flex: 0,
	},
});

export default class FixedBottomButton extends Component {

	constructor(props) {
		super(props);
		this.state = {
			keyboardIsVisible: false,
		};
	}

	componentWillMount() {
		this.onKeyboardWillShow = Keyboard.addListener('keyboardWillShow', this.onKeyboardHeightChange);
		this.onKeyboardWillHide = Keyboard.addListener('keyboardWillHide', this.onKeyboardHeightChange);
	}

	componentWillUnmount() {
		Keyboard.removeSubscription(this.onKeyboardWillShow);
		Keyboard.removeSubscription(this.onKeyboardWillHide);
	}

	onKeyboardHeightChange = (event) => {
		this.setState({ keyboardIsVisible: event.endCoordinates.screenY !== styles.dimensions.height });
	};

	renderButton = () => {
		const {
			buttonText,
			disabled,
			isLoading,
			onPress,
			trackAction,
		} = this.props;

		return (
			<Button
				isDisabled={disabled}
				isLoading={isLoading}
				onPress={onPress}
				text={buttonText}
				trackAction={trackAction}
				style={componentStyles.button}
				accessibilityLabel={this.props.accessibilityLabel}
			/>
		);
	};

	render() {
		if (this.props.hideOnKeyboardShow && this.state.keyboardIsVisible) {
			return null;
		}
		if (this.props.pinToKeyboard) {
			return (
				<PinToKeyboard
					height={44}
					component={this.renderButton()}
				/>
			);
		}
		return this.renderButton();
	}
}

FixedBottomButton.propTypes = {
	buttonText: PropTypes.string.isRequired,
	disabled: PropTypes.bool,
	isLoading: PropTypes.bool,
	onPress: PropTypes.func.isRequired,
	pinToKeyboard: PropTypes.bool,
	trackAction: PropTypes.string.isRequired,
	hideOnKeyboardShow: PropTypes.bool,
	accessibilityLabel: PropTypes.string.isRequired,
};

FixedBottomButton.defaultProps = {
	isLoading: false,
	pinToKeyboard: true,
	hideOnKeyboardShow: false,
	disabled: false,
};
