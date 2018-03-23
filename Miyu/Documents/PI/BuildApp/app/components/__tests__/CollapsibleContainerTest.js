
jest.unmock('react-native');
import 'react-native';
import React from 'react';
import CollapsibleContainer from '../CollapsibleContainer';
import Text from '../Library/Text/Text';

jest.mock('BuildNative');
jest.mock('BuildLibrary');

describe('CollapsibleContainer', () => {

	it('should not render with 0 children', () => {
		const tree = require('react-test-renderer').create(
			<CollapsibleContainer />
		);
		expect(tree.toJSON()).toMatchSnapshot();
	});

	it('should render with 1 child', () => {
		const tree = require('react-test-renderer').create(
			<CollapsibleContainer>
				<Text>test</Text>
			</CollapsibleContainer>
		);
		expect(tree.toJSON()).toMatchSnapshot();
	});

	it('should render with 2 children', () => {
		const tree = require('react-test-renderer').create(
			<CollapsibleContainer>
				<Text>test 1</Text>
				<Text>test 2</Text>
			</CollapsibleContainer>
		);
		expect(tree.toJSON()).toMatchSnapshot();
	});
});
