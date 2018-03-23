import React from 'react';
import { create } from 'react-test-renderer';
import 'react-native';
import AtomRichText from '../AtomRichText@1';

jest.mock('react-native-quill-render', () => 'QuillRender');

const props = {
	textData: {
		ops: [],
	},
};

function setup(extraProps = {}) {
	const wrapper = create(
		<AtomRichText
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

describe('AtomRichText', () => {
	it('should AtomRichText', () => {
		const { wrapper } = setup();
		expect(wrapper).toMatchSnapshot();
	});
});
