jest.mock('react-native');
jest.mock('BuildNative');
jest.mock('BuildLibrary');
jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');

jest.mock('../../lib/styles');
jest.mock('../../components/ProjectRow', () => 'ProjectRow');
jest.mock('../../components/FavoritesListRow', () => 'FavoritesListRow');
jest.mock('../../components/listHeader', () => 'ListHeader');
jest.mock('../../components/ErrorText', () => 'ErrorText');
jest.mock('../../components/navigationBar/NavigationBarIconButton', () => 'NavigationBarIconButton');


import { ListsOverviewScreen } from '../ListsOverviewScreen';
import React from 'react';
import renderer from 'react-test-renderer';

const defaultProps = {
	actions: {
		deleteFavorites: jest.fn(() => Promise.resolve({})),
		getProjects: jest.fn(),
		getShoppingLists: jest.fn(),
		getCustomerFavorites: jest.fn(),
		loadOrders: jest.fn(),
		trackState: jest.fn(),
	},
	favorites: [],
	favoritesError: '',
	isLoggedIn: true,
	isScreenVisible: true,
	navigator: {
		push: jest.fn(),
		updateCurrentRouteParams: jest.fn(),
	},
	navigation: {
		getNavigator: jest.fn(() => ({
			push: jest.fn(),
		})),
		performAction: jest.fn(),
	},
	projects: {
		active: {},
		archived: {},
	},
	projectsError: '',
};

const projects = {
	active: {
		myProjects: [{
			name: 'test',
			teamMemberCount: 1,
			orderCount: 1,
			photoGalleryCount: 1,
			favoriteListCount: 1,
			isOwnedByUser: false,
		}, {
			name: 'test 2',
			teamMemberCount: 1,
			orderCount: 1,
			photoGalleryCount: 1,
			favoriteListCount: 1,
			isOwnedByUser: true,
		}],
	},
	archived: {},
};

const favorites = [{
	id: 237506,
	isOwner: true,
	name: 'Office',
	itemCount: 2,
	productsMap: {
		1155759: {
			availableByLocation: false,
			productCompositeId: 1155759,
			favoriteProductId: 2092691,
			manufacturer: 'Safavieh',
			productConfigurationId: 'ddbda9c6-cb39-4d8c-a7ab-bb7b7363d86a',
			productId: 'FOX8508',
			title: 'Bernard Desk Chair',
			id: 0,
			finishes: [{
				uniqueId: 2763356,
				finish: 'Black',
				sku: 'FOX8508A',
				image: 'safavieh-fox8508a-1419.jpg',
				imagePaths: {
					100: '/imagebase/resized/100x100/safaviehimages/safavieh-fox8508a-1419.jpg',
					220: '/imagebase/resized/220x220/safaviehimages/safavieh-fox8508a-1419.jpg',
					320: '/imagebase/resized/330x320/safaviehimages/safavieh-fox8508a-1419.jpg',
				},
				cost: 156.82,
				msrp: 241.5,
				finishSampleUniqueId: null,
				status: 'Discontinued',
				finishSwatch: {
					swatchIdentifier: null,
					hexValue: '000000',
					styleValue: '',
					swatchImage: 'website/imagebase/swatchimages/int-cgs-bk.jpg',
				},
			}],
			squareFootageBased: false,
			type: 'Furniture',
			uniqueId: 2763356,
		},
		1155765: {
			availableByLocation: false,
			productCompositeId: 1155765,
			favoriteProductId: 2092693,
			manufacturer: 'Safavieh',
			productConfigurationId: 'baf1b4f0-f7a9-4994-8983-b0cd7e4b9036',
			productId: 'FOX8514',
			title: 'Olga Desk Chair',
			id: 1,
			finishes: [{
				uniqueId: 2763365,
				finish: 'Black',
				sku: 'FOX8514A',
				image: 'safavieh-fox8514a-1428.jpg',
				imagePaths: {
					100: '/imagebase/resized/100x100/safaviehimages/safavieh-fox8514a-1428.jpg',
					220: '/imagebase/resized/220x220/safaviehimages/safavieh-fox8514a-1428.jpg',
					320: '/imagebase/resized/330x320/safaviehimages/safavieh-fox8514a-1428.jpg',
				},
				cost: 211.16,
				msrp: 451.84,
				finishSampleUniqueId: null,
				status: 'stock',
				finishSwatch: {
					swatchIdentifier: null,
					hexValue: '000000',
					styleValue:'',
					swatchImage: 'website/imagebase/swatchimages/int-cgs-bk.jpg',
				},
			}],
			squareFootageBased: false,
			type: 'Furniture',
			uniqueId: 2763365,
		},
	},
}];

