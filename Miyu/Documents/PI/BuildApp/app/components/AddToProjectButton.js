import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import { InteractionManager } from 'react-native';
import { Button } from 'BuildLibrary';
import {
	NO_THANK_YOU,
	I_DONT_NEED_THIS,
	CHECK_BOX_OPTION,
} from '../constants/productDetailConstants';
import { connect } from 'react-redux';
import { withNavigation } from '@expo/ex-navigation';
import TrackingActions from '../lib/analytics/TrackingActions';

export class AddToProjectButton extends Component {
	isOptional = (pricedOption) => {
		return (pricedOption.value.toUpperCase() === NO_THANK_YOU || pricedOption.value.toUpperCase() === I_DONT_NEED_THIS);
	};

	isOptionalPricedOptionGroup = (pricedOptionGroup) => {
		return pricedOptionGroup.pricedOptions.filter((pricedOption) =>
			this.isOptional(pricedOption) || pricedOption.inputType.toUpperCase() === CHECK_BOX_OPTION).length > 0;
	};

	getAddToProjectTrackingContextData = () => {
		if (this.props.productConfigurationId) {
			const {
				productComposite: {
					manufacturer,
					productId,
					rootCategory,
				},
				selectedFinish: {
					finish,
					sku,
					uniqueId,
					pricebookCostView: {
						cost,
					},
				},
				quantity,
			} = this.props;
			return {
				manufacturer,
				productId,
				finish,
				sku,
				uniqueId,
				cost,
				quantity,
				categoryId: rootCategory.categoryId,
				categoryName: rootCategory.categoryName,
			};
		}
		return {
			sessionCartId: this.props.sessionCartId,
		};
	};

	onAddToProjectSuccess = ({ selectedSessionCartIDs }) => {
		const {
			productComposite: {
				accessories,
				compositeId,
				recommendedOptions,
			} = {},
			productConfigurationId,
			quantity,
			selectedFinish = {},
		} = this.props;

		if (recommendedOptions && recommendedOptions.length || accessories && accessories.length) {
			InteractionManager.runAfterInteractions(() => {
				this.props.navigation.getNavigator('root').push('addToProjectUpsell', {
					addedProductQuantity: quantity,
					finish: selectedFinish,
					parentKey: selectedFinish.uniqueId,
					recommendedOptions,
					compositeId,
					accessories,
					productConfigurationId,
					selectedSessionCartIDs,
				});
			});
		}
	}

	openAddToProjectModal = () => {
		const { productConfigurationId, quantity, sessionCartId } = this.props;
		if (productConfigurationId) {
			this.props.navigation.getNavigator('root').push('addToProjectModal', {
				itemToAdd: {
					productConfigurationId,
					quantity,
				},
				onSuccess: this.onAddToProjectSuccess,
			});
		} else {
			this.props.navigation.getNavigator('root').push('addToProjectModal', {
				onSuccess: this.onAddToProjectSuccess,
				sessionCartId,
			});
		}
	};

	validate = () => {
		if (!this.props.isLoggedIn) {
			this.props.navigation.getNavigator('root').push('loginModal', {
				loginSuccess: () => {
					this.props.navigation.getNavigator('root').pop();
					this.validate();
				},
			});
			return;
		}

		const {
			productComposite,
			productConfigurationId,
			onSquareFootageBased,
			onHasOptionGroups,
			validateAvailability,
			selectedPricedOptions,
		} = this.props;

		if (productConfigurationId && validateAvailability && validateAvailability()) {
			if (productComposite.squareFootageBased && this.props.quantity === 0) {
				onSquareFootageBased();
			} else if (productComposite.pricedOptionGroups.length) {
				const { pricedOptionGroups } = productComposite;
				const requiredPricedOptionGroups = pricedOptionGroups
					.filter((optionGroup) => !this.isOptionalPricedOptionGroup(optionGroup));
				const optionalPricedOptionGroupNames = pricedOptionGroups
					.filter((optionGroup) => this.isOptionalPricedOptionGroup(optionGroup))
					.map((optionGroup) => optionGroup.optionName);
				const requiredSelectedOptions = selectedPricedOptions.filter((option) => option.pricedOptions.length)
					.map((option) => option.optionName)
					.filter((optionName) => !optionalPricedOptionGroupNames.includes(optionName));
				if (requiredSelectedOptions.length === requiredPricedOptionGroups.length) {
					return this.openAddToProjectModal();
				}
				onHasOptionGroups(requiredSelectedOptions);
			} else {
				this.openAddToProjectModal();
			}
		} else {
			this.openAddToProjectModal();
		}
	};

	render() {
		return (
			<Button
				onPress={this.validate}
				text="Add To Project"
				accessibilityLabel="Add To Project"
				trackAction={TrackingActions.PDP_ADD_TO_PROJECT}
				trackContextData={this.getAddToProjectTrackingContextData}
				color="white"
				textColor="secondary"
			/>
		);
	}

}

AddToProjectButton.propTypes = {
	isLoggedIn: PropTypes.bool,
	navigation: PropTypes.shape({
		getNavigator: PropTypes.func,
	}),
	onHasOptionGroups: PropTypes.func,
	onSquareFootageBased: PropTypes.func,
	productConfigurationId: PropTypes.string,
	productComposite: PropTypes.object,
	quantity: PropTypes.number,
	selectedFinish: PropTypes.object,
	selectedPricedOptions: PropTypes.array,
	sessionCartId: PropTypes.number,
	validateAvailability: PropTypes.func,
};

const mapStateToProps = function (state, ownProps) {
	if (ownProps.productConfigurationId) {
		const {
			compositeId,
			selectedFinish,
			selectedPricedOptions,
		} = state.productConfigurationsReducer[ownProps.productConfigurationId];
		return {
			isLoggedIn: state.userReducer.isLoggedIn,
			itemAddedToProject: state.projectsReducer.itemAddedToProject,
			productComposite: state.productsReducer[compositeId],
			selectedFinish,
			selectedPricedOptions,
		};
	}
	return {
		isLoggedIn: state.userReducer.isLoggedIn,
		itemAddedToProject: state.projectsReducer.itemAddedToProject,
	};
};

export default withNavigation(connect(mapStateToProps, null)(AddToProjectButton));
