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
} from 'react-native';
import { ListView } from 'BuildLibrary';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {
	getProductReviews,
	clearReviews,
} from '../actions/ProductDetailActions';
import ProductReview from '../components/productDetail/ProductReview';
import styles from '../lib/styles';
import EventEmitter from '../lib/eventEmitter';
import {
	REVIEW_SORT_OPTIONS,
	REVIEW_SORT_TEXT,
	REVIEW_SORT_CRITERIA,
} from '../constants/productDetailConstants';
import LoadingView from '../components/LoadingView';
import Button from '../components/button';
import TrackingActions from '../lib/analytics/TrackingActions';
import { trackState } from '../actions/AnalyticsActions';

const componentStyles = StyleSheet.create({

	separator: {
		height: styles.dimensions.borderWidth,
		backgroundColor: styles.colors.grey,
	},
	reviewHeader: {
		backgroundColor: 'white',
		borderBottomWidth: styles.dimensions.borderWidth,
		borderColor: styles.colors.grey,
		flexDirection: 'row',
		justifyContent: 'space-between',
		padding: styles.measurements.gridSpace1,
		height: 44,
		alignItems: 'center',
	},
	pad: {
		padding: styles.measurements.gridSpace1,
	},
	listView: {
		overflow: 'hidden',
	},
	list: {
		flex:1,
	},
});

export class ProductReviewScreen extends Component {

	constructor(props) {
		super(props);
		this.renderRow = this.renderRow.bind(this);
		this.renderHeader = this.renderHeader.bind(this);
		this.sortReviews = this.sortReviews.bind(this);
		this.getSortOptions = this.getSortOptions.bind(this);
		this.onEndReached = this.onEndReached.bind(this);
		this.sort = this.sort.bind(this);
		this.state = {
			sortOption: 'NEWEST_TO_OLDEST',
			sortCriteria: {
				page: 0,
				type: 'SubmissionTime:desc',
			},
		};
	}

	componentWillMount() {
		const { actions, compositeId } = this.props,
			{ sortCriteria } = this.state;
		actions.getProductReviews({ compositeId, ...sortCriteria });
	}

	componentDidMount() {
		this.props.actions.trackState('build:app:productreviews');
	}

	componentWillUnmount() {
		const { clearReviews } = this.props.actions;
		clearReviews();
	}

	renderRow(review) {
		return (
			<View
				style={componentStyles.pad}
			>
				<ProductReview
					reviewText={review.reviewText}
					rating={review.rating}
					ratingRange={review.ratingRange}
					title={review.title}
					nickName={review.nickName}
					date={review.date}
					syndicationSource={review.syndicationSource}
				/>
			</View>
		);
	}

	renderSeparator(sectionID, rowID) {

		return (
			<View
				key={`${sectionID}-${rowID}`}
				style={componentStyles.separator}
			/>
		);
	}

	sort(option) {
		this.state.sortOption = option;
		const { actions, compositeId } = this.props,
			{ sortCriteria } = this.state;
		sortCriteria.page = 0;
		sortCriteria.type = REVIEW_SORT_CRITERIA[option];
		this.setState({
			...this.state,
			sortCriteria,
		});

		actions.getProductReviews({
			compositeId,
			...sortCriteria,
		});

	}

	getSortOptions() {
		const options = [];
		for (const option of REVIEW_SORT_OPTIONS) {
			options.push({
				text: REVIEW_SORT_TEXT[option],
				onPress: () => {
					this.sort(option);
				},
			});
		}
		return options;
	}

	sortReviews() {
		EventEmitter.emit('showActionSheet', {
			selections: [REVIEW_SORT_OPTIONS.indexOf(this.state.sortOption)],
			title: 'Sort',
			options: this.getSortOptions(),
		});
	}

	renderHeader() {
		return (
			<View
				style={[componentStyles.reviewHeader, styles.elements.inputGroupDivider]}
			>
				<Text
					style={styles.elements.lightText}
				>
					{this.props.total} Results
				</Text>
				<TouchableHighlight
					onPress={this.sortReviews}
					opacity={0.2}
				>
					<Text
						style={styles.elements.text}
					>
						Sort
					</Text>
				</TouchableHighlight>
			</View>
		);
	}

	onEndReached() {
		const { compositeId, actions } = this.props,
			{ sortCriteria } = this.state;
		sortCriteria.page += 1;
		this.setState({
			...this.state,
			sortCriteria,
		});
		actions.getProductReviews({ compositeId, ...sortCriteria });
	}

	render() {
		const { reviews, reviewsLoadError, isNoReviews } = this.props;
		if (reviews.length === 0) {
			if (reviewsLoadError) {
				return (
					<View style={styles.elements.screenWithHeader}>
						<Text>Sorry something went wrong, would you like to refresh?</Text>
						<Button
							text="Refresh"
							onPress={() => {
								const { actions, compositeId } = this.props,
									{ sortCriteria } = this.state;
								actions.getProductReviews({ compositeId, ...sortCriteria });
							}}
							trackAction={TrackingActions.PRODUCT_REVIEW_REFRESH}
							accessibilityLabel="Refresh"
						/>
					</View>
				);
			}
			if (isNoReviews) {
				return (
					<View style={styles.elements.screenWithHeader}>
						{this.renderHeader()}
						<View
							style={componentStyles.pad}
						>
							<Text
								style={[styles.elements.lightText, styles.elements.centerAll]}
							>
								This product has no product reviews
							</Text>
						</View>
					</View>);
			}

			return <LoadingView overlay={true}/>;
		}
		const dataSource = new ListView.DataSource({
			rowHasChanged: (row1, row2) => row1 !== row2,
		}).cloneWithRows(reviews);
		return (
			<View
				style={[styles.elements.screenWithHeader]}
			>
				{this.renderHeader()}
				<View
					style={componentStyles.list}
				>
					<ListView
						automaticallyAdjustContentInsets={false}
						dataSource={dataSource}
						renderRow={this.renderRow}
						renderSeparator={this.renderSeparator}
						onEndReached={this.onEndReached}
						onEndReachedThreshold={500}
					/>
				</View>
			</View>
		);
	}

}

ProductReviewScreen.route = {
	navigationBar: {
		title: 'Product Reviews',
		visible: true,
	},
};

ProductReviewScreen.propTypes = {
	compositeId: PropTypes.number.isRequired,
	actions: PropTypes.object.isRequired,
	reviews: PropTypes.array.isRequired,
	total: PropTypes.number.isRequired,
	reviewsLoadError: PropTypes.bool.isRequired,
	isNoReviews: PropTypes.bool.isRequired,
};

export default connect((state) => {
	return {
		reviews: state.productDetailReducer.reviews || [],
		total: state.productDetailReducer.totalReviews || 0,
		reviewsLoadError: state.productDetailReducer.reviewsLoadError || false,
		isNoReviews: state.productDetailReducer.isNoReviews || false,
	};
}, (dispatch) => {
	return {
		actions: bindActionCreators({
			getProductReviews,
			clearReviews,
			trackState,
		}, dispatch),
	};
})(ProductReviewScreen);
