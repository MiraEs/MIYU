
jest.mock('redux-actions');
jest.mock('../../services/productService', () => ({
	getProductCompositeById: jest.fn(),
	getProductCompositeByUniqueId: jest.fn(),
}));
import productService from '../../services/productService';
jest.unmock('../../actions/ProductsActions');
import productsActions from '../ProductsActions';

const compositeId = 1;
const uniqueId = 2;

describe('ProductActions', () => {

	it('should handle getProductComposite', () => {
		productsActions.getProductComposite({
			compositeId,
			uniqueId,
		})().then(() => {
			expect(productService.getProductCompositeById).toBeCalled();
			expect(productService.getProductCompositeByUniqueId).not.toBeCalled();
		});
	});

	it('should handle getProductCompositeSuccess', () => {
		const result = productsActions.getProductCompositeSuccess({});
		expect(result).toEqual({
			type: 'GET_PRODUCT_COMPOSITE_SUCCESS',
			payload: {},
		});
	});

	it('should handle clearProductCache', () => {
		const result = productsActions.clearProductCache();
		expect(result).toMatchSnapshot();
	});

	it('should handle setAvailability', () => {
		const result = productsActions.setAvailability(compositeId, uniqueId, 92106, 3);
		expect(result).toMatchSnapshot();
	});

});
