import React from 'react';
import { create } from 'react-test-renderer';
import 'react-native';
import QuillInline from '../QuillInline';

const props = {
	textColor: 'grey',
	link: {
		test: true,
	},
	linkColor: 'blue',
};

function setup(extraProps = {}) {
	const wrapper = create(
		<QuillInline
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

describe('QuillInline', () => {
	it('should render', () => {
		const { wrapper } = setup();
		expect(wrapper.toJSON()).toMatchSnapshot();
	});
	it('should get style', () => {
		const { instance } = setup({
			italic: true,
		});
		const result = instance.getStyle();
		expect(result).toMatchSnapshot();
	});
	it('should render without link', () => {
		const { wrapper } = setup({
			link: undefined,
		});
		expect(wrapper.toJSON()).toMatchSnapshot();
	});
	it('should render with an onPress function', () => {
		const props = {
			onLinkPress: jest.fn(),
		};
		const { wrapper } = setup(props);
		expect(wrapper.toJSON()).toMatchSnapshot();
	});
	it('should call onLinkPress if it is a function', () => {
		const extraProps = {
			onLinkPress: jest.fn(),
		};
		const { instance } = setup(extraProps);
		instance.handleLinkPress();
		expect(extraProps.onLinkPress).toBeCalledWith(props.link);
	});
	it('should not call onLinkPress if it is not a function', () => {
		const { instance } = setup();
		instance.handleLinkPress();
		// no assertions here. we are just making sure the component doesn't crash
		// by trying to invoke something that isn't a function.
	});
});
