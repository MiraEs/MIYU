'use strict';
import { handleActions } from 'redux-actions';
import {
	ADD_PHOTO,
	FILTER_PHOTOS_SELECTED,
	LOAD_DEVICE_PHOTOS_FAIL,
	LOAD_DEVICE_PHOTOS_SUCCESS,
	REPLACE_SELECTED_PHOTOS,
	TOGGLE_FETCHING_PHOTOS,
	TOGGLE_PHOTO_SELECTED,
} from '../constants/constants';

const initialState = {
	cursor: '',
	error: '',
	hasNextPage: false,
	isFetchingNextPage: false,
	photos: [],
	selectedPhotos: [],
};

const devicePhotosReducer = handleActions({
	[ADD_PHOTO]: (state, { payload: uri }) => {
		const photos = [{
			image: {
				uri,
			},
			isSelected: true,
		}, ...state.photos];
		const selectedPhotos = photos.filter((photo) => {
			return photo.isSelected;
		});
		return {
			...state,
			selectedPhotos,
			photos,
		};
	},
	[FILTER_PHOTOS_SELECTED]: (state, { payload }) => {
		return {
			...state,
			data: payload.filter((photo) => photo.selected),
		};
	},
	[LOAD_DEVICE_PHOTOS_FAIL]: (state, { payload: error }) => {
		return {
			...state,
			error,
		};
	},
	[LOAD_DEVICE_PHOTOS_SUCCESS]: (state, { payload }) => {
		const photos = payload.edges.map((photo) => {
			const selectedMatch = state.selectedPhotos.find((selectedPhoto) => {
				return selectedPhoto.image.uri === photo.node.image.uri;
			});
			return {
				...photo.node,
				isSelected: selectedMatch !== undefined,
			};
		});
		return {
			...state,
			photos: payload.isFirstPage ? photos : [...state.photos, ...photos],
			hasNextPage: payload.page_info.has_next_page,
			cursor: payload.page_info.has_next_page ? payload.page_info.end_cursor : initialState.cursor,
			isFetchingNextPage: false,
		};
	},
	[REPLACE_SELECTED_PHOTOS]: (state, { payload: selectedPhotos }) => {
		return {
			...state,
			selectedPhotos,
		};
	},
	[TOGGLE_FETCHING_PHOTOS]: (state) => {
		return {
			...state,
			isFetchingNextPage: !state.isFetchingNextPage,
		};
	},
	[TOGGLE_PHOTO_SELECTED]: (state, { payload: uri }) => {
		const selectedPhotos = [];
		const photos = state.photos.map((photo) => {
			const isSelected = photo.image.uri === uri ? !photo.isSelected : photo.isSelected;
			if (isSelected) {
				selectedPhotos.push(photo.image.uri);
			}
			return {
				...photo,
				isSelected,
			};
		});

		return {
			...state,
			photos,
			selectedPhotos,
		};
	},
}, initialState);

export default devicePhotosReducer;
