'use strict';

import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	BackHandler,
	View,
	TextInput,
	TouchableHighlight,
	TouchableOpacity,
	StyleSheet,
	Platform,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { typeAhead } from '../actions/SearchActions';
import { setComponentMeasurements } from '../actions/LayoutActions';
import { HOME } from '../constants/constants';
import styles from '../lib/styles';
import Icon from 'react-native-vector-icons/Ionicons';
import EventEmitter from '../lib/eventEmitter';
import TypeAhead from '../components/TypeAhead';
import { Text } from 'BuildLibrary';
import helpers from '../lib/helpers';
import router from '../router';
import {
	navigatorPush,
	navigatorReplace,
} from '../actions/NavigatorActions';
import HistoryConstants from '../constants/HistoryConstants';
import searchConstants from '../constants/searchConstants';
import { withNavigation } from '@expo/ex-navigation';

const shortInputWidth = styles.dimensions.width - 44;

const componentStyles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: styles.measurements.gridSpace1,
		height: styles.dimensions.tapSizeMedium,
	},
	barWrapper: {
		flex: 1,
		backgroundColor: styles.colors.white,
		height: 30,
		paddingHorizontal: styles.measurements.gridSpace1,
		flexDirection: 'row',
		alignItems: 'center',
		...Platform.select({
			ios: {
				borderWidth: styles.dimensions.borderWidth,
				borderColor: styles.colors.grey,
			},
		}),
	},
	inputBar: {
		flex: 1,
		alignSelf: 'center',
		height: 28,
		backgroundColor: styles.colors.white,
		color: styles.colors.secondary,
		fontFamily: styles.fonts.mainRegular,
		fontSize: 13,
		paddingHorizontal: styles.measurements.gridSpace1,
		paddingTop: styles.measurements.gridSpace1,
		paddingBottom: helpers.isAndroid() ? 4 : styles.measurements.gridSpace1,
	},
	searchButton: {
		justifyContent: 'center',
		alignItems: 'center',
		height: styles.dimensions.tapSizeMedium,
		width: styles.dimensions.tapSizeMedium,
		alignSelf: 'flex-end',
	},
	clearButtonPlaceholder: {
		width: 18,
	},
	closeButton: {
		paddingLeft: styles.measurements.gridSpace1,
		height: styles.dimensions.tapSizeMedium,
		justifyContent: 'center',
	},
	barNextToButton: {
		width: styles.dimensions.width - 31,
	},
});

@withNavigation
export class HeaderSearch extends Component {

	constructor(props) {
		super(props);
		this.state = {
			hidden: this.props.startHidden,
			isFocused: false,
			searchBoxText: props.searchKeyword || '',
		};
	}

	componentDidMount() {
		if (!EventEmitter.listeners('dismissKeyboard').length) {
			EventEmitter.addListener('dismissKeyboard', this.handleCloseButton);
		}
	}

	componentWillReceiveProps(nextProps) {
		if (!this.state.hidden && this.state.isFocused && this.props.typeAheadResults !== nextProps.typeAheadResults) {
			this.handleOverlay(nextProps);
		}
	}

	componentWillUnmount() {
		EventEmitter.removeListener('dismissKeyboard', this.handleCloseButton);
	}

	updateInput = (searchBoxText) => {
		this.setState({
			searchBoxText,
		});
		if (this.props.features.typeAhead) {
			this.props.actions.typeAhead(searchBoxText).catch(helpers.noop).done();
		}
	};

	handleOverlayTap = () => {
		if (this.searchbar) {
			this.searchbar.blur();
		}
		this.handleBlur();
	};

	handleCloseButton = () => {
		if (this.searchbar) {
			this.searchbar.blur();
			this.handleBlur();
			this.toggleSearchbarVisibility();
		}
	};

