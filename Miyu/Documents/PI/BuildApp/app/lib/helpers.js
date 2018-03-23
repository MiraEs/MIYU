import moment from 'moment';
import numeral from 'numeral';
import {
	findNodeHandle,
	PixelRatio,
	StatusBar,
	Linking,
	Platform,
	CameraRoll,
	ImageEditor,
	NativeModules,
} from 'react-native';
import {
	SITE_ID,
	CLOUDINARY_URL,
} from '../constants/constants';
import { AllHtmlEntities } from 'html-entities';
import NetworkError from '../errors/NetworkError';
const { UIManager } = NativeModules;

const entities = new AllHtmlEntities();
let endCursor = null;

const helpers = {

	isIOS() {
		return Platform.OS === 'ios';
	},

	isAndroid() {
		return Platform.OS === 'android';
	},

	noop() {},

	/**
	 * Get image data for a given URI
	 * This is a recursive function so be careful modifying it
	 */
	getPhotoByUri(photoUri) {
		const options = {
			first: 1000,
		};
		if (endCursor) {
			options.after = endCursor;
		}
		return CameraRoll.getPhotos(options).then((data) => {
			if (data && data.edges && data.edges.length) {
				const match = data.edges.find((edge) => edge.node.image.uri === photoUri);
				if (match) {
					endCursor = null;
					return match.node.image;
				} else if (data.page_info && data.page_info.has_next_page) {
					endCursor = data.page_info.end_cursor;
					return helpers.getPhotoByUri(photoUri);
				}
			}
		});
	},

	getResizedDimensions(width, height, maxWidth, maxHeight) {
		if (height > width && height > maxHeight) {
			width = (maxHeight / height) * width;
			height = maxHeight;
		} else if (width > height && width > maxWidth) {
			height = (maxWidth / width) * height;
			width = maxWidth;
		}
		return {
			width: helpers.toInteger(width),
			height: helpers.toInteger(height),
		};
	},

	/**
	 * Resize the given images
	 */
	resizeImages(images = []) {
		const resizeList = [];
		if (Array.isArray(images)) {
			images.forEach((image) => {
				resizeList.push(new Promise((resolve, reject) => {
					return helpers.getPhotoByUri(image.uri).then((imageData) => {
						if (imageData) {
							const { width, height } = imageData;
							const dimensions = helpers.getResizedDimensions(width, height, image.maxWidth, image.maxHeight);
							ImageEditor.cropImage(image.uri, {
								offset: {
									x: 0,
									y: 0,
								},
								size: {
									width,
									height,
								},
								displaySize: {
									width: dimensions.width,
									height: dimensions.height,
								},
							}, resolve, reject);
						} else {
							reject();
						}
					});
				}));
			});
		}
		return Promise.all(resizeList);
	},

	findUs() {
		const url = 'geo:39.7077069,-121.8205423,19.78';
		Linking
			.canOpenURL(url)
			.then((supported) => {
				if (supported) {
					Linking.openURL(url);
				}
			});
	},

	emailUs(email) {
		const url = `mailto:${email}`;
		Linking
			.canOpenURL(url)
			.then((supported) => {
				if (supported) {
					Linking.openURL(url);
				}
			});
	},

	getCloudinaryImageUrl(options) {
		if (options.name) {
			return `http://s3.img-b.com/image/private/t_base,f_auto,dpr_2.0,c_${options.crop || 'lpad'}${options.gravity ? `,g_${options.gravity}` : ''}${options.width ? `,w_${Math.round(options.width)}` : ''}${options.height ? `,h_${options.height}` : ''}${options.effect ? `,e_${options.effect}` :''}/${options.section ? `${options.section}/` : ''}${options.manufacturer ? `${options.manufacturer.toLowerCase().replace(/\s/g, '')}/` : ''}${options.name.toLowerCase().replace(/\s/g, '')}`;
		}
		return helpers.getCloudinaryNoImageAvailableUrl(options);
	},

	/**
	 * Get the no image available URL from cloudinary at the specified size
	 * @param  {object} options height and width
	 * @return {string}         the no image available URL
	 */
	getCloudinaryNoImageAvailableUrl(options) {
		return `https://s3.img-b.com/image/upload/t_base,f_auto,dpr_2.0,c_lpad,w_${options.width},h_${options.height}/404images/noimage.gif`;
	},

	getEventTitle(eventType) {
		switch (eventType) {
			case 'POST':
				return 'Post';
			case 'TEAM_MEMBER':
				return 'Team Member';
			case 'TEAM_EXPERT':
				return 'Team Expert';
			case 'FAVORITE_LIST':
				return 'Favorites List';
			case 'ORDER':
				return 'Order';
			case 'TRACKING':
				return 'Tracking';
			default:
				return '';
		}
	},

	getCloudinarySalesRepImage(options) {
		return `https://s3.img-b.com/image/upload/t_base,w_${options.width},h_${options.height}/v1/mediabase/build_profiles/${options.repUserId}/profile/${options.repUserId}`;
	},

	getProfileImage(options) {
		return `https://s3.img-b.com/image/upload/t_profile,w_${options.width || 200},h_${options.height || 200},c_thumb,dpr_2.0/v1/mediabase/build_profiles/${options.repUserId}/profile/${options.repUserId}`;
	},

	slugify(text) {
		if (text) {
			// Replace spaces with -
			// Remove all non-word chars including underscores
			// Replace multiple - with single -
			// Trim - from start of text
			// Trim - from end of text
			return text
				.toLowerCase()
				.replace(/\s+/g, '-')
				.replace(/([^\w\-]|_)+/g, '-')
				.replace(/\-\-+/g, '-')
				.replace(/^-+/, '')
				.replace(/-+$/, '');
		} else {
			return text;
		}
	},

	removeHTML(html) {
		return entities.decode((html || '')
			.replace(/<(?:.|\n)*?>/gm, '')
			.replace(/[\n\r]+/g, '')
			.replace(/[\t]+/g, ' '))
			.replace(/&#x27;+/g, '\'')
			.trim();
	},

	escapeRegex(text) {
		return text.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
	},

	getImageUrl(manufacturer, image) {
		if (image && manufacturer) {
			manufacturer = manufacturer.toLowerCase().replace(/\s/g, '');

			return `http://s2.img-b.com/imagebase/resized/330x320/${manufacturer}images/${image.toLowerCase()}`;
		}
		return 'http://s2.img-b.com/imagebase/resized/100x100/404images/noimage.gif';
	},

	//@Offload
	getCategoryImageUrl(image) {
		if (image) {
			return `http://s2.img-b.com/build.com/imagebase/resized/140x140/category_${SITE_ID}/${image.toLowerCase()}`;
		}
		return 'http://s2.img-b.com/imagebase/resized/100x100/404images/noimage.gif';
	},

	getOverlayImageUrl(id, height) {
		return 	`https://s3.img-b.com/image/private/t_base,f_png,h_${height},dpr_2.0/${id}`;
	},

	getPricedOptionUrl(image) {
		if (image) {
			return `https://s2.img-b.com/build.com/mediabase/pricedoptionimages/${image.toLowerCase()}`;
		}
		return 'https://s2.img-b.com/imagebase/resized/100x100/404images/noimage.gif';
	},

	getIcon(name) {
		return `${helpers.isIOS() ? 'ios-' : 'md-'}${name}`;
	},

	setStatusBarStyle(style, animate) {
		if (helpers.isIOS()) {
			StatusBar.setBarStyle(style, animate);
		}
	},

	/**
	 * Set visibility of status bar
	 * Animation options are 'none', 'fade', and 'slide'
	 */
	setStatusBarHidden(hidden, animation) {
		if (helpers.isIOS()) {
			StatusBar.setHidden(hidden, animation);
		}
	},

	getResizedImageForUrl(url, width) {
		if (url && url.indexOf(CLOUDINARY_URL) !== -1) {
			const index = url.lastIndexOf('/');
			// we call PixelRatio from React here because I can't seem to figure out
			// how to get Babel to destructure PixelRatio correctly in the tests
			width = width * PixelRatio.get();
			return `${url.slice(0, index)}/w_${Math.round(width)}/${url.slice(index + 1)}`;
		} else {
			return url;
		}
	},

	getDate(date) {
		const d = new Date();
		const threshold1 = d.setDate(d.getDate() - 5);
		const threshold2 = d.setDate(d.getDate() - 30);
		if (date > threshold1) {
			return moment(date).startOf('minute').fromNow();
		} else if (date > threshold2) {
			return moment(date).format('MMM D');
		} else {
			return moment(date).format('MMM D, YYYY');
		}
	},

	getRelativeDate(date) {
		const d = new Date();
		const threshold1 = d.setDate(d.getDate() - 5);
		const threshold2 = d.setDate(d.getDate() - 30);
		if (date > threshold1) {
			return moment(date).startOf('day').fromNow();
		} else if (date > threshold2) {
			return moment(date).startOf('month').fromNow();
		} else {
			return moment(date).startOf('year').fromNow();
		}
	},

	getFormattedDate(date, format) {
		return moment(new Date(date)).format(format);
	},

	getDateStrictFormat(date) {
		if (!date) {
			return;
		}
		return moment(date).format('MM/DD/YYYY');
	},
	validFinish(finish) {
		return (finish.status && finish.status.toLowerCase() === 'stock'
				&& finish.image);
	},
	setFirstAvailableFinish(productDrop) {
		const { searchRelevantFinishIndex, finishes } = productDrop,
			getFirstViableFinish = (finishes) => {
				let index = 0;
				for (const finish of finishes) {
					if (helpers.validFinish(finish)) {
						return index;
					}
					index++;
				}
				return 0;
			};


		if (searchRelevantFinishIndex && helpers.validFinish(finishes[searchRelevantFinishIndex])) {
			productDrop.selectedFinishIndex = searchRelevantFinishIndex;
		} else {
			productDrop.selectedFinishIndex = getFirstViableFinish(finishes);
		}

		return productDrop;
	},

	setLowestPrice(productDrop) {
		productDrop.minPrice = productDrop.finishes[0].cost;
		for (const finish of productDrop.finishes) {
			if (finish.status && finish.status.toLowerCase() === 'stock' && finish.cost < productDrop.minPrice) {
				productDrop.minPrice = finish.cost;
			}
		}
		return productDrop;
	},

	toInteger(number) {
		const parsedNumber = Number.parseInt(number);
		return Number.isNaN(parsedNumber) ? 0 : parsedNumber;
	},

	toFloat(number) {
		const parsedNumber = Number.parseFloat(number);
		return Number.isNaN(parsedNumber) ? 0.0 : parsedNumber;
	},

	/**
	 * Numeral.js wrapped methods
	 */
	toUSD(number) {
		if (!Number.isNaN(number) && typeof number !== 'undefined') {
			return numeral(number).format('$0,0.00');
		}
	},

	toQuantity(number) {
		return numeral(number).format('0');
	},

	toBigNumber(number) {
		return numeral(number).format('0,0');
	},
	/**
	 * Numeral.js wrapped methods
	 */
	toSqFt(number) {
		if (typeof number !== 'undefined') {
			return numeral(number).format('0,0.00');
		}
	},
	autoCapitalize(string = '', all = false) {
		if (!string || typeof string !== 'string') {
			return '';
		}
		if (all) {
			return string.replace(/(^|[^a-zA-Z\u00C0-\u017F'])([a-zA-Z\u00C0-\u017F])/g, (m) => m.toUpperCase());
		} else {
			return string.charAt(0).toUpperCase() + string.substring(1);
		}
	},

	getCouponCodeFromCart(cart) {
		if (cart.couponCode && cart.couponCode.code) {
			return cart.couponCode.code;
		}
	},

	calcGrandTotal(cart, credit) {
		const { cart: { subTotal, couponTotal, shippingOptions, taxAmount }, selectedShippingIndex } = cart;
		let grandTotal = couponTotal ? subTotal - couponTotal : subTotal;

		if (shippingOptions && shippingOptions[selectedShippingIndex] && shippingOptions[selectedShippingIndex].shippingCost) {
			grandTotal += shippingOptions[selectedShippingIndex].shippingCost;
		}

		if (taxAmount) {
			grandTotal += taxAmount;
		}

		if (credit) {
			grandTotal = credit > grandTotal ? 0 : grandTotal - credit;
		}

		return numeral(grandTotal).format('0.00');
	},

	calcStoreCredit(cart, credit) {
		const grandTotal = parseFloat(this.calcGrandTotal(cart));
		const storeCredit = credit > grandTotal ? grandTotal : credit;

		return parseFloat(storeCredit);
	},

	serviceErrorCheck(results) {
		const error = Array.isArray(results) ? results[0] : results;

		if (error && error.code && error.message) {
			throw new Error(error.message);
		}
	},

	isNetworkError(error) {
		return error instanceof NetworkError;
	},

	isGeneralError(error) {
		return !this.isNetworkError(error);
	},

	isPushNotificationsAllowed({ badge, sound, alert }) {
		return !!badge || !!sound || !!alert;
	},

	measureComponentByRef(ref, onMeasure) {
		const handle = findNodeHandle(ref);
		UIManager.measure(handle, (x, y, width, height, pageX, pageY) => {
			onMeasure({ width, height, pageX, pageY });
		});
	},

};

module.exports = helpers;
