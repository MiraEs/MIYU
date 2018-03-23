jest.mock('../../services/httpClient', () => ({}));
jest.mock('../../store/configStore', () => ({}));
jest.mock('../../lib/analytics/tracking');
jest.mock('../../lib/animations', () => ({
	easeInEaseOut: jest.fn(),
}));
jest.mock('BuildNative');
jest.mock('BuildLibrary');
jest.mock('../../components/Form', () => 'Form');
jest.mock('../../router', () => ({}));
jest.mock('../ImageGallery', () => 'ImageGallery');
jest.mock('../HeaderSearch', () => 'HeaderSearch');
jest.mock('../../components/FavoriteButton', () => 'FavoriteButton');
jest.mock('../../components/productDetail/VariationButton', () => 'VariationButton');
jest.mock('../../components/AddToCartSelector', () => 'AddToCartSelector');
jest.mock('../../components/AddToProjectButton', () => 'AddToProjectButton');
jest.mock('../../components/productDetail/ProductRestrictions', () => 'ProductRestrictions');
jest.mock('../../components/productDetail/RatingsButton', () => 'RatingsButton');
jest.mock('../../components/productDetail/ProductQAndAButton', () => 'ProductQAndAButton');
jest.mock('../../components/productDetail/ManufacturerResourcesButton', () => 'ManufacturerResourcesButton');
jest.mock('../../components/productDetail/ShopTheCollection', () => 'ShopTheCollection');
jest.mock('../../components/productDetail/ProductTitle', () => 'ProductTitle');
jest.mock('../../components/productDetail/ProductShortDescription', () => 'ProductShortDescription');
jest.mock('../../components/productDetail/ProductSquareFootQuantity', () => 'ProductSquareFootQuantity');
jest.mock('../../components/productDetail/ZipChecker', () => 'ZipChecker');
jest.mock('../../components/productDetail/SalesBox', () => 'SalesBox');
jest.mock('../../components/productDetail/ManufacturerCallToAction', () => 'ManufacturerCallToAction');
jest.mock('../../components/productDetail/RebateBox', () => 'RebateBox');
jest.mock('../../components/productDetail/ProductPrice', () => 'ProductPrice');
jest.mock('../../components/productDetail/StockCount', () => 'StockCount');
jest.mock('../../components/productDetail/ProductPricedOptionButtons', () => 'ProductPricedOptionButtons');
jest.mock('../../components/TappableListItem', () => 'TappableListItem');
jest.mock('../../components/LoadingView', () => 'LoadingView');
jest.mock('../../components/InlineAlert', () => 'InlineAlert');
jest.mock('../../components/ArIcon', () => 'ArIcon');
jest.mock('../../components/CollapsibleContainer', () => {
	const React = require('react');
	const PropTypes = require('prop-types');
	const collapsibleContainer = (props) => React.createElement('CollapsibleContainer', props, props.children);
	collapsibleContainer.propTypes = {
		children: PropTypes.any,
	};
	return collapsibleContainer;
});
jest.mock('../../components/OptionSelectButton', () => 'OptionSelectButton');
jest.mock('react-native-animatable', () => ({
	View: 'AnimatableView',
}));
jest.mock('react-native');

import React from 'react';
import { ProductDetailScreen } from '../ProductDetailScreen';
import productConfigurationsReducer from '../../../__mocks__/reducers/productConfigurationsReducer';
import productsReducer from '../../../__mocks__/reducers/productsReducer';

const compositeId = productConfigurationsReducer['6579e663-3335-4a15-a210-309c09470080'].compositeId;
const product = productsReducer[compositeId];
const {
	availability,
	discontinued,
	fetchingAvailability,
	finishes,
	imageGallery,
	manufacturer,
	manufacturerInfo,
	pricedOptionGroups,
	productId,
	productSpecs,
	productVideos,
	recommendedOptions,
	rootCategory,
	series,
	squareFootageBased,
	squareFootagePerCarton,
	availableByLocation,
	title,
	topProductSpecs,
	type,
	variations,
} = product;

