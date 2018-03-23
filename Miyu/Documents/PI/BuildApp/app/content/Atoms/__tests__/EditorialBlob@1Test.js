'use strict';

jest.mock('BuildNative');
jest.mock('BuildLibrary');


jest.unmock('react-native');

jest.mock('../../../../app/content/AtomComponent', () => 'AtomComponent');

import { EditorialBlob } from '../EditorialBlob@1';
import React from 'react';

const defaultProps = {
	group: {},
	heading: {},
	body_copy: {},
	section_cta: {
		text: 'test',
	},
};

describe('EditorialBlob component', () => {

	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<EditorialBlob {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render correctly with media_image', () => {
		const tree = require('react-test-renderer').create(
			<EditorialBlob
				{...defaultProps}
				media_image={{ public_id: 'id' }}
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render correctly with media_video', () => {
		const tree = require('react-test-renderer').create(
			<EditorialBlob
				{...defaultProps}
				videoIncludes={{
					0: {
						hashKey: 'hashKey',
						streamProviderCode: 0,
					},
				}}
				media_video={{ selected: [0] }}
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

});
