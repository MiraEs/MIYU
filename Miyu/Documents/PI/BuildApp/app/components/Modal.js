import React, {
	Component,
} from 'react';
import {
	Animated,
	StyleSheet,
	TouchableWithoutFeedback,
	View,
} from 'react-native';
import styles from '../lib/styles';
import helpers, { isIOS } from '../lib/helpers';
import NavigationBar from './NavigationBar';

const componentStyles = StyleSheet.create({
	component: {
		position: 'absolute',
		height: styles.dimensions.height,
		bottom: 0,
		right: 0,
		left: 0,
		justifyContent: 'flex-end',
	},
	backgroundScreen: {
		flex: 1,
		justifyContent: 'flex-end',
		backgroundColor: styles.colors.underlayGrey,
	},
	fullScreen: {
		flex: 1,
		backgroundColor: styles.colors.white,
	},
	fitWrap: {
		flex: 1,
	},
	fitScreen: {
		backgroundColor: styles.colors.white,
	},
	fitBackground: {
		flex: 1,
		justifyContent: 'flex-end',
		backgroundColor: styles.colors.black,
		opacity: 0,
	},
	blackBackground: {
		backgroundColor: styles.colors.black,
		opacity: 0,
	},
});

export class Modal extends Component {

	constructor(props) {
		super(props);

		this.initialState = {
			fullScreen: false,
			showNavBar: true,
			opacity: new Animated.Value(0),
			translateY: new Animated.Value(styles.dimensions.height),
			partialContentMeasures: null,
		};

		this.renderContent = helpers.noop;
		this.leftNavButton = {
			icon: helpers.getIcon('close'),
			onPress: this.hide,
		};
		this.rightNavButton = null;

		this.state = {
			...this.initialState,
		};
	}

	show = (options = {}) => {
		this.renderContent = options.renderContent.bind(this);
		this.leftNavButton = options.leftNavButton || this.leftNavButton;
		this.rightNavButton = options.rightNavButton || this.rightNavButton;

		return new Promise((resolve) => {
			this.setState({
				...options,
			}, () => {
				Animated.timing(this.state.translateY, { toValue: 0, duration: 500 }).start(() => {
					helpers.setStatusBarStyle('default', true);
					Animated.timing(this.state.opacity, { toValue: 0.5 }).start(resolve);
				});
			});
		});
	};

	hide = () => {
		this.renderContent = helpers.noop;

		return new Promise((resolve) => {
			Animated.timing(this.state.opacity, { toValue: 0, duration: 200 }).start(() => {
				Animated.timing(this.state.translateY, { toValue: styles.dimensions.height }).start(() => {
					this.setState({ ...this.initialState }, resolve);
				});
			});
		});
	};

	getComponentStyle = () => {
		const { translateY } = this.state;

		return [
			componentStyles.component,
			{ transform: [{ translateY }] },
		];
	};

	renderHeader() {
		const { showNavBar, title, fullScreen } = this.state;

		if (showNavBar) {
			return (
				<NavigationBar
					leftNavButton={this.leftNavButton}
					rightNavButton={this.rightNavButton}
					title={{ text: title }}
					light={true}
					fullHeader={fullScreen}
				/>
			);
		}
	}

	renderPartialScreen() {
		const { partialContentMeasures } = this.state;

		if (partialContentMeasures) {
			const topBackgroundHeight = partialContentMeasures.y;
			const bottomBackgroundHeight = styles.dimensions.height - (topBackgroundHeight + partialContentMeasures.height);
			const topBackgroundStyle = {
				opacity: this.state.opacity,
				height: topBackgroundHeight,
			};
			const bottomBackgroundStyle = {
				opacity: this.state.opacity,
				height: bottomBackgroundHeight,
			};
			return (
				<TouchableWithoutFeedback onPress={this.hide}>
					<View style={componentStyles.fitWrap}>
						<Animated.View style={[componentStyles.blackBackground, topBackgroundStyle]} />
						<TouchableWithoutFeedback onPress={this.hide}>
							<View style={componentStyles.fitScreen}>
								{this.renderContent()}
							</View>
						</TouchableWithoutFeedback>
						<Animated.View style={[componentStyles.blackBackground, bottomBackgroundStyle]} />
					</View>
				</TouchableWithoutFeedback>
			);
		}

		return (
			<TouchableWithoutFeedback onPress={this.hide}>
				<View style={componentStyles.fitWrap}>
					<Animated.View style={[componentStyles.fitBackground, { opacity: this.state.opacity }]} />
					<TouchableWithoutFeedback onPress={this.hide}>
						<View style={componentStyles.fitScreen}>
							{this.renderHeader()}
							{this.renderContent()}
						</View>
					</TouchableWithoutFeedback>
				</View>
			</TouchableWithoutFeedback>
		);
	}

	renderFullScreen() {
		const component = { marginTop: isIOS() ? 0 : 20 };

		return (
			<View style={[componentStyles.backgroundScreen, component]}>
				{this.renderHeader()}
				<View style={componentStyles.fullScreen}>
					{this.renderContent()}
				</View>
			</View>
		);
	}

	render() {
		const { fullScreen } = this.state;
		const view = fullScreen ? this.renderFullScreen() : this.renderPartialScreen();

		return (
			<Animated.View style={this.getComponentStyle()}>
				{view}
			</Animated.View>
		);
	}
}

Modal.propTypes = {};

Modal.defaultProps = {};

export default Modal;
