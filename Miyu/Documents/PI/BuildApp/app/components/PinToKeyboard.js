'use strict';
import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	View,
	StyleSheet,
	Dimensions,
	Keyboard,
	LayoutAnimation,
} from 'react-native';
import helpers from '../lib/helpers';

const {
	height,
} = Dimensions.get('window');

const componentStyles = StyleSheet.create({
	content: {
		position: 'absolute',
		bottom: 0,
		right: 0,
		left: 0,
		height: 50,
		backgroundColor: 'rgba(255,255,255,.85)',
	},
});

class PinToKeyboard extends Component {

	constructor(props) {
		super(props);
		this.state = {
			keyboardOffset: 0,
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
		this.props.onKeyboardHeightChange(Object.assign({}, {
			originalEvent: event,
			compoundHeight: height - event.endCoordinates.screenY + this.props.height,
		}));
		LayoutAnimation.configureNext({
			duration: event.duration,
			create: {
				type: LayoutAnimation.Types.keyboard,
				property: LayoutAnimation.Properties.opacity,
			},
			update: {
				type: LayoutAnimation.Types.keyboard,
				property: LayoutAnimation.Properties.opacity,
			},
		});
		this.setState({
			keyboardOffset: (height - event.endCoordinates.screenY),
		});
	};

	getBottom = () => {
		if (this.state.keyboardOffset > 0) {
			// keyboard expanded
			return this.state.keyboardOffset + this.props.expandedOffset;
		} else if (this.props.hideInitially) {
			// keyboard collapsed and should be hinding
			return -this.props.height;
		}
		return this.state.keyboardOffset;
	};

	renderChildren = () => {
		if (this.props.component) {
			return this.props.component;
		}
		if (this.props.children) {
			return this.props.children;
		}
	};

	render() {
		return (
			<View
				style={[componentStyles.content, {
					height: this.props.height,
					bottom: this.getBottom(),
				}]}
			>
				{this.renderChildren()}
			</View>
		);
	}

}


PinToKeyboard.propTypes = {
	children: PropTypes.element,
	height: PropTypes.number,
	component: PropTypes.element,
	hideInitially: PropTypes.bool,
	onKeyboardHeightChange: PropTypes.func.isRequired,
	expandedOffset: PropTypes.number,
};

PinToKeyboard.defaultProps = {
	expandedOffset: 0,
	hideInitially: false,
	onKeyboardHeightChange: helpers.noop,
};

module.exports = PinToKeyboard;
