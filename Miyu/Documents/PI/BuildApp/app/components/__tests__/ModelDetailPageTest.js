
jest.mock('BuildLibrary');
jest.mock('BuildNative');
jest.unmock('react-native');
jest.mock('../../lib/styles');

import 'react-native';
import React from 'react';

import ModelDetailPage from '../ModelDetailPage';

const fullProps = {
	product: {
		productDrop: {
			finishes: [{
				finish: 'Testing Finish',
			}, {
				finish: 'Other Testing Finish',
			}],
			manufacturer: 'Test Manufacturer',
			maxPrice: 200.64,
			minPrice: 150,
			productId: 'TEST-PROD 123',
			title: 'Testing Title',
		},
	},
	finish: 'Testing Finish',
	productSpecs: [{
		productSpectValue: [{
			value: 'Test Value 1',
		}, {
			value: 'Test Value 2',
		}],
	}],
};

describe('ModelDetailPage', () => {

	it('should render default props', () => {
		const tree = require('react-test-renderer').create(
			<ModelDetailPage {...fullProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

});
