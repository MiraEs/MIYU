'use strict';

import {
	GET_RELATED_UPSELL_PRODUCTS,
	RESET_RELATED_UPSELL_PRODUCTS,
	SET_SELECTED_UPSELL_FINISH,
	SET_SELECTED_UPSELL_MODEL,
} from '../constants/UpsellConstants';
import uuid from 'uuid';

const initialState = {
	recommendedOptions: [],
	accessories: [],
};

function setSelectedSuggestedFinish(suggestedOption, selectedFinishName) {
	suggestedOption.productDrop = suggestedOption.productDrop ? suggestedOption.productDrop : {};
	const { finishes = [] } = suggestedOption.productDrop;

	suggestedOption.selectedFinish = finishes.find((finish) => finish.finish === selectedFinishName);
	if (!suggestedOption.selectedFinish && finishes.length) {
		suggestedOption.selectedFinish = finishes[0];
	}

	return suggestedOption;
}

const setSelectedRecommendedProductAndFinish = (recommendedOption, selectedFinishName) => {
	recommendedOption.optionProducts.map(({ productDrop }) => {
		productDrop.finishes.forEach((finish) => {
			if (finish.finish === selectedFinishName) {
				recommendedOption.selectedFinish = finish;
				recommendedOption.selectedDrop = productDrop;
			}
		});
	});

	if (!recommendedOption.selectedFinish) {
		const { productDrop } = recommendedOption.optionProducts[0];
		recommendedOption.selectedDrop = productDrop;
		recommendedOption.selectedFinish = productDrop.finishes[0];
	}
	return recommendedOption;
};

const getRelatedUpsellProducts = (state, action) => {
	const recommendedOptions = action.payload.recommendedOptions.map((option) => {
		option.id = uuid.v1();
		return setSelectedRecommendedProductAndFinish(option, action.payload.finish);
	});
	const accessories = action.payload.accessories.map((option) => {
		option.id = uuid.v1();
		return setSelectedSuggestedFinish(option, action.payload.finish);
	});
	return {
		...state,
		recommendedOptions,
		accessories,
	};
};

const setSelectedUpsellFinish = (state, { payload }) => {
	const recommendedOptions = state.recommendedOptions.map((recommendedOption) => {
		if (recommendedOption.id === payload.optionId) {
			const { finishes } = recommendedOption.selectedDrop;
			recommendedOption.selectedFinish = finishes.find(({ uniqueId }) => uniqueId === payload.uniqueId);
		}
		return recommendedOption;
	});
	const accessories = state.accessories.map((accessory) => {
		if (accessory.id === payload.optionId) {
			accessory.selectedFinish = accessory.productDrop.finishes.find((finish) => finish.uniqueId === payload.uniqueId);
		}
		return accessory;
	});
	return {
		...state,
		recommendedOptions,
		accessories,
	};
};

const setSelectedUpsellModel = (state, action) => {
	if (action.type === SET_SELECTED_UPSELL_MODEL) {
		const payload = action.payload;
		return {
			...state,
			recommendedOptions: state.recommendedOptions.map((recommendedOption) => {
				if (recommendedOption.id === payload.optionId) {
					const optionProducts = recommendedOption.optionProducts;
					const optionProduct = optionProducts.find(({ productDrop }) => productDrop.productCompositeId === payload.selectedProductCompositeId);
					recommendedOption.selectedDrop = optionProduct.productDrop;
					const finishes = optionProduct.productDrop.finishes;
					let selectedFinish = finishes.find(({ finish }) => finish === payload.finish);
					if (!selectedFinish) {
						selectedFinish = finishes[0];
					}
					recommendedOption.selectedFinish = selectedFinish;
				}
				return recommendedOption;
			}),
		};
	}
	return state;
};

/**
 * Clear out recommendedOptions
 * @return {Object} initial state
 */
const resetRelatedUpsellProducts = () => initialState;

function upsellReducer(state = initialState, action = {}) {
	switch (action.type) {

		case GET_RELATED_UPSELL_PRODUCTS:
			return getRelatedUpsellProducts(state, action);
		case RESET_RELATED_UPSELL_PRODUCTS:
			return resetRelatedUpsellProducts();
		case SET_SELECTED_UPSELL_FINISH:
			return setSelectedUpsellFinish(state, action);
		case SET_SELECTED_UPSELL_MODEL:
			return setSelectedUpsellModel(state, action);
		default:
			return state;
	}
}

export default upsellReducer;
