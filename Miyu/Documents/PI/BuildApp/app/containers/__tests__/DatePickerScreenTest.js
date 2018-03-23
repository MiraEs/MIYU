jest.unmock('react-native');

jest.mock('../../lib/styles', () => ({
	measurements: {
		gridSpace2: 14,
	},
	colors: {
		white: 'white',
		greyLight: 'grey',
	},
	elements: {
		flex1: {
			flex: 1,
		},
	},
}));
jest.mock('BuildLibrary');
jest.mock('react-redux');
jest.mock('redux');
jest.mock('../../lib/helpers', () => ({}));
jest.mock('../../styles/navigationBarStyles', () => ({}));
jest.mock('../../actions/NavigatorActions', () => ({}));
jest.mock('../../actions/CartActions', () => ({
	getDeliveryDates: jest.fn(),
	setDeliveryDate: jest.fn(),
}));
jest.mock('../../lib/analytics/TrackingActions', () => ({}));

const props = {
	actions: {
		getDeliveryDates: jest.fn(),
	},
	deliveryDates: [{}],
	itemIds: [123],
	loading: false,
	requestedDeliveryDate: {},
	zipCode: 92106,
};

import { create } from 'react-test-renderer';
import React from 'react';
import 'react-native';
import {
	DatePickerScreen,
	mapStateToProps,
	mapDispatchToProps,
} from '../DatePickerScreen';
import {
	getDeliveryDates,
	setDeliveryDate,
} from '../../actions/CartActions';

describe('DatePickerScreen', () => {
	it('should render', () => {
		const wrapper = create(<DatePickerScreen {...props} />).toJSON();
		expect(wrapper).toMatchSnapshot();
	});
	it('should track screen load', () => {
		const instance = create(<DatePickerScreen {...props} />).getInstance();
		expect(instance.setScreenTrackingInformation()).toEqual({
			name: 'build:app:datepickerscreen',
		});
	});
	it('should getScreenData', () => {
		const instance = create(<DatePickerScreen {...props} />).getInstance();
		instance.getScreenData();
		expect(props.actions.getDeliveryDates).toBeCalledWith(92106);
	});
	it('should render button', () => {
		const instance = create(<DatePickerScreen {...props} />).getInstance();
		instance.getScreenData();
		expect(props.actions.getDeliveryDates).toBeCalledWith(92106);
	});
	describe('mapStateToProps', () => {
		it('should work with available dates', () => {
			const result = mapStateToProps({
				cartReducer: {
					cart: {
						availableDeliveryDates: 'available dates',
					},
				},
			});
			expect(result).toEqual({
				deliveryDates: 'available dates',
				loading: false,
			});
		});
		it('should work without available dates', () => {
			const result = mapStateToProps({
				cartReducer: {
					cart: {},
				},
			});
			expect(result).toEqual({
				deliveryDates: [],
				loading: true,
			});
		});
	});
	it('should mapDispatchToProps', () => {
		const dispatch = jest.fn((fn) => fn);
		const result = mapDispatchToProps(dispatch);
		expect(result).toEqual({
			actions: {
				getDeliveryDates,
				setDeliveryDate,
			},
		});
	});
});
