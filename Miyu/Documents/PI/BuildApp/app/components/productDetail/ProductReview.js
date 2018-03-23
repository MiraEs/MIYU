'use strict';

import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	View,
	StyleSheet,
} from 'react-native';
import StarRating from 'react-native-star-rating';
import styles from '../../lib/styles';
import {
	Image,
	Text,
} from 'BuildLibrary';
import helpers from '../../lib/helpers';

const componentStyles = StyleSheet.create({
	starWidth: {
		width: styles.dimensions.width/4,
	},
	horizontalPadding: {
		paddingHorizontal: styles.measurements.gridSpace1,
	},
	bottomPadding: {
		paddingBottom: styles.measurements.gridSpace1,
	},
	topPadding: {
		paddingTop: styles.measurements.gridSpace1,
	},
	syndication: {
		flexDirection: 'row',
		backgroundColor: styles.colors.greyLight,
		paddingHorizontal: styles.measurements.gridSpace1,
		flexWrap: 'wrap',
	},
	padLeft: {
		paddingLeft: styles.measurements.gridSpace1,
	},
});

class ProductReview extends Component {

	renderSyndication = () => {
		const { syndicationSource } = this.props;
		if (syndicationSource) {
			return (
				<View style={componentStyles.syndication}>
					<Image
						source={syndicationSource.imageUrl}
						resizeMode="contain"
						width={50}
						height={25}
					/>
					<Text
						style={componentStyles.padLeft}
						size="small"
					>
						Posted on {syndicationSource.name}
					</Text>
				</View>
			);
		}
	};

	render() {
		const {
			rating,
			ratingRange,
			title,
			reviewText,
			nickName,
			date,
		} = this.props;
		return (
			<View
				style={[componentStyles.horizontalPadding, componentStyles.topPadding]}
			>
				<Text weight="bold">{title}</Text>
				<Text>by {nickName}</Text>
				<Text
					fontStyle="italic"
					size="small"
				>
					Written {date}
				</Text>
				<View style={[componentStyles.starWidth, componentStyles.topPadding]}>
					<StarRating
						disabled={true}
						maxStars={ratingRange}
						emptyStar="ios-star-outline"
						fullStar="ios-star"
						halfStar="ios-star-half"
						iconSet="Ionicons"
						rating={rating}
						starColor={styles.colors.accent}
						starSize={14}
						selectedStar={helpers.noop}
					/>
				</View>
				<Text style={componentStyles.bottomPadding}>{reviewText}</Text>
				{this.renderSyndication()}
			</View>
		);
	}

}

ProductReview.propTypes = {
	rating: PropTypes.number.isRequired,
	ratingRange: PropTypes.number.isRequired,
	title: PropTypes.string,
	reviewText: PropTypes.string,
	nickName: PropTypes.string,
	date: PropTypes.string.isRequired,
	syndicationSource: PropTypes.object,
};

export default ProductReview;
