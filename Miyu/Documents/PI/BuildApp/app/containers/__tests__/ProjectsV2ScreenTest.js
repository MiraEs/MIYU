jest.mock('../../services/httpClient', () => ({}));
jest.mock('../../store/configStore', () => ({}));
jest.mock('../../lib/analytics/tracking');
jest.mock('BuildNative');
jest.mock('BuildLibrary');
jest.mock('../../lib/styles');
jest.mock('../../components/Form', () => 'Form');
jest.mock('../../components/FormInput', () => 'FormInput');
jest.mock('../../components/listHeader', () => 'ListHeader');
jest.mock('../../components/TextHighlighter', () => 'TextHighlighter');
jest.mock('../../components/ErrorText', () => 'ErrorText');
jest.mock('../../components/TappableListItem', () => 'TappableListItem');
jest.mock('../../components/navigationBar/NavigationBarIconButton', () => 'NavigationBarIconButton');

jest.mock('react-native');

import { ProjectsV2Screen } from '../ProjectsV2Screen';
import React from 'react';
import renderer from 'react-test-renderer';

const defaultProps = {
	actions: {
		getProjects: jest.fn(() => Promise.resolve()),
		updateProjectFilters: jest.fn(),
		getShoppingLists: jest.fn(),
		resetLoadingFlag: jest.fn(),
		loadOrders: jest.fn(),
	},
	isLoggedIn: false,
	error: '',
	isFiltering: false,
	filteredProjects: {},
	loading: false,
	projects: {
		active: {
			myProjects: [],
			sharedProjects: [],
		},
		archived: {
			myProjects: [],
			sharedProjects: [],
		},
	},
};

describe('ProjectsV2Screen component', () => {
	it('should render a guest user correctly', () => {
		const tree = renderer.create(
			<ProjectsV2Screen {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render a user with no projects correctly', () => {
		const tree = renderer.create(
			<ProjectsV2Screen
				{...defaultProps}
				isLoggedIn={true}
			/>
	).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render an error correctly', () => {
		const tree = renderer.create(
			<ProjectsV2Screen
				{...defaultProps}
				error="error"
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render a user with projects correctly', () => {
		const tree = renderer.create(
			<ProjectsV2Screen
				{...defaultProps}
				isLoggedIn={true}
				projects={{
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
				}}
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});
});

describe('ProjectsV2Screen function tests', () => {
	const componentInstance = new ProjectsV2Screen(defaultProps);

	it('should have a state', () => {
		const result = renderer.create(
			<ProjectsV2Screen {...defaultProps} />
		).getInstance().state;
		expect(result).toMatchSnapshot();
	});

	it('onRefresh', () => {
		const tree = renderer.create(
			<ProjectsV2Screen
				{...defaultProps}
				isLoggedIn={true}
			/>
		).getInstance();
		const spy = spyOn(tree, 'setState');
		tree.onRefresh();
		expect(spy).toBeCalledWith({ isRefreshing: true }, expect.any(Function));
	});

	it('onSearchInputChange', () => {
		const projectNameFilter = 'test';
		const tree = renderer.create(
			<ProjectsV2Screen
				{...defaultProps}
				isLoggedIn={true}
			/>
		).getInstance();
		const spy = spyOn(tree, 'setState');
		tree.onSearchInputChange({ search: { value: projectNameFilter }});
		expect(spy).toBeCalledWith({ projectNameFilter });
		expect(defaultProps.actions.updateProjectFilters).toBeCalledWith(projectNameFilter);
	});

	it('should render the section header', () => {
		const tree = componentInstance.renderSectionHeader({ section: { title: 'active' }});
		expect(tree).toMatchSnapshot();
	});

	it('should render project name accent', () => {
		const tree = componentInstance.renderProjectNameAccent({ isOwnedByUser: false });
		expect(tree).toMatchSnapshot();
	});

	it('should render a project', () => {
		const tree = componentInstance.renderProject({ item: {
			name: 'test',
			teamMemberCount: 1,
			orderCount: 1,
			photoGalleryCount: 1,
			favoriteListCount: 1,
			isOwnedByUser: false,
		}});
		expect(tree).toMatchSnapshot();
	});

	it('should render a non-project', () => {
		const tree = componentInstance.renderProject({ item: 'test' });
		expect(tree).toMatchSnapshot();
	});

	it('shouldn\'t render a project search box', () => {
		const tree = componentInstance.renderProjectsSearch();
		expect(tree).toMatchSnapshot();
	});

	it('should render a project search box', () => {
		const tree = renderer.create(
			<ProjectsV2Screen
				{...defaultProps}
				isLoggedIn={true}
				projects={{
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
						}, {
							name: 'test 3',
							teamMemberCount: 1,
							orderCount: 1,
							photoGalleryCount: 1,
							favoriteListCount: 1,
							isOwnedByUser: true,
						}, {
							name: 'test 4',
							teamMemberCount: 1,
							orderCount: 1,
							photoGalleryCount: 1,
							favoriteListCount: 1,
							isOwnedByUser: true,
						}, {
							name: 'test 5',
							teamMemberCount: 1,
							orderCount: 1,
							photoGalleryCount: 1,
							favoriteListCount: 1,
							isOwnedByUser: true,
						}, {
							name: 'test 6',
							teamMemberCount: 1,
							orderCount: 1,
							photoGalleryCount: 1,
							favoriteListCount: 1,
							isOwnedByUser: true,
						}],
						sharedProjects: [],
					},
					archived: {
						myProjects: [],
						sharedProjects: [],
					},
				}}
			/>
		)
			.getInstance()
			.renderProjectsSearch();
		expect(tree).toMatchSnapshot();
	});
});
