
jest.unmock('react-native');
jest.mock('BuildLibrary');
jest.mock('BuildNative');
import {
	Text,
	View,
} from 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';

import Pager from '../Pager/Pager';

const defaultProps = {};

describe('SwatchList component', () => {

	it('should render a Pager with default props', () => {
		const tree = renderer.create(
			<Pager {...defaultProps}>
				<Text>One</Text>
				<Text>Two</Text>
			</Pager>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render a Pager with View children', () => {
		const tree = renderer.create(
			<Pager {...defaultProps}>
				<View><Text>One</Text></View>
				<View><Text>Two</Text></View>
			</Pager>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should be able to change pages', () => {

		require('../../../../testSetup');

		const wrapper = renderer.create(
			<Pager {...defaultProps}>
				<Text>One</Text>
				<Text>Two</Text>
			</Pager>
		);
		wrapper.getInstance().goToPage(1);
		wrapper.getInstance().goToPageWithoutAnimation(0);
		expect(wrapper.toJSON()).toMatchSnapshot();

	});

});
