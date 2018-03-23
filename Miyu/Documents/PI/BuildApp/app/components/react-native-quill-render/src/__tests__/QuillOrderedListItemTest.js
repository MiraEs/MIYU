import React from 'react';
import { create } from 'react-test-renderer';
import 'react-native';
import QuillOrderedListItem from '../QuillOrderedListItem';

const props = {
	textColor: 'grey',
	listIndent: 10,
};

function setup(extraProps = {}) {
	const wrapper = create(
		<QuillOrderedListItem
			{...props}
			{...extraProps}
		/>
	);
	const instance = wrapper.getInstance();
	return {
		wrapper,
		instance,
	};
}

describe('QuillOrderedListItem', () => {
	it('should render', () => {
		const { wrapper } = setup();
		expect(wrapper.toJSON()).toMatchSnapshot();
	});
});
