import React from 'react';
import { create } from 'react-test-renderer';
import 'react-native';
import QuillHeading from '../QuillHeading';

const props = {
	textColor: 'grey',
	heading2Size: 24,
};

function setup(extraProps = {}) {
	const wrapper = create(
		<QuillHeading
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

describe('QuillHeading', () => {
	it('should render', () => {
		const { wrapper } = setup();
		expect(wrapper).toMatchSnapshot();
	});
	it('should get style', () => {
		const { instance } = setup({
			header: 2,
		});
		const result = instance.getStyle();
		expect(result).toMatchSnapshot();
	});
});
