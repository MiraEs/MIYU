
jest.mock('../../../lib/productHelpers', () => ({
	getStockText: jest.fn((selectedFinish) => `${selectedFinish.stockCount} In Stock`),
}));
jest.mock('build-library');

import React from 'react';
jest.unmock('react-native');
import 'react-native';
import renderer from 'react-test-renderer';

import StockCount from '../StockCount';

const fullProps = {
	availableByLocation: false,
	selectedFinish: {
		stockCount: 7,
	},
	squareFootageBased: false,
	discontinued: false,
};

describe('StockCount', () => {
	it('should render a stock count', () => {
		const wrapper = renderer.create(<StockCount {...fullProps} />);
		expect(wrapper.toJSON()).toMatchSnapshot();
	});
	it('should return null if discontinued', () => {
		const wrapper = renderer.create(
			<StockCount
				{...fullProps}
				discontinued={true}
			/>
		);
		expect(wrapper.toJSON()).toMatchSnapshot();
	});
	it('should return null if squareFootageBased', () => {
		const wrapper = renderer.create(
			<StockCount
				{...fullProps}
				squareFootageBased={true}
			/>
		);
		expect(wrapper.toJSON()).toMatchSnapshot();
	});
	it('should return null if availableByLocation', () => {
		const wrapper = renderer.create(
			<StockCount
				{...fullProps}
				availableByLocation={true}
			/>
		);
		expect(wrapper.toJSON()).toMatchSnapshot();
	});
	it('should return null if no selectedFinish', () => {
		const wrapper = renderer.create(<StockCount />);
		expect(wrapper.toJSON()).toMatchSnapshot();
	});
});
