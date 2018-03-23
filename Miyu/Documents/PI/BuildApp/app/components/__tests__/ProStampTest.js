
jest.unmock('react-native');
jest.mock('BuildLibrary');
jest.mock('../../lib/styles');

import React from 'react';
import ProStamp from '../ProStamp';

describe('ProStamp component', () => {

	it('should render corrently', () => {

		const tree = require('react-test-renderer').create(<ProStamp />).toJSON();
		expect(tree).toMatchSnapshot();

	});

});

