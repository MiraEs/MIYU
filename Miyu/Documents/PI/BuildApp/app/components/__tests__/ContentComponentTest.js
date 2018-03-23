'use strict';
jest.mock('../../../app/services/httpClient', () => ({}));
jest.mock('../../../app/store/configStore', () => ({}));
jest.mock('BuildNative');
jest.mock('BuildLibrary');
jest.mock('../../content/TemplateComponent', () => 'TemplateComponent');
jest.mock('../../../app/components/ContentError', () => 'ContentError');

jest.mock('react-native');

import React from 'react';
import { ContentComponent } from '../ContentComponent';

const defaultProps = {
	contentItem: {},
};

describe('Content Component test', () => {
	it('should render correctly', () => {
		const wrapper = require('react-test-renderer').create(
			<ContentComponent {...defaultProps} />
		);
		expect(wrapper.toJSON()).toMatchSnapshot();
	});
});
