jest.unmock('react-native');

import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';

import { Tutorial } from '../Tutorial';

jest.mock('BuildLibrary');
jest.mock('BuildNative');
jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');

const defaultProps = {
	actions: {
		setTutorialMode: jest.fn(),
	},
	isLoggedIn: false,
};

describe('Tutorial component', () => {

	it('should render Tutorial with only required props', () => {
		const tree = renderer.create(
			<Tutorial
				{...defaultProps}
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render Tutorail when isLoggedIn is true', () => {
		const tree = renderer.create(
			<Tutorial
				{...defaultProps}
				isLoggedIn={true}
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

});
