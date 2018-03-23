'use strict';
/*
 * HalfPageListSelector
 * Usage:
		toggleEmailSubjectModal() {
			EventEmitter.emit('showHalfPageListSelector', {
				selectedIndex: this.state.emailSubjectIndex,
				description: 'Select Subject',
				options: this.emailSubjects,
				heightDescription: THREE_QUARTER_HEIGHT,
				exitButton: {
					text: 'Cancel',
					isVisible: true,
					onPress: noop,
				},
				getTemplate: this.getTemplate,
			});
		}
	`getTemplate` is optional and takes a function. For example:
		getTemplate(option) {
			return <Text style={{color: 'blue'}}>{option.text}</Text>;
		}
	`exitButton` is an optional object
	`heightDescription` can either be HALF_HEIGHT or THREE_QUARTER_HEIGHT (see constants)
 */

import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	Animated,
	View,
	BackHandler,
	TouchableOpacity,
	Dimensions,
	StyleSheet,
} from 'react-native';
import styles from '../lib/styles';
import helpers from '../lib/helpers';
import EventEmitter from '../lib/eventEmitter';
import Icon from 'react-native-vector-icons/Ionicons';
import { THREE_QUARTER_HEIGHT } from '../constants/constants';
import TrackingActions from '../lib/analytics/TrackingActions';
import {
	Button,
	ScrollView,
	Text,
} from 'BuildLibrary';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);
const duration = 220,
	HEADER_HEIGHT = 49,
	componentStyles = StyleSheet.create({
		overlay: {
			backgroundColor: 'rgba(0, 0, 0, .6)',
			position: 'absolute',
			top: 0,
			bottom: 0,
			right: 0,
			left: 0,
		},
		listItemButton: {
			borderTopWidth: styles.dimensions.borderWidth,
			borderTopColor: styles.colors.grey,
			flexDirection: 'row',
		},
		buttonText: {
			lineHeight: styles.lineHeight.regular,
			opacity: styles.adjustOpacity.opacity,
			textAlign: 'left',
			flex: 1,
			marginLeft: styles.measurements.gridSpace2,
		},
		exitButton: {
			marginTop: 3,
		},
		icon: {
			alignSelf: 'flex-end',
			marginRight: styles.measurements.gridSpace2,
		},
		header: {
			height: HEADER_HEIGHT,
		},
		row: {
			flexDirection: 'row',
		},
		leftContainer: {
			justifyContent: 'center',
			flex: 1,
		},
		rightContainer: {
			flex: 0,
			flexDirection: 'row',
			justifyContent: 'flex-end',
		},
		iconView: {
			alignSelf: 'flex-end',
		},
		selectedCheckmark: {
			marginRight: styles.measurements.gridSpace2,
			fontSize: 48,
			height: HEADER_HEIGHT,
		},
		selectedButtonText: {
			marginLeft: styles.measurements.gridSpace2,
			textAlign: 'left',
			lineHeight: styles.lineHeight.regular,
			marginVertical: styles.measurements.gridSpace2,
			justifyContent: 'center',
		},
		listItemButtonText: {
			marginLeft: styles.measurements.gridSpace2,
			textAlign: 'left',
			marginVertical: styles.measurements.gridSpace2,
			lineHeight: styles.lineHeight.regular,
		},
		sheetWrap: {
			backgroundColor: styles.colors.white,
		},
		content: {
			position: 'absolute',
			top: styles.dimensions.height,
			left: 0,
			right: 0,
		},
	});

export default class HalfPageListSelector extends Component {

	constructor(props) {
		super(props);

		this.state = {
			translateY: new Animated.Value(0),
			overlayOpacity: new Animated.Value(0),
			isVisible: false,
			isHiding: false,
			height: 0,
			...props,
		};
	}

	componentWillMount() {
		BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
		EventEmitter.addListener('showHalfPageListSelector', this.setConfiguration);
	}

	componentDidUpdate() {
		if (this.renderTimeout && this.renderTimeout.clearTimeout) {
			this.renderTimeout.clearTimeout();
		}
		this.renderTimeout = setTimeout(() => {
			if (this.state.pendingShow) {
				this._show();
			}
		}, duration);
	}

	componentWillUnmount() {
		if (this.timeOut && this.timeOut.clearTimeout) {
			this.timeOut.clearTimeout();
		}
		EventEmitter.removeListener('showHalfPageListSelector', this.setConfiguration);
		BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
	}

	getDefaultTemplate = (item, style, props) => {
		return (
			<Text
				style={style}
				{...props}
			>
				{item.text}
			</Text>
		);
	};

	handleBackPress = () => {
		if (this.state.isVisible) {
			this.hide();
			return true;
		}
		return false;
	};

	onSheetLayout = () => {
		const { heightDescription } = this.state;
		const windowHeight = Dimensions.get('window').height;

		let height = windowHeight * .5;
		if (heightDescription === THREE_QUARTER_HEIGHT) {
			height = windowHeight * .75;
		}

		this.setState({
			height,
			sheetHeight: height,
		}, () => {
			if (this.state.pendingShow) {
				this._show();
			}
		});
	};

