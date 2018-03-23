
jest.unmock('react-native');
jest.mock('BuildNative');
import 'react-native';
import React from 'react';

import Button from '../button';

jest.mock('../../lib/styles');
jest.mock('../../store/configStore', () => ({}));

const defaultProps = {
	testID: 'testID',
	trackAction: 'trackAction',
	onPress: jest.fn(),
};

describe('Button component', () => {
	it('should render a TouchableHighlight', () => {
		const tree = require('react-test-renderer').create(
			<Button {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});
});
