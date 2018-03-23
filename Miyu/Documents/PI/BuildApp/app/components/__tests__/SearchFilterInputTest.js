jest.unmock('react-native');
jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');
jest.mock('../../lib/helpers');
jest.mock('../../lib/styles');

import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import SearchFilterInput from '../SearchFilterInput';

const defaultProps = {
	onChangeText: jest.fn(),
	onFocus: jest.fn(),
	onLayout: jest.fn(),
	style: {
		container: {},
		input: {},
		icon: {},
	},
	placeholder: 'placeholder',
	text: 'text',
	theme: 'regular',
	selectionColor: 'red',
};

describe('SearchFilterInput component', () => {

	it('should render with default props', () => {
		const tree = renderer.create(<SearchFilterInput {...defaultProps} />);
		expect(tree.toJSON()).toMatchSnapshot();
	});

});
