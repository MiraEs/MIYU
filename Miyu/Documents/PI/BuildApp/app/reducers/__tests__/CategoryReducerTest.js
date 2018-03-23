import categoryReducer from '../categoryReducer';
import {
	CATEGORIES_SUCCESS,
	CATEGORY_SUCCESS,
	CATEGORIES_FAIL,
} from '../../constants/categoryConstants';

describe('categoryReducer', () => {
	it('should return initialState', () => {
		expect(categoryReducer(undefined, {})).toMatchSnapshot();
	});


	it('should return the state for CATEGORIES_SUCCESS', () => {
		expect(categoryReducer(undefined, {
			type: CATEGORIES_SUCCESS,
			payload: [ {link: '/foo/c/1234'}, {}, {categoryid:1234}, {link: '/foo/c1234'}, {link: '1234'} ],
		})).toMatchSnapshot();
	});


	it('should return the state for CATEGORY_SUCCESS', () => {
		expect(categoryReducer({
			categories: [],
		}, {
			type: CATEGORY_SUCCESS,
			payload: {
				category: {
					id: 1,
					name: 'name',
				},
				subCategories: {
					featuredSubcategories: [ {link: '/foo/c/1234'}, {}, {categoryid:1234}, {link: '/foo/c1234'}, {link: '1234'} ],
					additionalSubcategories: [ {link: '/foo/c/1234'}, {}, {categoryid:1234}, {link: '/foo/c1234'}, {link: '1234'} ],
				},
			},
		})).toMatchSnapshot();
	});


	it('should return the state for CATEGORIES_FAIL', () => {
		expect(categoryReducer(undefined, {
			type: CATEGORIES_FAIL,
			payload: {
				abc: 123,
			},
		})).toMatchSnapshot();
	});

});
