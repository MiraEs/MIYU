'use strict';

jest.mock('BuildNative');
jest.mock('BuildLibrary');


jest.unmock('react-native');
jest.mock('../../../lib/styles');
jest.mock('../../../content/AtomComponent', () => 'AtomComponent');

import { ContentAuthor } from '../ContentAuthor@1';
import React from 'react';


describe('ContentAuthor component', () => {
	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<ContentAuthor />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render correctly guest_author', () => {
		const guest_author = {
			profile_image: 'profile_image',
			full_name: 'full_name',
		};

		const tree = require('react-test-renderer').create(
			<ContentAuthor guest_author={guest_author}/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render correctly profile Includes', () => {
		const profile_id = {
			selected: ['1'],
		};
		const profileIncludes = {
			'1': { title: 'title', fullName: 'fullName', employeeId: 1 },
		};

		const tree = require('react-test-renderer').create(
			<ContentAuthor
				profile_id={profile_id}
				profileIncludes={profileIncludes}
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});


});
