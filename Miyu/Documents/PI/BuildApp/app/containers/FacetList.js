import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	StyleSheet,
	View,
	NativeModules,
	InteractionManager,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
	clearFacets,
	updateSelectedFacets,
	searchByKeyword,
} from '../actions/SearchActions';
import styles from '../lib/styles';
import LoadingView from '../components/LoadingView';
import NavigationBarTitle from '../components/navigationBar/NavigationBarTitle';
import NavigationBarTextButton from '../components/navigationBar/NavigationBarTextButton';
import FacetGroupRow from '../components/FacetGroupRow';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import {
	withScreen,
	ScrollView,
} from 'BuildLibrary';
import helpers from '../lib/helpers';
import pluralize from 'pluralize';
import isEqual from 'lodash.isequal';
const { UIManager } = NativeModules;

const componentStyles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: styles.colors.white,
	},
	selectedContainer: {
		paddingBottom: styles.measurements.gridSpace1,
	},
	headerSubContainer: {
		marginHorizontal: 60,
		paddingBottom: styles.measurements.gridSpace1,
	},
	done: {
		flex: 1,
		alignItems: 'center',
	},
	clearFacets: {
		alignItems: 'center',
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingHorizontal: styles.measurements.gridSpace1,
		height: 43.5,
		top: 20,
	},
	navBarButton: {
		height: styles.dimensions.tapSizeMedium,
		justifyContent: 'center',
	},
});

export class FacetList extends Component {

	constructor(props) {
		super(props);
		this.scrollPositionY = 0;
		this.scrollViewHeight = 0;
		this.initialSelectedFacets = props.selectedFacets;
	}

	getChildContext() {
		return {
			actions: this.props.actions,
		};
	}

	componentDidMount() {
		InteractionManager.runAfterInteractions(() => {
			this.handleFilterCountChange();
			this.props.navigator.updateCurrentRouteParams({
				instance: this,
			});
		});
	}

	componentWillReceiveProps(nextProps) {
		const {
			numFound,
			numSelectedFacets,
		} = this.props;
		if (numFound !== nextProps.numFound || numSelectedFacets !== nextProps.numSelectedFacets) {
			this.handleFilterCountChange(nextProps);
		}
	}

	setScreenTrackingInformation() {
		return {
			name: 'build:app:facetlist',
		};
	}

	handleFilterCountChange = (props = this.props) => {
		const {
			numFound,
			numSelectedFacets,
		} = props;
		this.props.navigator.updateCurrentRouteParams({
			numFound,
			numSelectedFacets,
		});
	};

	/**
	 * Track the size and scroll position of the main ScrollView
	 */
	onScroll = ({ nativeEvent }) => {
		this.scrollPositionY = nativeEvent.contentOffset.y;
		this.scrollViewHeight = nativeEvent.layoutMeasurement.height;
	};

	/**
	 * Checks to make sure that the ScrollView is visible when rerendering
	 * happens. There used to be an issue on Android where when filtering items
	 * far below the ScrollView's viewport would render a blank view because the
	 * ScrollView didn't scroll up automatically.
	 */
	onContentSizeChange = (contentWidth, contentHeight) => {
		if (this.scrollView && (this.scrollPositionY + this.scrollViewHeight) > contentHeight) {
			this.scrollView.scrollTo({ y: (contentHeight - this.scrollViewHeight) });
		}
	};

	searchBoxFocus = (event) => {
		if (this.scrollView) {
			UIManager.measureLayout(
				event.nativeEvent.target,
				this.scrollView.getScrollableNode(),
				helpers.noop,
				(x, y) => {
					this.scrollView.scrollTo({
						y: (y - styles.measurements.gridSpace2 - 43),
					});
				}
			);
		}
	};

	renderFacetGroup = (facetGroup, selectedFacetResponses, index) => {
		return (
			<FacetGroupRow
				key={index}
				rowData={{
					...facetGroup,
					selectedFacetResponses,
					searchCriteria: this.props.searchCriteria,
				}}
				searchBoxFocus={this.searchBoxFocus}
			/>
		);
	};

