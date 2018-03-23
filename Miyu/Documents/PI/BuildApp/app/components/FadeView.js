'use strict';

import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import { Animated } from 'react-native';

export default class FadeView extends Component {

	constructor(props) {
		super(props);
		this.makeVisible = false;
		this.state = {
			fadeAnim: new Animated.Value(1),
		};
	}

	fadeToggle(callback) {
		const toValue = this.makeVisible ? 1 : 0;
		Animated.timing(this.state.fadeAnim, {
			toValue,
			duration: this.props.duration,
		}).start(callback);
		this.makeVisible = !this.makeVisible;
	}

	render() {
		return (
			<Animated.View
				style={{opacity: this.state.fadeAnim}}
			>
				{this.props.children}
			</Animated.View>
		);
	}
}

FadeView.propTypes = {
	children: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.array,
		PropTypes.element,
	]),
	duration: PropTypes.number,
};

FadeView.defaultProps = {
	duration: 400,
};
