
jest.unmock('react-native');
jest.mock('BuildNative');
jest.mock('../../../services/httpClient', () => ({}));
import 'react-native';
import React from 'react';
import PagerTabBar from '../Pager/PagerTabBar';

const defaultProps = {
	tabs: [{
		text: 'tab text',
	}, {
		text: 'tab text 2',
	}],
};

describe('PagerTabBar', () => {
	it('should render with default props', () => {
		const tree = require('react-test-renderer').create(
			<PagerTabBar {...defaultProps} />
		);
		expect(tree).toMatchSnapshot();
	});

});
