
import store from '../store/configStore';

function getProductConfiguration(productConfigurationId) {
	return store.getState().productConfigurationsReducer[productConfigurationId];
}

function getProductComposite(productConfigurationId) {
	const state = store.getState();
	const productConfiguration = getProductConfiguration(productConfigurationId);
	if (productConfiguration) {
		return state.productsReducer[productConfiguration.compositeId];
	}
}

function getSelectedFinish(productConfigurationId) {
	const productConfiguration = getProductConfiguration(productConfigurationId);
	if (productConfiguration) {
		return productConfiguration.selectedFinish;
	}
}

export default {
	getProductComposite,
	getProductConfiguration,
	getSelectedFinish,
};
