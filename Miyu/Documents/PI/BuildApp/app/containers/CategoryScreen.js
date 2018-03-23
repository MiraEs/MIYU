import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	InteractionManager,
	StyleSheet,
	View,
} from 'react-native';
import {
	ListView,
	withScreen,
} from 'BuildLibrary';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getCategory } from '../actions/CategoryActions';
import { getSharedPromos } from '../actions/ContentActions';
import {
	CATEGORY_SECTION,
	IMAGE_42,
} from '../constants/CloudinaryConstants';
import helpers from '../lib/helpers';
import HeaderSearch from './HeaderSearch';
import TappableListItem from '../components/TappableListItem';
import ListHeader from '../components/listHeader';
import TemplateComponent from '../content/TemplateComponent';
import styles from '../lib/styles';
import { trackState } from '../actions/AnalyticsActions';
import tracking from '../lib/analytics/tracking';
import CustomDimensions from '../lib/analytics/CustomDimensions';

const componentStyles = StyleSheet.create({
	background: {
		backgroundColor: styles.colors.greyLight,
	},
});

export class CategoryScreen extends Component {

	constructor(props) {
		super(props);
		this.hasRedirected = false;
		this.state = {
			dataSource: new ListView.DataSource({
				rowHasChanged: () => true,
				sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
			}).cloneWithRowsAndSections(this.getListData(props)),
		};
	}

	componentWillReceiveProps(props) {
		const { category, clearExistingFacets } = props;
		if (!this.props.category && category) {
			tracking.setCustomDimension(CustomDimensions.CATEGORY_ID, category.id);
			this.props.actions.trackState(`build:app:category:${category.name}:${category.id}`);
		}
		if (category !== this.props.category) {
			tracking.setCustomDimension(CustomDimensions.CATEGORY_ID, category.id);
			this.setState({
				dataSource: this.state.dataSource.cloneWithRowsAndSections(this.getListData(props)),
			});
		}
		if (category && category.hasProducts && !this.hasRedirected) {
			this.hasRedirected = true;
			const categoryId = category.id;
			let selectedFacets = [];
			if (this.props.category && this.props.category.selectedFacets) {
				selectedFacets = this.props.category.selectedFacets;
			} else if (props.selectedFacets) {
				// facets can be passed into the category screen from deep linking route that matches a category URL
				selectedFacets = props.selectedFacets;
			}
			InteractionManager.runAfterInteractions(() => {
				this.props.navigator.replace('productDrops', {
					searchCriteria: {
						page: 1,
						pageSize: 25,
						categoryId,
					},
					tracking: {
						name: this.getNextCategoryTrackState(category),
						data: {
							categoryId,
						},
					},
					title: category.name,
					selectedFacets,
					clearExistingFacets,
				});
			});
		}
	}

	setScreenTrackingInformation() {
		return (props) => {

			if (props && props.category) {
				return {
					name: `build:app:category:${props.category.name}:${props.category.id}`,
				};
			}
		};
	}

	/**
	 * Get category data for the given category ID
	 */
	getScreenData = () => {
		const { actions, categoryId, category } = this.props;
		actions.getSharedPromos(categoryId);
		actions.getCategory(category || { id: categoryId });
	};

	getNextCategoryTrackState = (category) => {
		return `build:app:category:searchresults:${category.name}:${category.id}`;
	};

	categoryTap = (category) => {
		if (category.link) {
			if (/\d+$/.test(category.link)) {
				let id = category.link.match(/\d+$/);
				if (Array.isArray(id) && id.length) {
					id = helpers.toInteger(id[0]);
				}
				this.props.navigator.push('category', {
					categoryId: id,
				});
			}
		} else if (category.hasProducts) {
			const categoryId = category.id;
			this.props.navigator.push('productDrops', {
				searchCriteria: {
					categoryId,
					page: 1,
					pageSize: 50,
				},
				image: category.image,
				title: category.name,
				tracking: {
					name: this.getNextCategoryTrackState(category),
					data: {
						categoryId,
					},
				},
			});
		} else {
			this.props.navigator.push('category', {
				categoryId: category.id,
			});
		}
	};

	getListData = (props) => {
		const { category, isLoading } = props;
		const { featuredCategories, nonFeaturedCategories } = category || {};
		let subCatData = {};
		if (!isLoading && featuredCategories && featuredCategories.length) {
			if (nonFeaturedCategories && nonFeaturedCategories.length) {
				subCatData = { 'featured': category.featuredCategories, 'extra': nonFeaturedCategories };
			} else {
				subCatData = { 'featured': category.featuredCategories };
			}
		} else if (!isLoading && nonFeaturedCategories) {
			subCatData = { 'only': nonFeaturedCategories };
		}
		return subCatData;
	};

	renderSharedPromos = () => {
		if (this.props.sharedPromos && this.props.sharedPromos.length) {
			return <TemplateComponent contentItem={this.props.sharedPromos[0]}/>;
		}
		return <View />;
	};

	renderCategory = (category, sectionID) => {
		const imageUrl = helpers.getCloudinaryImageUrl({
			...IMAGE_42,
			section: CATEGORY_SECTION,
			name: category.image,
		});
		return (
			<TappableListItem
				onPress={() => this.categoryTap(category)}
				image={category.image && sectionID === 'featured' ? { uri: imageUrl } : null}
				body={category.name}
				accessibilityLabel={category.name}
			/>
		);
	};

	renderSectionHeader = (data, sectionId) => {
		const catName = this.props.category.name.toUpperCase();
		return <ListHeader text={sectionId === 'featured' || sectionId === 'only' ? catName : `SHOP MORE ${catName}`}/>;
	};

	render() {
		return (
			<ListView
				style={componentStyles.background}
				automaticallyAdjustContentInsets={false}
				dataSource={this.state.dataSource}
				enableEmptySections={true}
				renderRow={this.renderCategory}
				renderHeader={this.renderSharedPromos}
				renderSectionHeader={this.renderSectionHeader}
				scrollsToTop={true}
				accessibilityLabel="Subcategories"
			/>
		);
	}
}

CategoryScreen.route = {
	navigationBar: {
		renderRight() {
			return (
				<View style={styles.elements.header}>
					<HeaderSearch startHidden={true}/>
				</View>
			);
		},
	},
};

CategoryScreen.propTypes = {
	category: PropTypes.object,
	categoryId: PropTypes.number.isRequired,
	isLoading: PropTypes.bool,
	actions: PropTypes.object,
	refresh: PropTypes.bool,
	navigator: PropTypes.shape({
		push: PropTypes.func,
		replace: PropTypes.func,
	}),
	sharedPromos: PropTypes.array,
	clearExistingFacets: PropTypes.bool,
};

export default connect((state, ownProps) => {
	if (!state.categoryReducer.categories.hasOwnProperty(ownProps.categoryId)) {
		return {
			loading: true,
			refresh: state.errorReducer.refresh,
		};
	}
	const category = state.categoryReducer.categories[ownProps.categoryId] || ownProps.category;
	return {
		category,
		// we keep the loading screen visible if the category has products because we are
		// waiting for the redirect to the product drops page
		loading: state.categoryReducer.categories[ownProps.categoryId].hasProducts,
		refresh: state.errorReducer.refresh,
		sharedPromos: state.contentReducer.sharedPromos[ownProps.categoryId],
	};
}, (dispatch) => {
	return {
		actions: bindActionCreators({
			getCategory,
			getSharedPromos,
			trackState,
		}, dispatch),
	};
})(withScreen(CategoryScreen));
