jest.mock('react-native');
jest.mock('BuildNative');
jest.mock('BuildLibrary');
jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');
jest.mock('react-native-camera');
jest.mock('../../components/navigationBar/NavigationBarTextButton', () => 'NavigationBarTextButton');

import React from 'react';
import { SelectPhotoModal, mapDispatchToProps, mapStateToProps } from '../SelectPhotoModal';
import renderer from 'react-test-renderer';

const defaultProps = {
	actions: {
		getDevicePhotos: jest.fn(),
		resetSelectedPhotos: jest.fn(),
		toggleFetchingPhotos: jest.fn(),
		togglePhotoSelected: jest.fn(),
	},
	cursor: '',
	error: '',
	hasNextPage: false,
	navigation: {
		getNavigator: jest.fn(),
	},
	navigator: {
		pop: jest.fn(),
		push: jest.fn(),
		updateCurrentRouteParams: jest.fn(),
	},
	onDone: jest.fn(),
	photos: [],
	selectedPhotos: [],
};

describe('SelectPhotoModal', () => {

	it('should render', () => {
		const tree = renderer.create(
			<SelectPhotoModal {...defaultProps} />
		);
		expect(tree.toJSON()).toMatchSnapshot();
	});

	it('should render a selected photo count', () => {
		const tree = renderer.create(
			<SelectPhotoModal
				{...defaultProps}
				selectedPhotos={[ 'a photo' ]}
			/>
		);
		expect(tree.toJSON()).toMatchSnapshot();
	});

	it('should render an error', () => {
		const tree = renderer.create(
			<SelectPhotoModal
				{...defaultProps}
				error="Test"
			/>
		);
		expect(tree.toJSON()).toMatchSnapshot();
	});
});