describe('ListsOverviewScreen component', () => {
	it('should render a guest user correctly', () => {
		const tree = renderer.create(
			<ListsOverviewScreen
				{...defaultProps}
				isLoggedIn={false}
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render a user with no projects or favorites', () => {
		const tree = renderer.create(
			<ListsOverviewScreen
				{...defaultProps}
			/>
	).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render an error correctly', () => {
		const tree = renderer.create(
			<ListsOverviewScreen
				{...defaultProps}
				projectsError="error"
				favoritesError="error"
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render a user with projects & favorites', () => {
		const tree = renderer.create(
			<ListsOverviewScreen
				{...defaultProps}
				isLoggedIn={true}
				projects={projects}
				favorites={favorites}
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});
});

describe('ListsOverviewScreen function tests', () => {
	const componentInstance = new ListsOverviewScreen(defaultProps);

	it('should have a state', () => {
		const result = renderer.create(
			<ListsOverviewScreen {...defaultProps} />
		).getInstance().state;
		expect(result).toMatchSnapshot();
	});

	describe('onRefresh', () => {
		it('true', () => {
			const tree = renderer.create(
				<ListsOverviewScreen
					{...defaultProps}
					isLoggedIn={true}
				/>
			).getInstance();
			const spy = spyOn(tree, 'setState');
			tree.onRefresh();
			expect(spy).toBeCalledWith({ isRefreshing: true }, expect.any(Function));
		});

		it('false', () => {
			const tree = renderer.create(
				<ListsOverviewScreen
					{...defaultProps}
					isLoggedIn={false}
				/>
			).getInstance();
			const spy = spyOn(tree, 'setState');
			tree.onRefresh();
			expect(spy).not.toBeCalled();
		});
	});

	describe('getScreenData', () => {
		it('without data', () => {
			const tree = renderer.create(
				<ListsOverviewScreen
					{...defaultProps}
				/>
			).getInstance();
			const result = tree.getScreenData();
			expect(result).toMatchSnapshot();
		});

		it('with data', () => {
			const tree = renderer.create(
				<ListsOverviewScreen
					{...defaultProps}
					projects={projects}
					favorites={favorites}
				/>
			).getInstance();
			const result = tree.getScreenData();
			expect(result).toMatchSnapshot();
		});

		it('with error', () => {
			const tree = renderer.create(
				<ListsOverviewScreen
					{...defaultProps}
					projects={projects}
					projectsError="Test"
					favorites={favorites}
					favoritesError="Test"
				/>
			).getInstance();
			const result = tree.getScreenData();
			expect(result).toMatchSnapshot();
		});
	});

	it('goToFavorite', () => {
		componentInstance.goToFavorite(1);
		expect(defaultProps.navigator.push).toBeCalledWith('favoritesList', {
			favoriteId: 1,
		});
	});

	it('goToFavoritesScreen', () => {
		componentInstance.goToFavoritesScreen();
		expect(defaultProps.navigator.push).toBeCalledWith('favorites');
	});

	it('goToProjectDetails', () => {
		const project = {
			id: 1,
			name: 'Test',
		};
		componentInstance.goToProjectDetails(project);
		expect(defaultProps.navigator.push).toBeCalledWith('projectDetails', {
			projectId: project.id,
			projectName: project.name,
		});
	});

	it('goToProjectsScreen', () => {
		componentInstance.goToProjectsScreen();
		expect(defaultProps.navigator.push).toBeCalledWith('projectsV2');
	});

	it('onLoginPress', () => {
		componentInstance.onLoginPress();
		expect(defaultProps.navigation.getNavigator).toBeCalledWith('root');
	});

	it('onPressDeleteFavorite', () => {
		componentInstance.onPressDeleteFavorite(1);
		expect(defaultProps.actions.deleteFavorites).toBeCalledWith(1);
	});

	it('onPressEmptyFavoritesButton', () => {
		componentInstance.onPressEmptyFavoritesButton();
		expect(defaultProps.navigation.performAction).toBeCalled();
	});

	it('onPressEmptyProjectsButton', () => {
		componentInstance.onPressEmptyProjectsButton();
		expect(defaultProps.navigation.getNavigator).toBeCalledWith('root');
	});

	it('projectKeyExtactor', () => {
		const result = componentInstance.projectKeyExtactor({ id: 1 });
		expect(result).toEqual(1);
	});

	it('renderEmptyFavoritesState', () => {
		const tree = componentInstance.renderEmptyFavoritesState();
		expect(tree).toMatchSnapshot();
	});

	it('renderEmptyProjectsState', () => {
		const tree = componentInstance.renderEmptyProjectsState();
		expect(tree).toMatchSnapshot();
	});

	describe('renderFavorite', () => {
		it('should return element', () => {
			class Test extends React.Component {
				render() {
					return React.createElement('Test');
				}
			}
			const tree = componentInstance.renderFavorite(<Test />, undefined);
			expect(tree).toMatchSnapshot();
		});

		it('should return FavoritesListRow', () => {
			const tree = componentInstance.renderFavorite({
				id: 1,
			}, false);
			expect(tree).toMatchSnapshot();
		});

		it('should return last FavoritesListRow', () => {
			const tree = componentInstance.renderFavorite({
				id: 1,
			}, true);
			expect(tree).toMatchSnapshot();
		});
	});

	describe('renderHeader', () => {
		it('should return null', () => {
			const tree = componentInstance.renderHeader();
			expect(tree).toMatchSnapshot();
		});

		it('should return errors', () => {
			const tree = renderer.create(
				<ListsOverviewScreen
					{...defaultProps}
					projects={projects}
					favoritesError="Test"
					projectsError="Test"
				/>
			).getInstance().renderHeader();
			expect(tree).toMatchSnapshot();
		});
	});

	it('renderProject', () => {
		const tree = componentInstance.renderProject(projects.active.myProjects[0]);
		expect(tree).toMatchSnapshot();
	});

	describe('renderRow', () => {
		it('project last row', () => {
			const tree = componentInstance.renderRow({
				index: 0,
				item: {},
				section: {
					data: [1],
					title: 'PROJECTS',
				},
			});
			expect(tree).toMatchSnapshot();
		});

		it('project not last row', () => {
			const tree = componentInstance.renderRow({
				index: 0,
				item: {},
				section: {
					data: [1, 2],
					title: 'PROJECTS',
				},
			});
			expect(tree).toMatchSnapshot();
		});

		it('favorites last row', () => {
			const tree = componentInstance.renderRow({
				index: 0,
				item: {},
				section: {
					data: [1],
					title: 'FAVORITES',
				},
			});
			expect(tree).toMatchSnapshot();
		});
	});

	describe('renderSectionHeader', () => {
		it('project header no projects', () => {
			const tree = componentInstance.renderSectionHeader({
				section: {
					title: 'PROJECTS',
				},
			});
			expect(tree).toMatchSnapshot();
		});

		it('project header with projects', () => {
			const tree = renderer.create(
				<ListsOverviewScreen
					{...defaultProps}
					projects={projects}
				/>
			).getInstance().renderSectionHeader({
				section: {
					title: 'PROJECTS',
				},
			});
			expect(tree).toMatchSnapshot();
		});

		it('favorites header no favorites', () => {
			const tree = componentInstance.renderSectionHeader({
				section: {
					title: 'FAVORITES',
				},
			});
			expect(tree).toMatchSnapshot();
		});

		it('favorites header with favorites', () => {
			const tree = renderer.create(
				<ListsOverviewScreen
					{...defaultProps}
					projects={projects}
					favorites={favorites}
				/>
			).getInstance().renderSectionHeader({
				section: {
					title: 'FAVORITES',
				},
			});
			expect(tree).toMatchSnapshot();
		});
	});
});
