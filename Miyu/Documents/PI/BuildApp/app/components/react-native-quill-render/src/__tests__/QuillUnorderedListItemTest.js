import React from 'react';
import { create } from 'react-test-renderer';
import 'react-native';
import QuillUnorderedListItem from '../QuillUnorderedListItem';

const props = {};

function setup(extraProps = {}) {
	const wrapper = create(
		<QuillUnorderedListItem
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

describe('QuillUnorderedListItem', () => {
	it('should render', () => {
		const { wrapper } = setup();
		expect(wrapper.toJSON()).toMatchSnapshot();
	});
});
