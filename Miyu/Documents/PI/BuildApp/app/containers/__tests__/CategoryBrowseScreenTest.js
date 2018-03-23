'use strict';

jest.mock('../../../app/services/httpClient', () => ({}));
jest.mock('../../../app/store/configStore', () => ({}));
jest.mock('../../../app/lib/analytics/tracking');
jest.mock('BuildNative');
jest.mock('BuildLibrary');
jest.mock('../../../app/components/TappableListItem', () => 'TappableListItem');
jest.mock('../../../app/components/LoadingView', () => 'LoadingView');
jest.mock('../../../app/containers/HeaderSearch', () => 'HeaderSearch');

jest.unmock('react-native');

import { CategoryBrowseScreen } from '../CategoryBrowseScreen';
import React from 'react';

const defaultProps = {
	categories: [],
	actions: {
		trackState: jest.fn(),
	},
};

describe('CategoryBrowseScreen component', () => {

	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<CategoryBrowseScreen {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});
});
