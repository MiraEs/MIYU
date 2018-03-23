'use strict';

jest.mock('react-native');
jest.mock('BuildNative');
jest.mock('BuildLibrary');
jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');

import FavoritesListRow from '../FavoritesListRow';
import React from 'react';
import renderer from 'react-test-renderer';

const defaultProps = {
	favorite: {},
	favoriteId: 237506,
	onDelete: jest.fn(),
	onPress: jest.fn(),
};

const favorite = {
	id: 237506,
	isOwner: true,
	name: 'Office',
	itemCount: 2,
	productsMap: {
		1155759: {
			availableByLocation: false,
			productCompositeId: 1155759,
			favoriteProductId: 2092691,
			manufacturer: 'Safavieh',
			productConfigurationId: 'ddbda9c6-cb39-4d8c-a7ab-bb7b7363d86a',
			productId: 'FOX8508',
			title: 'Bernard Desk Chair',
			id: 0,
			finishes: [{
				uniqueId: 2763356,
				finish: 'Black',
				sku: 'FOX8508A',
				image: 'safavieh-fox8508a-1419.jpg',
				imagePaths: {
					100: '/imagebase/resized/100x100/safaviehimages/safavieh-fox8508a-1419.jpg',
					220: '/imagebase/resized/220x220/safaviehimages/safavieh-fox8508a-1419.jpg',
					320: '/imagebase/resized/330x320/safaviehimages/safavieh-fox8508a-1419.jpg',
				},
				cost: 156.82,
				msrp: 241.5,
				finishSampleUniqueId: null,
				status: 'Discontinued',
				finishSwatch: {
					swatchIdentifier: null,
					hexValue: '000000',
					styleValue: '',
					swatchImage: 'website/imagebase/swatchimages/int-cgs-bk.jpg',
				},
			}],
			squareFootageBased: false,
			type: 'Furniture',
			uniqueId: 2763356,
		},
		1155765: {
			availableByLocation: false,
			productCompositeId: 1155765,
			favoriteProductId: 2092693,
			manufacturer: 'Safavieh',
			productConfigurationId: 'baf1b4f0-f7a9-4994-8983-b0cd7e4b9036',
			productId: 'FOX8514',
			title: 'Olga Desk Chair',
			id: 1,
			finishes: [{
				uniqueId: 2763365,
				finish: 'Black',
				sku: 'FOX8514A',
				image: 'safavieh-fox8514a-1428.jpg',
				imagePaths: {
					100: '/imagebase/resized/100x100/safaviehimages/safavieh-fox8514a-1428.jpg',
					220: '/imagebase/resized/220x220/safaviehimages/safavieh-fox8514a-1428.jpg',
					320: '/imagebase/resized/330x320/safaviehimages/safavieh-fox8514a-1428.jpg',
				},
				cost: 211.16,
				msrp: 451.84,
				finishSampleUniqueId: null,
				status: 'stock',
				finishSwatch: {
					swatchIdentifier: null,
					hexValue: '000000',
					styleValue:'',
					swatchImage: 'website/imagebase/swatchimages/int-cgs-bk.jpg',
				},
			}],
			squareFootageBased: false,
			type: 'Furniture',
			uniqueId: 2763365,
		},
	},
};

describe('FavoritesListRow component', () => {
	it('should render an empty row', () => {
		const tree = renderer.create(
			<FavoritesListRow {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render', () => {
		const tree = renderer.create(
			<FavoritesListRow
				{...defaultProps}
				favorite={favorite}
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});


});
