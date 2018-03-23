import { shallow } from 'enzyme';
import React from 'react';
import 'react-native';

jest.unmock('react-native');
jest.mock('build-library');
jest.mock('react-redux');
jest.mock('../../../lib/productHelpers', () => ({
	getConfiguredPrice: jest.fn(() => 777),
	getStockText: jest.fn(() => 'stock text'),
}));
jest.mock('../../../lib/styles');
jest.mock('../../../lib/helpers', () => ({
	toUSD: jest.fn((price) => `$${price}`),
}));

import {
	ProductConfigurationHeader,
	mapStateToProps,
} from '../ProductConfigurationHeader';

const compositeId = 1234;
const manufacturer = 'mfg';
const selectedLeadTimeText = 'lead time text';
const selectedSku = 'selectedSKU';
const finishOne = {
	pricebookCostView: {
		cost: 123,
	},
	leadTimeText: selectedLeadTimeText,
	sku: selectedSku,
};
const stockText = 'stock text';
const productComposite = {
	manufacturer,
};
const productConfigurationId = 'u-u-i-d';
const props = {
	hasSelectedFinish: true,
	productComposite: {
		productId: 'compositeProductId',
		finishes: [finishOne, {
			pricebookCostView: {
				cost: 321,
			},
		}],
	},
	productConfiguration: {},
	manufacturer,
	selectedLeadTimeText,
	stockText,
	selectedSku,
	productConfigurationId,
};

describe('ProductConfigurationHeader', () => {
	it('should render with selected finish', () => {
		const wrapper = shallow(<ProductConfigurationHeader {...props} />);
		expect(wrapper).toMatchSnapshot();
	});
	it('should render with no selected finish', () => {
		const wrapper = shallow(
			<ProductConfigurationHeader
				{...props}
				hasSelectedFinish={false}
			/>
		);
		expect(wrapper).toMatchSnapshot();
	});
	it('should render nothing if there\'s no productConfiguration', () => {
		const wrapper = shallow(
			<ProductConfigurationHeader
				{...props}
				productConfiguration={undefined}
			/>
		);
		expect(wrapper).toMatchSnapshot();
	});
	it('should mapStateToProps', () => {
		const state = {
			productConfigurationsReducer: {
				[props.productConfigurationId]: {
					compositeId,
					selectedFinish: finishOne,
				},
			},
			productsReducer: {
				[compositeId]: productComposite,
			},
		};
		const ownProps = {
			productConfigurationId: props.productConfigurationId,
		};
		const result = mapStateToProps(state, ownProps);
		expect(result).toMatchSnapshot();
	});
	it('should mapStateToProps without productConfiguration', () => {
		const state = {
			productConfigurationsReducer: {},
		};
		const ownProps = {
			productConfigurationId,
		};
		const result = mapStateToProps(state, ownProps);
		expect(result).toMatchSnapshot();
	});
});
