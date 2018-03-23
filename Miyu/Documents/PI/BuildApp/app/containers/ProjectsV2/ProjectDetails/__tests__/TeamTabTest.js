'use strict';

jest.mock('BuildNative');
jest.mock('BuildLibrary');
jest.mock('../../../../components/Avatar', () => 'Avatar');
jest.mock('../../../../components/TappableListItem', () => 'TappableListItem');
jest.mock('../../InviteTeammateScreen', () => 'InviteTeammateScreen');
jest.mock('../../../../services/httpClient', () => ({}));
jest.mock('../../../../lib/analytics/TrackingActions', () => ({}));
jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');

jest.unmock('react-native');

import { TeamTab } from '../TeamTab';
import React from 'react';

const defaultProps = {
	actions: {
		getTeam: jest.fn(),
		getInvitees: jest.fn(),
		sendProjectInvites: jest.fn(),
		updateProjectInvites: jest.fn(),
		resendProjectInvite: jest.fn(),
		rejectProjectInvite: jest.fn(),
		deleteProjectTeamMember: jest.fn(),
	},
	error: '',
	projectId: 1,
	loading: false,
	teamInvitees: [],
	teamMembers: [{
		email: 'test@test.com',
		isOwner: true,
		user: {
			avatar: null,
			firstName: 'Test',
			lastName: 'McTesty',
			name: 'Test McTesty',
		},
	}],
};

describe('TeamTab component', () => {
	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<TeamTab {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render the invitees block', () => {
		const tree = require('react-test-renderer').create(
			<TeamTab
				{...defaultProps}
				teamInvitees={[{
					email: 'test@test.com',
					status: 'PENDING',
					user: {
						avatar: null,
						firstName: 'Test',
						lastName: 'McTesty',
						name: 'Test McTesty',
					},
				}]}
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

});

describe('TeamTab function tests', () => {
	it('should return the screen tracking info', () => {
		const tree = require('react-test-renderer').create(
			<TeamTab {...defaultProps} />
		).getInstance().setScreenTrackingInformation();
		expect(tree).toMatchSnapshot();
	});

	it('should render the pending footer', () => {
		const tree = require('react-test-renderer').create(
			<TeamTab {...defaultProps} />
		).getInstance().renderPendingFooter();
		expect(tree).toMatchSnapshot();
	});

	it('should render the pending header', () => {
		const tree = require('react-test-renderer').create(
			<TeamTab {...defaultProps} />
		).getInstance().renderPendingHeader();
		expect(tree).toMatchSnapshot();
	});

	it('should render the pending teammate with user object', () => {
		const tree = require('react-test-renderer').create(
			<TeamTab {...defaultProps} />
		)
			.getInstance()
			.renderTeamMember(
				jest.fn(),
				true, {
					email: 'test@test.com',
					status: 'PENDING',
					user: {
						avatar: null,
						firstName: 'Test',
						lastName: 'McTesty',
						name: 'Test McTesty',
					},
				}
			);
		expect(tree).toMatchSnapshot();
	});

	it('should render the pending teammate without user object', () => {
		const tree = require('react-test-renderer').create(
			<TeamTab {...defaultProps} />
		)
			.getInstance()
			.renderTeamMember(
				jest.fn(),
				true, {
					email: 'test@test.com',
					status: 'PENDING',
				}
			);
		expect(tree).toMatchSnapshot();
	});

	it('should render the project owner mark', () => {
		const tree = require('react-test-renderer').create(
			<TeamTab {...defaultProps} />
		)
			.getInstance()
			.renderProjectOwner({
				isOwner: true,
			});
		expect(tree).toMatchSnapshot();
	});

	it('should not render the project owner mark', () => {
		const tree = require('react-test-renderer').create(
			<TeamTab {...defaultProps} />
		)
			.getInstance()
			.renderProjectOwner({
				isOwner: false,
			});
		expect(tree).toMatchSnapshot();
	});

	it('should render the teammate info', () => {
		const tree = require('react-test-renderer').create(
			<TeamTab {...defaultProps} />
		)
			.getInstance()
			.renderTeamMember(
				jest.fn(),
				false, {
					email: 'test@test.com',
					user: {
						avatar: null,
						firstName: 'Test',
						lastName: 'McTesty',
						name: 'Test McTesty',
					},
				}
			);
		expect(tree).toMatchSnapshot();
	});

	it('should render the teammate status', () => {
		const tree = require('react-test-renderer').create(
			<TeamTab {...defaultProps} />
		)
			.getInstance()
			.renderInviteeStatus({
				status: 'PENDING',
			});
		expect(tree).toMatchSnapshot();
	});

});
