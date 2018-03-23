
jest.unmock('react-native');
import 'react-native';
import React from 'react';

jest.mock('../../../app/components/Form', () => 'Form');
jest.mock('../../../app/components/FormInput', () => 'FormInput');
jest.mock('../../../app/components/FormDropDown', () => 'FormDropDown');
jest.mock('../../../app/services/SmartyStreets', () => ({}));
jest.mock('../../../app/lib/styles');
jest.mock('BuildLibrary');
jest.mock('BuildNative');

import AddressEdit from '../AddressEdit';

const defaultProps = {
	onChange: jest.fn(),
};

describe('AddressEdit', () => {
	it('should render with default props', () => {
		const tree = require('react-test-renderer').create(
			<AddressEdit {...defaultProps} />
		);
		expect(tree).toMatchSnapshot();
	});
});
