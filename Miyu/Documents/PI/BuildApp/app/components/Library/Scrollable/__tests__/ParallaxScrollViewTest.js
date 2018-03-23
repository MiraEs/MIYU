jest.mock('BuildNative');

jest.unmock('react-native');

import React from 'react';
import { Text, View } from 'react-native';
import ParallaxScrollView from '../ParallaxScrollView';
import renderer from 'react-test-renderer';

describe('ParallaxScrollView component', () => {

	const defaultProps = {
		parallaxHeaderHeight: 100,
		renderStickyHeader: () => {
			return (
				<View>
					<Text>Sticky Header</Text>
				</View>
			);
		},
	};

	it('should render correctly', () => {
		const wrapper = renderer.create(
			<ParallaxScrollView {...defaultProps}>
				<View/>
			</ParallaxScrollView>
		);
		expect(wrapper.toJSON()).toMatchSnapshot();
	});

});