const defaultProps = {
	actions: {
		trackState: jest.fn(),
		updateSquareFootage: jest.fn(),
	},
	navigator: {
		updateCurrentRouteParams: jest.fn(),
		push: jest.fn(),
	},
	navigation: {
		getNavigator: jest.fn(() => {
			return {
				push: jest.fn(),
				popToTop: jest.fn(),
			};
		}),
		performAction: jest.fn(),
	},
	productConfigurations: productConfigurationsReducer,
	productConfigurationId: '6579e663-3335-4a15-a210-309c09470080',
	availability,
	discontinued,
	fetchingAvailability,
	finishes,
	imageGallery,
	manufacturer,
	manufacturerInfo,
	pricedOptionGroups,
	productId,
	productSpecs,
	productVideos,
	recommendedOptions,
	rootCategory,
	series,
	squareFootageBased,
	squareFootagePerCarton,
	availableByLocation,
	title,
	topProductSpecs,
	type,
	variations,
};

const wrapper = require('react-test-renderer').create(
	<ProductDetailScreen {...defaultProps} />
);

describe('ProductDetailScreen component', () => {
	it('snapshot test', () => {
		expect(wrapper.toJSON()).toMatchSnapshot();
	});

	it('expect changing productConfigurationId to change snapshot', () => {
		wrapper.getInstance().props = {
			...defaultProps,
			productConfigurationId: '741bcd00-ce80-43f3-bd8b-52deafb35822',
		};

		expect(wrapper.toJSON()).toMatchSnapshot();
	});

	it('expect setting showQuantitySelectorView to false to change snapshot', () => {
		wrapper.getInstance().setState({ showQuantitySelectorView: false });

		expect(wrapper.toJSON()).toMatchSnapshot();
	});

	it('expect setting isAddToCartEnabled to false to change snapshot', () => {
		wrapper.getInstance().setState({ isAddToCartEnabled: false });

		expect(wrapper.toJSON()).toMatchSnapshot();
	});

	it('expect method onChangeProductConfigurationId to run updateCurrentRouteParams', () => {
		const spy = jest.spyOn(wrapper.getInstance().props.navigator, 'updateCurrentRouteParams');
		wrapper.getInstance().productConfigurationId = '741bcd00-ce80-43f3-bd8b-52deafb35822';
		wrapper.getInstance().onChangeProductConfigurationId('6579e663-3335-4a15-a210-309c09470080');

		expect(spy).toHaveBeenCalled();
	});

	it('expect method onSquareFootageChange to run updateSquareFootage', () => {
		const spy = jest.spyOn(wrapper.getInstance().props.actions, 'updateSquareFootage');
		wrapper.getInstance().onSquareFootageChange('1000');

		expect(spy).toHaveBeenCalled();
	});

	it('expect method onFinishButtonPress to run getNavigator', () => {
		wrapper.getInstance().onFinishButtonPress();
		expect(defaultProps.navigation.getNavigator).toBeCalledWith('root');
	});

	it('expect method onShortDescriptionPress to run getNavigator', () => {
		wrapper.getInstance().onShortDescriptionPress();
		expect(defaultProps.navigation.getNavigator).toBeCalledWith('root');
	});

	it('expect method onVideosPress to run getNavigator', () => {
		wrapper.getInstance().onVideosPress();
		expect(defaultProps.navigation.getNavigator).toBeCalledWith('root');
	});

	it('expect method onReviewPress to run getNavigator', () => {
		wrapper.getInstance().onReviewPress();
		expect(defaultProps.navigation.getNavigator).toBeCalledWith('root');
	});

	it('expect method onProductSpecificationsPress to run getNavigator', () => {
		wrapper.getInstance().onProductSpecificationsPress();
		expect(defaultProps.navigation.getNavigator).toBeCalledWith('root');
	});

	it('expect method onCollectionPress to run navigator push', () => {
		wrapper.getInstance().onCollectionPress();
		expect(defaultProps.navigation.getNavigator).toBeCalledWith('root');
	});

	it('expect method getAddToCartTrackData to return expected results', () => {
		const results = wrapper.getInstance().getProductConfiguration();
		expect(results).toEqual(productConfigurationsReducer['6579e663-3335-4a15-a210-309c09470080']);
	});

	it('expect method onUpdateQuantity to change quantity state', () => {
		wrapper.getInstance().onUpdateQuantity('2');
		expect(wrapper.getInstance().state.quantity).toEqual('2');
	});

	// react-test-renderer won't clear the interval automatically
	// which causes the test to hang at the end
	clearInterval(wrapper.getInstance().getProductCompositeDataInterval);
});
