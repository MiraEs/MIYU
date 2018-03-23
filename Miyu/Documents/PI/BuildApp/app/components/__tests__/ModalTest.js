
jest.mock('BuildNative');
jest.mock('BuildLibrary');
jest.mock('react-native-deprecated-custom-components');
jest.unmock('react-native');

import React from 'react';
import { Modal } from '../Modal';

const defaultProps = {};

describe('Modal component', () => {
	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<Modal {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});
});
