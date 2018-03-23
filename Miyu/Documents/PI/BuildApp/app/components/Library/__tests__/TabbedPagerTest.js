jest.unmock('react-native');

jest.mock('BuildNative');
jest.mock('../../../../app/components/Library/Pager/Pager', () => 'Pager');
jest.mock('../../../../app/components/Library/Pager/PagerTabBar', () => 'PagerTabBar');

import TabbedPager from '../../../../app/components/Library/Pager/TabbedPager';
import React from 'react';
import renderer from 'react-test-renderer';

const defaultProps = {
	tabs: [{
		name: 'tab 1',
		component: null,
	}, {
		name: 'tab 2',
		component: null,
	}, {
		name: 'tab 3',
		component: null,
	}],
};

describe('TabbedPager Test', () => {

	it('should render correctly', () => {
		const wrapper = renderer.create(
			<TabbedPager {...defaultProps} />
		);
		expect(wrapper.toJSON()).toMatchSnapshot();
	});

	it('should change pages correctly', () => {

		const wrapper = renderer.create(
			<TabbedPager {...defaultProps} />
		);
		wrapper.getInstance().goToPage(1);
		expect(wrapper.toJSON()).toMatchSnapshot();

	});

});
