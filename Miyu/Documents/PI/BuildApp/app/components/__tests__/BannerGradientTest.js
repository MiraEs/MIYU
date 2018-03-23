'use strict';

jest.mock('../../../app/services/httpClient', () => ({}));
jest.mock('../../../app/store/configStore', () => ({}));
jest.mock('../../../app/lib/analytics/tracking');
jest.mock('BuildNative');
jest.mock('BuildLibrary');

jest.unmock('react-native');

import BannerGradient from '../BannerGradient';
import React from 'react';

const defaultProps = {

};

describe('BannerGradient component', () => {
	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<BannerGradient {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

});
