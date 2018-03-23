'use strict';

jest.mock('BuildNative');

jest.mock('../../../../app/services/httpClient', () => ({}));
jest.mock('../../../../app/content/Atoms/AtomText@1', () => 'AtomText@1');
jest.mock('../../../../app/content/Atoms/AtomCloudinary@1', () => 'AtomCloudinary@1');
jest.mock('../../../../app/content/Atoms/HeroMedia@1', () => 'HeroMedia@1');

jest.unmock('react-native');

import { INCLUDE_TYPES } from '../../../constants/ContentConstants';
import { AtomMultiselect } from '../AtomMultiselect@1';
import { View } from 'react-native';
import React from 'react';

const defaultProps = {
	contentReducer: {
		categoryIncludes: {
			248: {
				0: {
					content: { _type: 'test@1' },
					group: {},
				},
			},
		},
		contentItems: {
			0: {
				content: { _type: 'test@1' },
				group: {},
			},
			1: {
				content: { _type: 'article-legacy@1' },
				group: {},
			},
		},
		productIncludes: {
			0: {
				group: {},
				finishes: [{}],
			},
		},
		videoIncludes: {
			0: {

			},
		},
		favoriteIncludes: {
			0: {},
		},
		profileIncludes: {
			0: {},
		},
		tagIncludes: {
			0: {},
		},
		userIncludes: {
			0: {},
		},
	},
	label: 'Label',
	includeType: INCLUDE_TYPES.ARTICLE,
	navigator: {},
	selected: [],
	style: {},
};

describe('AtomMultiSelect', () => {

	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<AtomMultiselect {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render with an article', () => {
		const props = {
			...defaultProps,
			includeType: INCLUDE_TYPES.ARTICLE,
			selected: [0],
		};
		const tree = require('react-test-renderer').create(
			<AtomMultiselect {...props} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should not attempt to render a legacy article', () => {
		const props = {
			...defaultProps,
			includeType: INCLUDE_TYPES.ARTICLE,
			selected: [1],
		};
		const tree = require('react-test-renderer').create(
			<AtomMultiselect {...props} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render with a category', () => {
		const props = {
			...defaultProps,
			includeType: INCLUDE_TYPES.CATEGORY,
			selected: [{
				storeId: 248,
				categoryId: 0,
			}],
		};
		const tree = require('react-test-renderer').create(
			<AtomMultiselect {...props} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render with a product', () => {
		const props = {
			...defaultProps,
			includeType: INCLUDE_TYPES.PRODUCT,
			selected: [0],
		};
		const tree = require('react-test-renderer').create(
			<AtomMultiselect {...props} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render with a video', () => {
		const props = {
			...defaultProps,
			includeType: INCLUDE_TYPES.VIDEO,
			selected: [0],
		};
		const tree = require('react-test-renderer').create(
			<AtomMultiselect {...props} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should not crash when given currently unused include types', () => {
		const tree = require('react-test-renderer').create(
			<View>
				<AtomMultiselect
					{...defaultProps}
					includeType={INCLUDE_TYPES.FAVORITE}
					selected={[0]}
				/>
				<AtomMultiselect
					{...defaultProps}
					includeType={INCLUDE_TYPES.PROFILE}
					selected={[0]}
				/>
				<AtomMultiselect
					{...defaultProps}
					includeType={INCLUDE_TYPES.TAG}
					selected={[0]}
				/>
				<AtomMultiselect
					{...defaultProps}
					includeType={INCLUDE_TYPES.USER}
					selected={[0]}
				/>
			</View>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});


});
