jest.unmock('../helpers');
jest.unmock('moment');
jest.unmock('numeral');
jest.unmock('html-entities');

const mockImagesPage1 = {
	edges: [{
		node: {
			image: {
				uri: '/photo/uri/1',
			},
		},
	}, {
		node: {
			image: {
				uri: '/photo/uri/2',
			},
		},
	}],
	page_info: {
		has_nex_page: false,
	},
};

jest.mock('react-native', () => ({
	CameraRoll: {
		getPhotos: jest.fn(() => ({
			then: jest.fn((cb) => cb(mockImagesPage1)),
		})),
	},
	NativeModules: {
		UIManager: jest.fn(),
	},
	PixelRatio: {
		get: jest.fn(() => 2),
	},
	Platform: {
		OS: 'ios',
	},
	StatusBar: {
		setHidden: jest.fn(),
		setBarStyle: jest.fn(),
	},
}));
jest.mock('../styles');

import { StatusBar } from 'react-native';

import helpers from '../helpers';

describe('app/lib/helpers.js', () => {

	describe('getPhotoByUri', () => {
		it('should handle photo URI', async () => {
			const result = await helpers.getPhotoByUri('/photo/uri/1');
			expect(result).toEqual(mockImagesPage1.edges[0].node.image);
		});
	});

	describe('getResizedDimensions', () => {
		it('should handle height greater than width', () => {
			const result = helpers.getResizedDimensions(1, 2, 1, 1);
			expect(result).toEqual({
				height: 1,
				width: 0,
			});
		});
		it('should handle width greater than height', () => {
			const result = helpers.getResizedDimensions(2, 1, 1, 1);
			expect(result).toEqual({
				height: 0,
				width: 1,
			});
		});
		it('should handle same width and height', () => {
			const result = helpers.getResizedDimensions(1, 1, 1, 1);
			expect(result).toEqual({
				height: 1,
				width: 1,
			});
		});
	});

	describe('resizeImages', () => {
		it('should handle a number passed to it', async () => {
			const result = await helpers.resizeImages(123);
			expect(result).toEqual([]);
		});
	});


	describe('slugify function', () => {
		it('should return slugified string', () => {
			const slug = helpers.slugify('This is a test');
			expect(slug).toEqual('this-is-a-test');
		});
		it('should return empty strings if passed an empty string', () => {
			const result = helpers.slugify('');
			expect(result).toEqual('');
		});
	});

	describe('getResizedImageForUrl function', () => {

		it('should format URL for Build', () => {
			const RESOURCE = 'ASDF';
			const URL = 'http://build.com/test/';

			const IMAGE_URL = helpers.getResizedImageForUrl(`${URL}${RESOURCE}`, 100);
			expect(IMAGE_URL).toEqual(`${URL}${RESOURCE}`);
		});

		it('should format URL for Cloudinary', () => {
			const RESOURCE = 'ooxxcaynmctoyktnor2k';
			const URL = 'http://res.cloudinary.com/build/image/upload/';

			const IMAGE_URL = helpers.getResizedImageForUrl(`${URL}${RESOURCE}`, 100);
			expect(IMAGE_URL).toEqual(`${URL}w_200/${RESOURCE}`);
		});

	});

	describe('removeHTML', () => {
		it('should remove HTML tags', () => {
			const HTML = helpers.removeHTML('<div>test</div>');
			expect(HTML).toEqual('test');
		});

		it('should not crash and return and empty string when passed nothing', () => {
			const HTML = helpers.removeHTML();
			expect(HTML).toEqual('');
		});
	});

	describe('getIcon', () => {
		it('should return an icon name', () => {
			const icon = helpers.getIcon('test');
			expect(icon).toEqual('ios-test');
		});
	});

	describe('getImageUrl', () => {
		it('should return an image URL', () => {
			const url = helpers.getImageUrl('manufacturer', 'Image.png');
			expect(url).toEqual('http://s2.img-b.com/imagebase/resized/330x320/manufacturerimages/image.png');
		});

		it('should return a 404 image URL when image is missing', () => {
			const url = helpers.getImageUrl('manufacturer');
			expect(url).toEqual('http://s2.img-b.com/imagebase/resized/100x100/404images/noimage.gif');
		});
	});

	describe('getCategoryImageUrl', () => {
		it('should return a category image URL for the given image', () => {
			expect(helpers.getCategoryImageUrl('test.png')).toEqual('http://s2.img-b.com/build.com/imagebase/resized/140x140/category_82/test.png');
		});

		it('should return a 404 image if no image is provided', () => {
			expect(helpers.getCategoryImageUrl()).toEqual('http://s2.img-b.com/imagebase/resized/100x100/404images/noimage.gif');
		});
	});

	describe('getPricedOptionUrl', () => {
		it('should return the formatted URL for a priced option image', () => {
			const result = helpers.getPricedOptionUrl('image.png');
			expect(result).toEqual('https://s2.img-b.com/build.com/mediabase/pricedoptionimages/image.png');
		});
		it('should return a 404 image if no image passed in', () => {
			const result = helpers.getPricedOptionUrl();
			expect(result).toEqual('https://s2.img-b.com/imagebase/resized/100x100/404images/noimage.gif');
		});
	});


	describe('toUSD', () => {
		it('should return a formatted string with USD of a number', () => {
			const munmuns = helpers.toUSD(234);
			expect(munmuns).toEqual('$234.00');
		});

		it('should handle numbers inside strings', () => {
			const munmuns = helpers.toUSD('234.98');
			expect(munmuns).toEqual('$234.98');
		});
	});

	describe('setStatusBarStyle function', () => {

		it('should call StatusBar.setStyle', () => {
			helpers.setStatusBarStyle();
			expect(StatusBar.setBarStyle).toBeCalled();
		});

	});

	describe('setStatusBarHidden function', () => {
		it('should call StatusBar.setHidden', () => {
			helpers.setStatusBarHidden(true, 'none');
			expect(StatusBar.setBarStyle).toBeCalled();
		});
	});

	describe('getCouponCodeFromCart', () => {
		it('should get the coupon code from the cart', () => {
			const cart = {
				couponCode: {
					code: 'coupon-code',
				},
			};
			const result = helpers.getCouponCodeFromCart(cart);
			expect(result).toEqual(cart.couponCode.code);
		});
		it('should return undefined if no cart provided', () => {
			const result = helpers.getCouponCodeFromCart({});
			expect(result).toEqual(undefined);
		});
	});


	describe('getDate function', () => {
		it('should return a formatted date', () => {
			const sourceDate1 = new Date();
			const TWO_DAYS_AGO = sourceDate1.setDate(sourceDate1.getDate() - 2);
			const date1 = helpers.getDate(TWO_DAYS_AGO);
			expect(date1).toEqual('2 days ago');
		 });
	});

	describe('validFinish', () => {
		it('should return image for a finish in stock', () => {
			const finish = {
				status: 'Stock',
				image: 'image.png',
			};
			const result = helpers.validFinish(finish);
			expect(result).toEqual('image.png');
		});
	});

	describe('setLowestPrice', () => {
		it('should mutate given product drop with minPrice', () => {
			const productDrop = {
				finishes: [{
					status: 'STOCK',
					cost: 123.45,
				}, {
					status: 'STOCK',
					cost: 234.56,
				}],
			};
			const result = helpers.setLowestPrice(productDrop);
			expect(result).toEqual({
				...productDrop,
				minPrice: 123.45,
			});
		});
	});

});
