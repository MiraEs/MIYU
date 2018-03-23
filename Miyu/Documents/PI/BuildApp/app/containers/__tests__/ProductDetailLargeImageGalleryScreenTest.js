jest.mock('react-native');
jest.mock('../../components/LargeImageGalleryScreen', () => 'LargeImageGalleryScreen');
import React from 'react';
import {
	ProductDetailLargeImageGalleryScreen,
	mapStateToProps,
	mapDispatchToProps,
} from '../ProductDetailLargeImageGalleryScreen';
import renderer from 'react-test-renderer';

const defaultProps = {
	actions: {
		goToGalleryIndex: jest.fn(),
	},
	currentIndex: 0,
	images: [{uri: 'test'}],
	navigator: {
		pop: jest.fn(),
		updateCurrentRouteParams: jest.fn(),
	},
	onNavigationPress: jest.fn(),
	productConfigurationId: '1',
	title: 'test',
};

describe('ProductDetailLargeImageGalleryScreen', () => {

	it('should render correctly', () => {
		const tree = renderer.create(
			<ProductDetailLargeImageGalleryScreen {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

});

describe('ProductDetailLargeImageGalleryScreen functions', () => {

	it('onNavigationPress', () => {
		const index = 1;
		const wrapper = renderer.create(
			<ProductDetailLargeImageGalleryScreen {...defaultProps} />
		).getInstance();
		wrapper.onNavigationPress(index);
		expect(defaultProps.actions.goToGalleryIndex).toBeCalledWith({
			index,
			productConfigurationId: defaultProps.productConfigurationId,
		});
	});

	describe('mapStateToProps', () => {
		it('should find the index in the reducer', () => {
			const productConfigurationId = 1;
			const index = 2;
			const result = mapStateToProps({
				productDetailReducer: {
					screenViews: {
						[productConfigurationId]: {
							imageGalleryIndex: index,
						},
					},
				},
			}, {
				productConfigurationId,
				currentIndex: 3,
			});
			expect(result).toEqual({ currentIndex: index });
		});

		it('should find the index in the props', () => {
			const productConfigurationId = 1;
			const index = 2;
			const result = mapStateToProps({
				productDetailReducer: {
					screenViews: {},
				},
			}, {
				productConfigurationId,
				currentIndex: index,
			});
			expect(result).toEqual({ currentIndex: index });
		});

	});

	it('should mapDispatchToProps', () => {
		const dispatch = jest.fn((fn) => fn);
		const result = mapDispatchToProps(dispatch);
		expect(result).toMatchSnapshot({
			...defaultProps.actions,
		});
	});
});
