'use strict';

import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	Animated,
	Text,
} from 'react-native';
import styles from '../lib/styles';

export default class FetchErrorMessage extends Component {

	constructor(props) {
		super(props);

		this.updateText = this.updateText.bind(this);

		this.state = {
			height: new Animated.Value(props.text ? 40 : 0),
			text: props.text,
			opacity: 0,
		};
	}

	componentWillReceiveProps(nextProps) {
		if (this.state.text !== nextProps.text) {
			if (this.state.text) {
				this.timeoutId = setTimeout(() => this.updateText(nextProps.text), 310);
			} else {
				this.updateText(nextProps.text);
			}
			Animated.timing(this.state.height, {
				toValue: nextProps.text ? 33 : 0,
				duration: 300,
			}).start();
		}
	}

	componentWillUnmount() {
		clearTimeout(this.timeoutId);
	}

	updateText(text) {
		this.setState({
			text,
			opacity: text ? 1 : 0,
		});
	}

	render() {
		const { text, height, opacity } = this.state;

		if (this.state.text) {
			return (
			<Animated.View
				style={[styles.elements.fetchErrorView, {
					height,
					opacity,
				}]}
			>
				<Text style={styles.elements.fetchErrorText}>{text}</Text>
			</Animated.View>);
		} else {
			return null;
		}
	}

}

FetchErrorMessage.propTypes = {
	text: PropTypes.string,
};
