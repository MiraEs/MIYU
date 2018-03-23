import { create } from 'react-test-renderer';
import React from 'react';
import 'react-native';
import InlineAlert from '../InlineAlert';

const props = {
	children: 'test child',
	title: 'Alert Title',
	style: {},
};

function setup(otherProps) {
	const wrapper = create(
		<InlineAlert
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

describe('InlineAlert', () => {
	it('should render with full props', () => {
		const { wrapper } = setup();
		expect(wrapper.toJSON()).toMatchSnapshot();
	});
});
