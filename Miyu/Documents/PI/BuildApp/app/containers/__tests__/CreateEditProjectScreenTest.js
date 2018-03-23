'use strict';

jest.mock('../../../app/services/httpClient', () => ({}));
jest.mock('../../../app/store/configStore', () => ({}));
jest.mock('../../../app/lib/analytics/tracking');
jest.mock('BuildNative');
jest.mock('BuildLibrary');

jest.mock('../../../app/components/Form', () => 'Form');
jest.mock('../../../app/components/FormInput', () => 'FormInput');
jest.mock('../../../app/components/Checkbox', () => 'Checkbox');
jest.mock('../../../app/components/ErrorText', () => 'ErrorText');
jest.mock('../../../app/components/navigationBar/NavigationBarTextButton', () => 'NavigationBarTextButton');

jest.unmock('react-native');

import { CreateEditProject } from '../CreateEditProjectScreen';
import React from 'react';

const defaultProps = {
	actions: {
		trackState: jest.fn(),
	},
	customerId: 0,
	error: '',
	isEditMode: false,
	project: {
		name: '',
		description: '',
		id: undefined,
		archived: false,
		engageExpert: true,
	},
};

describe('CreateEditProject component', () => {

	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<CreateEditProject {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});
});
