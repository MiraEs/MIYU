'use strict';

import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	StyleSheet,
	TouchableHighlight,
	View,
} from 'react-native';
import {
	Text,
	Image,
} from 'BuildLibrary';
import {
	toUSD,
	getCloudinaryImageUrl,
} from '../lib/helpers';
import {
	PRODUCT_SECTION,
	IMAGE_100,
} from '../constants/CloudinaryConstants';
import {
	colors,
	dimensions,
	measurements,
} from '../lib/styles';

const componentStyles = StyleSheet.create({
	row: {
		flexDirection: 'row',
		padding: measurements.gridSpace1,
	},
	column: {
		flexDirection: 'column',
	},
	image: {
		height: 80,
		width: 80,
		marginRight: measurements.gridSpace1,
	},
	swatch: {
		width: 80,
		height: measurements.gridSpace2,
	},
	textContainer: {
		flex: 1,
	},
	background: {
		backgroundColor: colors.white,
		marginBottom: measurements.gridSpace1,
	},
	selectedBorder: {
		borderWidth: dimensions.borderWidthLarge,
		borderColor: colors.accent,
	},
});

class FinishDetail extends Component {

	renderShippingEstimate = () => {
		const { leadTimeInformation } = this.props;
		if (leadTimeInformation && leadTimeInformation.estimatedShippingDate) {
			return <Text>{leadTimeInformation.text}</Text>;
		}
		return null;
	};

	getCost = () => {
		const { pricebookCostView, cost } = this.props;
		if (pricebookCostView) {
			return toUSD(pricebookCostView.cost);
		}
		return toUSD(cost);
	};

	getStyle = () => {
		const styles = [componentStyles.row, componentStyles.background];
		if (this.props.isSelected) {
			styles.push(componentStyles.selectedBorder);
		}
		return styles;
	};

	getSwatchStyle = () => {
		if (this.props.hexValue || this.props.finishSwatch) {
			const hexValue = this.props.hexValue ? this.props.hexValue : this.props.finishSwatch.hexValue;
			if (this.validHexValue(hexValue)) {
				const color = `#${hexValue}`;
				return [componentStyles.swatch, { backgroundColor: color }];
			}
		}
	};

	/**
	 * Valid Hex Values: #f0f, #f0fc, #ff00ff
	 * Else RN will throw warnings and the color won't show
	 * This occurred when color white showed up with 5 Fs in data
	 */
	validHexValue = (hexValue) => {
		const length = hexValue.length;
		return length === 3 || length === 4 || length === 6;
	};

	renderColorSwatch = () => {
		const swatchStyle = this.getSwatchStyle();
		if (swatchStyle) {
			return (
				<View style={swatchStyle}/>
			);
		}
	};

	render() {
		const { uniqueId, image, finish, manufacturer, onPress } = this.props,
			imageUrl = getCloudinaryImageUrl({
				...IMAGE_100,
				section: PRODUCT_SECTION,
				name: `${manufacturer}/${image}`,
			});

		return (
			<TouchableHighlight
				onPress={() => onPress(uniqueId)}
				underlayColor="rgba(0, 0, 0, .1)"
			>
				<View
					style={this.getStyle()}
				>
					<View style={componentStyles.column}>
						<Image
							source={{ uri: imageUrl }}
							style={componentStyles.image}
						/>
						{this.renderColorSwatch()}
					</View>
					<View style={componentStyles.textContainer}>
						<Text weight="bold">{finish}</Text>
						<Text weight="bold">{this.getCost()}</Text>
						{this.renderShippingEstimate()}
					</View>
				</View>
			</TouchableHighlight>
		);
	}

}

FinishDetail.propTypes = {
	cost: PropTypes.number,
	pricebookCostView: PropTypes.shape({
		cost: PropTypes.number.isRequired,
	}),
	finish: PropTypes.string.isRequired,
	image: PropTypes.string.isRequired,
	manufacturer: PropTypes.string.isRequired,
	leadTimeInformation: PropTypes.object,
	onPress: PropTypes.func.isRequired,
	uniqueId: PropTypes.number.isRequired,
	isSelected: PropTypes.bool.isRequired,
	hexValue: PropTypes.string,
	finishSwatch: PropTypes.object,
};

FinishDetail.defaultProps = {
	isSelected: false,
};

export default FinishDetail;
