'use strict';

jest.mock('../../../app/services/httpClient', () => ({}));
jest.mock('../../../app/store/configStore', () => ({}));
jest.mock('../../../app/lib/analytics/tracking');
jest.mock('BuildNative');
jest.mock('BuildLibrary');
jest.mock('../../../app/components/Form', () => 'Form');
jest.mock('../../../app/components/FormInput', () => 'FormInput');

jest.unmock('react-native');

import { LookbackScreen } from '../LookbackScreen';
import React from 'react';

const defaultProps = {
	lookbackStatus: 'RECORDING_STATUS_INACTIVE',
};

describe('LookbackScreen component', () => {

	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<LookbackScreen {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render correctly when recording', () => {
		const tree = require('react-test-renderer').create(
			<LookbackScreen
				{...defaultProps}
				lookbackStatus="RECORDING_STATUS_RECORDING"
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render correctly when stopped recording', () => {
		const tree = require('react-test-renderer').create(
			<LookbackScreen
				{...defaultProps}
				lookbackStatus="RECORDING_STATUS_STOPPED"
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

});
