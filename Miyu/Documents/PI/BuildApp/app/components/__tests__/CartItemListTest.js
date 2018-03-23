import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';

import CartItemList from '../CartItemList';

jest.unmock('react-native');
jest.unmock('BuildLibrary');
jest.mock('build-library');

jest.mock('../../../app/services/httpClient', () => ({}));
jest.mock('../../../app/components/button', () => 'Button');
jest.mock('../../../app/components/Cart/CartRow', () => 'CartRow');
jest.mock('../../../app/containers/CartScreen', () => 'CartScreen');
jest.mock('BuildNative');

describe('CartItemList component', () => {

	it('should render CartItemList with no props', () => {
		const tree = renderer.create(
			<CartItemList />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render CartItemList with only required props', () => {
		const tree = renderer.create(
			<CartItemList
				items={[{}, {}, {}]}
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

});
