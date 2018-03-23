import { create } from 'react-test-renderer';
import React from 'react';
import 'react-native';
import FinishDetail from '../finishDetail';

const props = {
	cost: 123.45,
	pricebookCostView: {
		cost: 123.45,
	},
	finish: 'finish',
	image: 'image.png',
	manufacturer: 'mfg',
	leadTimeInformation: {},
	onPress: jest.fn(),
	uniqueId: 15,
	isSelected: true,
	hexValue: '654321',
	finishSwatch: {
		hexValue: '987654',
	},
};

jest.mock('react-native');
jest.mock('../../constants/CloudinaryConstants', () => ({
	PRODUCT_SECTION: 'PRODUCT_SECTION',
	IMAGE_100: 'IMAGE_100',
}));
jest.mock('../../lib/helpers', () => ({
	getCloudinaryImageUrl: jest.fn(() => '/image/url'),
	toUSD: jest.fn(munMuns => `$${munMuns}`),
}));

function setup(otherProps) {
	const wrapper = create(
		<FinishDetail
			{...props}
			{...otherProps}
		/>
	);
	const instance = wrapper.getInstance();
	return {
		wrapper,
		instance,
	};
}

describe('FinishDetail', () => {
	describe('render', () => {
		it('should render with full props', () => {
			const { wrapper } = setup();
			expect(wrapper.toJSON()).toMatchSnapshot();
		});
		it('should render with isSelected false, no pricebookCostView, no hex value, and leadTimeInformation', () => {
			const {wrapper} = setup({
				isSelected: false,
				pricebookCostView: undefined,
				leadTimeInformation: {
					estimatedShippingDate: 'some day',
					text: 'lead time info text',
				},
				hexValue: '',
			});
			expect(wrapper.toJSON()).toMatchSnapshot();
		});
	});
});
