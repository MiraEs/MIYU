
jest.mock('BuildLibrary');
jest.mock('../../../app/services/httpClient', () => ({}));
jest.mock('../../../app/store/configStore', () => ({}));
jest.mock('../../../app/components/Form', () => 'Form');
jest.mock('../../../app/components/FormInput', () => 'FormInput');
jest.mock('../../../app/components/NavigationBar', () => 'NavigationBar');
jest.mock('../../../app/lib/analytics/tracking');
jest.mock('BuildNative');

jest.unmock('react-native');
import 'react-native';
import React from 'react';
import { AddPhotoModal } from '../addPhotoModal';

const defaultProps = {
	actions: {
		getDevicePhotos: jest.fn(),
		trackState: jest.fn(),
	},
	cursor: '',
	eventStoreType: '',
	hasNextPage: false,
	images: [],
	initialSelectedPhotos: [],
	isFetchingNextPage: false,
	isFirstPage: true,
	launchedFrom: '',
	returnTo: '',
	selectedPhotos: [],
};

describe('AddPhotoModal component', () => {

	it('should render with default props', () => {
		const tree = require('react-test-renderer').create(
			<AddPhotoModal {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render a photo view with proper children', () => {
		const tree = require('react-test-renderer').create(
			<AddPhotoModal
				{...defaultProps}
				photo={{
					image: {
						uri: 'test',
					},
				}}
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render a selected photo view with proper children', () => {
		const tree = require('react-test-renderer').create(
			<AddPhotoModal
				{...defaultProps}
				photo={{
					image: {
						uri: 'test',
					},
					isSelected: true,
				}}
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render a selected photo count view and text', () => {
		const tree = require('react-test-renderer').create(
			<AddPhotoModal
				{...defaultProps}
				selectedPhotos={['']}
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render a text when there is an error in the content', () => {
		const tree = require('react-test-renderer').create(
			<AddPhotoModal
				{...defaultProps}
				retrievePhotoError="test"
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});
});
