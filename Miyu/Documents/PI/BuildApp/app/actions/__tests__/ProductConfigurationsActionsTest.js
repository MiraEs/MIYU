
const dispatch = jest.fn();
const getState = jest.fn(() => ({
	productsReducer: {
		1234: {},
	},
}));
jest.mock('redux-actions');
jest.mock('../../../app/actions/ProductsActions', () => ({
	getProductCompositeSuccess: jest.fn(),
}));

jest.mock('../../../app/services/productService', () => ({
	getProductCompositeById: jest.fn(() => ({
		then: jest.fn(() => ({})),
	})),
	getProductCompositeByUniqueId: jest.fn(() => ({
		then: jest.fn(),
	})),
}));
import productService from '../../services/productService';

import productConfigurationsActions from '../ProductConfigurationsActions';

describe('ProductConfigurationsActions', () => {

	const uniqueId = 4321;
	const compositeId = 1234;
	const productConfigurationId = 'u-u-i-d';

	beforeEach(() => {
		dispatch.mockClear();
		productService.getProductCompositeById.mockClear();
		productService.getProductCompositeByUniqueId.mockClear();
	});

	it('should handle createProductConfiguration when we already have a composite', () => {
		return productConfigurationsActions.createProductConfiguration({
			compositeId,
			productConfigurationId,
			uniqueId,
		})(dispatch, getState).then(() => {
			expect(dispatch).toBeCalledWith({
				type: 'CREATE_PRODUCT_CONFIGURATION',
				payload: {
					uniqueId,
					productConfigurationId,
					productComposite: {},
				},
			});
		});
	});

	it('should handle createProductConfiguration with compositeId when we don\'t have a composite', () => {
		const compositeId = 777;
		productConfigurationsActions.createProductConfiguration({
			uniqueId,
			productConfigurationId,
			compositeId,
		})(dispatch, getState);
		expect(productService.getProductCompositeById).toBeCalledWith({ compositeId });
		expect(productService.getProductCompositeByUniqueId).not.toBeCalled();
	});

	it('should handle createProductConfiguration with uniqueId when we don\'t have a composite', () => {
		productConfigurationsActions.createProductConfiguration({
			uniqueId,
			productConfigurationId,
		})(dispatch, getState);
		expect(productService.getProductCompositeById).not.toBeCalled();
		expect(productService.getProductCompositeByUniqueId).toBeCalledWith({ uniqueId });
	});

	it('should handle setProductConfigurationFinish', () => {
		const result = productConfigurationsActions.setProductConfigurationFinish({});
		expect(result).toEqual({
			type: 'SET_PRODUCT_CONFIGURATION_FINISH',
			payload: {},
		});
	});

});
