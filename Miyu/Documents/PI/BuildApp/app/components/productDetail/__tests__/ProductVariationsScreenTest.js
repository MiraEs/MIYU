
import renderer from 'react-test-renderer';

jest.mock('build-library');
jest.mock('BuildLibrary');
jest.mock('BuildNative');
jest.mock('redux');
jest.mock('uuid');
jest.mock('react-redux');
jest.mock('../../../actions/ProductConfigurationsActions');
jest.mock('../../../lib/styles');
jest.mock('../../../lib/helpers', () => ({
	toUSD: jest.fn((input) => input),
	getCloudinaryImageUrl: jest.fn((image) => `cloudinary/url/${image.section}/${image.name}`),
}));
jest.mock('../../../constants/CloudinaryConstants', () => ({
	PRODUCT_SECTION: 'PRODUCT_SECTION',
	IMAGE_100: 'IMAGE_100',
}));
jest.mock('../../../actions/ProductsActions');
jest.mock('../ProductConfigurationOptionButton', () => 'ProductConfigurationOptionButton');
jest.mock('../ProductConfigurationHeader', () => 'ProductConfigurationHeader');
jest.mock('../../../lib/analytics/TrackingActions');
jest.mock('../../../lib/productHelpers');
jest.mock('../../FixedBottomButton');
import React from 'react';
jest.unmock('react-native');
import 'react-native';
jest.mock('../../../services/httpClient', () => ({}));

import { ProductVariationsScreen } from '../ProductVariationsScreen';

const finishes = [{
	finish: 'finish 1',
	image: 'finishImage1.png',
	uniqueId: 123,
	pricebookCostView: {
		cost: 654.12,
	},
}, {
	finish: 'finish 2',
	image: 'finishImage2.png',
	uniqueId: 321,
	pricebookCostView: {
		cost: 7843.12,
	},
}];
const variationProducts = [{
	currentVariation: true,
}, {
	currentVariation: false,
}];
const compositeId = 1324;
const productComposite = {
	finishes,
	productCompositeId: compositeId,
};
const fullProps = {
	actions: {
		createProductConfiguration: jest.fn(),
		getProductComposite: jest.fn(),
		setProductConfigurationFinish: jest.fn(),
	},
	cost: 321.45,
	manufacturer: 'mfg',
	hasSelectedFinish: false,
	onPressContinue: jest.fn(),
	productConfigurationId: 'u-u-i-d',
	products: {
		[compositeId]: productComposite,
	},
	selectedFinishName: 'finish 1',
	stockText: '10 in stock',
	variations: [{
		variationProducts,
	}],
	selectedLeadTimeText: 'It ships when it ships.',
	navigator: {
		pop: jest.fn(),
		updateCurrentRouteParams: jest.fn(),
	},
	selectedSku: 'S3L3C73DSKU',
	selectedImage: 'image.png',
	productComposite,
	finishes,
};

describe('ProductVariationsScreen', () => {
	it('should render with no selected finish', () => {
		const wrapper = renderer.create(<ProductVariationsScreen {...fullProps} />);
		expect(wrapper.toJSON()).toMatchSnapshot();
	});
	it('should render with selected finish', () => {
		const props = {
			...fullProps,
			hasSelectedFinish: true,
		};
		const wrapper = renderer.create(<ProductVariationsScreen {...props} />);
		expect(wrapper.toJSON()).toMatchSnapshot();
	});
	it('should handle pressing continue button', () => {
		const wrapper = renderer.create(<ProductVariationsScreen {...fullProps} />);
		wrapper.getInstance().onPressContinue();
		expect(fullProps.onPressContinue).toBeCalledWith(fullProps.productConfigurationId);
		expect(fullProps.navigator.pop).toBeCalled();
	});
	it('should have tracking information', () => {
		const wrapper = renderer.create(<ProductVariationsScreen {...fullProps} />);
		const result = wrapper.getInstance().setScreenTrackingInformation();
		expect(result).toEqual({
			name: 'build:app:productvariation',
		});
	});
	it('should handle pressing a variation', () => {
		const wrapper = renderer.create(<ProductVariationsScreen {...fullProps} />);
		wrapper.getInstance().onPressVariation({ productCompositeId: fullProps.productComposite.productCompositeId });
		expect(fullProps.actions.createProductConfiguration).toBeCalled();
		expect(fullProps.navigator.updateCurrentRouteParams).toBeCalled();
	});
	it('should handle finish press', () => {
		const wrapper = renderer.create(<ProductVariationsScreen {...fullProps} />);
		const uniqueId = finishes[0].uniqueId;
		wrapper.getInstance().onPressFinish(uniqueId);
		expect(fullProps.navigator.updateCurrentRouteParams).toBeCalledWith({
			hasSelectedFinish: true,
		});
		expect(fullProps.actions.setProductConfigurationFinish).toBeCalledWith({
			productComposite: fullProps.productComposite,
			productConfigurationId: fullProps.productConfigurationId,
			uniqueId,
		});
	});
});
