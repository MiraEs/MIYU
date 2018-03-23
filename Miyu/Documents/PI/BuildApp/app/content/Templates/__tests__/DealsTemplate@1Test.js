'use strict';

import React from 'react';

jest.unmock('react-native');

jest.mock('BuildLibrary');
jest.mock('BuildNative');
jest.mock('../../../../app/content/Atoms/AtomText@1', () => 'AtomText@1');
jest.mock('../../../../app/content/AtomComponent', () => 'AtomComponent');
jest.mock('../../../../app/components/Library/Pager/TabbedPager', () => 'TabbedPager');
jest.mock('../../../../app/components/NavigationBar', () => 'NavigationBar');
jest.mock('../../../../app/components/Library/Scrollable/ParallaxScrollView', () => 'ParallaxScrollView');

import { DealsTemplate } from '../DealsTemplate@1';

// set up the jsdom
import '../../../../testSetup';

const defaultProps = {
	contentItem: {
		content: {
			heading: {
				text: 'heading',
			},
			sale_section: {
				items: [],
			},
		},
	},
	categoryIncludes: {},
	navigator: {
		updateCurrentRouteParams: jest.fn(),
	},
};

describe('Deal component', () => {

	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<DealsTemplate {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

});
