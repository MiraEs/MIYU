'use strict';

jest.mock('../../../app/services/httpClient', () => ({}));
jest.mock('../../../app/store/configStore', () => ({}));
jest.mock('../../../app/lib/analytics/tracking');
jest.mock('BuildNative');
jest.mock('BuildLibrary');

jest.unmock('react-native');

import {ContentTestRow} from '../ContentTestRow';
import React from 'react';

const defaultProps = {
	label: 'label',
	type: 'type',
};

describe('ContentTestRow component', () => {
	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<ContentTestRow {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

});
