
import { handleActions } from 'redux-actions';
import pluralize from 'pluralize';
import productConfigurationsActions from '../actions/ProductConfigurationsActions';
import productsActions from '../actions/ProductsActions';

const {
	addProductConfigurationTextPricedOption,
	addToOrSetProductConfigurationPricedOption,
	createConfiguration,
	setProductConfigurationPricedOption,
	setProductConfigurationFinish,
	cloneProductConfiguration,
} = productConfigurationsActions;

const initialState = {};

function decorateSelectedFinish(selectedFinish) {
	if (selectedFinish) {
		selectedFinish.isLowLeadCompliant = true;
		(selectedFinish.restrictions || []).forEach((restriction) => {
			// set flag for low lead compliance
			if (restriction.policyDescription.toLowerCase().indexOf('ab1953') !== -1) {
				selectedFinish.isLowLeadCompliant = false;
			}
		});
		selectedFinish.pricebookCostView = selectedFinish.pricebookCostView || {};
		selectedFinish.pricebookCostViewsMap = selectedFinish.pricebookCostViewsMap || {};
	}
	return selectedFinish;
}

function getFinish(productComposite, uniqueId) {
	if (productComposite && productComposite.finishes && productComposite.finishes.length > 0) {
		let selectedFinish;
		if (uniqueId) {
			selectedFinish = productComposite.finishes.find((finish) => finish.uniqueId === uniqueId);
		}
		if (!selectedFinish) {
			selectedFinish = productComposite.finishes[0];
		}
		return decorateSelectedFinish(selectedFinish);
	}
}

export default handleActions({
	[cloneProductConfiguration]: (state, action) => {
		const {
			sourceId,
			destinationId,
		} = action.payload;
		const sourceConfiguration = state[sourceId];
		if (sourceConfiguration) {
			return {
				...state,
				[destinationId]: {
					...sourceConfiguration,
				},
			};
		}
		return state;
	},

	[addToOrSetProductConfigurationPricedOption]: (state, action) => {
		const {
			productConfigurationId,
			pricedOptionId,
			optionName,
			keyCode,
			name,
		} = action.payload;
		const { selectedPricedOptions } = state[productConfigurationId];
		const selectedPricedOptionNames = selectedPricedOptions.map((optionGroup) => optionGroup.optionName);
		const pricedOption = {
			pricedOptionId,
			optionName,
			keyCode,
			name,
		};
		let newSelectedPricedOptions;
		if (selectedPricedOptionNames.includes(optionName)) {
			newSelectedPricedOptions = selectedPricedOptions.map((optionGroup) => {
				if (optionGroup && optionGroup.optionName === optionName) {
					const isAlreadyIncluded = !!optionGroup.pricedOptions.find((option) => option.pricedOptionId === pricedOptionId);
					if (isAlreadyIncluded) {
						return {
							...optionGroup,
							pricedOptions: optionGroup.pricedOptions.filter((option) => option.pricedOptionId !== pricedOptionId),
							name: `${pluralize('Option', optionGroup.pricedOptions.length - 1, true)}`,
						};
					} else {
						optionGroup.pricedOptions.push(pricedOption);
						optionGroup.name = `${pluralize('Option', optionGroup.pricedOptions.length, true)}`;
					}
				}
				return optionGroup;
			});
		} else {
			newSelectedPricedOptions = [...selectedPricedOptions, {
				pricedOptions: [pricedOption],
				optionName,
				name,
			}];
		}
		return {
			...state,
			[productConfigurationId]: {
				...(state[productConfigurationId] || {}),
				selectedPricedOptions: newSelectedPricedOptions,
			},
		};
	},

	[createConfiguration]: (state, action) => {
		const {
			productConfigurationId,
			productComposite,
			uniqueId,
		} = action.payload;
		if (!productConfigurationId || !productComposite) {
			return state;
		}
		const selectedFinish = getFinish(productComposite, uniqueId);
		return {
			...state,
			[productConfigurationId]: {
				selectedFinish,
				compositeId: productComposite.productCompositeId,
				selectedPricedOptions: [],
				uniqueId: selectedFinish.uniqueId,
			},
		};
	},

	[setProductConfigurationFinish]: (state, action) => {
		const {
			productComposite,
			productConfigurationId,
			uniqueId,
		} = action.payload;
		if (!productConfigurationId || !uniqueId || !productComposite) {
			return state;
		}
		return {
			...state,
			[productConfigurationId]: {
				...state[productConfigurationId],
				selectedFinish: getFinish(productComposite, uniqueId),
				uniqueId,
			},
		};
	},

	[setProductConfigurationPricedOption]: (state, action) => {
		const {
			productConfigurationId,
			pricedOptionId,
			optionName,
			keyCode,
			name,
		} = action.payload;
		const { selectedPricedOptions } = state[productConfigurationId];
		const pricedOption = {
			pricedOptionId,
			keyCode,
			name,
			optionName,
		};
		const newSelectedPricedOptions = selectedPricedOptions.filter((optionGroup) => optionGroup && optionGroup.optionName !== optionName);
		const oldPricedOptionGroup = selectedPricedOptions.find((optionGroup) => optionGroup && optionGroup.optionName === optionName);

		let newPricedOptions = [];
		if (oldPricedOptionGroup) {
			newPricedOptions = oldPricedOptionGroup.pricedOptions.filter((option) => option && option.keyCode);
		}
		newPricedOptions.push(pricedOption);
		newSelectedPricedOptions.push({
			name,
			optionName,
			pricedOptions: newPricedOptions,
		});

		return {
			...state,
			[productConfigurationId]: {
				...state[productConfigurationId],
				selectedPricedOptions: newSelectedPricedOptions,
			},
		};
	},

	[addProductConfigurationTextPricedOption]: (state, action) => {
		const {
			keyCode,
			name,
			optionName,
			pricedOptionId,
			productConfigurationId,
		} = action.payload;
		let { selectedPricedOptions } = state[productConfigurationId];
		const selectedOptionNames = selectedPricedOptions.map((optionGroup) => optionGroup.optionName);
		const pricedOption = {
			pricedOptionId,
			optionName,
			keyCode,
			name,
		};

		if (selectedOptionNames.includes(optionName)) {
			selectedPricedOptions = selectedPricedOptions.map((optionGroup) => {
				if (optionGroup && optionGroup.optionName === optionName) {
					const isAlreadyIncluded = !!optionGroup.pricedOptions.find((option) => option.pricedOptionId === pricedOptionId);
					if (isAlreadyIncluded) {
						const newPricedOptions = optionGroup.pricedOptions.filter((option) => option.pricedOptionId !== pricedOptionId);
						newPricedOptions.push(pricedOption);
						return {
							...optionGroup,
							pricedOptions: newPricedOptions,
						};
					} else {
						optionGroup.pricedOptions = [...optionGroup.pricedOptions, pricedOption];
					}
				}
				return optionGroup;
			});
		} else {
			selectedPricedOptions = [...selectedPricedOptions, {
				pricedOptions: [pricedOption],
				optionName,
				name,
			}];
		}

		return {
			...state,
			[productConfigurationId]: {
				...state[productConfigurationId],
				selectedPricedOptions,
			},
		};
	},

	[productsActions.clearProductCache]: () => initialState,

}, initialState);
