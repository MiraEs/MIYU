jest.mock('react-native');
jest.mock('BuildNative');
jest.mock('BuildLibrary');
jest.mock('../../SimpleModal', () => 'SimpleModal');
jest.mock('../../AddToCartButton', () => 'AddToCartButton');
jest.mock('../../OptionSelectButton', () => 'OptionSelectButton');
jest.mock('../../../lib/animations', () => ({
	fadeIn: {},
}));
jest.mock('../../../lib/eventEmitter', () => ({
	emit: jest.fn(),
}));

import React from 'react';
import ReactNative from 'react-native';
import BuildLibrary from 'build-library';
import EventEmitter from '../../../lib/eventEmitter';
import SimpleModal from '../../SimpleModal';
import { RelatedProduct } from '../RelatedProduct';

const defaultProps = {
	id: '1',
	titlePrimary: 'Test Primary',
	titleSecondary: 'Test Secondary',
	compositeId: 1,
	onAddToCartPress: jest.fn(),
	onQuantityInputFocus: jest.fn(),
	optionType: 'Required',
	optionProducts: [],
	whyText: 'some text',
	friendlyName: 'Friendly Name',
	neededQuantity: 1,
	isSuggestedItem: true,
	selectedFinish: {},
	selectedDrop: {},
	actions: {
		getProductRootCategory: jest.fn(),
		trackAction: jest.fn(),
	},
	navigator: {
		push: jest.fn(),
	},
};

describe('RelatedProduct', () => {

	it('should render', () => {
		const tree = require('react-test-renderer').create(
			<RelatedProduct {...defaultProps} />
		);
		expect(tree.toJSON()).toMatchSnapshot();
	});
});

describe('RelatedProduct functions', () => {

	it('state', () => {
		const instance = require('react-test-renderer').create(
			<RelatedProduct {...defaultProps} />
		).getInstance();
		expect(instance.state).toMatchSnapshot();
	});

	it('onWhyTextPress', () => {
		require('react-test-renderer').create(
			<RelatedProduct {...defaultProps} />
		).getInstance().onWhyTextPress('Title', 'content');
		expect(EventEmitter.emit).toBeCalledWith('showScreenOverlay', <SimpleModal title="Title"><ReactNative.View><BuildLibrary.Text>content</BuildLibrary.Text></ReactNative.View></SimpleModal>);
	});

	it('onFinishButtonPress', () => {
		require('react-test-renderer').create(
			<RelatedProduct {...defaultProps} />
		).getInstance().onFinishButtonPress();
		expect(defaultProps.navigator.push).toBeCalledWith('upsellFinishSelection', {
			optionId: '1',
			prevSelectedFinish: {},
		});
	});

	it('onModelDetailPress', () => {
		require('react-test-renderer').create(
			<RelatedProduct {...defaultProps} />
		).getInstance().onModelDetailPress();
		expect(defaultProps.navigator.push).toBeCalledWith('modelDetailPickerScreen', {
			finish: defaultProps.selectedFinish.finish,
			optionId: defaultProps.id,
			optionProducts: [],
			productFriendlyName: defaultProps.friendlyName,
		});
	});

	it('onUpdateQuantity', () => {
		const wrapper = require('react-test-renderer').create(
			<RelatedProduct {...defaultProps} />
		).getInstance();
		wrapper.onUpdateQuantity(2);
		expect(wrapper.state.quantity).toEqual(2);
	});

	describe('isMatchOptionType', () => {
		it('should match', () => {
			const result = require('react-test-renderer').create(
				<RelatedProduct {...defaultProps} />
			).getInstance().isMatchOptionType('asdf', 'asdf');
			expect(result).toEqual(true);
		});

		it('should match', () => {
			const result = require('react-test-renderer').create(
				<RelatedProduct {...defaultProps} />
			).getInstance().isMatchOptionType('asdf', 'asdF');
			expect(result).toEqual(true);
		});

		it('should match', () => {
			const result = require('react-test-renderer').create(
				<RelatedProduct {...defaultProps} />
			).getInstance().isMatchOptionType('asdf', 'ASDF');
			expect(result).toEqual(true);
		});

		it('should not match', () => {
			const result = require('react-test-renderer').create(
				<RelatedProduct {...defaultProps} />
			).getInstance().isMatchOptionType('asdf', 'qwer');
			expect(result).toEqual(false);
		});
	});

});
