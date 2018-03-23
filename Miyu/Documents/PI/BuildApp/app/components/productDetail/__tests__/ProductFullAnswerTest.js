jest.unmock('react-native');
jest.mock('../../../lib/styles');
jest.mock('../../../lib/helpers', () => ({
	removeHTML: jest.fn(html => html),
}));
jest.mock('../ProductAnswer', () => 'ProductAnswer');
jest.mock('../../../actions/AnalyticsActions', () => ({
	trackState: jest.fn(),
}));
jest.mock('../../../store/configStore', () => ({
	dispatch: jest.fn(),
}));
jest.mock('../../../styles/navigationBarStyles', () => ({}));

import { create } from 'react-test-renderer';
import React from 'react';
import 'react-native';
import ProductFullAnswer from '../ProductFullAnswer';

const props = {
	question: 'question',
	answer: 'answer',
};

describe('ProductFullAnswer', () => {
	it('should render', () => {
		const wrapper = create(<ProductFullAnswer {...props} />).toJSON();
		expect(wrapper).toMatchSnapshot();
	});
});
