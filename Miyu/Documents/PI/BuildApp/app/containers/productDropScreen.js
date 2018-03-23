import {
	View,
	TouchableOpacity,
	StyleSheet,
} from 'react-native';
import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import EventEmitter from '../lib/eventEmitter';
import HeaderSearch from './HeaderSearch';
import {
	cycleViewStyle,
	searchByKeyword,
	setSortOption,
	updateSelectedFacets,
	clearFacets,
	setNullSearchResult,
} from '../actions/SearchActions';
import styles from '../lib/styles';
import {
	SEARCH_GRID,
	SORT_OPTIONS,
	SORT_TEXT,
} from '../constants/searchConstants';
import ProductDrop from '../components/ProductDrop';
import helpers from '../lib/helpers';
import LoadingView from '../components/LoadingView';
import Icon from 'react-native-vector-icons/Ionicons';
import {
	GridView,
	ListView,
	Text,
	withScreen,
} from 'BuildLibrary';
import IconBadge from '../components/IconBadge';
import tracking from '../lib/analytics/tracking';
import { historyUpsert } from '../actions/HistoryActions';

const scrollThreshold = 10000;
const controllButtonHitSlop = {
	top: styles.measurements.gridSpace2,
	bottom: styles.measurements.gridSpace2,
	left: styles.measurements.gridSpace1,
	right: styles.measurements.gridSpace1,
};

const componentStyles = StyleSheet.create({
	header: {
		backgroundColor: styles.colors.white,
		alignItems: 'center',
		flexDirection: 'row',
		paddingVertical: styles.measurements.gridSpace2,
		paddingHorizontal: styles.measurements.gridSpace1,
	},
	list: {
		backgroundColor: styles.colors.greyLight,
		flex: 1,
	},
	gridView: {
		marginRight: styles.measurements.gridSpace1,
	},
	iconBadgePosition: {
		position: 'relative',
		top: 6,
		marginLeft: 4,
	},
	filterButton: {
		flexDirection: 'row',
	},
	resultsText: {
		flex: 1,
	},
	loadingIndicator: {
		margin: styles.measurements.gridSpace1,
	},
	spacer: {
		color: styles.colors.grey,
		marginHorizontal: styles.measurements.gridSpace1,
	},
	noResultsContainer: {
		margin: styles.measurements.gridSpace1,
		padding: styles.measurements.gridSpace1,
		backgroundColor: styles.colors.white,
		flex: 1,
	},
	noResultsIcon: {
		alignSelf: 'center',
		marginTop: styles.measurements.gridSpace2,
	},
	noResultsListWrapper: {
		marginTop: styles.measurements.gridSpace2,
		flexDirection: 'row',
	},
	noResultsTopText: {
		paddingBottom: styles.measurements.gridSpace2,
	},
	bulletText: {
		flex: 1,
		marginLeft: styles.measurements.gridSpace3,
	},
});

export class ProductDrops extends Component {

	constructor(props) {
		super(props);
		this.dataSource = new ListView.DataSource({
			rowHasChanged: () => true,
		});
		this.state = {
			newSearch: true,
		};
	}

	componentDidMount() {
		const {
			actions,
			clearExistingFacets,
			image,
			searchCriteria,
			searchCriteria: {
				categoryId,
				keyword,
			},
			selectedFacets,
			title,
		} = this.props;
		if (clearExistingFacets || selectedFacets) {
			actions.clearFacets(searchCriteria);
		}

		actions.historyUpsert({
			compositeId: undefined,
			data: {
				image,
				title,
			},
			categoryId,
			keyword,
		});
	}

	componentWillReceiveProps(nextProps) {
		if (this.state && this.state.newSearch && this.props.isLoading && !nextProps.isLoading) {
			this.setState({ newSearch: false });
		}
	}

	componentWillUnmount() {
		if (this.props.nullSearchResult) {
			this.props.actions.setNullSearchResult(false);
		}
	}

	setScreenTrackingInformation() {
		return {
			name: this.props.tracking.name,
			meta: this.props.tracking.data,
		};
	}

	getDataSource = () => {
		return this.dataSource.cloneWithRows(this.props.productDrops);
	};

	search = (searchCriteria) => {
		const { actions } = this.props;
		actions.searchByKeyword({ ...searchCriteria }).done();
	};

	trackHeaderSearch = (searchCriteria) => {
		const { numFound, productDrops } = this.props;
		if (searchCriteria.keyword) {
			tracking.trackHeaderSearch(searchCriteria, numFound, Array.isArray(productDrops) ? productDrops.length : 0);
		}
	};

