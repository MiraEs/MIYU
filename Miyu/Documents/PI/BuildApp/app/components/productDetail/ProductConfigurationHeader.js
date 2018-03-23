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
import productHelpers from '../../lib/productHelpers';
import styles from '../../lib/styles';
import helpers from '../../lib/helpers';

const componentStyles = StyleSheet.create({
	row: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	titleSection: {
		padding: styles.measurements.gridSpace1,
		height: 77,
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
	manufacturerSku: {
		flexShrink: 1,
	},
	cost: {
		flexGrow: 1,
	},
});

export class ProductConfigurationHeader extends Component {

	getSku = () => {
		if (this.props.hasSelectedFinish) {
			return this.props.selectedSku;
		}
		return this.props.productComposite.productId;
	};

	getCostText = () => {
		if (!this.props.hasSelectedFinish) {
			const prices = this.props.productComposite.finishes.map((finish) => finish.pricebookCostView.cost);
			const minCost = Math.min(...prices);
			const maxCost = Math.max(...prices);
			return `${helpers.toUSD(minCost)} - ${helpers.toUSD(maxCost)}`;
		}
		const cost = productHelpers.getConfiguredPrice(this.props.productConfigurationId);
		return helpers.toUSD(cost);
	};

	renderStockCount = () => {
		if (this.props.hasSelectedFinish) {
			return (
				<Text
					weight="bold"
					color="accent"
					size="small"
				>
					{this.props.stockText}
				</Text>
			);
		}
	};

	render() {
		if (!this.props.productConfiguration) {
			return null;
		}
		return (
			<View style={componentStyles.titleSection}>
				<View style={componentStyles.row}>
					<Text
						weight="bold"
						numberOfLines={1}
						style={componentStyles.manufacturerSku}
					>
						{this.props.manufacturer} {this.getSku()}
					</Text>
					<Text
						color="primary"
						weight="bold"
						textAlign="right"
						style={componentStyles.cost}
					>
						{this.getCostText()}
					</Text>
				</View>
				{this.renderStockCount()}
				<Text size="small">{this.props.hasSelectedFinish ? this.props.selectedLeadTimeText : 'Availability based on selected finish'}</Text>
			</View>
		);
	}

}

ProductConfigurationHeader.propTypes = {
	manufacturer: PropTypes.string,
	hasSelectedFinish: PropTypes.bool,
	selectedLeadTimeText: PropTypes.string,
	stockText: PropTypes.string,
	selectedSku: PropTypes.string,
	productComposite: PropTypes.object,
	productConfiguration: PropTypes.object,
	productConfigurationId: PropTypes.string,
};

ProductConfigurationHeader.defaultProps = {};

export const mapStateToProps = (state, ownProps) => {
	const { productConfigurationId } = ownProps;
	const productConfiguration = state.productConfigurationsReducer[productConfigurationId];
	if (!productConfiguration) {
		return {
			productConfiguration,
		};
	}
	const {
		selectedFinish,
		compositeId,
	} = productConfiguration;
	const product = state.productsReducer[compositeId];
	return {
		manufacturer: product.manufacturer,
		selectedSku: selectedFinish.sku,
		stockText: productHelpers.getStockText(selectedFinish, selectedFinish.leadTimeInformation),
		productComposite: product,
		selectedLeadTimeText: selectedFinish.leadTimeText,
		productConfiguration,
		compositeId,
	};
};

export default connect(mapStateToProps)(ProductConfigurationHeader);
