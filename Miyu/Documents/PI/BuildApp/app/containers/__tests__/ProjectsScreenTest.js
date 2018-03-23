'use strict';

jest.mock('../../../app/services/httpClient', () => ({}));
jest.mock('../../../app/store/configStore', () => ({}));
jest.mock('../../../app/lib/analytics/tracking');
jest.mock('BuildNative');
jest.mock('BuildLibrary');
jest.mock('../../../app/components/Form', () => 'Form');
jest.mock('../../../app/components/FormInput', () => 'FormInput');
jest.mock('../../../app/components/LoadingView', () => 'LoadingView');
jest.mock('../../../app/components/listHeader', () => 'ListHeader');
jest.mock('../../../app/components/projectOnboardingPrompt', () => 'ProjectOnboardingPrompt');
jest.mock('../../../app/components/TextHighlighter', () => 'TextHighlighter');
jest.mock('../../../app/components/ErrorText', () => 'ErrorText');
jest.mock('../../../app/components/navigationBar/NavigationBarIconButton', () => 'NavigationBarIconButton');

jest.unmock('react-native');

import { ProjectsScreen } from '../ProjectsScreen';
import React from 'react';

const defaultProps = {
	actions: {
		trackState: jest.fn(),
		trackAction: jest.fn(),
		getProjects: jest.fn(() => ({ done: jest.fn() })),
	},
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

describe('ProjectsScreen component', () => {

	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<ProjectsScreen {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});
});
