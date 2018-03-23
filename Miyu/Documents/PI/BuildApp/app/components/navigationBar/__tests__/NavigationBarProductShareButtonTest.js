jest.unmock('react-native');
jest.mock('prop-types');
jest.mock('react-redux');
jest.mock('react-native-branch', () => ({
	createBranchUniversalObject: jest.fn(() => ({
		generateShortUrl: jest.fn(() => ({
			url: '/url',
		})),
	})),
}));
import branch from 'react-native-branch';
jest.mock('react-native-share', () => ({
	open: jest.fn(() => ({
		then: jest.fn(() => ({
			catch: jest.fn(() => ({
				done: jest.fn(),
			})),
		})),
	})),
}));
import Share from 'react-native-share';
jest.mock('../NavigationBarIconButton', () => 'NavigationBarIconButton');
jest.mock('../../../lib/analytics/TrackingActions', () => ({
	PDP_NAV_TAP_SHARE: 'PDP_NAV_TAP_SHARE',
}));
jest.mock('../../../lib/helpers', () => ({
	getIcon: jest.fn((name) => name),
	slugify: jest.fn((slug) => slug.toLowerCase().replace(' ', '-')),
}));

import { create } from 'react-test-renderer';
import React from 'react';
import 'react-native';
import { NavigationBarProductShareButton, mapStateToProps } from '../NavigationBarProductShareButton';

const props = {
	manufacturer: 'mfg',
	title: 'title',
	productId: 'productId',
	compositeId: 1234,
	type: 'type',
	selectedFinish: {},
	uniqueId: 5678,
	useBranchLinksForShare: true,
	description: 'description',
};

describe('NavigationBarProductShareButton', () => {
	it('should render with full props', () => {
		const result = create(<NavigationBarProductShareButton {...props} />).toJSON();
		expect(result).toMatchSnapshot();
	});
	describe('onSharePress', () => {

		beforeEach(() => {
			Share.open.mockClear();
		});

		it('should handle a press with uniqueId', async () => {
			const wrapper = create(<NavigationBarProductShareButton {...props} />);
			const instance = wrapper.getInstance();
			await instance.onSharePress();
			expect(branch.createBranchUniversalObject).toBeCalledWith('mfg productId title', {
				contentIndexingMode: 'private',
				title: 'mfg productId title on Build.com',
			});
			expect(Share.open).toBeCalledWith({
				message: 'View the mfg productId title on Build.com',
				title: 'Share Product',
				url: '/url',
			});
		});
		it('should handle a press without a uniqueId', async () => {
			const newProps = { ...props };
			delete newProps.uniqueId;
			newProps.useBranchLinksForShare = false;
			const wrapper = create(<NavigationBarProductShareButton {...newProps} />);
			const instance = wrapper.getInstance();
			await instance.onSharePress();
			expect(branch.createBranchUniversalObject).toBeCalledWith('mfg productId title', {
				contentIndexingMode: 'private',
				title: 'mfg productId title on Build.com',
			});
			expect(Share.open).toBeCalledWith({
				message: 'View the mfg productId title on Build.com',
				title: 'Share Product',
				url: 'https://www.build.com/mfg-productid/s1234',
			});
		});
	});
	describe('mapStateToProps', () => {

		const productsReducer = {
			1234: {
				description: 'description',
				manufacturer: 'mfg',
				productId: 'productId',
				selectedFinish: {
					uniqueId: 5678,
				},
				title: 'title',
				type: 'type',
			},
		};
		const featuresReducer = {
			features: {
				useBranchLinksForShare: true,
			},
		};

		it('should handle with product', () => {
			const result = mapStateToProps({
				productsReducer,
				featuresReducer,
			}, {
				compositeId: 1234,
			});
			expect(result).toEqual({
				description: 'description',
				manufacturer: 'mfg',
				productId: 'productId',
				selectedFinish: {
					uniqueId: 5678,
				},
				uniqueId: 5678,
				title: 'title',
				type: 'type',
				useBranchLinksForShare: true,
			});
		});
		it('should handle without selectedFinish', () => {
			delete productsReducer['1234'].selectedFinish;
			const result = mapStateToProps({
				productsReducer,
				featuresReducer: {
					features: {
						useBranchLinksForShare: true,
					},
				},
			}, {
				compositeId: 1234,
			});
			expect(result).toEqual({
				description: 'description',
				manufacturer: 'mfg',
				productId: 'productId',
				selectedFinish: undefined,
				uniqueId: undefined,
				title: 'title',
				type: 'type',
				useBranchLinksForShare: true,
			});		});
		it('should handle without product', () => {
			const result = mapStateToProps({
				productsReducer: {},
			}, {
				compositeId: 1234,
			});
			expect(result).toEqual({
				description: '',
			});
		});
	});
});
