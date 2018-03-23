'use strict';

import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	Animated,
	StyleSheet,
	TouchableWithoutFeedback,
	View,
} from 'react-native';
import {
	ListView,
	Text,
	TouchableOpacity,
} from 'BuildLibrary';
import TrackingActions from '../../../lib/analytics/TrackingActions';
import helpers from '../../../lib/helpers';
import styles from '../../../lib/styles';
import LinearGradient from 'react-native-linear-gradient';

const FADE_WIDTH = 63;
const FADE_RIGHT_OFFSET = styles.dimensions.width - FADE_WIDTH;
const componentStyles = StyleSheet.create({
	tabBarView: {
		backgroundColor: styles.colors.white,
		elevation: 3,
		shadowColor: 'black',
		shadowOpacity: 0.35,
		shadowRadius: 2,
		shadowOffset: {
			height: 1,
			width: 0,
		},
		zIndex: 1,
	},
	tabTarget: {
		height: styles.buttons.regular.height,
	},
	tab: {
		justifyContent: 'center',
		flex: 1,
	},
	tabText: {
		paddingHorizontal: styles.measurements.gridSpace2,
	},
	highlightedTab: {
		paddingTop: 5,
		borderBottomColor: styles.colors.primary,
		borderBottomWidth: 5,
	},
	linearGradient: {
		width: FADE_WIDTH,
		height: styles.buttons.regular.height,
		position: 'absolute',
		zIndex: 100,
	},
});

export default class PagerTabBar extends Component {

