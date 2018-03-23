jest.unmock('react-native');
jest.mock('react-native-vector-icons/Ionicons');
jest.mock('../../../lib/helpers', () => ({
	isIOS: jest.fn(),
	isAndroid: jest.fn(),
}));
jest.mock('../../../lib/styles');
jest.mock('../../../store/configStore', () => {});
jest.mock('../../../actions/AnalyticsActions', () => ({

}));

import { create } from 'react-test-renderer';
import React from 'react';
import 'react-native';
import NavigationBarTextButton from '../NavigationBarTextButton';

const props = {
	disabled: false,
	onPress: jest.fn(),
};

describe('NavigationBarTextButton', () => {
	beforeEach(() => {
		props.onPress.mockClear();
	});
	it('should render on iOS', () => {
		const wrapper = create(<NavigationBarTextButton>Text</NavigationBarTextButton>).toJSON();
		expect(wrapper).toMatchSnapshot();
	});
	it('should handle button pressed if not disabled', () => {
		const wrapper = create(<NavigationBarTextButton {...props} />);
		const instance = wrapper.getInstance();
		instance.handleButtonPressed();
		expect(props.onPress).toBeCalled();
	});
	it('should handle button pressed if disabled', () => {
		const wrapper = create(
			<NavigationBarTextButton
				{...props}
				disabled={true}
			/>
		);
		const instance = wrapper.getInstance();
		instance.handleButtonPressed();
		expect(props.onPress).not.toBeCalled();
	});
});
