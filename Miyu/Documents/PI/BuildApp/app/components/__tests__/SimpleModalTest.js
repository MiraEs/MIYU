import { create } from 'react-test-renderer';
import React from 'react';
import 'react-native';
import SimpleModal from '../SimpleModal';

jest.mock('BuildLibrary');

const props = {
	title: 'Modal Title',
	children: 'Modal Children',
	onClose: jest.fn(),
};

function setup(otherProps) {
	const wrapper = create(
		<SimpleModal
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

describe('SimpleModal', () => {
	beforeEach(() => {
		props.onClose.mockClear();
	});
	it('should render with full props', () => {
		const { wrapper } = setup();
		expect(wrapper.toJSON()).toMatchSnapshot();
	});
	describe('hide', () => {
		it('should handle hide', () => {
			const { instance } = setup();
			instance.hide();
			expect(props.onClose).toBeCalled();
		});
		it('should handle hide without an onClose prop', () => {
			const { instance } = setup({
				...props,
				onClose: undefined,
			});
			instance.hide();
			expect(props.onClose).not.toBeCalled();
		});
	});
});
