import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	StyleSheet,
	View,
} from 'react-native';
import { Text } from 'build-library';
import { connect } from 'react-redux';
import StarRating from 'react-native-star-rating';
import TappableListItem from '../TappableListItem';
import helpers from '../../lib/helpers';
import styles from '../../lib/styles';
import productConfigurationHelpers from '../../lib/ProductConfigurationHelpers';

const componentStyles = StyleSheet.create({
	row: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	spaceBetween: {
		justifyContent: 'space-between',
	},
	center: {
		alignItems: 'center',
	},
	reviewText: {
		fontFamily: styles.fonts.mainRegular,
		fontSize: styles.fontSize.regular,
		color: styles.colors.secondary,
		flex: 1,
	},
	reviewCount: {
		paddingLeft: styles.measurements.gridSpace1,
	},
});

export class RatingsButton extends Component {

	render() {
		const { reviewRating } = this.props;
		if (reviewRating.numReviews && reviewRating.numReviews > 0) {
			const ratingStarsAndTitle = (
				<View style={[componentStyles.row, componentStyles.spaceBetween, componentStyles.center]}>
					<Text style={componentStyles.reviewText}>Reviews</Text>
					<View style={componentStyles.row}>
						<StarRating
							disabled={true}
							maxStars={5}
							emptyStar="ios-star-outline"
							fullStar="ios-star"
							halfStar="ios-star-half"
							iconSet="Ionicons"
							rating={reviewRating.avgRating || 0}
							starColor={styles.colors.accent}
							starSize={14}
							selectedStar={helpers.noop}
						/>
						<Text
							size="small"
							lineHeight={Text.sizes.small}
							style={componentStyles.reviewCount}
						>({reviewRating.numReviews})</Text>
					</View>
				</View>
			);
			return (
				<TappableListItem
					onPress={this.props.onPress}
					title={ratingStarsAndTitle}
					accessibilityLabel="Reviews Button"
				/>
			);
		}
		return null;
	}

}

RatingsButton.propTypes = {
	reviewRating: PropTypes.object,
	onPress: PropTypes.func,
};

RatingsButton.defaultProps = {
	reviewRating: {},
};

const mapStateToProps = (state, ownProps) => {
	const productComposite = productConfigurationHelpers.getProductComposite(ownProps.productConfigurationId) || {};
	return {
		reviewRating: productComposite.reviewRating,
	};
};

export default connect(mapStateToProps)(RatingsButton);
