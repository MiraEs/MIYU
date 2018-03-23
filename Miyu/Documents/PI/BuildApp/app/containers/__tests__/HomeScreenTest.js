'use strict';

jest.mock('../../../app/services/httpClient', () => ({}));
jest.mock('../../../app/store/configStore', () => ({}));
jest.mock('../../../app/lib/analytics/tracking');
jest.mock('BuildNative');
jest.mock('BuildLibrary');
jest.mock('../../../app/components/Form', () => 'Form');
jest.mock('../../../app/components/FormInput', () => 'FormInput');
jest.mock('../../../app/components/ContentError', () => 'ContentError');
jest.mock('../../../app/content/Atoms/AtomText@1', () => 'AtomText@1');
jest.mock('../../../app/content/TemplateComponent', () => 'TemplateComponent');

jest.mock('../../../app/containers/HeaderSearch', () => 'HeaderSearch');

jest.unmock('react-native');

import { HomeScreen } from '../HomeScreen';
import React from 'react';

const defaultProps = {
	actions: {
		trackState: jest.fn(),
	},
};

describe('HomeScreen component', () => {

	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<HomeScreen {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});
});
