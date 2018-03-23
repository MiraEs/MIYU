import React from 'react';
jest.mock('react-native');
jest.mock('BuildNative');
jest.mock('BuildLibrary');
jest.mock('react-redux');
jest.mock('redux');
jest.mock('@expo/ex-navigation', () => ({
	withNavigation: jest.fn(),
}));
jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');
jest.mock('../../../services/httpClient', () => ({}));
jest.mock('../../../lib/helpers', () => ({
	isIOS: jest.fn(() => true),
	setFirstAvailableFinish: jest.fn((drop) => drop),
	getCloudinaryImageUrl: jest.fn((image) => `cloudinary/url/${image}`),
	toUSD: jest.fn((amount) => `$${amount}`),
}));
jest.mock('../../../lib/styles');
jest.mock('../../../lib/ProductConfigurationHelpers', () => ({}));
jest.mock('../../../actions/SearchActions');

import renderer from 'react-test-renderer';
import { ShopTheCollection } from '../ShopTheCollection';

const fullProps = {
	productDrops: [{
		uniqueId: 1234,
		finishes:[{
			cost: 777.12,
			image: 'image.png',
			uniqueId: 1234,
		}],
		selectedFinishIndex: 0,
	}],
};

describe('ShopTheCollection', () => {
	it('should render with products', () => {
		const wrapper = renderer.create(<ShopTheCollection {...fullProps} />);
		expect(wrapper.toJSON()).toMatchSnapshot();
	});
});
