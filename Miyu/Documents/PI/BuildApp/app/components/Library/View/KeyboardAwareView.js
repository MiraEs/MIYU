import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	View,
	Keyboard,
} from 'react-native';

export default class KeyboardAwareView extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isKeyboardShown: false,
		};
	}

	componentWillMount() {
		this.keyboardDidShow = Keyboard.addListener('keyboardDidShow', this.keyboardIsShown);
		this.keyboardDidHide = Keyboard.addListener('keyboardDidHide', this.keyboardIsHidden);
		this.keyboardWillShow = Keyboard.addListener('keyboardWillShow', this.keyboardIsShown);
		this.keyboardWillHide = Keyboard.addListener('keyboardWillHide', this.keyboardIsHidden);
	}

	componentWillUnmount() {
		Keyboard.removeSubscription(this.keyboardDidShow);
		Keyboard.removeSubscription(this.keyboardDidHide);
		Keyboard.removeSubscription(this.keyboardWillShow);
		Keyboard.removeSubscription(this.keyboardWillHide);
	}

	keyboardIsShown = () => {
		this.setState({
			isKeyboardShown: true,
		});
	};

	keyboardIsHidden = () => {
		this.setState({
			isKeyboardShown: false,
		});
	};

	render() {
		const { isShownWhenKeyboardIsUp } = this.props,
			{ isKeyboardShown } = this.state;
		if ((isShownWhenKeyboardIsUp && isKeyboardShown) || (!isShownWhenKeyboardIsUp && !isKeyboardShown)) {
			return <View {...this.props}/>;
		}
		return null;
	}
}

KeyboardAwareView.propTypes = {
	isShownWhenKeyboardIsUp: PropTypes.bool,
};