	handleSubmit = () => {
		if (this.searchbar) {
			this.searchbar.blur();
			this.setState({
				isFocused: false,
			});
		}
		if (this.props.startHidden) {
			this.setState({ hidden: true });
		}
		this.closeOverlay();
		const {
			searchBoxText: keyword,
		} = this.state;
		if (keyword) {
			const navigatorAction = this.props.replaceCurrentRoute || this.props.nullSearchResult ? navigatorReplace : navigatorPush;
			const searchCriteria = {
				title: keyword,
				searchCriteria: {
					keyword,
					page: 1,
					pageSize: 50,
				},
				tracking: {
					name: 'build:app:headersearch:searchresults',
					data: {
						'search.keyword': keyword,
					},
				},
			};
			if (this.props.navigator.navigatorId !== HOME) {
				const navigator = this.props.navigation.getNavigator(HOME);
				navigator.popToTop();
				navigator.push('productDrops', searchCriteria);
				this.props.navigation.performAction(({ tabs }) => tabs('main').jumpToTab(HOME));
			} else {
				navigatorAction(router.getRoute('productDrops', searchCriteria), HOME);
			}
		} else {
			this.handleCloseButton();
		}
	};

	showSearch = () => {
		this.toggleSearchbarVisibility();
		setTimeout(() => {
			if (this.searchbar) {
				this.searchbar.focus();
			}
		}, 300);
	};

	toggleSearchbarVisibility = () => {
		if (this.props.allowFullCollapse) {
			this.setState({ hidden: !this.state.hidden });
		}
	};

	handleOverlay = (props = this.props) => {
		const { searchBoxText } = this.state;
		const {
			recentSearches,
			typeAheadResults,
			features: { viewRecentSearches },
		} = props;
		const { RECENT_SEARCHES_MAX_DISPLAY, RECENT_SEARCHES_DISPLAY_WITH_TYPEAHEAD } = HistoryConstants;
		const { TYPEAHEAD_MAX_RESULTS } = searchConstants;

		const typeAheadInfo = (searchBoxText && typeAheadResults[searchBoxText]) || null;
		let typeAheadComponent = null;

		// get the data for the typeahead suggestions
		const typeAheadSuggestions = (typeAheadInfo && typeAheadInfo.suggestions) || [];

		// build the list of recent searches
		const numberOfRecentSearches = typeAheadSuggestions.length ? RECENT_SEARCHES_DISPLAY_WITH_TYPEAHEAD : RECENT_SEARCHES_MAX_DISPLAY;
		let recentSearchKeywords = [];
		if (viewRecentSearches && recentSearches) {
			recentSearchKeywords = recentSearches
				.filter(({ keyword = '' }) => keyword.indexOf(searchBoxText) > -1)
				.slice(0, numberOfRecentSearches)
				.map(({ keyword }) => ({
					text: keyword,
					icon: 'md-time',
				}));
		}

		// build the list of typeahead suggestions
		const suggestions = typeAheadSuggestions
			.slice(0, TYPEAHEAD_MAX_RESULTS - recentSearchKeywords.length)
			.map((suggestion) => ({
				text: suggestion,
			}));

		// build the rows and section headers for the typeahead
		const results = {};
		const headers = {};
		if (recentSearchKeywords.length) {
			results.recentSearchKeywords = recentSearchKeywords;
			headers.recentSearchKeywords = 'Recent Searches';
		}
		if (suggestions.length) {
			results.suggestions = suggestions;
			headers.suggestions = '';
		}

		if (Object.keys(results).length) {
			typeAheadComponent = (
				<TypeAhead
					results={results}
					headers={headers}
					term={searchBoxText}
					onPress={this.handleSuggestionTap}
				/>);
		}

		if (!this.state.hidden && this.state.isFocused) {
			EventEmitter.emit('showCustomScreenOverlay', {
				overlayStyles: {
					top: styles.headerStyleSheet.General.TotalNavHeight,
				},
				component: typeAheadComponent,
			});
		}
	};

	backButtonHandler = () => {
		this.handleOverlayTap();
		return true;
	};

	handleFocus = () => {
		this.setState({
			isFocused: true,
			hidden: false,
		}, () => this.handleOverlay());
		BackHandler.addEventListener('hardwareBackPress', this.backButtonHandler);
		EventEmitter.addListener('screenOverlayClosed', this.handleOverlayTap);
	};

	closeOverlay = () => {
		EventEmitter.emit('hideScreenOverlay');
		EventEmitter.removeListener('screenOverlayClosed', this.handleOverlayTap);
		BackHandler.removeEventListener('hardwareBackPress', this.backButtonHandler);
	};

	handleSuggestionTap = (suggestion) => {
		this.setState({
			searchBoxText: suggestion,
		}, this.handleSubmit);
	};

	handleBlur = () => {
		this.setState({ hidden: true });
		this.closeOverlay();
		this.setState({
			isFocused: false,
		});
	};

