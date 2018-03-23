jest.unmock('../../../app/actions/UpsellActions');

import UpsellActions from '../UpsellActions';
import {
	GET_RELATED_UPSELL_PRODUCTS,
	SET_SELECTED_UPSELL_FINISH,
	SET_SELECTED_UPSELL_MODEL,
} from '../../constants/UpsellConstants';

const dispatch = jest.fn();
const getState = jest.fn(() => ({
	productsReducer: {
		1234: {
			recommendedOptions: {},
			accessories: {},
		},
	},
	productConfigurationsReducer: {
		'u-u-i-d': {
			selectedFinish: {
				finish: '',
			},
		},
	},
}));

describe('UpsellActions', () => {

	describe('setSelectedFinish', () => {
		it('should return object with matching props', () => {
			const result = UpsellActions.setSelectedFinish();
			expect(result.type).toEqual(SET_SELECTED_UPSELL_FINISH);
		});
	});

	describe('getSelectedModel', () => {
		it('should return object with matching props', () => {
			const result = UpsellActions.getSelectedModel();
			expect(result.type).toEqual(SET_SELECTED_UPSELL_MODEL);
		});
	});

	describe('getRelatedUpsellProducts', () => {
		const compositeId = 1234;
		const productConfigurationId = 'u-u-i-d';
		const selectedFinish = {
			finish: '',
		};
		const { recommendedOptions, accessories } = getState().productsReducer[1234];

		it('should use provided selectedFinish', () => {
			UpsellActions.getRelatedUpsellProducts(compositeId, selectedFinish, productConfigurationId)(dispatch, getState);
			expect(dispatch).toBeCalledWith({
				type: GET_RELATED_UPSELL_PRODUCTS,
				payload: {
					recommendedOptions,
					accessories,
					finish: '',
				},
			});
		});

		it('should use selected finish from product in productDetailReducer', () => {
			UpsellActions.getRelatedUpsellProducts(compositeId, null, productConfigurationId)(dispatch, getState);
			expect(dispatch).toBeCalledWith({
				type: GET_RELATED_UPSELL_PRODUCTS,
				payload: {
					recommendedOptions,
					accessories,
					finish: '',
				},
			});
		});
	});
});
