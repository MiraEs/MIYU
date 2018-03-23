'use strict';

import {
	ORDER_TO_RETURN,
	UPDATE_ITEM_IN_RETURN,
	UPDATE_SHIPPING_METHODS,
} from '../constants/constants';
import { handleActions } from 'redux-actions';
import cloneDeep from 'lodash.clonedeep';

const initialState = {
	returnInProgress: {
		itemsGroups: [{
			id: 1,
			items: [],
			shippingMethods: [{
				description: 'Return shipping cost will be deducted from your refund. A printer is required.',
				title: 'Drop off at UPS',
				price: 7,
			}, {
				description: 'Return shipping cost will be deducted from your refund. A printer is required. You will need to call UPS to schedule a pick-up.',
				title: 'Have UPS come pick up',
				price: 12,
			}, {
				description: 'You are responsible for obtaining your own shipping label and will not have full visibility into return tracking/status.',
				isPro: true,
				title: 'Return with your own shipping label & provider',
			}],
		}],
		groupsForReturn: [{
			id: 1,
			items: [],
			shippingMethod: {
				title: 'UPS Drop-off',
				price: 7,
			},
			refund: {
				type: 'Store Credit',
			},
			groupSummary: {
				originalCost: 630,
				tax: 8,
				returnShipping: -7,
				total: 631,
			},
		}, {
			id: 2,
			items: [],
			shippingMethod: {
				title: 'UPS Pick-up',
				price: 12,
			},
			refund: {
				type: 'Credit Card',
				cardInfo: {
					cardType: 'Discover',
					lastFour: 1234,
					expDate: '1/1/21',
				},
			},
			groupSummary: {
				originalCost: 630,
				tax: 8,
				returnShipping: -12,
				total: 631,
			},
		}],
	},
};

const ReturnsReducer = handleActions({
	[ORDER_TO_RETURN]: (state, action) => {
		return {
			...state,
			returnInProgress: {
				...state.returnInProgress,
				items: [...action.payload],
				itemsGroups: [{ // remove this example code
					...state.returnInProgress.itemsGroups[0],
					items: [...action.payload],
				}],
				groupsForReturn: [{ // remove this example code
					...state.returnInProgress.groupsForReturn[0],
					items: [...action.payload],
				}, {
					...state.returnInProgress.groupsForReturn[1],
					items: [...action.payload],
				}],
			},
		};
	},
	[UPDATE_ITEM_IN_RETURN]: (state, { payload: {index, item} }) => {
		const tempItems = cloneDeep(state.returnInProgress.items);
		tempItems[index] = {
			...tempItems[index],
			...item,
		};
		return {
			...state,
			returnInProgress: {
				...state.returnInProgress,
				items: [
					...tempItems,
				],
			},
		};
	},
	[UPDATE_SHIPPING_METHODS]: (state, { payload: { groupIndex, shippingMethods }}) => {
		const tempItemsGroups = cloneDeep(state.returnInProgress.itemsGroups);
		tempItemsGroups[groupIndex].shippingMethods = [
			...shippingMethods,
		];
		return {
			...state,
			returnInProgress: {
				...state.returnInProgress,
				itemsGroups: [
					...tempItemsGroups,
				],
			},
		};
	},
}, initialState);

export default ReturnsReducer;
