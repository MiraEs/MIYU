jest.unmock('react-native');

jest.mock('BuildLibrary');
jest.mock('BuildNative');
jest.mock('../../../containers/RecentlyViewedScreen', () => 'RecentlyViewedScreen');
jest.mock('../../../content/AtomComponent', () => 'AtomComponent');
jest.mock('../../../content/Atoms/AtomText@1', () => 'AtomText@1');
jest.mock('../../../components/Library/Pager/PagerTabBar', () => 'PagerTabBar');
jest.mock('../../../components/Library/Pager/TabbedPager', () => 'TabbedPager');
jest.mock('../../../lib/styles');
jest.mock('react-native-splash-screen', () => ({ hide: jest.fn()} ));

import React from 'react';
import NativeHome from '../NativeHome@1';

const defaultProps = {
	contentItem: {
		content: {
			recently_viewed: {
				item_count: {},
				nav_title: {},
			},
			native_sale_section: {
				items: [{
					nav_title: {},
				}],
			},
			promos: {
				nav_title: {},
				promos: {
					items: [{}],
				},
			},
			diy_articles: {
				nav_title: {},
				articles: {
					selected: [{}],
				},
			},
		},
	},
};

describe('NativeHome component', () => {

	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<NativeHome {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

});
