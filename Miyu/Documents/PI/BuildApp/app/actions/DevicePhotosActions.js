import { CameraRoll } from 'react-native';
import {
	ADD_PHOTO,
	LOAD_DEVICE_PHOTOS_FAIL,
	LOAD_DEVICE_PHOTOS_SUCCESS,
	REPLACE_SELECTED_PHOTOS,
	TOGGLE_FETCHING_PHOTOS,
	TOGGLE_PHOTO_SELECTED,
} from '../constants/constants';

/**
 * Get & Load Device Photos
 */

const loadPhotosSuccess = (data, isFirstPage) => {
	return {
		type: LOAD_DEVICE_PHOTOS_SUCCESS,
		payload: {
			...data,
			isFirstPage,
		},
	};
};

const loadPhotosFail = (payload) => {
	return {
		type: LOAD_DEVICE_PHOTOS_FAIL,
		payload,
	};
};

const addPhoto = (photo) => {
	return (dispatch) => {
		dispatch({
			type: ADD_PHOTO,
			payload: photo,
		});
	};
};

const getDevicePhotos = (options) => {
	options = options || {};
	options.isFirstPage = options.isFirstPage || false;

	const request = {
		first: 10,
		assetType: 'Photos',
	};

	const cursor = options.filters && options.filters.cursor ? options.filters.cursor : undefined;

	if (cursor) {
		request.after = cursor;
	}

	return (dispatch) => {
		const firstPage = options.isFirstPage;
		return CameraRoll.getPhotos(request).then((data) => {
			dispatch(loadPhotosSuccess(data, firstPage));
		}, (error) => {
			dispatch(loadPhotosFail(error));
		});
	};
};

const resetSelectedPhotos = (data) => {
	return (dispatch) => {
		return dispatch({
			type: REPLACE_SELECTED_PHOTOS,
			payload: data || [],
		});
	};
};

const togglePhotoSelected = (photoUrl) => {
	return (dispatch) => {
		return dispatch({
			type: TOGGLE_PHOTO_SELECTED,
			payload: photoUrl,
		});
	};
};

const toggleFetchingPhotos = () => {
	return (dispatch) => {
		return dispatch({
			type: TOGGLE_FETCHING_PHOTOS,
		});
	};
};

module.exports = {
	loadPhotosSuccess,
	loadPhotosFail,
	addPhoto,
	getDevicePhotos,
	resetSelectedPhotos,
	togglePhotoSelected,
	toggleFetchingPhotos,
};
