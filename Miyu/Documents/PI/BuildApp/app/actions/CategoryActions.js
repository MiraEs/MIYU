import categoryService from '../services/categoryService';

import {
	CATEGORIES_SUCCESS,
	CATEGORY_SUCCESS,
	CATEGORIES_FAIL,
} from '../constants/categoryConstants';
import { createAction } from 'redux-actions';
import helpers from '../lib/helpers';


const categoryActions = {
	getCategoriesSuccess: createAction(CATEGORIES_SUCCESS),
	getCategorySuccess: createAction(CATEGORY_SUCCESS),
	getCategoriesFail: createAction(CATEGORIES_FAIL),

	getCategories() {
		return (dispatch) => {
			return categoryService.getCategories().then((data) => {
				helpers.serviceErrorCheck(data);
				dispatch(categoryActions.getCategoriesSuccess(data));
			})
				.catch((error) => {
					dispatch(categoryActions.getCategoriesFail(error.message));
				});
		};
	},

	getCategory(category) {
		return (dispatch) => {
			return Promise.all([category.name ? category : categoryService.getCategory(category.id), categoryService.getSubCategories(category.id)]).then(([category, subCategories]) => {
				dispatch(categoryActions.getCategorySuccess({ category, subCategories }));
			}, (error) => {
				dispatch(categoryActions.getCategoriesFail(error));
			});
		};
	},

};

module.exports = categoryActions;
