
jest.mock('../../../app/services/httpClient', () => ({}));
jest.mock('../../../app/components/Form', () => 'Form');
jest.mock('../../../app/components/FormInput', () => 'FormInput');
jest.mock('BuildLibrary');
jest.mock('../../../app/store/configStore', () => ({}));
jest.mock('../../../app/lib/analytics/tracking');
jest.mock('../../components/navigationBar/NavigationBarIconButton', () => 'NavigationBarIconButton');
jest.mock('BuildNative');
jest.mock('../../components/SaveFavoritesListModal', () => 'SaveFavoritesListModal');
jest.mock('react-native-share', () => ({
	open: jest.fn(() => ({ catch: jest.fn(() => ({ done: jest.fn() })) })),
}));

jest.unmock('react-native');
import 'react-native';
import React from 'react';
import { FavoritesListScreen } from '../FavoritesListScreen';
import { create } from 'react-test-renderer';
import Share from 'react-native-share';

const defaultProps = {
	favoriteId: 123,
	actions: {
		trackState: jest.fn(),
	},
	cart: {},
	loading: false,
	error: '',
	favorites: {},
	favorite: {},
	modal: {
		show: jest.fn(),
	},
	products: {},
	productConfigurations: {},
	saveListError: '',
	navigator: {
		push: jest.fn(),
		pop: jest.fn(),
	},
	navigation: {
		getNavigator: jest.fn(),
		performAction: jest.fn(),
	},
};

describe('FavoritesListScreen component', () => {

	it('should render correctly with no favorites', () => {
		const tree = create(
			<FavoritesListScreen {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render with no favoriteId', () => {
		const props = {...defaultProps};
		delete props.favoriteId;
		const wrapper = create(<FavoritesListScreen {...props} />).toJSON();
		expect(wrapper).toMatchSnapshot();
	});

	it('should render with favorites products map as owner', () => {
		const props = {
			...defaultProps,
			favorite: {
				productsMap: [{}],
				name: 'favorite name',
				isOwner: true,
			},
		};
		const wrapper = create(<FavoritesListScreen {...props} />).toJSON();
		expect(wrapper).toMatchSnapshot();
	});

	it('should render with favorites products map as not owner', () => {
		const props = {
			...defaultProps,
			favorite: {
				productsMap: [{}],
				name: 'favorite name',
				isOwner: false,
			},
		};
		const wrapper = create(<FavoritesListScreen {...props} />).toJSON();
		expect(wrapper).toMatchSnapshot();
	});

	it('should render the right nav button', () => {
		const wrapper = create(FavoritesListScreen.route.navigationBar.renderRight()).toJSON();
		expect(wrapper).toMatchSnapshot();
	});

	it('should show modal on edit', () => {
		const instance = create(<FavoritesListScreen {...defaultProps} />).getInstance();
		instance.edit();
		expect(defaultProps.modal.show).toBeCalled();
	});

	it('should handle share', () => {
		const props = {
			...defaultProps,
			favorite: {
				name: 'favorite name',
				id: 'favorite id',
			},
		};
		const instance = create(<FavoritesListScreen {...props} />).getInstance();
		instance.share();
		expect(Share.open).toBeCalledWith({
			message: 'favorite name. The best favorites list ever made on Build.com',
			title: 'Share Your Favorites',
			url: 'https://www.build.com/favorites/favorite-name-favorite-id',
		});
	});

	it('should update source', () => {
		const instance = create(<FavoritesListScreen {...defaultProps} />).getInstance();
		const favorite = {
			productsMap: [{
				test: true,
			}],
		};
		instance.state = {
			swipeableListViewDataSource: {
				cloneWithRowsAndSections: jest.fn(rows => rows),
			},
			listViewDataSource: {
				cloneWithRowsAndSections: jest.fn(rows => rows),
			},
		};
		instance.updateDataSource(favorite);
		expect(instance.state).toEqual({
			listViewDataSource: [[{
				test: true,
			}]],
			swipeableListViewDataSource: [[{
				test: true,
			}]],
		});
	});

});
