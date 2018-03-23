
jest.unmock('react-native');
jest.mock('BuildNative');
jest.mock('BuildLibrary');

import 'react-native';
import React from 'react';
import ExpertBio from '../ExpertBio';

jest.mock('../../../app/services/httpClient', () => ({}));

const defaultProps = {
	rep: {
		repUserID: 123,
		repFirstName: 'Derf',
		repLastName: 'Nabac',
	},
};

describe('ExpertBio Container', () => {

	it('should render with pro rep', () => {
		const tree = require('react-test-renderer').create(
			<ExpertBio {...defaultProps} />
		);
		expect(tree.toJSON()).toMatchSnapshot();
	});

	it('should render with no rep', () => {
		const tree = require('react-test-renderer').create(
			<ExpertBio />
		);
		expect(tree.toJSON()).toMatchSnapshot();
	});

});