	loadMoreProducts = () => {
		const {
			searchCriteria,
			numFound,
			isLoading,
			productDrops,
		} = this.props;
		if (!isLoading && searchCriteria.page * searchCriteria.pageSize < numFound && productDrops && productDrops.length >= searchCriteria.pageSize) {
			searchCriteria.page += 1;
			this.search(searchCriteria);
		}
	};

	sort = (sortOption) => {
		const { actions, searchCriteria } = this.props;
		const { categoryId, keyword } = searchCriteria;
		actions.setSortOption({ categoryId, keyword, sortOption });
		searchCriteria.sortOption = sortOption;
		this.search(searchCriteria);
		if (this.list && typeof this.list.scrollTo === 'function') {
			this.list.scrollTo({ animated: false });
		}
	};

	getSortOptions = () => {
		const options = [];
		for (const option of SORT_OPTIONS) {
			options.push({
				text: SORT_TEXT[option],
				onPress: () => {
					this.sort(option);
				},
			});
		}
		return options;
	};

	sortDrops = () => {
		EventEmitter.emit('showActionSheet', {
			selections: [SORT_OPTIONS.indexOf(this.props.sortOption)],
			title: 'Sort',
			options: this.getSortOptions(),
		});
	};

	launchFacetModal = () => {
		const { searchCriteria } = this.props;
		this.props.navigation.getNavigator('root').push('facetSelection', {
			searchCriteria,
			onDoneButtonPress: this.scrollToTop,
		});
	};

	scrollToTop = ({ hasChanges }) => {
		if (this.list && typeof this.list.scrollTo === 'function' && hasChanges) {
			this.list.scrollTo({ y: 0 });
		}
	};

	renderHeader = () => {
		const { actions, numFound, numSelectedFacets } = this.props;
		if (numFound > 0) {
			return (
				<View
					accessibilityLabel="Facets Header"
					style={[componentStyles.header, styles.elements.inputGroupDivider]}
				>
					<Text
						color="grey"
						style={componentStyles.resultsText}
						accessibilityLabel="Search Results Count"
					>
						{helpers.toBigNumber(numFound)} Results
					</Text>
					<TouchableOpacity
						hitSlop={controllButtonHitSlop}
						onPress={actions.cycleViewStyle}
						accessibilityLabel="View Button"
					>
						<Text textAlign="center">View</Text>
					</TouchableOpacity>
					<Text style={componentStyles.spacer}>|</Text>
					<TouchableOpacity
						hitSlop={controllButtonHitSlop}
						onPress={this.sortDrops}
						accessibilityLabel="Sort Button"
					>
						<Text textAlign="center">Sort</Text>
					</TouchableOpacity>
					<Text style={componentStyles.spacer}>|</Text>
					<TouchableOpacity
						hitSlop={controllButtonHitSlop}
						onPress={this.launchFacetModal}
						accessibilityLabel="Filter Button"
					>
						<View style={componentStyles.filterButton}>
							<Text textAlign="center">Filter</Text>
							<IconBadge
								badgeCount={numSelectedFacets}
								style={componentStyles.iconBadgePosition}
								isHiddenWhenNoCount={true}
							/>
						</View>
					</TouchableOpacity>
				</View>
			);
		} else {
			return null;
		}
	};

	renderDrop = (productDrop) => {
		productDrop = helpers.setLowestPrice(productDrop);
		productDrop = helpers.setFirstAvailableFinish(productDrop);

		return (
			<ProductDrop
				key={productDrop.productCompositeId}
				productDrop={productDrop}
				selectedFinish={productDrop.finishes[productDrop.selectedFinishIndex]}
				viewStyle={this.props.viewStyle}
			/>
		);
	};

	renderFooter = () => {
		if (this.state && !this.state.newSearch && this.props.isLoading) {
			return (
				<View style={componentStyles.loadingIndicator}>
					<LoadingView/>
				</View>
			);
		}
	};

	renderNoResults = () => {
		return (
			<View style={componentStyles.noResultsContainer}>
				<Icon
					size={90}
					name={helpers.getIcon('search')}
					color={styles.colors.grey}
					style={componentStyles.noResultsIcon}
				/>
				<Text
					textAlign="center"
					size="large"
					style={componentStyles.noResultsTopText}
					accessibilityLabel="No Results"
				>
					We're sorry, we couldn't find results for "{this.props.searchCriteria.keyword}".
				</Text>
				<Text>We want you to find exactly what you need.
					Try these helpful search tips.
				</Text>
				<View style={componentStyles.noResultsListWrapper}>
					<Text>&bull;</Text><Text style={componentStyles.bulletText}>Double-check your spelling.</Text>
				</View>
				<View style={componentStyles.noResultsListWrapper}>
					<Text>&bull;</Text><Text style={componentStyles.bulletText}>Use more generic search terms (e.g.
					kitchen faucets, sinks).</Text>
				</View>
			</View>
		);
	};

