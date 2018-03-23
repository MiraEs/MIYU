import { create } from 'react-test-renderer';
import React from 'react';
import 'react-native';
import {
	FAQScreen,
	mapStateToProps,
	mapDispatchToProps,
} from '../FAQScreen';

jest.mock('../../content/TemplateComponent', () => 'TemplateComponent');

const faqSection1 = {
	id: 1234,
};

const props = {
	actions: {
		getNamedSharedItem: jest.fn(),
	},
	faqSections: [faqSection1],
	error: false,
};

function setup(otherProps) {
	const wrapper = create(
		<FAQScreen
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

describe('FAQScreen', () => {
	it('should render with full props', () => {
		const { wrapper } = setup();
		expect(wrapper.toJSON()).toMatchSnapshot();
	});
	it('should render an error message', () => {
		const { wrapper } = setup({
			error: true,
		});
		expect(wrapper.toJSON()).toMatchSnapshot();
	});
	it('should track screen data', () => {
		const { instance } = setup();
		const result = instance.setScreenTrackingInformation();
		expect(result).toEqual({
			name: 'build:app:faqscreen',
		});
	});
	describe('mapStateToProps', () => {
		it('should handle no errors', () => {
			const state = {
				contentReducer: {
					errors:  {},
					namedSharedItems: {
						'native-support-help': [faqSection1],
					},
				},
			};
			const result = mapStateToProps(state);
			expect(result).toMatchSnapshot();
		});
		it('should handle errors', () => {
			const state = {
				contentReducer: {
					errors:  {
						'native-support-help': new Error('test error'),
					},
					namedSharedItems: {
						'native-support-help': [faqSection1],
					},
				},
			};
			const result = mapStateToProps(state);
			expect(result).toMatchSnapshot();
		});
	});
	it('should mapDispatchToProps', () => {
		const dispatch = jest.fn(fn => fn);
		const result = mapDispatchToProps(dispatch);
		expect(result).toMatchSnapshot();
	});
});