	setConfiguration = (config) => {
		config = {
			description: null,
			options: null,
			heightDescription: null,
			height: this.state.height,
			exitButton: {
				text: 'Done',
				isVisible: true,
				onPress: helpers.noop,
			},
			getTemplate: this.getDefaultTemplate,
			...config,
		};

		this.setState({
			...config,
		});

		this.show();
	};

	renderDescription = () => {
		const { description } = this.state;
		if (description) {
			return (
				<View style={[componentStyles.row, componentStyles.header]}>
					<View style={componentStyles.leftContainer}>
						<Text
							textAlign="center"
							weight="bold"
							lineHeight={false}
						>
							{description}
						</Text>
					</View>
					<View style={componentStyles.rightContainer}>
						{this.renderExitButton()}
					</View>
				</View>
			);
		}
	};

	renderExitButton = () => {
		const { exitButton } = this.state;

		if (exitButton.isVisible) {
			return (
				<Button
					borders={false}
					color="white"
					onPress={() => {
						exitButton.onPress();
						this.hide();
					}}
					style={componentStyles.exitButton}
					text={exitButton.text}
					textColor="secondary"
					trackAction={TrackingActions.DONE_BUTTON}
					accessibilityLabel="Exit"
				/>
			);
		}
	};

	renderList = () => {
		const { options, selectedIndex, getTemplate } = this.state;
		if (options) {
			return options.map((option, index) => {
				return (
					<TouchableOpacity
						key={`custom-action-sheet-${index}`}
						onPress={() => {
							option.onPress(index);
							this.hide(false);
						}}
						style={componentStyles.listItemButton}
					>
						<View style={componentStyles.leftContainer}>
							{getTemplate(option, this.getButtonTextStyle(selectedIndex, index), this.getTextProps(selectedIndex, index))}
						</View>
						<View style={[componentStyles.rightContainer]}>
							{this.getIcon(selectedIndex, index)}
						</View>
					</TouchableOpacity>
				);
			});
		}
	};

	getIcon = (selectedIndex, index) => {
		if (selectedIndex === index) {
			return (
				<Icon
					name="ios-checkmark"
					color={styles.colors.accent}
					style={componentStyles.selectedCheckmark}
				/>
			);
		}
	};

	getButtonTextStyle = (selectedIndex, index) => {
		const { styleSheet } = this.state;
		const styles = styleSheet || componentStyles;
		if (selectedIndex === index) {
			return styles.selectedButtonText;
		}
		return styles.listItemButtonText;
	};

	getTextProps = (selectedIndex, index) => {
		const result = {
			color: 'secondary',
		};

		if (selectedIndex === index) {
			result.color = 'accent';
		}

		return result;
	};

	getViewStyles = () => {
		const { isVisible, isHiding } = this.state;
		const styles = {
			position: 'absolute',
			top: 0,
			right: 0,
			left: 0,
		};
		if (isVisible === true || (isHiding === true && isVisible === false)) {
			styles.bottom = 0;
		}

		return styles;
	};

	animateActionSheet = (toValue) => {
		Animated.timing(this.state.translateY, {
			toValue,
			duration,
		}).start();
	};

	animateOverlay = (toValue) => {
		Animated.timing(this.state.overlayOpacity, {
			toValue,
			duration,
		}).start();
	};

	hide = (callOnHide = true) => {
		this.setState({
			isVisible: false,
			isHiding: true,
		}, () => {
			this.timeOut = setTimeout(() => {
				this.setState({
					isHiding: false,
				});
			}, duration);
			this.animateOverlay(0);
			this.animateActionSheet(0);
		});

		const { onHide } = this.state;
		if (callOnHide && onHide) {
			onHide();
		}
	};

	show = () => {
		this.setState({
			isVisible: true,
			pendingShow: true,
		});
	};

	isVisible = () => {
		return this.state.isVisible;
	};

	_show = () => {
		this.animateOverlay(1);
		this.animateActionSheet(-this.state.height);
		this.setState({pendingShow: false});
	};

	getOverlayStyles = () => {
		return [componentStyles.overlay, {
			opacity: this.state.overlayOpacity,
		}];
	};

	getContentStyles = () => {
		return [componentStyles.content, {
			transform: [{
				translateY: this.state.translateY,
			}],
		}];
	};

	render() {
		let scrollHeight = this.state.height - HEADER_HEIGHT;
		if (helpers.isAndroid()) {
			scrollHeight -= styles.measurements.gridSpace3;
		}

		return (
			<View
				style={this.getViewStyles()}
			>
				<AnimatedTouchableOpacity
					onPress={this.hide}
					style={this.getOverlayStyles()}
				/>
				<Animated.View
					onLayout={this.onSheetLayout}
					style={this.getContentStyles()}
				>
					<View
						style={componentStyles.sheetWrap}
						ref={(node) => this.contentView = node}
					>
						{this.renderDescription()}
						<ScrollView style={{height: scrollHeight}}>
							{this.renderList()}
						</ScrollView>
					</View>
				</Animated.View>
			</View>
		);
	}

}

HalfPageListSelector.propTypes = {
	description: PropTypes.string,
	options: PropTypes.array,
	styleSheet: PropTypes.object,
	heightDescription: PropTypes.string,
	exitButton: PropTypes.object,
	getTemplate: PropTypes.func,
	onHide: PropTypes.func,
};

HalfPageListSelector.defaultProps = {};
