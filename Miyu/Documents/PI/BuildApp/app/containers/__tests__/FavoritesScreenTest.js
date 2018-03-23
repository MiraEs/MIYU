jest.mock('react-native');
jest.mock('BuildNative');
jest.mock('BuildLibrary');
jest.mock('../../components/navigationBar/NavigationBarIconButton', () => 'NavigationBarIconButton');
jest.mock('../../components/SaveFavoritesListModal', () => 'SaveFavoritesListModal');
jest.mock('../../components/FavoritesListRow', () => 'FavoritesListRow');


import { FavoritesScreen } from '../FavoritesScreen';
import React from 'react';

const defaultProps = {
	actions: {
		trackState: jest.fn(),
	},
	favorites: {},
};

describe('FavoritesScreen component', () => {

	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<FavoritesScreen {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});
});
