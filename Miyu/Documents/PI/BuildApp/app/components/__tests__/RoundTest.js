jest.mock('../../../app/lib/analytics/tracking');
jest.mock('BuildNative');
jest.mock('BuildLibrary');

jest.unmock('react-native');

import Round from '../../../app/components/Round';
import React from 'react';

const defaultProps = {
	backgroundColor: 'black',
	diameter: 40,
};

describe('Round component', () => {
	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<Round {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});
});
