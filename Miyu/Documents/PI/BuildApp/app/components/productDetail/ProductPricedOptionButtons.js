import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import { Keyboard } from 'react-native';
import { withNavigation } from '@expo/ex-navigation';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import productConfigurationHelpers from '../../lib/ProductConfigurationHelpers';
import ProductConfigurationButton from './ProductConfigurationButton';
import { RADIO_OPTION } from '../../constants/productDetailConstants';
import productConfigurationsActions from '../../actions/ProductConfigurationsActions';

export class ProductPricedOptionButtons extends Component {

	componentDidMount() {
		const { compositeId, pricedOptionGroups = [], selectedPricedOptions, productConfigurationId, actions } = this.props;
		pricedOptionGroups.forEach((pricedOptionGroup) => {
			const pricedOption = pricedOptionGroup.pricedOptions.find(({ defaultSelection, inputType }) => inputType.toUpperCase() === RADIO_OPTION && defaultSelection);
			const selectedOptionForGroup = selectedPricedOptions.find(({ optionName }) => optionName === pricedOptionGroup.optionName);
			if (pricedOption && !selectedOptionForGroup) {
				// if there is a radio option which has a defaultSelection
				// and there is no selected option in the group
				actions.setProductConfigurationPricedOption({
					pricedOptionId: pricedOption.pricedOptionId,
					keyCode: pricedOption.text,
					name: pricedOption.value,
					optionName: pricedOptionGroup.optionName,
					productConfigurationId,
					compositeId,
				});
			}
		});
	}

	onPressConfigureButton = () => {
		const { navigation, productConfigurationId } = this.props;
		Keyboard.dismiss();
		navigation.getNavigator('root').push('productPricedOptions', {
			productConfigurationId,
		});
	};

	render() {
		const { pricedOptionGroups, selectedPricedOptions } = this.props;
		if (pricedOptionGroups.length) {
			const options = pricedOptionGroups.map((pricedOption) => {
				const selected = selectedPricedOptions.find((option) => {
					if (!option) {
						return false;
					}
					return option.optionName === pricedOption.optionName;
				});
				const name = selected && selected.name ? selected.name : '';
				return {
					name: pricedOption.optionName,
					value: name,
				};
			});
			return (
				<ProductConfigurationButton
					onPress={this.onPressConfigureButton}
					label="Configure"
					options={options}
				/>
			);
		}
		return null;
	}

}

ProductPricedOptionButtons.propTypes = {
	actions: PropTypes.object,
	navigation: PropTypes.shape({
		getNavigator: PropTypes.func,
	}),
	compositeId: PropTypes.number,
	productConfigurationId: PropTypes.string,
	pricedOptionGroups: PropTypes.array,
	selectedPricedOptions: PropTypes.array,
};

ProductPricedOptionButtons.defaultProps = {};

export const mapStateToProps = (state, ownProps) => {
	const productComposite = productConfigurationHelpers.getProductComposite(ownProps.productConfigurationId) || {};
	const productConfiguration = productConfigurationHelpers.getProductConfiguration(ownProps.productConfigurationId) || {};
	return {
		pricedOptionGroups: productComposite.pricedOptionGroups,
		compositeId: productComposite.productCompositeId,
		selectedPricedOptions: productConfiguration.selectedPricedOptions,
	};
};

export const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			setProductConfigurationPricedOption: productConfigurationsActions.setProductConfigurationPricedOption,
		}, dispatch),
	};
};


export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(ProductPricedOptionButtons));
