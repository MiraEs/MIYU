
jest.mock('react-native');
jest.mock('BuildNative');
jest.mock('react-native-deprecated-custom-components');

import React from 'react';
import Form from '../Form';

describe('Form component', () => {
	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(<Form />).toJSON();
		expect(tree).toMatchSnapshot();
	});

});

describe('Form functions', () => {
	it('getChildContext', () => {
		const result = require('react-test-renderer').create(<Form />)
			.getInstance()
			.getChildContext();
		expect(result).toMatchSnapshot();
	});

	it('getScrollView', () => {
		const instance = require('react-test-renderer').create(<Form />)
			.getInstance();
		const scrollView = instance.getScrollView();
		const stateScrollView = instance.state.scrollView;
		expect(scrollView).toEqual(stateScrollView);
	});
});
