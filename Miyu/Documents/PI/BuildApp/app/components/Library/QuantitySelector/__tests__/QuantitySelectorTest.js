
jest.unmock('react-native');
jest.mock('BuildNative');

import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';

import QuantitySelector from '../QuantitySelector';

describe('QuantitySelector component', () => {

	it('should render QuantitySelector with required props', () => {
		const tree = renderer.create(
			<QuantitySelector />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render QuantitySelector with prop style', () => {
		const tree = renderer.create(
			<QuantitySelector style={{}}/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render QuantitySelector with prop id', () => {
		const tree = renderer.create(
			<QuantitySelector id={'test'}/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render QuantitySelector with prop quantity', () => {
		const tree = renderer.create(
			<QuantitySelector quantity={1}/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render QuantitySelector with prop onUpdateQuantity', () => {
		const tree = renderer.create(
			<QuantitySelector onUpdateQuantity={() => null}/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render QuantitySelector with prop showSelectors', () => {
		const tree = renderer.create(
			<QuantitySelector showSelectors={true}/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render QuantitySelector with prop disableDelete', () => {
		const tree = renderer.create(
			<QuantitySelector disableDelete={true}/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

});
