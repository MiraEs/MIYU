'use strict';

import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	Animated,
	View,
	BackHandler,
	TouchableOpacity,
	StyleSheet,
} from 'react-native';
import { isIOS } from '../lib/helpers';
import styles from '../lib/styles';
import EventEmitter from '../lib/eventEmitter';
import Icon from 'react-native-vector-icons/Ionicons';
import {
	Text,
	ListView,
} from 'BuildLibrary';

const duration = 220,
	rowHeight = 50,
	componentStyles = StyleSheet.create({
		overlay: {
			backgroundColor: styles.colors.underlayGrey,
			position: 'absolute',
			top: 0,
			bottom: 0,
			right: 0,
			left: 0,
		},
		content: {
			position: 'absolute',
			top: styles.dimensions.height + 20,
			left: 0,
			right: 0,
			paddingTop: styles.measurements.gridSpace3,
		},
		optionText: {
			marginVertical: styles.measurements.gridSpace2,
		},
		icon: {
			width: 40,
			height: 40,
		},
		titleWrapper: {
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'space-between',
			paddingHorizontal: styles.measurements.gridSpace1,
			paddingBottom: styles.measurements.gridSpace2,
			borderBottomWidth: styles.dimensions.borderWidth,
			borderBottomColor: styles.colors.grey,
		},
		description: {
			color: styles.colors.secondary,
			lineHeight: styles.lineHeight.large,
			fontSize: styles.fontSize.large,
			fontFamily: styles.fonts.mainRegular,
			textAlign: 'center',
			marginBottom: 30,
		},
		button: {
			paddingHorizontal: styles.measurements.gridSpace2,
			justifyContent: 'space-between',
			borderBottomWidth: styles.dimensions.borderWidth,
			borderBottomColor: styles.colors.grey,
			flexDirection: 'row',
			alignItems: 'center',
		},
		buttonText: {
			textAlign: 'center',
			fontFamily: styles.fonts.mainBold,
			fontSize: styles.fontSize.regular,
			color: styles.colors.primary,
		},
		sheetWrap: {
			paddingBottom: isIOS() ? 0 : styles.measurements.gridSpace3,
			backgroundColor: styles.colors.white,
		},
		sheetWrapPadding: {
			paddingTop: styles.measurements.gridSpace2,
		},
		flex1: {
			flex: 1,
		},
		flex3: {
			flex: 3,
		},
	}),
	defaultStyles = StyleSheet.create({
		buttonText: {
			left: 10,
			textAlign: 'left',
			fontFamily: styles.fonts.mainRegular,
			fontSize: styles.fontSize.regular,
			color: styles.colors.secondary,
		},
		selectedButtonText: {
			left: 10,
			color: styles.colors.accent,
			textAlign: 'left',
			fontFamily: styles.fonts.mainRegular,
			fontSize: styles.fontSize.regular,
		},
		title: {
			fontSize: styles.fontSize.large,
			fontFamily: styles.fonts.bold,
			fontWeight: '700',
			color: styles.colors.secondary,
		},
	});

export default class ActionSheet extends Component {
	displayName = 'ActionSheet';

	constructor(props) {
		super(props);
		this.state = {
			translateY: new Animated.Value(0),
			overlayOpacity: new Animated.Value(0),
			styleSheet: props.styleSheet,
			isVisible: false,
			isHiding: false,
			height: 0,
			multiSelect: false,
			selections: [],
			options: [],
			createNewOption: null,
			pendingLayout: true,
			...props,
		};

	}

	componentWillMount() {
		EventEmitter.addListener('showActionSheet', this.setConfiguration);
	}

	componentDidUpdate() {
		if (this.renderTimeout && this.renderTimeout.clearTimeout) {
			this.renderTimeout.clearTimeout();
		}
		this.renderTimeout = setTimeout(() => {
			if (this.state.pendingShow && !this.state.pendingLayout) {
				this._show();
			}
		}, duration);
	}

	componentWillUnmount() {
		if (this.timeOut && this.timeOut.clearTimeout) {
			this.timeOut.clearTimeout();
		}
		EventEmitter.removeListener('showActionSheet', this.setConfiguration);
	}

	handleBackPress = () => {
		if (this.state.isVisible) {
			this.hide();
			return true;
		}
		return false;
	};

	isVisible = () => {
		return this.state.isVisible;
	};

	onSheetLayout = (event) => {
		this.setState({
			height: event.nativeEvent.layout.height + 20,
		}, () => {
			if (this.state.pendingShow) {
				this.setState({
					pendingLayout: false,
				}, this._show);
			}
		});
	};

	setConfiguration = (config) => {
		const newConfig = {
			icon: null,
			title: null,
			description: null,
			options: null,
			createNewOption: null,
			selections: [],
			initSelections: config.selections ? [...config.selections] : [],
			multiSelect: false,
			...config,
			pendingLayout: this.state.pendingLayout && config.pendingLayout,
		};
		this.setState({
			...newConfig,
		});
		this.show();
	};

	renderIcon = () => {
		const { icon } = this.state;
		if (icon) {
			return (
				<View
					style={componentStyles.icon}
				>
					<Icon
						size={30}
						name={icon}
						color="#fff"
					/>
				</View>
			);
		}
	};

