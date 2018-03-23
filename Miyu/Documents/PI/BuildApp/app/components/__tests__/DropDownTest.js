'use strict';

jest.mock('../../../app/services/httpClient', () => ({}));
jest.mock('../../../app/store/configStore', () => ({}));
jest.mock('../../../app/lib/analytics/tracking');
jest.mock('BuildNative');
jest.mock('BuildLibrary');

jest.unmock('react-native');

import DropDown from '../DropDown';
import React from 'react';

const defaultProps = {
	accessibilityLabel: 'accessibilityLabel',
};

describe('DropDown component', () => {
	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<DropDown {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

});
