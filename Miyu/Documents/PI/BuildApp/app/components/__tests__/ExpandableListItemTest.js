import { create } from 'react-test-renderer';
import React from 'react';
import 'react-native';
import ExpandableListItem from '../ExpandableListItem';

const props = {
	body: 'body text',
	children: 'children',
	trackAction: 'test-track-action',
};

function setup(otherProps) {
	const wrapper = create(
		<ExpandableListItem
			{...props}
			{...otherProps}
		/>
	);
	const instance = wrapper.getInstance();
	return {
		wrapper,
		instance,
	};
}

describe('ExpandableListItem', () => {
	it('should render with full props', () => {
		const { wrapper } = setup();
		expect(wrapper.toJSON()).toMatchSnapshot();
	});
	it('should render when not collapsed', () => {
		const {
			wrapper,
			instance,
		} = setup();
		instance.toggleState();
		expect(wrapper.toJSON()).toMatchSnapshot();
	});
});
