
jest.mock('../../../app/services/httpClient', () => ({}));
jest.mock('../../../app/store/configStore', () => ({}));
jest.mock('BuildLibrary');
jest.mock('BuildNative');
jest.mock('../../../app/components/Form', () => 'Form');
jest.mock('../../../app/components/FormInput', () => 'FormInput');
jest.mock('../../../app/components/AddToCartButton', () => 'AddToCartButton');

jest.unmock('react-native');
import 'react-native';
import React from 'react';
import { AddToCartSelector } from '../AddToCartSelector';

const defaultProps = {
	compositeId: 1234,
	onHasOptionGroups: jest.fn(),
	onSquareFootageBased: jest.fn(),
	quantity: 22,
	uniqueId: 8767,
};

describe('AddToCartSelector component', () => {

	it('should render correctly with only required props', () => {
		const tree = require('react-test-renderer').create(
			<AddToCartSelector {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render with hidden quantity selector', () => {
		const tree = require('react-test-renderer').create(
			<AddToCartSelector
				{...defaultProps}
				hideQuantitySelector={true}
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render with onUpdateQuantity function', () => {
		const tree = require('react-test-renderer').create(
			<AddToCartSelector
				{...defaultProps}
				onUpdateQuantity={jest.fn()}
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render with productComposite prop', () => {
		const tree = require('react-test-renderer').create(
			<AddToCartSelector
				{...defaultProps}
				productComposite={{}}
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render with selectedFinish prop', () => {
		const tree = require('react-test-renderer').create(
			<AddToCartSelector
				{...defaultProps}
				selectedFinish={{}}
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render with validateAvailability prop', () => {
		const tree = require('react-test-renderer').create(
			<AddToCartSelector
				{...defaultProps}
				validateAvailability={jest.fn()}
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render with onInputFocus prop', () => {
		const tree = require('react-test-renderer').create(
			<AddToCartSelector
				{...defaultProps}
				onInputFocus={jest.fn()}
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

});
