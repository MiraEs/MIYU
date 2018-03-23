jest.mock('BuildNative');
jest.mock('BuildLibrary');
jest.mock('react-redux');
jest.mock('redux');
jest.mock('../../lib/helpers');
jest.mock('../../lib/SimpleStoreHelpers');

jest.unmock('react-native');

import { AddToProjectButton } from '../AddToProjectButton';
import React from 'react';
import renderer from 'react-test-renderer';
import {
	NO_THANK_YOU,
	I_DONT_NEED_THIS,
} from '../../constants/productDetailConstants';

const defaultProps = {
	navigation: {
		getNavigator: jest.fn(() => ({ push: jest.fn() })),
	},
	onHasOptionGroups: jest.fn(),
	onSquareFootageBased: jest.fn(),
	productConfigurationId: '',
	productComposite: {},
	quantity: 1,
	selectedFinish: {},
	selectedPricedOptions: [],
	validateAvailability: jest.fn(() => true),
	sessionCartId: null,
	isLoggedIn: true,
};

describe('AddToProjectButton component', () => {

	it('should render correctly', () => {
		const tree = renderer.create(<AddToProjectButton {...defaultProps} />);
		expect(tree).toMatchSnapshot();
	});

	it('should call onSquareFootageBased callback', () => {
		const props = {
			...defaultProps,
			productConfigurationId: 'test123',
			productComposite: {
				squareFootageBased: true,
			},
			quantity: 0,
		};
		const tree = renderer.create(<AddToProjectButton {...props} />);
		tree.getInstance().validate();
		expect(tree.getInstance().props.onSquareFootageBased).toHaveBeenCalled();
	});

	it('should call onHasOptionGroups', () => {
		const props = {
			...defaultProps,
			productConfigurationId: 'test123',
			productComposite: {
				pricedOptionGroups: [{
					pricedOptions: [],
				}],
			},
		};
		const tree = renderer.create(<AddToProjectButton {...props} />);
		tree.getInstance().validate();
		expect(tree.getInstance().props.onHasOptionGroups).toHaveBeenCalled();
	});

	describe('isOptional', () => {
		it('should return true if it has pricedOption value == NO_THANK_YOU', () => {
			const pricedOption = {
				value: NO_THANK_YOU,
			};
			const instance = new AddToProjectButton();
			const result = instance.isOptional(pricedOption);
			expect(result).toBe(true);
		});

		it('should return true if it has pricedOption value == I_DONT_NEED_THIS', () => {
			const pricedOption = {
				value: I_DONT_NEED_THIS,
			};
			const instance = new AddToProjectButton();
			const result = instance.isOptional(pricedOption);
			expect(result).toBe(true);
		});

		it('should return false', () => {
			const pricedOption = {
				value: 'test',
			};
			const instance = new AddToProjectButton();
			const result = instance.isOptional(pricedOption);
			expect(result).toBe(false);
		});
	});
});

