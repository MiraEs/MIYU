'use strict';

jest.unmock('../MockedComponents');

import 'react-native';

import {
	MockScrollView,
} from '../MockedComponents';

describe('MockedComponents', () => {

	describe('MockScrollView', () => {
		it('should have a snapshot', () => {
			const mock = new MockScrollView();
			expect(mock).toMatchSnapshot();
		});

	});

});
