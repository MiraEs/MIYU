'use strict';
import React from 'react';
import {
	View,
	TouchableHighlight,
	StyleSheet,
	Animated,
} from 'react-native';
import PropTypes from 'prop-types';
import { Text } from 'BuildLibrary';
import Button from './button';
import FadeView from './FadeView';
import helpers from '../lib/helpers';
import Icon from 'react-native-vector-icons/Ionicons';
import styles from '../lib/styles';
import {
	TIMEOUT_DURATION_2,
	FADE_TEXT_DURATION,
} from '../constants/AnimationConstants';

const componentStyles = StyleSheet.create({
	flexRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
	},
});

export default class AddToCartButton extends Button {

	constructor(props) {
		super(props);
		this.stateQueue = [];
		this.hasActiveStateChange = false;
		this.fadeIn = true;
		this.defaultText = props.text;
		this.state = {
			text: props.text,
			underlayColor: styles.colors.primaryDark,
			fadeAnim: new Animated.Value(1),
			...this.getStyles(props),
		};
	}

	componentWillReceiveProps(nextProps) {
		this.setState(this.getStyles(nextProps));
	}

	handleChange = () => {
		const change = this.stateQueue[0];
		if (change && change.state) {
			this.hasActiveStateChange = true;
			this.fadeView && this.fadeView.fadeToggle(() => {
				this.setState(change.state, () => {
					this.fadeView && this.fadeView.fadeToggle(() => {
						change.callback();
						setTimeout(() => {
							this.stateQueue = [...this.stateQueue.slice(1, this.stateQueue.length)];
							this.handleChange();
						}, TIMEOUT_DURATION_2);
					});
				});
			});
		} else {
			this.hasActiveStateChange = false;
		}
	};

	queueChange = (state = {}, callback = () => null) => {
		this.stateQueue = [...this.stateQueue, {
			state,
			callback,
		}];
		if (!this.hasActiveStateChange) {
			this.handleChange();
		}
	};

	reset = (callback) => {
		this.queueChange({
			text: this.defaultText,
			itemAdded: false,
		}, callback);
	};

	renderCheckmark = () => {
		if (this.state.itemAdded) {
			return (
				<Icon
					name={helpers.getIcon('checkmark')}
					size={32}
					color={this.props.color === 'white' ? styles.colors.secondary : styles.colors.white}
				/>
			);
		}
	};

	render() {
		return (
			<TouchableHighlight
				onPress={() => {
					if (!this.props.disabled) {
						this.props.onPress();
					}
				}}
				underlayColor={this.state.underlayColor}
				style={this.state.buttonStyle}
				accessibilityLabel="Add To Cart Button"
			>
				<View>
					<FadeView
						ref={(fade) => this.fadeView = fade}
						duration={FADE_TEXT_DURATION}
					>
						<View style={componentStyles.flexRow}>
							<Text
								color={this.props.color === 'white' ? 'secondary' : 'white'}
								style={this.state.buttonTextStyle}
							>
								{this.state.text}
							</Text>
							{this.renderCheckmark()}
						</View>
					</FadeView>
				</View>
			</TouchableHighlight>
		);
	}

}

AddToCartButton.propTypes = {
	buttonState: PropTypes.string,
	disabled: PropTypes.bool,
	textFadeType: PropTypes.oneOf(['in', 'out']),
	showBouncingDots: PropTypes.bool,
	itemAdded: PropTypes.bool,
	isEnabled: PropTypes.bool,
};

AddToCartButton.defaultProps = {
	disabled: false,
	showBouncingDots: false,
	itemAdded: false,
	isEnabled: true,
	disableBorder: true,
};
