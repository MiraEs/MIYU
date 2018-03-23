import devicePhotosReducer from '../devicePhotosReducer';

const photo1 = {
	image: {
		uri: '/photo/uri',
	},
	isSelected: true,
};

const photo2 = {
	image: {
		uri: '/other/photo/uri',
	},
	isSelected: false,
};

const photo3 = {
	image: {
		uri: '/yet/another/photo/uri',
	},
	isSelected: true,
};

const initialState = {
	cursor: '',
	error: '',
	hasNextPage: false,
	isFetchingNextPage: false,
	photos: [],
	selectedPhotos: [],
};

describe('devicePhotosReducer', () => {
	it('should handle ADD_PHOTO', () => {
		const action = {
			type: 'ADD_PHOTO',
			payload: '/test/uri',
		};
		const result = devicePhotosReducer(initialState, action);
		expect(result).toMatchSnapshot();
	});
	it('should handle FILTER_SELECTED_PHOTOS', () => {
		const action = {
			type: 'FILTER_PHOTOS_SELECTED',
			payload: [{
				uri: '/selected/photo',
				selected: true,
			}, {
				uri: '/not/selected/photo',
				selected: false,
			}],
		};
		const result = devicePhotosReducer(initialState, action);
		expect(result).toMatchSnapshot();
	});
	it('should handle LOAD_DEVICE_PHOTOS_FAIL', () => {
		const error = new Error('load device photos test error');
		const action = {
			type: 'LOAD_DEVICE_PHOTOS_FAIL',
			payload: error,
		};
		const result = devicePhotosReducer(initialState, action);
		expect(result).toMatchSnapshot();
	});
	it('should handle LOAD_DEVICE_PHOTOS_SUCCESS', () => {
		const action = {
			type: 'LOAD_DEVICE_PHOTOS_SUCCESS',
			payload: {
				edges: [{
					node: {
						image: {
							uri: '/uri/1',
						},
					},
				}],
				page_info: {
					has_next_page: true,
					end_cursor: 'u-u-i-d',
				},
			},
		};
		const result = devicePhotosReducer(initialState, action);
		expect(result).toMatchSnapshot();
	});
	it('should handle LOAD_DEVICE_PHOTOS_SUCCESS with selectedPhotos and one page', () => {
		const action = {
			type: 'LOAD_DEVICE_PHOTOS_SUCCESS',
			payload: {
				edges: [{
					node: photo1,
				}],
				page_info: {
					has_next_page: false,
					end_cursor: 'u-u-i-d',
				},
				isFirstPage: true,
			},
		};
		const initial = {
			...initialState,
			selectedPhotos:[photo1],
		};
		const result = devicePhotosReducer(initial, action);
		expect(result).toMatchSnapshot();
	});
	it('should handle REPLACE_SELECTED_PHOTOS', () => {
		const action = {
			type: 'REPLACE_SELECTED_PHOTOS',
			payload: [photo1.image.uri],
		};
		const result = devicePhotosReducer(initialState, action);
		expect(result).toMatchSnapshot();
	});
	it('should handle TOGGLE_FETCHING_PHOTOS', () => {
		const action = {
			type: 'TOGGLE_FETCHING_PHOTOS',
			payload: '/photo/uri',
		};
		const result = devicePhotosReducer(initialState, action);
		expect(result).toMatchSnapshot();
	});
	it('should handle TOGGLE_PHOTO_SELECTED', () => {
		const action = {
			type: 'TOGGLE_PHOTO_SELECTED',
			payload: '/photo/uri',
		};
		const initial = {
			...initialState,
			photos: [photo1, photo2, photo3],
		};
		const result = devicePhotosReducer(initial, action);
		expect(result).toMatchSnapshot();
	});
});
