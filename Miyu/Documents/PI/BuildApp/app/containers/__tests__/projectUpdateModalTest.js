'use strict';

jest.mock('../../../app/services/httpClient', () => ({}));
jest.mock('../../../app/store/configStore', () => ({}));
jest.mock('../../../app/lib/analytics/tracking');
jest.mock('../../../app/lib/styles');
jest.mock('BuildNative');
jest.mock('BuildLibrary');
jest.mock('../../../app/components/Avatar', () => 'Avatar');
jest.mock('../../../app/components/PinToKeyboard', () => 'PinToKeyboard');
jest.mock('../../../app/components/navigationBar/NavigationBarTextButton', () => 'NavigationBarTextButton');

jest.unmock('react-native');
jest.mock('TextInput', () => 'TextInput');

import { ProjectUpdateModal } from '../projectUpdateModal';
import React from 'react';

const defaultProps = {
	actions: {
		trackState: jest.fn(),
	},
	devicePhotos: {
		photos: [],
	},
	dispatch: jest.fn(),
	eventStoreType: 'project',
	imagesToPost: [],
	photoActions: {},
	projects: {},
	user: {
		firstName: '',
		lastName: '',
	},
};

describe('ProjectUpdateModal component', () => {

	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<ProjectUpdateModal {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});
});