	constructor(props) {
		super(props);
		this.tabs = [];
		const ds = new ListView.DataSource({
			rowHasChanged: (r1, r2) => r1 !== r2,
		});
		this.state = {
			dataSource: ds.cloneWithRows(this.props.tabs),
			fadeLeft: false,
			fadeLeftPosition: new Animated.Value(0),
			fadeRight: false,
			fadeRightPosition: new Animated.Value(FADE_RIGHT_OFFSET),
			tabSizes: [],
			tabBarWidth: undefined,
		};
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.tabs !== nextProps.tabs) {
			this.setState({
				dataSource: this.state.dataSource.cloneWithRows(nextProps.tabs),
			});

			// manually call since the number of tabs didn't change
			if (this.props.tabs.length === nextProps.tabs.length) {
				this.scrollTabs(this.findSelectedTabIndex(nextProps));
			}
		}
	}

	findSelectedTabIndex = ({ tabs = [] }) => {
		let index = 0;
		const { length } = tabs;
		for (; index < length; index++) {
			if (tabs[index].selected) {
				break;
			}
		}

		return index === length ? -1 : index;
	};

	measureTabs = () => {
		const promises = [];
		this.tabs.map((tab) => {
			promises.push(new Promise((resolve) => {
				tab.measure((ox, oy, width) => {
					// ox is not reliable in Android so we'll calculate it later
					resolve({
						width,
					});
				});
			}));
		});

		return Promise.all(promises).then((widths) => {
			return widths;
		});
	};

	setTabMeasurements = (override = false) => {
		return new Promise((resolve) => {
			if (!override && this.state.tabSizes.length) {
				return resolve({
					tabSizes: this.state.tabSizes,
					tabBarWidth: this.state.tabBarWidth,
				});
			}

			this.measureTabs().then((tabSizes) => {
				let tabBarWidth = 0;
				tabSizes.forEach((tabSize) => {
					const { width } = tabSize;
					// order here is important.  The width of the last tab is the origin of this tab
					tabSize.ox = tabBarWidth;
					tabBarWidth += width;
				});
				this.setState({
					tabBarWidth,
					tabSizes,
				}, () => {
					resolve({
						tabBarWidth,
						tabSizes,
					});
				});
			});
		});
	};

	onPressFade = (fadeOffset, { nativeEvent }) => {
		const { locationX } = nativeEvent;
		const { offset } = this.tabBar.scrollProperties;

		// the offset plus the tap location is the true tap location
		const trueTapLocation = locationX + offset + fadeOffset;

		const { tabSizes } = this.state;
		let index = 1;
		for (; index < tabSizes.length - 1; index++) {
			// go through the X positions of tabSizes to figure which tab was clicked on
			// we won't know until we're past it so subtract 1
			if (tabSizes[index].ox > trueTapLocation) {
				index -= 1;
				break;
			}
		}

		// use that index to change the index on the parent using the callback
		this.props.onPageChanged(index);
	};

	onContentSizeChange = () => {
		this.setTabMeasurements(true).then(() => {
			this.setFade();
			this.scrollTabs(this.findSelectedTabIndex(this.props));
		}).done();
	};

	onScroll = (event) => {
		const { x } = event.nativeEvent.contentOffset;
		this.state.fadeLeftPosition.setValue(x);
		this.state.fadeRightPosition.setValue(x + FADE_RIGHT_OFFSET);
		this.setFade();
	};

	scrollTabs = (index) => {
		const { tabSizes } = this.state;

		// check to see if index is out of bounds
		if (index === -1 || index > tabSizes.length || !tabSizes.length || !tabSizes[index]) {
			return;
		}

		// figure out where our tab is located
		const leftTabEdge = tabSizes[index].ox;
		const rightTabEdge = leftTabEdge + tabSizes[index].width;

		// figure out the visible portion of the tab bar
		const scrollProperties = this.tabBar.scrollProperties;
		const leftWindowEdge = scrollProperties.offset;
		const windowWidth = scrollProperties.visibleLength;
		const rightWindowEdge = leftWindowEdge + windowWidth;

		// scroll the selected tab into view
		if (leftTabEdge < leftWindowEdge || rightTabEdge < leftWindowEdge) {
			this.tabBar && this.tabBar.scrollTo({ y: 0, x: leftTabEdge });
		} else if (leftTabEdge > rightWindowEdge || rightTabEdge > rightWindowEdge) {
			this.tabBar && this.tabBar.scrollTo({ y: 0, x: rightTabEdge - windowWidth });
		}
	};

	setFade = () => {
		const contentSize = this.state.tabBarWidth;
		const screenWidth = styles.dimensions.width;
		const contentOffset = this.tabBar.scrollProperties.offset;
		const newState = {};

		// check to see if we're close to the edges
		const EDGE_OVERLAP = 14;
		const leftEdgeDetection = contentOffset > EDGE_OVERLAP;
		const rightEdgeDetection = contentSize - contentOffset - screenWidth > EDGE_OVERLAP;

		// only save the state if something has changed
		if (leftEdgeDetection !== this.state.fadeLeft) {
			newState.fadeLeft = leftEdgeDetection;
		}
		if (rightEdgeDetection !== this.state.fadeRight) {
			newState.fadeRight = rightEdgeDetection;
		}
		this.setState({ ...newState });
	};

	renderFadeLeft = () => {
		if (helpers.isIOS() && this.state.fadeLeft) {
			return (
				<Animated.View style={[{ left: this.state.fadeLeftPosition }, componentStyles.linearGradient]}>
					<TouchableWithoutFeedback onPress={this.onPressFade.bind(this, 0)}>
						<LinearGradient
							start={{ x: 0.0, y: 0.5 }}
							end={{ x: 1.0, y: 0.5 }}
							colors={['rgba(255, 255, 255, 0.7)', 'rgba(255, 255, 255, 0)']}
							style={styles.elements.flex1}
						/>
					</TouchableWithoutFeedback>
				</Animated.View>
			);
		}
	};

	renderFadeRight = () => {
		if (helpers.isIOS() && this.state.fadeRight) {
			return (
				<Animated.View style={[{ left: this.state.fadeRightPosition }, componentStyles.linearGradient]}>
					<TouchableWithoutFeedback onPress={this.onPressFade.bind(this, FADE_RIGHT_OFFSET)}>
						<LinearGradient
							start={{ x: 0.0, y: 0.5 }}
							end={{ x: 1.0, y: 0.5 }}
							colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.7)']}
							style={styles.elements.flex1}
						/>
					</TouchableWithoutFeedback>
				</Animated.View>
			);
		}
	};

	renderTab = (tab, sectionId, rowId) => {
		rowId = parseInt(rowId, 10);
		const tabHighlight = tab.selected ? componentStyles.highlightedTab : {};
		const textColor = tab.selected ? 'primary' : 'secondary';

		return (
			<TouchableOpacity
				key={tab.text}
				ref={(ref) => {
					if (ref) {
						this.tabs[rowId] = ref;
					}
				}}
				onPress={this.props.onPageChanged.bind(this, rowId)}
				style={componentStyles.tabTarget}
				trackAction={TrackingActions.PAGER_TAB_TAP}
				trackContextData={{
					tabName: tab.text.replace(/\s/g, ''),
				}}
			>
				<View style={[componentStyles.tab, tabHighlight]}>
					<Text
						color={textColor}
						lineHeight={false}
						weight="bold"
						style={componentStyles.tabText}
					>
						{tab.text}
					</Text>
				</View>
			</TouchableOpacity>
		);
	};

	render() {
		return (
			<View style={componentStyles.tabBarView}>
				<ListView
					dataSource={this.state.dataSource}
					enableEmptySections={true}
					horizontal={true}
					onContentSizeChange={this.onContentSizeChange}
					onScroll={this.onScroll}
					ref={(ref) => {
						if (ref) {
							this.tabBar = ref;
						}
					}}
					removeClippedSubviews={false}
					renderRow={this.renderTab}
					renderHeader={this.renderFadeLeft}
					renderFooter={this.renderFadeRight}
					scrollEventThrottle={25}
					scrollsToTop={false}
					showsHorizontalScrollIndicator={false}
					accessibilityLabel="Tab Bar"
				/>
			</View>
		);
	}

}

PagerTabBar.propTypes = {
	onPageChanged: PropTypes.func,
	tabs: PropTypes.array,
};

PagerTabBar.defaultProps = {
	onPageChanged: helpers.noop,
	pager: {
		goToPage: helpers.noop,
	},
	tabs: [],
};