	renderLoading = () => {
		if (this.props.isLoading) {
			return (
				<LoadingView
					overlay={true}
					backgroundColor={styles.colors.translucentWhite}
				/>
			);
		}
	};

	doSelectedFacetsHaveChanges = () => {
		return !isEqual(this.initialSelectedFacets, this.props.selectedFacets);
	};

	handleDonePress = () => {
		const { actions, navigator, searchCriteria, onDoneButtonPress } = this.props;
		actions.searchByKeyword({
			...searchCriteria,
			page: 1,
			applyFacets: true,
		});
		onDoneButtonPress({ hasChanges: this.doSelectedFacetsHaveChanges() });
		navigator.pop();
	};

	clearFacets = () => {
		const { actions, searchCriteria } = this.props;
		actions.searchByKeyword({
			...searchCriteria,
			clearFacets: true,
		});
	};

	renderKeyboardSpacer = () => {
		if (helpers.isIOS()) {
			return <KeyboardSpacer key="keyboardSpacer" />;
		}
	};

	render() {
		const {
			selectedFacetResponses,
		} = this.props;
		return (
			<View style={componentStyles.container}>
				<ScrollView
					ref={(node) => {
						this.scrollView = node;
					}}
					scrollsToTop={true}
					onScroll={this.onScroll}
					onContentSizeChange={this.onContentSizeChange}
					automaticallyAdjustContentInsets={false}
					accessibilityLabel="Facets"
				>
					{this.props.facets.map((facetGroup, index) => this.renderFacetGroup(facetGroup, selectedFacetResponses, index))}
				</ScrollView>
				{this.renderKeyboardSpacer()}
				{this.renderLoading()}
			</View>
		);
	}
}

FacetList.route = {
	navigationBar: {
		visible: true,
		// eslint-disable-next-line react/prop-types
		renderTitle: ({ params }) => {
			let subTitle = '';
			if (typeof params.numFound === 'number') {
				subTitle = `${pluralize('Result', params.numFound, true)}, ${pluralize('Filter', params.numSelectedFacets || 0, true)} Selected`;
			}
			return (
				<NavigationBarTitle
					title="Filter Results"
					subTitle={subTitle}
				/>
			);
		},
		// eslint-disable-next-line react/prop-types
		renderRight: ({ params }) => {
			return (
				<NavigationBarTextButton
					onPress={() => params.instance.handleDonePress()}
				>
					Done
				</NavigationBarTextButton>
			);
		},
		// eslint-disable-next-line react/prop-types
		renderLeft: ({ params }) => <NavigationBarTextButton onPress={() => params.instance.clearFacets()}>Clear</NavigationBarTextButton>,
	},
};

FacetList.propTypes = {
	navigator: PropTypes.shape({
		pop: PropTypes.func,
		updateCurrentRouteParams: PropTypes.func,
	}),
	facets: PropTypes.array,
	actions: PropTypes.object,
	selectedFacets: PropTypes.object,
	searchCriteria: PropTypes.object.isRequired,
	isLoading: PropTypes.bool,
	numFound: PropTypes.number,
	numSelectedFacets: PropTypes.number,
	onDoneButtonPress: PropTypes.func,
	selectedFacetResponses: PropTypes.array,
};

FacetList.childContextTypes = {
	actions: PropTypes.object,
};

const mapStateToProps = (state, ownProps) => {
	let search;
	const { categoryId, keyword } = ownProps.searchCriteria;
	if (categoryId) {
		search = state.searchReducer.categorySearches[categoryId];
	} else if (keyword) {
		search = state.searchReducer.keywordSearches[keyword];
	}
	return {
		facets: search ? search.facets : [],
		selectedFacets: search ? search.selectedFacets : {},
		isLoading: state.searchReducer.isLoading,
		numFound: search ? search.numFound : 0,
		numSelectedFacets: search ? search.numSelectedFacets : 0,
		selectedFacetResponses: search ? search.selectedFacetResponses : [],
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			clearFacets,
			updateSelectedFacets,
			searchByKeyword,
		}, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(withScreen(FacetList));
