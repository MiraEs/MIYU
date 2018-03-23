
jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');
jest.mock('../../../app/components/IconBadge', () => 'IconBadge');
jest.mock('BuildLibrary');
jest.mock('BuildNative');

jest.unmock('react-native');
import 'react-native';
import React from 'react';
import TappableListItem from '../TappableListItem';

const defaultProps = {};

describe('TappableListItem', () => {

	beforeEach(() => jest.resetModules());

	it('should render default props', () => {
		const tree = require('react-test-renderer').create(
			<TappableListItem {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

});
