
jest.mock('../../../app/services/httpClient', () => ({}));
jest.mock('../../../app/store/configStore', () => ({}));
jest.mock('../../../app/lib/analytics/tracking');
jest.mock('BuildNative');
jest.mock('BuildLibrary');

jest.unmock('react-native');
import 'react-native';
import React from 'react';
import { DevOptions } from '../devOptionsScreen';

const defaultProps = {
	user: {},
};

describe('The devOptionScreen', () => {

	it('should render the dev options', () => {
		const tree = require('react-test-renderer').create(
			<DevOptions {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

});
