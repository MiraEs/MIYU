
jest.unmock('react-native');
jest.mock('BuildLibrary');
jest.mock('BuildNative');
jest.mock('redux');
jest.mock('react-redux');
jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');
jest.mock('../../components/LoadingView', () => 'LoadingView');
jest.mock('../../lib/Validations', () => ({}));
jest.mock('../../actions/ProductsActions', () => ({
	getAvailability: jest.fn(),
	setAvailability: jest.fn(),
}));
jest.mock('../../actions/ProductsActions', () => ({
	AVAILABILITY: {
		UNKNOWN: 'UNKNOWN',
		BACKORDERED: 'BACKORDERED',
		IN_STOCK: 'IN_STOCK',
		INSUFFICIANT_QUANTITY: 'INSUFFICIANT_QUANTITY',
		OUT_OF_STOCK: 'OUT_OF_STOCK',
	},
}));
import { AVAILABILITY } from '../../actions/ProductsActions';
import 'react-native';
import React from 'react';
import { ZipChecker} from '../productDetail/ZipChecker';

const defaultProps = {
	compositeId: 0,
	selectedFinish: {},
	quantity: 1,
	availability: { status: AVAILABILITY.UNKNOWN },
};

describe('ZipChecker', () => {
	it('should render correctly with default props', () => {
		const tree = require('react-test-renderer').create(
			<ZipChecker {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});
});

describe('ZipChecker', () => {
	it('should render correctly when backordered', () => {
		const tree = require('react-test-renderer').create(
			<ZipChecker
				{...defaultProps}
				availability={{ status: AVAILABILITY.BACKORDERED }}
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});
});

describe('ZipChecker', () => {
	it('should render correctly when in stock', () => {
		const tree = require('react-test-renderer').create(
			<ZipChecker
				{...defaultProps}
				availability={{ status: AVAILABILITY.IN_STOCK }}
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});
});

describe('ZipChecker', () => {
	it('should render correctly when insufficient quantity', () => {
		const tree = require('react-test-renderer').create(
			<ZipChecker
				{...defaultProps}
				availability={{ status: AVAILABILITY.INSUFFICIANT_QUANTITY }}
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});
});

describe('ZipChecker', () => {
	it('should render correctly when out of stock', () => {
		const tree = require('react-test-renderer').create(
			<ZipChecker
				{...defaultProps}
				availability={{ status: AVAILABILITY.OUT_OF_STOCK }}
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});
});
