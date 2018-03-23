
jest.mock('../../../app/services/httpClient', () => ({}));
jest.mock('../../../app/store/configStore', () => ({}));
jest.mock('react-native-camera');
jest.mock('BuildLibrary');
jest.mock('BuildNative');
jest.mock('../../../app/components/Form', () => 'Form');
jest.mock('../../../app/components/FormInput', () => 'FormInput');
jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');
jest.mock('../../../app/lib/analytics/tracking');

jest.unmock('react-native');
import 'react-native';
import React from 'react';
import { CameraModalScreen } from '../CameraModalScreen';

const defaultProps = {
	actions: {
		trackState: jest.fn(),
	},
	eventStoreType: 'project',
	returnTo: 'test',
};

describe('CameraModalScreen', () => {

	it('should render with default props', () => {
		const tree = require('react-test-renderer').create(
			<CameraModalScreen {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

});
