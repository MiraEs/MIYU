
import { createAction } from 'redux-actions';
import productsActions from './ProductsActions';
import productService from '../services/productService';

const createConfiguration = createAction('CREATE_PRODUCT_CONFIGURATION');
function createProductConfiguration({ compositeId, uniqueId, productConfigurationId }) {
	return async (dispatch, getState) => {
		const { productsReducer } = getState();

		// if we already have the product composite in the redux store
		if (compositeId && productsReducer && productsReducer[compositeId]) {
			dispatch(createConfiguration({
				uniqueId,
				productConfigurationId,
				productComposite: productsReducer[compositeId],
			}));
			return;
		}

		// if we do not have the product composite in the redux store
		let getProductComposite;
		if (compositeId) {
			getProductComposite = productService.getProductCompositeById.bind(this, { compositeId });
		} else if (uniqueId) {
			getProductComposite = productService.getProductCompositeByUniqueId.bind(this, { uniqueId });
		} else {
			if (__DEV__) {
				console.error('You must pass either a compositeId or a uniqueId to createProductConfiguration');
			}
			return;
		}
		const productComposite = await getProductComposite();
		dispatch(productsActions.getProductCompositeSuccess(productComposite));
		dispatch(createConfiguration({
			uniqueId,
			productConfigurationId,
			productComposite,
		}));
	};
}

const setProductConfigurationFinish = createAction('SET_PRODUCT_CONFIGURATION_FINISH');
const setProductConfigurationPricedOption = createAction('SET_PRODUCT_CONFIGURATION_PRICED_OPTION');
const addProductConfigurationTextPricedOption = createAction('ADD_PRODUCT_CONFIGURATION_TEXT_PRICED_OPTION');
const addToOrSetProductConfigurationPricedOption = createAction('ADD_TO_OR_SET_PRODUCT_CONFIGURATION_PRICED_OPTION');
const cloneProductConfiguration = createAction('CLONE_PRODUCT_CONFIGURATION');

module.exports = {
	addProductConfigurationTextPricedOption,
	addToOrSetProductConfigurationPricedOption,
	createConfiguration,
	createProductConfiguration,
	setProductConfigurationFinish,
	setProductConfigurationPricedOption,
	cloneProductConfiguration,
};
