'use strict';

jest.mock('../../../app/components/events/Tracking', () => 'TrackingEvent');
jest.mock('../../../app/components/events/favorite', () => 'FavoriteEvent');
jest.mock('../../../app/components/events/Order', () => 'OrderEvent');
jest.mock('../../../app/components/events/post', () => 'PostEvent' );
jest.mock('../../../app/components/events/teamMember', () => 'TeamMemberEvent');
jest.mock('../../../app/components/events/teamExpert', () => 'TeamExpertEvent');
jest.mock('../../../app/components/events/Onboarding', () => 'OnboardingEvent');
jest.mock('BuildNative');
jest.unmock('react-native');

import Event from '../Event';
import React from 'react';

const defaultProps = {
	event: {},
	eventStoreType: 'eventStoreType',
	isGlobalFeed: false,
};

describe('Event component', () => {
	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<Event {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render POST event correctly', () => {
		const event = {eventId: 1, user:{}, projectName: 'ProjectName', eventType:'POST'};
		const tree = require('react-test-renderer').create(
			<Event
				{...defaultProps}
				event={event}
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render TRACKING event correctly', () => {
		const event = {eventId: 1, user:{}, eventType:'TRACKING'};
		const tree = require('react-test-renderer').create(
			<Event
				{...defaultProps}
				event={event}
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render FAVORITE_LIST event correctly', () => {
		const event = {eventId: 1, user:{}, eventType:'FAVORITE_LIST'};
		const tree = require('react-test-renderer').create(
			<Event
				{...defaultProps}
				event={event}
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render ORDER event correctly', () => {
		const event = {eventId: 1, user:{}, eventType:'ORDER'};
		const tree = require('react-test-renderer').create(
			<Event
				{...defaultProps}
				event={event}
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render TEAM_MEMBER event correctly', () => {
		const event = {eventId: 1, user:{}, eventType:'TEAM_MEMBER'};
		const tree = require('react-test-renderer').create(
			<Event
				{...defaultProps}
				event={event}
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render TEAM_EXPERT event correctly', () => {
		const event = {eventId: 1, user:{}, eventType:'TEAM_EXPERT'};
		const tree = require('react-test-renderer').create(
			<Event
				{...defaultProps}
				event={event}
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render ONBOARDING event correctly', () => {
		const event = {eventId: 1, user:{}, eventType:'ONBOARDING'};
		const tree = require('react-test-renderer').create(
			<Event
				{...defaultProps}
				event={event}
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});
});
