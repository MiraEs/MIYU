import { create } from 'react-test-renderer';
import React from 'react';
import 'react-native';
import { FAQDetail } from '../FAQDetail';
import EventEmitter from '../../lib/eventEmitter';

jest.mock('../../lib/eventEmitter', () => ({
	emit: jest.fn(),
}));
const navigatorPush = jest.fn();

const props = {
	body_copy: {},
	media_image: {},
	media_link_url: {},
	heading: {},
	group: {},
	contentItemId: '123',
	section_cta_url: {},
	section_cta: {},
	navigation: {
		getNavigator: jest.fn(() => ({
			push: navigatorPush,
		})),
	},
};

function setup(otherProps) {
	const wrapper = create(
		<FAQDetail
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

describe('FAQDetail', () => {
	it('should render with full props', () => {
		const { wrapper } = setup();
		expect(wrapper.toJSON()).toMatchSnapshot();
	});
	it('should track screen data', () => {
		const { instance } = setup();
		const result = instance.setScreenTrackingInformation();
		expect(result).toEqual({
			name: 'build:app:faqdetail',
		});
	});
	it('should handle email press', () => {
		const { instance } = setup();
		instance.handleEmailPress();
		expect(navigatorPush).toBeCalled();
	});
	it('should handle call pressed', () => {
		const { instance } = setup();
		instance.handleCallPress();
		expect(EventEmitter.emit).toBeCalled();
	});
});
