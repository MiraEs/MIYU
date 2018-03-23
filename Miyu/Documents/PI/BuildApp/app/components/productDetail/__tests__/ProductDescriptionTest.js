jest.mock('redux');
jest.mock('react-redux');
jest.mock('BuildLibrary');
jest.mock('BuildNative');
jest.mock('build-library');
jest.mock('../../../services/httpClient', () => ({}));
jest.mock('../../../actions/ProductDetailActions');
jest.mock('../../../components/HTML', () => 'HTML');
jest.mock('../../../lib/styles');

jest.unmock('react-native');
import 'react-native';
import React from 'react';
import { ProductDescription } from '../ProductDescription';
import renderer from 'react-test-renderer';

const fullProps = {
	actions: {
		getProductCompositeDescription: jest.fn(),
	},
	compositeId: 1234,
	title: 'Test title',
	shortDescription: [],
};

describe('ProductDescription', () => {

	beforeEach(() => jest.resetModules());

	it('should render default props', () => {
		const tree = renderer.create(
			<ProductDescription {...fullProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should handle a composite description error', () => {
		const props = {
			...fullProps,
			compositeDescriptionError: 'test error',
		};
		const wrapper = renderer.create(
			<ProductDescription {...props} />
		).toJSON();
		expect(wrapper).toMatchSnapshot();
	});

});
