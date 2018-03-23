jest.mock('react-native');
jest.mock('BuildNative');
jest.mock('BuildLibrary');
jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');
jest.mock('react-native-camera');

import React from 'react';
import { DeviceCameraModal } from '../DeviceCameraModal';
import renderer from 'react-test-renderer';

const defaultProps = {
	onImageCapture: jest.fn(),
	navigator: {
		pop: jest.fn(),
	},
};

describe('DeviceCameraModal', () => {

	it('should render', () => {
		const tree = renderer.create(
			<DeviceCameraModal {...defaultProps} />
		);
		expect(tree.toJSON()).toMatchSnapshot();
	});
});

describe('DeviceCameraModal functions', () => {
	it('state', () => {
		const wrapper = renderer.create(
			<DeviceCameraModal {...defaultProps} />
		).getInstance();
		expect(wrapper.state).toMatchSnapshot();
	});

	it('setScreenTrackingInformation', () => {
		const result = renderer.create(
			<DeviceCameraModal {...defaultProps} />
		).getInstance().setScreenTrackingInformation();
		expect(result).toMatchSnapshot();
	});

	it('toggleFrontBackCamera', () => {
		const wrapper = renderer.create(
			<DeviceCameraModal {...defaultProps} />
		).getInstance();
		wrapper.toggleFrontBackCamera();
		expect(wrapper.state.cameraType).toEqual('front');
		wrapper.toggleFrontBackCamera();
		expect(wrapper.state.cameraType).toEqual('back');
	});

	it('handleImageTaken', () => {
		const wrapper = renderer.create(
			<DeviceCameraModal {...defaultProps} />
		).getInstance();
		wrapper.handleImageTaken({ path: 'path' });
		expect(defaultProps.onImageCapture).toHaveBeenCalledWith('path');
	});

	it('takePicture', () => {
		const wrapper = renderer.create(
			<DeviceCameraModal {...defaultProps} />
		).getInstance();
		wrapper.takePicture();
		expect(wrapper.cam.capture).toHaveBeenCalled();
	});

	it('closeCamera', () => {
		renderer.create(
			<DeviceCameraModal {...defaultProps} />
		).getInstance().closeCamera();
		expect(defaultProps.navigator.pop).toHaveBeenCalled();
	});

});
