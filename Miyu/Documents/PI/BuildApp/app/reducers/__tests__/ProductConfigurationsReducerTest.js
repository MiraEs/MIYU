
jest.mock('../../actions/ProductsActions', () => ({}));
jest.mock('../../actions/ProductsActions', () => ({
	clearProductCache: 'CLEAR_PRODUCT_CACHE',
}));
import productsActions from '../../actions/ProductsActions';

import productConfigurationsReducer from '../ProductConfigurationsReducer';
jest.mock('../../actions/ProductConfigurationsActions', () => ({
	createConfiguration: 'CREATE_PRODUCT_CONFIGURATION',
	setProductConfigurationFinish: 'SET_PRODUCT_CONFIGURATION_FINISH',
	setProductConfigurationPricedOption: 'SET_PRODUCT_CONFIGURATION_PRICED_OPTION',
	addProductConfigurationTextPricedOption: 'ADD_PRODUCT_CONFIGURATION_TEXT_PRICED_OPTION',
}));
import productConfigurationsActions from '../../actions/ProductConfigurationsActions';

describe('ProductConfigurationsActions', () => {

	const productConfigurationId = 'u-u-i-d';
	const compositeId = 1234;
	const uniqueId = 4321;
	const uniqueId2 = 777;
	const productComposite = {
		productCompositeId: compositeId,
		finishes: [{
			uniqueId,
		}, {
			uniqueId: uniqueId2,
		}],
	};
	const previousState = {
		[productConfigurationId]: {
			selectedFinish: {
				uniqueId,
			},
			selectedPricedOptions: [{
				optionName: 'option name one',
				pricedOptions: [],
			}],
			compositeId,
			uniqueId,
		},
	};

	it('should have an initial state', () => {
		const result = productConfigurationsReducer(undefined, {
			type: '',
		});
		expect(result).toEqual({});
	});

	describe('createConfiguration', () => {
		it('should return new state with productConfigurationId and productComposite', () => {
			const result = productConfigurationsReducer({}, {
				type: productConfigurationsActions.createConfiguration,
				payload: {
					productConfigurationId,
					productComposite,
					uniqueId,
				},
			});
			expect(result).toEqual({
				[productConfigurationId]: {
					selectedFinish: {
						isLowLeadCompliant: true,
						pricebookCostView: {},
						pricebookCostViewsMap: {},
						uniqueId,
					},
					selectedPricedOptions: [],
					compositeId,
					uniqueId,
				},
			});
		});
		it('should return previous state if no productConfigurationId or productComposite', () => {
			const result = productConfigurationsReducer(previousState, {
				type: productConfigurationsActions.createConfiguration,
				payload: {
					productComposite,
					uniqueId,
				},
			});
			expect(result).toEqual(previousState);
		});
	});

	describe('setProductConfigurationFinish', () => {
		it('should return new selected finish information', () => {
			const result = productConfigurationsReducer(previousState, {
				type: productConfigurationsActions.setProductConfigurationFinish,
				payload: {
					productConfigurationId,
					productComposite,
					uniqueId: uniqueId2,
				},
			});
			expect(result).toEqual({
				[productConfigurationId]: {
					selectedFinish: {
						isLowLeadCompliant: true,
						pricebookCostView: {},
						pricebookCostViewsMap: {},
						uniqueId: uniqueId2,
					},
					uniqueId: uniqueId2,
					selectedPricedOptions: [{
						optionName: 'option name one',
						pricedOptions: [],
					}],
					compositeId,
				},
			});
		});
		it('should return previous state when missing productConfigurationId, uniqueId, or productComposite', () => {
			const result = productConfigurationsReducer(previousState, {
				type: productConfigurationsActions.setProductConfigurationFinish,
				payload: {
					productConfigurationId,
					productComposite,
				},
			});
			expect(result).toEqual(previousState);
		});
	});

	it('should handle setProductConfigurationPricedOption', () => {
		const result = productConfigurationsReducer(previousState, {
			type: productConfigurationsActions.setProductConfigurationPricedOption,
			payload: {
				productConfigurationId,
				pricedOptionId: 1,
				optionName: 'option name',
				keyCode: 'key code',
				name: 'name',
			},
		});
		expect(result).toEqual({
			[productConfigurationId]: {
				compositeId,
				selectedFinish: { uniqueId },
				selectedPricedOptions: [{
					optionName: 'option name one',
					pricedOptions: [],
				}, {
					name: 'name',
					optionName: 'option name',
					pricedOptions: [{
						keyCode: 'key code',
						name: 'name',
						optionName: 'option name',
						pricedOptionId: 1,
					}],
				}],
				uniqueId: 4321,
			},
		});
	});

	it('should handle addProductConfigurationTextPricedOption', () => {
		const name = 'name';
		const optionName = 'option name one';
		const keyCode = 'keyCode';
		const pricedOptionId = 'pricedOptionId';
		const result = productConfigurationsReducer(previousState, {
			type: productConfigurationsActions.addProductConfigurationTextPricedOption,
			payload: {
				name,
				optionName,
				keyCode,
				pricedOptionId,
				productConfigurationId,
			},
		});
		expect(result).toEqual({
			[productConfigurationId]: {
				selectedFinish: {
					uniqueId,
				},
				selectedPricedOptions: [{
					optionName: 'option name one',
					pricedOptions: [{
						keyCode,
						name,
						optionName,
						pricedOptionId,
					}],
				}],
				compositeId,
				uniqueId,
			},
		});
	});

	it('should handle clearProductCache', () => {
		const result = productConfigurationsReducer(previousState, {
			type: productsActions.clearProductCache,
		});
		expect(result).toMatchSnapshot();
	});

});
