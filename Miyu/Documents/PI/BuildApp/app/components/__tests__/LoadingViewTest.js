jest.unmock('react-native');
jest.mock('BuildNative');

import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';

import LoadingView from '../LoadingView';

describe('LoadingView component', () => {

	it('should render LoadingView without props', () => {
		const tree = renderer.create(
			<LoadingView />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render with overlay prop set to true', () => {
		const tree = renderer.create(
			<LoadingView
				overlay={true}
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render with a background color prop', () => {
		const tree = renderer.create(
			<LoadingView
				backgroundColor="#FFFFFF"
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

});
