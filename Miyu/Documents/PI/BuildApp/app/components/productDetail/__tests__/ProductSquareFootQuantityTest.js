

jest.mock('../../../lib/helpers', () => ({
	toInteger: jest.fn((number) => Number.parseInt(number, 10)),
	toSqFt: jest.fn((footage) => footage),
	toUSD: jest.fn((dollar) => `$${dollar}`),
	toBigNumber: jest.fn((num) => num),
}));
jest.mock('build-library');
jest.mock('../../../lib/Validations', () => ({}));
jest.mock('../../../components/TooltipInput', () => 'TooltipInput');

jest.unmock('react-native');
import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';

import ProductSquareFootQuantity from '../ProductSquareFootQuantity';

const fullProps = {
	onCartonCountChange: jest.fn(),
	onSquareFootageChange: jest.fn(),
	squareFootage: 20,
	costPerSquareFoot: 2.75,
	squareFootagePerCarton: 22,
	stockCount: 20,
};

describe('ProductSquareFootQuantity', () => {

	beforeEach(() => jest.resetModules());

	it('should render default props', () => {
		const wrapper = renderer.create(
			<ProductSquareFootQuantity {...fullProps} />
		);
		expect(wrapper.toJSON()).toMatchSnapshot();
	});

	it('should call onCartonCountChange', () => {
		const props = {...fullProps};
		renderer.create(
			<ProductSquareFootQuantity {...props} />
		);
		props.squareFootage = 100;
		expect(fullProps.onCartonCountChange).toBeCalled();
	});

	it('should render the tooltip with no square footage message', () => {
		const wrapper = renderer.create(
			<ProductSquareFootQuantity
				{...fullProps}
				squareFootage={undefined}
			/>
		);
		const result = wrapper.getInstance().renderTooltip();
		expect(result).toMatchSnapshot();
	});

	it('should render the tooltip with square footage message', () => {
		const wrapper = renderer.create(
			<ProductSquareFootQuantity {...fullProps} />
		);
		const result = wrapper.getInstance().renderTooltip();
		expect(result).toMatchSnapshot();
	});

});
