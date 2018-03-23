'use strict';

import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	View,
	StyleSheet,
	Text,
	TouchableHighlight,
 	PixelRatio,
} from 'react-native';
import { ListView } from 'BuildLibrary';
import { NavigationStyles } from '@expo/ex-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import styles from '../lib/styles';
import {
	TEMPLATE_ORDER,
	TEMPLATE_SHIPPING_ESTIMATE,
} from '../constants/constants';
import helpers from '../lib/helpers';
import { trackState } from '../actions/AnalyticsActions';
import store from '../store/configStore';
import EventEmitter from '../lib/eventEmitter';
import NavigationBarTextButton from './navigationBar/NavigationBarTextButton';

const componentStyles = StyleSheet.create({
	screen: {
		backgroundColor: styles.colors.lightGray,
		padding: 0,
		margin: 0,
	},
	listItem: {
		height: 60,
		justifyContent: 'space-between',
	},
	listItemText: {
		flex: 1,
		fontSize: 16,
		fontFamily: styles.fonts.mainRegular,
		color: styles.colors.secondary,
	},
	listItemIcon: {
		marginRight:styles.measurements.gridSpace2,
	},
	listItemSeparator: {
		height: 1 / PixelRatio.get(),
		backgroundColor: styles.colors.iOSDivider,
	},
	bold: {
		fontWeight: 'bold',
	},
});

const ON_CANCEL_BUTTON_PRESS = 'ON_CANCEL_BUTTON_PRESS';
const ON_DONE_BUTTON_PRESS = 'ON_DONE_BUTTON_PRESS';

class ListSelector extends Component {

	constructor(props) {
		super(props);

		const ds = new ListView.DataSource({
			rowHasChanged: () => true,
		});

		this.state = {
			dataSource: ds.cloneWithRows(this.props.list),
		};
	}

	componentDidMount() {
		store.dispatch(trackState(this.props.tracking.name, this.props.tracking.data));
		EventEmitter.addListener(ON_CANCEL_BUTTON_PRESS, this.onCancelPress);
		EventEmitter.addListener(ON_DONE_BUTTON_PRESS, this.onDonePress);

		setTimeout(() => {
			this.props.navigator.updateCurrentRouteParams({
				showDoneButton: this.props.showDoneButton,
			});
		}, 500);
	}

	componentWillUnmount() {
		EventEmitter.removeAllListeners(ON_CANCEL_BUTTON_PRESS);
		EventEmitter.removeAllListeners(ON_DONE_BUTTON_PRESS);
	}

	onCancelPress = () => {
		this.hideModal();
	};

	onDonePress = () => {
		this.hideModal();
	};

	hideModal = () => {
		this.props.navigation.getNavigator('root').pop();
	};

	renderSeparator = (sectionID, rowID) => {
		return (
			<View
				key={`${sectionID}-${rowID}`}
				style={componentStyles.listItemSeparator}
			/>
		);
	};

	onItemPress = (listItem) => {
		const { showDoneButton, list, onSelectItem } = this.props;
		if (showDoneButton) {
			const index = list.indexOf(listItem);
			list[index].selected = true;
		}
		this.setState({
			dataSource: this.state.dataSource.cloneWithRows(list),
		});
		onSelectItem(listItem);
	};

	renderRow = (listItem) => {
		const text = listItem[this.props.listItemText];
		const iconName = listItem.selected ? 'md-checkmark' : 'ios-add-circle-outline';
		const iconColor = listItem.selected ? styles.colors.accent : styles.colors.secondary;

		switch (this.props.template) {
			case TEMPLATE_ORDER:
				return (
					<TouchableHighlight
						onPress={() => this.onItemPress(listItem)}
						underlayColor="rgba(0, 0, 0, .1)"
					>
						<View style={[styles.elements.row, componentStyles.listItem]} >
							<Text style={[componentStyles.listItemText, componentStyles.bold]}>
								#{text}
							</Text>
							<Text style={componentStyles.listItemText}>
								${listItem.total}
							</Text>
							<Text style={componentStyles.listItemText}>
								{listItem.orderDate}
							</Text>
							<Icon
								name={iconName}
								size={34}
								color={iconColor}
								style={componentStyles.listItemIcon}
							/>
						</View>
					</TouchableHighlight>
				);
			case TEMPLATE_SHIPPING_ESTIMATE:
				return (
					<TouchableHighlight
						onPress={() => this.onItemPress(listItem)}
						underlayColor="rgba(0, 0, 0, .1)"
					>
						<View style={[styles.elements.row, componentStyles.listItem]}>
							<View>
								<Text style={[styles.text.bold, styles.fontSize.small]}>
									{listItem.shippingCost === 0 ? 'FREE' : helpers.toUSD(listItem.shippingCost)}
								</Text>
								<Text style={[styles.text.mediumGray, styles.fontSize.small]}>
									{text}
								</Text>
							</View>
							<Icon
								name={iconName}
								size={34}
								color={iconColor}
								style={componentStyles.listItemIcon}
							/>
						</View>
					</TouchableHighlight>
				);
			default:
				return (
					<TouchableHighlight
						onPress={() => this.onItemPress(listItem)}
						underlayColor="rgba(0, 0, 0, .1)"
					>
						<View
							style={[styles.elements.row, componentStyles.listItem]}
						>
							<Text
								style={componentStyles.listItemText}
							>
								{text}
							</Text>
							<Icon
								name={iconName}
								size={34}
								color={iconColor}
								style={componentStyles.listItemIcon}
							/>
						</View>
					</TouchableHighlight>
				);
		}
	};

	render() {
		return (
			<View style={[styles.elements.screen, componentStyles.screen]}>
				<ListView
					dataSource={this.state.dataSource}
					renderRow={this.renderRow}
					renderSeparator={this.renderSeparator}
					enableEmptySections={true}
				/>
			</View>
		);
	}
}

ListSelector.propTypes = {
	title: PropTypes.string,
	showCancelButton: PropTypes.bool,
	showDoneButton: PropTypes.bool,
	list: PropTypes.array.isRequired,
	listItemText: PropTypes.string.isRequired,
	template: PropTypes.string,
	onSelectItem: PropTypes.func.isRequired,
	navigation: PropTypes.shape({
		getNavigator: PropTypes.func,
	}),
	navigator: PropTypes.shape({
		updateCurrentRouteParams: PropTypes.func,
	}),
	tracking: PropTypes.shape({
		name: PropTypes.string,
		data: PropTypes.object,
	}),
};

ListSelector.defaultProps = {
	title: 'Selection',
	showCancelButton: true,
	showDoneButton: true,
	list: [],
};

/* eslint-disable react/no-multi-comp */
ListSelector.route = {
	styles: {
		...NavigationStyles.SlideVertical,
		gestures: null,
	},
	navigationBar: {
		visible: true,
		title(props) {
			return props.title;
		},
		renderLeft(route) {
			if (route.params.showCancelButton) {
				return (
					<NavigationBarTextButton onPress={() => EventEmitter.emit(ON_CANCEL_BUTTON_PRESS)}>
						Cancel
					</NavigationBarTextButton>
				);
			}
		},
		renderRight(route) {
			if (route.params.showDoneButton) {
				return (
					<NavigationBarTextButton onPress={() => EventEmitter.emit(ON_DONE_BUTTON_PRESS)}>
						Done
					</NavigationBarTextButton>
				);
			}
		},
	},
};

export default ListSelector;
