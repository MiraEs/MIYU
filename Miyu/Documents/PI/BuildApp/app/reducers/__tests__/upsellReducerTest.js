import upsellReducer from '../upsellReducer';
import {
	GET_RELATED_UPSELL_PRODUCTS,
	RESET_RELATED_UPSELL_PRODUCTS,
	SET_SELECTED_UPSELL_FINISH,
	SET_SELECTED_UPSELL_MODEL,
} from '../../constants/UpsellConstants' ;

jest.unmock('../../../app/reducers/upsellReducer');

const finish1 = {
	finish: 'copper',
};

const finish2 = {
	finish: 'bronze',
};

const productDrop1 = {
	finishes: [finish1, finish2],
};

const optionProduct1 = {
	productDrop: productDrop1,
};

const recommendedOption1 = {
	productDrop: productDrop1,
	optionProducts: [optionProduct1],
};

describe('upsellReducer reducer', () => {

	it('should return initialState', () => {
		expect(upsellReducer(undefined, {})).toMatchSnapshot();
	});


	it('should GET_RELATED_UPSELL_PRODUCTS', () => {
		const action = {
			type: GET_RELATED_UPSELL_PRODUCTS,
			payload: {
				recommendedOptions: [recommendedOption1],
				accessories: [],
				finish: {},
			},
		};
		const state = upsellReducer({undefined}, action);
		expect(
			state
		).toMatchSnapshot();
	});

	it('should RESET_RELATED_UPSELL_PRODUCTS', () => {
		const action = {
			type: RESET_RELATED_UPSELL_PRODUCTS,
		};
		const state = upsellReducer(undefined, action);
		expect(
			state
		).toMatchSnapshot();
	});

	it('should SET_SELECTED_UPSELL_FINISH', () => {
		const action = {
			type: SET_SELECTED_UPSELL_FINISH,
		};
		const state = upsellReducer(undefined, action);
		expect(
			state
		).toMatchSnapshot();
	});

	it('should SET_SELECTED_UPSELL_MODEL', () => {
		const action = {
			type: SET_SELECTED_UPSELL_MODEL,
		};
		const state = upsellReducer(undefined, action);
		expect(
			state
		).toMatchSnapshot();
	});

});