	getWidth = () => {
		if (this.props.allowFullCollapse === false && !this.state.isFocused) {
			return { width: shortInputWidth };
		}
		if (this.state.hidden && this.props.allowFullCollapse) {
			return { width: 100 };
		}
		if (this.props.nextToButton) {
			return componentStyles.barNextToButton;
		}
		return { width: styles.dimensions.width };
	};

	handleClear = () => {
		this.updateInput('');
		if (this.searchbar) {
			this.searchbar.focus();
		}
	};

	renderClearButton = () => {
		if (this.state.searchBoxText.length) {
			return (
				<TouchableHighlight
					onPress={this.handleClear}
					hitSlop={{
						top: 5,
						bottom: 5,
						left: 20,
						right: 10,
					}}
				>
					<Icon
						name="ios-close-circle"
						size={22}
						color={styles.colors.grey}
					/>
				</TouchableHighlight>
			);
		}
		return (
			<View
				style={componentStyles.clearButtonPlaceholder}
			/>
		);
	};

	renderCloseButton = () => {
		if (this.state.isFocused) {
			return (
				<TouchableOpacity
					onPress={this.handleCloseButton}
					style={componentStyles.closeButton}
					accessibilityLabel="Header Search Close"
				>
					<Text
						lineHeight={false}
						color={helpers.isIOS() ? 'primary' : 'white'}
					>
						Close
					</Text>
				</TouchableOpacity>
			);
		}
	};

	renderContent = () => {
		if (this.state.hidden && this.props.allowFullCollapse) {
			return (
				<TouchableOpacity
					onPress={this.showSearch}
					style={componentStyles.searchButton}
					accessibilityLabel="Header Search Button"
				>
					<Icon
						name="ios-search"
						size={27}
						color={helpers.isIOS() ? styles.colors.primary : styles.colors.white}
					/>
				</TouchableOpacity>
			);
		}
		return (
			<View style={componentStyles.container}>
				<View style={componentStyles.barWrapper}>
					<Icon
						ref={(ref) => this.searchIcon = ref}
						name="ios-search"
						size={16}
						color={styles.colors.secondary}
					/>
					<TextInput
						style={componentStyles.inputBar}
						ref={(ref) => this.searchbar = ref}
						onChangeText={this.updateInput}
						value={this.state.searchBoxText}
						placeholder="What are you shopping for?"
						placeholderTextColor={styles.colors.gray}
						autoCapitalize="none"
						autoCorrect={false}
						returnKeyType="search"
						onSubmitEditing={this.handleSubmit}
						onFocus={this.handleFocus}
						accessibilityLabel="Header Search Input"
						underlineColorAndroid="transparent"
					/>
					{this.renderClearButton()}
				</View>
				{this.renderCloseButton()}
			</View>
		);
	};

	render() {
		return (
			<View style={[this.props.style, this.getWidth()]}>
				{this.renderContent()}
			</View>
		);
	}
}

HeaderSearch.propTypes = {
	searchKeyword: PropTypes.string,
	replaceCurrentRoute: PropTypes.bool,
	startHidden: PropTypes.bool,
	allowFullCollapse: PropTypes.bool,
	style: PropTypes.oneOfType([
		PropTypes.number,
		PropTypes.object,
		PropTypes.array,
	]),
	actions: PropTypes.object,
	typeAheadResults: PropTypes.object,
	features: PropTypes.object.isRequired,
	recentSearches: PropTypes.array,
	navigator: PropTypes.shape({
		navigatorId: PropTypes.string,
	}),
	navigation: PropTypes.shape({
		getNavigator: PropTypes.func,
		performAction: PropTypes.func,
	}),
	nullSearchResult: PropTypes.bool,
	nextToButton: PropTypes.bool,
};

HeaderSearch.defaultProps = {
	replaceCurrentRoute: false,
	startHidden: false,
	allowFullCollapse: false,
	features: {},
	nextToButton: false,
};

const mapStateToProps = (state) => {
	return {
		typeAheadResults: state.searchReducer.typeAheadResults,
		features: {
			typeAhead: state.featuresReducer.features.typeAhead,
			viewRecentSearches: state.featuresReducer.features.recentSearches,
		},
		recentSearches: state.HistoryReducer.searches,
		nullSearchResult: state.searchReducer.nullSearchResult,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			setComponentMeasurements,
			typeAhead,
		}, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(HeaderSearch);