	getDoneButton = () => {
		if (this.state.multiSelect) {
			return (
				<TouchableOpacity
					onPress={this.onDonePress}
				>
					<Text
						textAlign="right"
						lineHeight={false}
					>
						Done
					</Text>
				</TouchableOpacity>
			);
		}
	};

	renderTitle = () => {
		const { title } = this.state;
		const titleText = title ? (
			<Text
				size="large"
				textAlign="center"
				weight="bold"
				lineHeight={false}
			>
				{title}
			</Text>
		) : null;
		return (
			<View style={componentStyles.titleWrapper}>
				<TouchableOpacity
					style={componentStyles.flex1}
					onPress={this.hide}
				>
					<Text lineHeight={false}>Cancel</Text>
				</TouchableOpacity>
				<View style={componentStyles.flex3}>
					{titleText}
				</View>
				<View style={componentStyles.flex1}>
					{this.getDoneButton()}
				</View>
			</View>
		);
	};

	onDonePress = () => {
		const { selections, initSelections } = this.state;
		this.state.onDonePress({
			initSelections,
			selections,
		});
		this.hide();
	};

	renderDescription = () => {
		const { description } = this.state;
		if (description) {
			return (
				<Text
					style={componentStyles.description}
				>{description}</Text>
			);
		}
	};

	renderOption = (option, section, index) => {
		index = parseInt(index, 10);
		const { selections } = this.state;
		const selected = selections.indexOf(index) !== -1;
		return (
			<TouchableOpacity
				key={`custom-action-sheet-${index}`}
				onPress={() => {
					if (option.onPress) {
						option.onPress();
						this.hide();
					} else {
						let newSelections;
						if (selected) {
							newSelections = [...selections];
							newSelections.splice(newSelections.indexOf(index), 1);
						} else {
							newSelections = selections.concat(index);
						}
						this.setState({
							selections: newSelections,
						});
						if (!this.state.multiSelect) {
							this.hide();
						}
					}
				}}
				style={componentStyles.button}
			>
				<Text
					style={componentStyles.optionText}
					color={selected ? 'accent' : 'secondary'}
					lineHeight={false}
				>
					{option.text}
				</Text>
				{this.getIcon(index)}
			</TouchableOpacity>
		);
	};

	renderOptions = () => {
		let options = this.state.options;
		if (options) {
			const { createNewOption } = this.state;
			if (createNewOption) {
				options = [{
					...createNewOption,
					onPress: () => {
						createNewOption.onPress();
						this.onDonePress();
					},
				}].concat(options);
			}
			const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
			return (
				<ListView
					ref={(ref) => this.list = ref}
					enableEmptySections={true}
					dataSource={ds.cloneWithRows(options)}
					renderRow={this.renderOption}
					scrollEnabled={this.state.height > styles.dimensions.height}
					pageSize={30}
				/>
			);
		} else {
			return null;
		}
	};

	getIcon = (index) => {
		const { selections } = this.state;
		if (selections.indexOf(index) >= 0) {
			return (
				<Icon
					name="md-checkmark"
					size={24}
					color={styles.colors.accent}
				/>
			);
		}
	};

	getButtonTextStyle = (index) => {
		const { selections, styleSheet } = this.state;
		const styles = styleSheet || actionSheet;
		if (selections.indexOf(index) >= 0) {
			return styles.selectedButtonText;
		}
		return styles.buttonText;
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

	hide = () => {
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
		BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
	};

	show = () => {
		this.setState({
			isVisible: true,
			pendingShow: true,
		});
		if (this.list && typeof this.list.scrollTo === 'function') {
			this.list.scrollTo({
				x: 0,
				y: 0,
				animated: false,
			});
		}
		BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
	};

	_show = () => {
		this.animateOverlay(1);
		this.animateActionSheet(-(this.state.height));
		this.setState({ pendingShow: false });
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

	getSheetPadding = () => {
		return this.state.title || this.state.description ? componentStyles.sheetWrapPadding : {};
	};

	getSheetHeight = () => {
		if ((this.state.options.length + 1) * rowHeight > styles.dimensions.height) {
			return {
				height: styles.dimensions.height,
			};
		}
	};

	render() {
		return (
			<View style={this.getViewStyles()}>
				<Animated.View style={this.getOverlayStyles()}>
					<TouchableOpacity
						onPress={this.hide}
						style={componentStyles.overlay}
					/>
				</Animated.View>
				<Animated.View
					onLayout={this.onSheetLayout}
					style={this.getContentStyles()}
				>
					<View
						style={[componentStyles.sheetWrap, this.getSheetPadding(), this.getSheetHeight()]}
						ref={(node) => this.contentView = node}
					>
						{this.renderTitle()}
						{this.renderDescription()}
						{this.renderOptions()}
					</View>
					{this.renderIcon()}
				</Animated.View>
			</View>

		);
	}

}

ActionSheet.propTypes = {
	icon: PropTypes.string,
	title: PropTypes.string,
	description: PropTypes.string,
	options: PropTypes.array,
	optionsTextStyle: PropTypes.object,
	styleSheet: PropTypes.object,
	onCreateNewPress: PropTypes.func,
};

ActionSheet.defaultProps = {
	styleSheet: defaultStyles,
};
