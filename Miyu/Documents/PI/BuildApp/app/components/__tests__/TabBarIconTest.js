import { create } from 'react-test-renderer';
import React from 'react';
import 'react-native';
import TabBarIcon from '../TabBarIcon';

const props = {
	name: 'md-list',
	size: 22,
	color: '#ffffff',
	style: {},
	topOffset: 4,
};

function setup(otherProps) {
	const wrapper = create(
		<TabBarIcon
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

describe('TabBarIcon', () => {
	it('should render with full props', () => {
		const { wrapper } = setup();
		expect(wrapper.toJSON()).toMatchSnapshot();
	});
	it('should default topOffset to 0 when not specified', () => {
		const { wrapper } = setup({
			topOffset: undefined,
		});
		expect(wrapper.toJSON()).toMatchSnapshot();
	});
});
