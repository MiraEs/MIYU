'use strict';

import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	StyleSheet,
	View,
	ViewPropTypes,
} from 'react-native';
import { Text } from 'build-library';
import {
	TouchableOpacity,
} from 'BuildLibrary';
import {
	measurements,
	elements,
} from '../../lib/styles';
import TrackingActions from '../../lib/analytics/TrackingActions';
import { HIT_SLOP } from '../../constants/constants';
import { withNavigation } from '@expo/ex-navigation';

const componentStyles = StyleSheet.create({
	container: {
		marginBottom: measurements.gridSpace1,
		paddingHorizontal: measurements.gridSpace1,
		paddingVertical: measurements.gridSpace2,
	},
	arrowIcon: {
		justifyContent: 'center',
		marginHorizontal: measurements.gridSpace1,
	},
	freeShipping: {
		paddingBottom: measurements.gridSpace1,
	},
	title: {
		marginBottom: measurements.gridSpace1,
	},
	leftMargin: {
		marginLeft: measurements.gridSpace1,
	},
	readMore: {
		padding: measurements.gridSpace1,
		paddingTop: measurements.gridSpace2,
		alignSelf: 'center',
		justifyContent: 'center',
	},
});

@withNavigation
class ProductShortDescription extends Component {

	renderSeriesButton() {
		const { series } = this.props;
		if (series) {
			if (this.props.onCollectionPress) {
				return (
					<TouchableOpacity
						trackAction={TrackingActions.PRODUCT_DESCRIPTION_COLLECTION}
						onPress={this.props.onCollectionPress}
						hitSlop={HIT_SLOP}
					>
						<Text>
							• <Text color="primary">{series} Collection</Text>
						</Text>
					</TouchableOpacity>
				);
			}
			return (
				<Text style={componentStyles.leftMargin}>
					• <Text>{series} Collection</Text>
				</Text>
			);
		}
	}

	renderFreeShipping() {
		if (this.props.freeShipping) {
			return (
				<Text
					style={componentStyles.freeShipping}
					weight="bold"
					color="accent"
				>
					Free Shipping!
				</Text>
			);
		}
	}

	renderValues() {
		return this.props.specifications.map((spec, index) => {
			return (
				<Text
					key={index}
					style={[componentStyles.leftMargin, elements.text]}
				>
					• {spec.attributeName}: {spec.productSpecValue.map((s) => s.value).join(', ')}
				</Text>
			);
		});
	}

	renderReadMore() {
		if (this.props.onPressReadMore) {
			return (
				<TouchableOpacity
					trackAction={TrackingActions.PRODUCT_DESCRIPTION_READ_MORE}
					onPress={this.props.onPressReadMore}
					style={componentStyles.readMore}
					hitSlop={HIT_SLOP}
				>
					<Text
						weight="bold"
						color="primary"
					>
						Read More
					</Text>
				</TouchableOpacity>
			);
		}
	}

	render() {
		return (
			<View style={[componentStyles.container, this.props.style]}>
				<Text style={[componentStyles.title, elements.text]}>{this.props.title}</Text>
				{this.renderFreeShipping()}
				{this.renderSeriesButton()}
				{this.renderValues()}
				{this.renderReadMore()}
			</View>
		);
	}

}

ProductShortDescription.propTypes = {
	onCollectionPress: PropTypes.func,
	onPressReadMore: PropTypes.func,
	series: PropTypes.string,
	specifications: PropTypes.array.isRequired,
	title: PropTypes.string.isRequired,
	style: ViewPropTypes.style,
	freeShipping: PropTypes.bool,
};

ProductShortDescription.defaultProps = {
	specifications: [],
	style: {},
};

export default ProductShortDescription;
