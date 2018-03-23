import {
	CATEGORIES_SUCCESS,
	CATEGORY_SUCCESS,
	CATEGORIES_FAIL,
} from '../constants/categoryConstants';
import { handleActions } from 'redux-actions';

const initialState = {
	headerCategories: [],
	categories: {},
	error: '',
};

export default handleActions({
	[CATEGORIES_SUCCESS]: (state, action) => ({
		...state,
		headerCategories: action.payload.filter((c) => !c.link || (c.link && /^\d+$/.test(c.link))),
		error: '',
	}),
	[CATEGORIES_FAIL]: (state, action) => {
		return {
			...state,
			error: action.payload,
		};
	},
	[CATEGORY_SUCCESS]: (state, action) => {
		const newCats = {...state.categories};
		// @Offload
		action.payload.category.featuredCategories = action.payload.subCategories.featuredSubcategories.filter((c) => !c.link || (c.link && /\d+$/.test(c.link)));
		action.payload.category.nonFeaturedCategories = action.payload.subCategories.additionalSubcategories.filter((c) => !c.link || (c.link && /\d+$/.test(c.link)));
		newCats[action.payload.category.id] = action.payload.category;
		return {
			...state,
			categories: newCats,
			error: '',
		};
	},
}, initialState);
