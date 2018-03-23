import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import { withNavigation } from '@expo/ex-navigation';
import { connect } from 'react-redux';
import ProductConfigurationButton from './ProductConfigurationButton';
import productConfigurationHelpers from '../../lib/ProductConfigurationHelpers';

@withNavigation
export class VariationButton extends Component {

	onPressVariations = () => {
		const {
			navigation,
		} = this.props;
		navigation.getNavigator('root').push('productVariations', {
			initialProductConfigurationId: this.props.productConfigurationId,
			onPressContinue: this.props.onChangeProductConfigurationId,
		});
	};

	render() {
		const {
			variations,
			selectedFinish,
		} = this.props;
		if (Array.isArray(variations) && variations.length > 0) {
			const options = [];
			options.push({
				name: 'Finish',
				value: selectedFinish.finish,
			});
			variations.forEach((variation) => {
				const currentVariation = variation.variationProducts.find((product) => product.currentVariation);
				if (currentVariation && currentVariation.variationName) {
					options.push({
						name: variation.name,
						value: currentVariation.variationName,
					});
				}
			});

			return (
				<ProductConfigurationButton
					onPress={this.onPressVariations}
					label="Customize"
					options={options}
				/>
			);
		}
		return null;
	}

}

VariationButton.propTypes = {
	variations: PropTypes.array,
	selectedFinish: PropTypes.object,
	navigation: PropTypes.object,
	productConfigurationId: PropTypes.string.isRequired,
	onChangeProductConfigurationId: PropTypes.func,
};

VariationButton.defaultProps = {};

const mapStateToProps = (state, ownProps) => {
	const productComposite = productConfigurationHelpers.getProductComposite(ownProps.productConfigurationId) || {};
	const selectedFinish = productConfigurationHelpers.getSelectedFinish(ownProps.productConfigurationId);
	return {
		variations: productComposite.variations,
		selectedFinish,
	};
};

export default connect(mapStateToProps)(VariationButton);
