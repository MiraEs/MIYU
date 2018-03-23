
const dispatch = jest.fn();
jest.mock('redux-actions');

jest.mock('CameraRoll', () => ({
	getPhotos: jest.fn(() => Promise.resolve()),
}));

import { CameraRoll } from 'react-native';
jest.unmock('react-native');

jest.unmock('../../../app/actions/DevicePhotosActions');
import devicePhotosActions from '../DevicePhotosActions';

describe('DevicePhotosActions', () => {

	afterEach(() => {
		dispatch.mockClear();
	});

	describe('loadPhotosSuccess', () => {
		it('should return an object with matching props', () => {
			const result = devicePhotosActions.loadPhotosSuccess({}, false);
			expect(result).toEqual({
				type: 'LOAD_DEVICE_PHOTOS_SUCCESS',
				payload: {
					isFirstPage: false,
				},
			});
		});
	});

	describe('loadPhotosFail', () => {
		it('should return an object with matching props', () => {
			const error = new Error('test');
			const result = devicePhotosActions.loadPhotosFail(error);
			expect(result).toEqual({
				type: 'LOAD_DEVICE_PHOTOS_FAIL',
				payload: error,
			});
		});
	});

	describe('addPhoto', () => {
		it('should return a function and call dispatch', () => {
			devicePhotosActions.addPhoto({})(dispatch);
			expect(dispatch).toBeCalledWith({
				type: 'ADD_PHOTO',
				payload: {},
			});
		});
	});

	describe('getDevicePhotos', () => {
		it('should return a function and call CameraRoll.getPhotos', () => {
			devicePhotosActions.getDevicePhotos()(dispatch);
			expect(CameraRoll.getPhotos).toBeCalled();
		});
		it('should call CameraRoll with options', () => {
			const options = {
				filters: {
					cursor: '1',
				},
			};
			devicePhotosActions.getDevicePhotos(options)(dispatch);
			expect(CameraRoll.getPhotos).toBeCalledWith({
				first: 10,
				assetType: 'Photos',
				after: '1',
			});
		});
	});

	describe('resetSelectedPhotos', () => {
		it('should return a function and call dispatch with object', () => {
			devicePhotosActions.resetSelectedPhotos([{}])(dispatch);
			expect(dispatch).toBeCalledWith({
				type: 'REPLACE_SELECTED_PHOTOS',
				payload: [{}],
			});
		});
		it('should default the payload to an empty array', () => {
			devicePhotosActions.resetSelectedPhotos()(dispatch);
			expect(dispatch).toBeCalledWith({
				type: 'REPLACE_SELECTED_PHOTOS',
				payload: [],
			});
		});
	});

	describe('togglePhotoSelected', () => {
		it('should return a function and call dispatch with object', () => {
			const photoUrl = '/photo/url';
			devicePhotosActions.togglePhotoSelected(photoUrl)(dispatch);
			expect(dispatch).toBeCalledWith({
				type: 'TOGGLE_PHOTO_SELECTED',
				payload: photoUrl,
			});
		});
	});

	describe('toggleFetchingPhotos', () => {
		it('should return a function and call dispatch with object', () => {
			devicePhotosActions.toggleFetchingPhotos()(dispatch);
			expect(dispatch).toBeCalledWith({
				type: 'TOGGLE_FETCHING_PHOTOS',
			});
		});
	});

});
