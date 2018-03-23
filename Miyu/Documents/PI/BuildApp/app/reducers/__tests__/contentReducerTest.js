'use strict';

jest.unmock('../../../app/reducers/contentReducer');

import contentReducer from '../contentReducer';

import {
	LOAD_CONTENT,
	LOAD_CONTENT_SUCCESS,
	LOAD_CONTENT_FAIL,
	LOAD_SHARED_PROMO_SUCCESS,
	LOAD_CONTENT_GROUP_SUCCESS,
	LOAD_ROUTE_PAGE,
	LOAD_ROUTE_PAGE_SUCCESS,
	LOAD_ROUTE_PAGE_FAIL,
} from '../../constants/ContentConstants' ;


describe('contentReducer reducer', () => {

	it('should return initialState', () => {
		expect(contentReducer(undefined, {})).toMatchSnapshot();
	});


	it('should LOAD_CONTENT', () => {
		const action = {
			type: LOAD_CONTENT,
			payload: {
				id: 1,
			},
		};
		const state = contentReducer(undefined, action);
		expect(
			state
		).toMatchSnapshot();
	});

	it('should LOAD_CONTENT_SUCCESS', () => {
		const action = {
			type: LOAD_CONTENT_SUCCESS,
			payload: {
				id: 1,
			},
		};
		const state = contentReducer(undefined, action);
		expect(
			state
		).toMatchSnapshot();
	});

	it('should LOAD_CONTENT_FAIL', () => {
		const action = {
			type: LOAD_CONTENT_FAIL,
			error: {
				message: 'not found',
			},
			payload: {
				id: 1,
			},
		};
		const state = contentReducer(undefined, action);
		expect(
			state
		).toMatchSnapshot();
	});

	it('should LOAD_SHARED_PROMO_SUCCESS', () => {
		const action = {
			type: LOAD_SHARED_PROMO_SUCCESS,
			payload: {
				categoryId: 1,
				data: [],
			},
		};
		const state = contentReducer(undefined, action);
		expect(
			state
		).toMatchSnapshot();
	});

	it('should LOAD_CONTENT_GROUP_SUCCESS', () => {
		const action = {
			type: LOAD_CONTENT_GROUP_SUCCESS,
			payload: {
				type: 'type',
				data: [],
			},
		};
		const state = contentReducer(undefined, action);
		expect(
			state
		).toMatchSnapshot();
	});

	it('should LOAD_ROUTE_PAGE', () => {
		const action = {
			type: LOAD_ROUTE_PAGE,
			payload: {
				rotue: 'route',
			},
		};
		const state = contentReducer(undefined, action);
		expect(
			state
		).toMatchSnapshot();
	});

	it('should LOAD_ROUTE_PAGE_SUCCESS', () => {
		const action = {
			type: LOAD_ROUTE_PAGE_SUCCESS,
			payload: {
				route: 'route',
				data: [{}],
			},
		};
		const state = contentReducer(undefined, action);
		expect(state).toMatchSnapshot();
	});

	it('should LOAD_ROUTE_PAGE_FAIL', () => {
		const action = {
			type: LOAD_ROUTE_PAGE_FAIL,
			error: {
				message: 'message',
			},
			payload: {
				rotue: 'route',
			},
		};
		const state = contentReducer(undefined, action);
		expect(
			state
		).toMatchSnapshot();
	});

});
