'use strict';

jest.mock('BuildNative');
jest.mock('BuildLibrary');
jest.unmock('react-native');

jest.mock('../../../../app/content/AtomComponent', () => 'AtomComponent');

import SharedPromo from '../SharedPromo@1';
import React from 'react';

const defaultProps = {
	contentItem: {
		content: {
			media_image: {},
			coupon_code: {
				text: 'coupon',
			},
		},
		group: {},
		id: 1,
	},
};

const variationC = {
	...defaultProps,
	contentItem: {
		content: {
			media_image: {},
			coupon_code: {
				text: 'coupon',
			},
			variation: {
				selected: 'c',
			},
		},
		group: {},
		id: 1,
	},
};

const variationD = {
	contentItem: {
		content: {
			media_image: {},
			coupon_code: {
				text: 'coupon',
			},
			variation: {
				selected: 'd',
			},
		},
		group: {},
		id: 1,
	},
};

describe('SharedPromo component', () => {

	it('should render variations A & B correctly', () => {
		const tree = require('react-test-renderer').create(
			<SharedPromo {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render variation C correctly', () => {
		const tree = require('react-test-renderer').create(
			<SharedPromo {...variationC} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render variation D correctly', () => {
		const tree = require('react-test-renderer').create(
			<SharedPromo {...variationD} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

});
