import React, {
	Component,
} from 'react';
import {
	BackHandler,
	LayoutAnimation,
	StyleSheet,
	TouchableOpacity,
	View,
} from 'react-native';
import EventEmitter from '../lib/eventEmitter';
import styles from '../lib/styles';

const componentStyles = StyleSheet.create({
	overlay: {
		position: 'absolute',
		top: 0,
		bottom: 0,
		right: 0,
		left: 0,
		height: styles.dimensions.height,
		width: styles.dimensions.width,
	},
	hidden: {
		height: 0,
		overflow: 'hidden',
	},
});

export default class ScreenOverlay extends Component {

	constructor(props) {
		super(props);

		this.state = {
			isVisible: false,
			disableClickToHide: false,
			overlayStyles: {},
		};
	}

	componentDidMount() {
		BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
		EventEmitter.addListener('showScreenOverlay', this.setConfigurationDefault);
		EventEmitter.addListener('showCustomScreenOverlay', this.setConfiguration);
		EventEmitter.addListener('hideScreenOverlay', this.hide);
	}

	componentWillUnmount() {
		BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
		EventEmitter.removeListener('showScreenOverlay', this.setConfigurationDefault);
		EventEmitter.removeListener('showCustomScreenOverlay', this.setConfiguration);
		EventEmitter.removeListener('hideScreenOverlay', this.hide);
	}

	handleBackPress = () => {
		if (this.state.isVisible) {
			this.hide();
			return true;
		}
		return false;
	};

	hide = (clearComponent = false) => {
		this.setState({
			isVisible: false,
			disableClickToHide: false,
			component: clearComponent ? null : this.state.component,
			overlayStyles: {},
		});
	};

	setConfigurationDefault = (component) => {
		this.setConfiguration({ component });
	};

	setConfiguration = (options) => {
		if (options.animation) {
			LayoutAnimation.configureNext(options.animation);
		}
		this.setState({
			alpha: 0.3,
			isVisible: true,
			...options,
		});
	};

	clickToHide = () => {
		if (!this.state.disableClickToHide) {
			EventEmitter.emit('screenOverlayClosed');
			this.hide();
		}
	};

	getStyles = () => {
		const { isVisible, overlayStyles } = this.state;
		if (isVisible) {
			return [componentStyles.overlay, overlayStyles];
		} else {
			return componentStyles.hidden;
		}
	};

	getTint = () => {
		return {
			backgroundColor: `rgba(0,0,0,${this.state.alpha || 0.3})`,
		};
	};

	render() {
		return (
			<View
				style={[this.getStyles(), this.getTint()]}
			>
				<TouchableOpacity
					style={this.getStyles()}
					onPress={this.clickToHide}
				/>
				{this.state.component}
			</View>
		);
	}
}
