'use strict';

jest.unmock('../../../app/reducers/photosReducer');

import photoReducer from '../photosReducer';

import {
	LOAD_PHOTOS_FAIL,
	LOAD_PHOTOS_SUCCESS,
	LOADING_PHOTOS,
} from '../../constants/constants';

const emptyState = {
	error: '',
	loading: false,
	photos: [],
};

const loadPhotosFailAction = {
	type: LOAD_PHOTOS_FAIL,
	payload: 'error',
};

const loadPhotosSuccessAction = {
	type: LOAD_PHOTOS_SUCCESS,
	payload: ['photo0', 'photo1', 'photo2'],
};

const loadingPhotosAction = {
	type: LOADING_PHOTOS,
	payload: true,
};

const otherTypeAction = {
	type: 'OTHER_TYPE',
};

describe('app/reducers/photosReducer.js', () => {
	it('should update state with photos from LOAD_PHOTOS_SUCCESS', () => {
		const state = photoReducer(emptyState, loadPhotosSuccessAction);
		expect(state).toEqual({
			...emptyState,
			photos: loadPhotosSuccessAction.payload,
		});
	});

	it('should update state with LOAD_PHOTOS_FAIL', () => {
		const state = photoReducer(emptyState, loadPhotosFailAction);
		expect(state).toEqual({
			...emptyState,
			error: loadPhotosFailAction.payload,
		});
	});

	it('should update state with LOADING_PHOTOS', () => {
		const state = photoReducer(emptyState, loadingPhotosAction);
		expect(state).toEqual({
			...emptyState,
			loading: loadingPhotosAction.payload,
		});
	});

	it('should not affect the state on ignored actions', () => {
		const state = photoReducer(emptyState, otherTypeAction);
		expect(state).toEqual(emptyState);
	});
});
