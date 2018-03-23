jest.mock('react-native');
jest.mock('BuildNative');
jest.mock('BuildLibrary');
jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');
jest.mock('../../lib/styles');
jest.mock('../../lib/helpers');

import React from 'react';
import renderer from 'react-test-renderer';
import ExpandCollapseContainer from '../ExpandCollapseContainer';
import { Text } from 'BuildLibrary';

const defaultProps = {
	children: (<Text>children</Text>),
	header: (<Text>Header</Text>),
};
const mockLayoutEvent = {
	nativeEvent: {
		layout: {
			height: 100,
		},
	},
};
const moreButton = {
	moreButton: (<Text>More</Text>),
};

describe('ExpandCollapseContainer', () => {
	it('should render collapsed', () => {
		const tree = renderer.create(
			<ExpandCollapseContainer {...defaultProps} />
		);
		tree.getInstance().setMaxHeight(mockLayoutEvent);
		expect(tree.toJSON()).toMatchSnapshot();
	});

	it('should render expanded', () => {
		const props = {
			...defaultProps,
			isVisible: true,
		};
		const tree = renderer.create(
			<ExpandCollapseContainer {...props} />
		);
		tree.getInstance().setMaxHeight(mockLayoutEvent);
		expect(tree.toJSON()).toMatchSnapshot();
	});

	it('should render a more button', () => {
		const props = {
			...defaultProps,
			...moreButton,
		};
		const tree = renderer.create(
			<ExpandCollapseContainer {...props} />
		);
		tree.getInstance().setMaxHeight(mockLayoutEvent);
		expect(tree.toJSON()).toMatchSnapshot();
	});

	it('should not render with no children', () => {
		const props = {
			...defaultProps,
		};
		delete props.children;
		const tree = renderer.create(
			<ExpandCollapseContainer {...props} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});
});
