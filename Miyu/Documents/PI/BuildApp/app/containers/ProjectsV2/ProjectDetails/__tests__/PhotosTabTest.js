'use strict';

jest.mock('BuildNative');
jest.mock('BuildLibrary');
jest.mock('react-native');
jest.mock('../../../../lib/analytics/TrackingActions', () => ({}));
jest.mock('../../../../actions/ProjectEventActions', () => ({
	getPhotos: jest.fn(),
}));
jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');

import { mapStateToProps, mapDispatchToProps, PhotosTab } from '../PhotosTab';
import React from 'react';
import renderer from 'react-test-renderer';

const defaultProps = {
	actions: {
		createEvent: jest.fn(() => Promise.resolve({})),
		getPhotos: jest.fn(),
		trackAction: jest.fn(),
	},
	error: '',
	projectId: 1,
	loading: false,
	navigation: {
		getNavigator: jest.fn(() => ({
			push: jest.fn(),
		})),
	},
	photos: [{
		id: 1,
		imageUrl: 'http://image',
	}],
	project: {
		archived: false,
	},
	user: {
		customerId: 1,
	},
};

const mockState = {
	photosReducer: {
		error: '',
		loading: false,
		photos: [{ id: 1}],
	},
	projectsReducer: {
		projects: {
			active: {
				myProjects: [{ id: defaultProps.projectId }],
				sharedProjects: [],
				invitedProjects: [],
			},
			archived: {
				myProjects: [],
				sharedProjects: [],
				invitedProjects: [],
			},
			preAuthProjects: [],
		},
	},
	userReducer: {
		user: {},
	},
};

describe('PhotosTab component', () => {
	it('should render correctly before data loads', () => {
		const tree = renderer.create(
			<PhotosTab {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render correctly after data loads', () => {
		const tree = renderer.create(
			<PhotosTab {...defaultProps} />
		);
		tree.getInstance().setState({ initialLoading: false });
		expect(tree.toJSON()).toMatchSnapshot();
	});

	it('should render correctly with no photos', () => {
		const tree = renderer.create(
			<PhotosTab
				{...defaultProps}
				photos={[]}
			/>
		);
		tree.getInstance().setState({ initialLoading: false });
		expect(tree.toJSON()).toMatchSnapshot();
	});

});

describe('PhotosTab function tests', () => {
	it('initial state', () => {
		const result = renderer.create(
			<PhotosTab {...defaultProps} />
		).getInstance().state;
		expect(result).toMatchSnapshot();
	});

	it('setScreenTrackingInformation', () => {
		const tree = renderer.create(
			<PhotosTab {...defaultProps} />
		).getInstance().setScreenTrackingInformation();
		expect(tree).toMatchSnapshot();
	});

	it('getScreenData', () => {
		renderer.create(
			<PhotosTab {...defaultProps} />
		).getInstance().getScreenData();
		expect(defaultProps.actions.getPhotos).toBeCalledWith({ projectId: defaultProps.projectId });
	});

	it('photoKeyExtractor', () => {
		const result = renderer.create(
			<PhotosTab {...defaultProps} />
		).getInstance().photoKeyExtractor({ id: 1 });
		expect(result).toEqual(1);
	});

	it('onPressAddPhotos', () => {
		const wrapper = renderer.create(
			<PhotosTab {...defaultProps} />
		).getInstance();
		wrapper.onPressAddPhotos();
		expect(defaultProps.navigation.getNavigator).toBeCalledWith('root');
	});

	it('uploadPhotos', () => {
		const selectedPhotos = [];
		const wrapper = renderer.create(
			<PhotosTab {...defaultProps} />
		).getInstance();
		wrapper.uploadPhotos(selectedPhotos);
		expect(defaultProps.actions.createEvent).toBeCalledWith({
			eventType: 'POST',
			message: '',
			photos: selectedPhotos,
			projectId: defaultProps.projectId,
		});
		expect(defaultProps.actions.trackAction).toBeCalledWith('Post', {
			user_id: defaultProps.user.customerId,
			project_id: defaultProps.projectId,
			photo: false,
			text: false,
			photo_count: selectedPhotos.length,
			'@expert': false,
			project_status: 'active',
		});
	});

	describe('renderAddPhotosButton', () => {
		it('primary', () => {
			const result = renderer.create(
				<PhotosTab {...defaultProps} />
			).getInstance().renderAddPhotosButton('primary');
			expect(result).toMatchSnapshot();
		});

		it('white', () => {
			const result = renderer.create(
				<PhotosTab {...defaultProps} />
			).getInstance().renderAddPhotosButton('white');
			expect(result).toMatchSnapshot();
		});
	});

	it('renderHeader', () => {
		const result = renderer.create(
			<PhotosTab {...defaultProps} />
		).getInstance().renderHeader();
		expect(result).toMatchSnapshot();
	});

	it('renderPhoto', () => {
		const index = 0;
		const result = renderer.create(
			<PhotosTab {...defaultProps} />
		).getInstance().renderPhoto({
			item: { ...defaultProps.photos[index] },
			index,
		});
		expect(result).toMatchSnapshot();
	});

	it('mapStateToProps', () => {
		const result = mapStateToProps(mockState, defaultProps.projectId );
		expect(result).toMatchSnapshot();
	});

	it('mapDispatchToProps', () => {
		const dispatch = jest.fn();
		const result = mapDispatchToProps(dispatch);
		expect(result).toMatchSnapshot();
	});

});
