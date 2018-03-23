import productConfigurationHelpers from '../ProductConfigurationHelpers';

jest.unmock('react-native');
jest.mock('../../store/configStore', () => ({
	getState: jest.fn(() => ({
		productConfigurationsReducer: {
			'u-u-i-d': {
				compositeId: 1234,
				selectedFinish: {
					finish: 'finish name',
				},
			},
		},
		productsReducer: {
			[1234]: {},
		},
	})),
}));

const productConfigurationId = 'u-u-i-d';

describe('productConfigurationHelpers', () => {
	describe('getProductConfiguration', () => {
		it('should return product configuration', () => {
			const result = productConfigurationHelpers.getProductConfiguration(productConfigurationId);
			expect(result).toEqual({
				compositeId: 1234,
				selectedFinish: {
					finish: 'finish name',
				},
			});
		});
		it('should return undefined if no configuration found', () => {
			const result = productConfigurationHelpers.getProductConfiguration('adsf');
			expect(result).toEqual(undefined);
		});
	});
	describe('getProductComposite', () => {
		it('should return product composite', () => {
			const result = productConfigurationHelpers.getProductComposite(productConfigurationId);
			expect(result).toEqual({});
		});
		it('should return undefined if there is no product composite', () => {
			const result = productConfigurationHelpers.getProductComposite('asdf');
			expect(result).toEqual();
		});
	});
	describe('getSelectedFinish', () => {
		it('should return selected finish', () => {
			const result = productConfigurationHelpers.getSelectedFinish(productConfigurationId);
			expect(result).toEqual({
				finish: 'finish name',
			});
		});
		it('should return undefined if there\'s no product composite', () => {
			const result = productConfigurationHelpers.getSelectedFinish('asdf');
			expect(result).toEqual();
		});
	});

});