	renderList = () => {
		if (this.state && this.state.newSearch) {
			return <LoadingView backgroundColor={styles.colors.greyLight}/>;
		}

		const hasProductDrops = this.props.productDrops && !this.props.productDrops.length;
		if (this.state && !this.state.newSearch && !this.props.isLoading && hasProductDrops) {
			if (!this.props.nullSearchResult) {
				this.props.actions.setNullSearchResult(true);
			}
			return this.renderNoResults();
		}
		if (this.props.viewStyle === SEARCH_GRID) {
			return (
				<GridView
					ref={(ref) => this.list = ref}
					items={this.props.productDrops}
					itemsPerRow={2}
					renderItem={this.renderDrop}
					style={componentStyles.gridView}
					onEndReached={this.loadMoreProducts}
					onEndReachedThreshold={scrollThreshold}
					scrollsToTop={true}
				/>
			);
		}
		return (
			<ListView
				ref={(ref) => this.list = ref}
				automaticallyAdjustContentInsets={false}
				removeClippedSubviews={helpers.isAndroid()}
				enableEmptySections={true}
				dataSource={this.getDataSource()}
				renderRow={this.renderDrop}
				onEndReached={this.loadMoreProducts}
				onEndReachedThreshold={scrollThreshold}
				renderFooter={this.renderFooter}
				scrollsToTop={true}
				accessibilityLabel="Products"
			/>
		);
	};

	getScreenData = () => {
		const { actions, searchCriteria, selectedFacets, sortOption } = this.props;
		actions.searchByKeyword({
			...searchCriteria,
			sortOption,
		})
		.then(() => {
			if (selectedFacets) {
				selectedFacets.forEach((facet) => {
					actions.updateSelectedFacets({
						...facet,
						status: 'selected',
						categoryId: searchCriteria.categoryId,
					});
				});
				actions.searchByKeyword({
					...searchCriteria,
				});
			}
		})
		.then(() => this.trackHeaderSearch(searchCriteria)).done();
	};

	render() {
		return (
			<View style={styles.elements.screenWithHeader}>
				{this.renderHeader()}
				<View style={componentStyles.list}>
					{this.renderList()}
				</View>
			</View>
		);
	}
}

ProductDrops.route = {
	navigationBar: {
		visible: true,
		title(params) {
			return params.title || 'Search Results';
		},
		renderRight(route) {
			const { keyword } = route.params.searchCriteria;
			const props = {
				searchKeyword: keyword,
				startHidden: !keyword,
				allowFullCollapse: !keyword,
			};
			return (
				<View style={styles.elements.header}>
					<HeaderSearch {...props} />
				</View>
			);
		},
	},
};

ProductDrops.propTypes = {
	clearExistingFacets: PropTypes.bool,
	navigator: PropTypes.object,
	navigation: PropTypes.shape({
		getNavigator: PropTypes.func,
	}),
	actions: PropTypes.object.isRequired,
	productDrops: PropTypes.array,
	image: PropTypes.string,
	isLoading: PropTypes.bool,
	numFound: PropTypes.number,
	numSelectedFacets: PropTypes.number,
	nullSearchResult: PropTypes.bool,
	searchCriteria: PropTypes.object,
	selectedFacets: PropTypes.array,
	title: PropTypes.string,
	features: PropTypes.object,
	sortOption: PropTypes.string,
	viewStyle: PropTypes.string,
	refresh: PropTypes.bool,
	tracking: PropTypes.shape({
		name: PropTypes.string,
		data: PropTypes.object,
	}),
};

ProductDrops.defaultProps = {
	productDrops: [],
	facets: [],
	numFound: 0,
	numSelectedFacets: 0,
	searchCriteria: {
		keyword: 'faucet',
		page: 1,
		pageSize: 50,
	},
	sortOption: 'SCORE',
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
		features: state.featuresReducer.features,
		productDrops: search ? search.productDrops : [],
		isLoading: state.searchReducer.isLoading,
		numFound: search ? search.numFound : 0,
		sortOption: search ? search.sortOption : 'SCORE',
		numSelectedFacets: search ? search.numSelectedFacets : 0,
		viewStyle: state.searchReducer.viewStyle,
		refresh: state.errorReducer.refresh,
		nullSearchResult: state.searchReducer.nullSearchResult,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			clearFacets,
			cycleViewStyle,
			historyUpsert,
			searchByKeyword,
			setSortOption,
			updateSelectedFacets,
			setNullSearchResult,
		}, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(withScreen(ProductDrops));