describe('SelectPhotoModal functions', () => {
	beforeEach(() => {
		defaultProps.actions.getDevicePhotos.mockClear();
		defaultProps.actions.resetSelectedPhotos.mockClear();
		defaultProps.actions.toggleFetchingPhotos.mockClear();
		defaultProps.actions.togglePhotoSelected.mockClear();
	});

	it('setScreenTrackingInformation', () => {
		const result = renderer.create(
			<SelectPhotoModal {...defaultProps} />
		).getInstance().setScreenTrackingInformation();
		expect(result).toMatchSnapshot();
	});

	it('getScreenData', () => {
		renderer.create(
			<SelectPhotoModal {...defaultProps} />
		).getInstance().getScreenData();
		expect(defaultProps.actions.getDevicePhotos).toBeCalledWith({
			isFirstPage: true,
		});
	});

	describe('onEndReached', () => {
		it('should not fetch', () => {
			const wrapper = renderer.create(
				<SelectPhotoModal
					{...defaultProps}
					isFetchingData={false}
					hasNextPage={false}
				/>
			).getInstance();
			wrapper.onEndReached();
			expect(defaultProps.actions.toggleFetchingPhotos).not.toBeCalled();
			// first fetch is due to mounting the component
			expect(defaultProps.actions.getDevicePhotos).toHaveBeenCalledTimes(1);
		});

		it('should fetch', () => {
			const wrapper = renderer.create(
				<SelectPhotoModal
					{...defaultProps}
					isFetchingData={false}
					hasNextPage={true}
				/>
			).getInstance();
			wrapper.onEndReached();
			expect(defaultProps.actions.toggleFetchingPhotos).toBeCalled();
			expect(defaultProps.actions.getDevicePhotos).toHaveBeenCalledTimes(2);
			// first fetch is due to mounting the component
			expect(defaultProps.actions.getDevicePhotos).toBeCalledWith({ isFirstPage: true });
			expect(defaultProps.actions.getDevicePhotos).toBeCalledWith({ filters: { cursor: '' }});
		});

	});

	it('togglePhotoSelection', () => {
		const photo = { id: 1 };
		const wrapper = renderer.create(
			<SelectPhotoModal {...defaultProps} />
		).getInstance();
		wrapper.togglePhotoSelection(photo);
		expect(defaultProps.actions.togglePhotoSelected).toHaveBeenCalledWith(photo);
	});

	describe('onCancelPress', () => {
		it('should be called with empty array', () => {
			const wrapper = renderer.create(
				<SelectPhotoModal
					{...defaultProps}
				/>
			).getInstance();
			wrapper.onCancelPress();
			expect(defaultProps.actions.resetSelectedPhotos).toBeCalledWith([]);
			expect(defaultProps.navigator.pop).toHaveBeenCalled();
		});

		it('should be called with an array', () => {
			const initialSelectedPhotos = [ 'photo 1' ];
			const wrapper = renderer.create(
				<SelectPhotoModal
					{...defaultProps}
					initialSelectedPhotos={initialSelectedPhotos}
					shouldClearSelectedPhotos={false}
				/>
			).getInstance();
			wrapper.onCancelPress();
			expect(defaultProps.actions.resetSelectedPhotos).toBeCalledWith(initialSelectedPhotos);
			expect(defaultProps.navigator.pop).toHaveBeenCalled();
		});
	});

	it('onImageCapture', () => {
		const path = 'path';
		const wrapper = renderer.create(
			<SelectPhotoModal {...defaultProps} />
		).getInstance();
		wrapper.onImageCapture(path);
		expect(defaultProps.navigator.pop).toHaveBeenCalledWith(2);
		expect(defaultProps.onDone).toHaveBeenCalledWith([path]);
	});

	it('onSelectButtonPress', () => {
		const selectedPhotos = ['path'];
		const wrapper = renderer.create(
			<SelectPhotoModal
				{...defaultProps}
				selectedPhotos={selectedPhotos}
			/>
		).getInstance();
		wrapper.onSelectButtonPress();
		expect(defaultProps.navigator.pop).toHaveBeenCalled();
		expect(defaultProps.onDone).toHaveBeenCalledWith(selectedPhotos);
	});

	it('openCameraScreen', () => {
		const wrapper = renderer.create(
			<SelectPhotoModal
				{...defaultProps}
			/>
		).getInstance();
		wrapper.openCameraScreen();
		expect(defaultProps.navigator.push).toHaveBeenCalledWith('deviceCameraModal', {
			onImageCapture: wrapper.onImageCapture,
		});
	});

	it('photoKeyExtractor', () => {
		const result = renderer.create(
			<SelectPhotoModal {...defaultProps} />
		).getInstance().photoKeyExtractor({}, 0);
		expect(result).toEqual(0);
	});

	it('renderHeader', () => {
		const result = renderer.create(
			<SelectPhotoModal {...defaultProps} />
		).getInstance().renderHeader();
		expect(result).toMatchSnapshot();
	});

	describe('renderPhoto', () => {
		it('should render selected photo', () => {
			const result = renderer.create(
				<SelectPhotoModal {...defaultProps} />
			).getInstance().renderPhoto({
				item: {
					isSelected: true,
					image: {
						uri: 'uri',
					},
				},
				index: 0,
			});
			expect(result).toMatchSnapshot();
		});

		it('should render unselected photo', () => {
			const result = renderer.create(
				<SelectPhotoModal {...defaultProps} />
			).getInstance().renderPhoto({
				item: {
					isSelected: false,
					image: {
						uri: 'uri',
					},
				},
				index: 0,
			});
			expect(result).toMatchSnapshot();
		});

		it('should render center photo', () => {
			const result = renderer.create(
				<SelectPhotoModal {...defaultProps} />
			).getInstance().renderPhoto({
				item: {
					isSelected: false,
					image: {
						uri: 'uri',
					},
				},
				index: 1,
			});
			expect(result).toMatchSnapshot();
		});

		it('should render an element', () => {
			const Element = React.createElement('Element', this.props);
			const result = renderer.create(
				<SelectPhotoModal {...defaultProps} />
			).getInstance().renderPhoto({
				item: Element,
				index: 0,
			});
			expect(result).toMatchSnapshot();
		});
	});

	it('mapDispatchToProps', () => {
		const dispatch = jest.fn();
		const result = mapDispatchToProps(dispatch);
		expect(result).toMatchSnapshot();
	});

	it('mapStateToProps', () => {
		const result = mapStateToProps({
			devicePhotosReducer: {
				cursor: 'cursor',
				error: 'error',
				hasNextPage: true,
				isFetchingNextPage: false,
				photos: [],
				selectedPhotos: [],
			},
		});
		expect(result).toMatchSnapshot();
	});

});
