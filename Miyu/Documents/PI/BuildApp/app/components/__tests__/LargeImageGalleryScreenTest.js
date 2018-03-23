jest.mock('react-native-gallery', () => 'Gallery');
jest.mock('BuildNative');
jest.mock('BuildLibrary');
jest.mock('react-native');

import React from 'react';
import { LargeImageGalleryScreen } from '../LargeImageGalleryScreen';
import renderer from 'react-test-renderer';

const defaultProps = {
	currentIndex: 0,
	images: [{uri: 'test'}],
	navigator: {
		pop: jest.fn(),
		updateCurrentRouteParams: jest.fn(),
	},
	onNavigationPress: jest.fn(),
	title: 'test',
};

describe('LargeImageGalleryScreen', () => {

	it('should render correctly', () => {
		const tree = renderer.create(
			<LargeImageGalleryScreen {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

});

describe('LargeImageGalleryScreen functions', () => {

	it('state', () => {
		const wrapper = renderer.create(
			<LargeImageGalleryScreen {...defaultProps} />
		).getInstance();
		expect(wrapper.state).toMatchSnapshot();
	});

	it('scrollView', () => {
		const wrapper = renderer.create(
			<LargeImageGalleryScreen {...defaultProps} />
		).getInstance();
		expect(wrapper.scrollView).toMatchSnapshot();
	});

	it('onNavigationPress', () => {
		const wrapper = renderer.create(
			<LargeImageGalleryScreen {...defaultProps} />
		).getInstance();
		wrapper.onNavigationPress(1);
		expect(wrapper.scrollView.scrollTo).toBeCalledWith({ x: -16 });
		expect(wrapper.state.currentIndex).toEqual(1);
	});

	describe('getImages', () => {
		it('should return an array of images', () => {
			const instance = renderer.create(
				<LargeImageGalleryScreen {...defaultProps} />
			).getInstance();
			const images = instance.getImages();
			expect(images).toEqual(['test']);
		});

		it('should return an empty array', () => {
			const props = {
				...defaultProps,
				images: [],
			};
			const instance = renderer.create(
				<LargeImageGalleryScreen {...props} />
			).getInstance();
			const images = instance.getImages();
			expect(images).toEqual([]);
		});
	});

	it('onDonePress', () => {
		const instance = new LargeImageGalleryScreen(defaultProps);
		instance.onDonePress();
		expect(defaultProps.navigator.pop).toBeCalled();
	});
});
