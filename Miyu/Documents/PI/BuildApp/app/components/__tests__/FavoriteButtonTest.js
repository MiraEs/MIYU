jest.unmock('react-native');
import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';

import { FavoriteButton } from '../FavoriteButton';

jest.mock('../../../app/store/configStore', () => ({}));
jest.mock('../../../app/services/httpClient', () => ({}));
jest.mock('../../../app/containers/CartScreen', () => 'CartScreen');
jest.mock('BuildLibrary');
jest.mock('../../../app/components/SaveFavoritesListModal', () => 'SaveFavoritesListModal');
jest.mock('BuildNative');

const defaultProps = {
	actions: {},
	finishes: [],
	features: {},
	isLoggedIn: true,
	product: {},
	favorites: {},
};

describe('FavoriteButton component', () => {

	it('should render FavoriteButton with required props', () => {
		const tree = renderer.create(
			<FavoriteButton
				{...defaultProps}
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render FavoriteButton with navBarButton prop true', () => {
		const tree = renderer.create(
			<FavoriteButton
				{...defaultProps}
				navBarButton={true}
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render FavoriteButton with style prop', () => {
		const tree = renderer.create(
			<FavoriteButton
				{...defaultProps}
				style={{}}
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render FavoriteButton if isLoggedIn prop set to false', () => {
		const tree = renderer.create(
			<FavoriteButton
				{...defaultProps}
				isLoggedIn={false}
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

});
